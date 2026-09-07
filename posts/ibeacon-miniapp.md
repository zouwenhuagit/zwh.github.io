---
layout: doc
title: 小程序 iBeacon 对接实战：从架构设计到踩坑总结
date: 2026-09-07
tags: [小程序, iBeacon, 蓝牙]
---

# 小程序 iBeacon 对接实战：从架构设计到踩坑总结

零售门店里，客户扫码进小程序，想把自己和企业身份绑定起来。

传统做法是让客户手动输入三个字段——客户编码、客户名称，再对接企业业务员审核。问题是客户根本记不住自己的编码，输错了就得来回沟通，一单绑定搞半天。

iBeacon 解决的核心问题是**「在场证明」**。零售门店里放一个蓝牙信标，客户进店后小程序自动扫描到信标，就确认了客户确实在店里。连接成功后，只需输入用户自己的手机号就能自动带出客户信息，后台自动完成绑定流程。

这篇文章拆解一套已经在生产环境跑通的 iBeacon 对接方案，覆盖架构设计、核心代码、页面交互和完整闭环流程。

## 1. 三层架构：各管各的事

这套实现拆了三层，从下往上依次是：

```
┌─────────────────────────────────────────┐
│  bind-customer 页面（业务层）             │
│  表单 / 零售门店搜索 / 提交绑定            │
├─────────────────────────────────────────┤
│  ↑ behaviors 引入                        │
├─────────────────────────────────────────┤
│  beaconBehavior（行为层）                 │
│  自动扫描启停 / 数据绑定 / 方法暴露        │
├─────────────────────────────────────────┤
│  ↑ 调用单例方法                           │
├─────────────────────────────────────────┤
│  beaconManager（全局单例）                │
│  蓝牙初始化 / 扫描调度 / 信标解析 / 前后台恢复│
└─────────────────────────────────────────┘
```

最底层的 **beaconManager** 是全局单例，整个小程序只有一个实例，管蓝牙生命周期和扫描调度。中间的 **beaconBehavior** 是一个 Behavior 混入，页面引入后自动管扫描启停，暴露三个方法。最上层的 **bind-customer** 页面管表单和业务逻辑。

分层的好处很直接：页面不直接碰蓝牙 API，behavior 不关心业务，manager 不关心 UI。改一层不影响其他两层。

## 2. beaconManager：全局单例的五件事

beaconManager 解决五个核心问题。逐个拆开说。

### 第一件：蓝牙初始化带退避

openBluetoothAdapter 会弹授权弹窗。如果初始化失败了，30 秒内不重复调用，避免反复弹窗骚扰用户。但用户主动点击时传 `force=true`，跳过退避窗口立即重试。

```javascript
// 被动场景失败退避：30 秒内不再重复调 openBluetoothAdapter
// 主动场景（force=true）：用户明确点击，直接跳过退避窗口
if (!force && this._initFailedAt && Date.now() - this._initFailedAt < INIT_FAIL_BACKOFF_DURATION) {
  return Promise.resolve(false)
}

this._initPromise = new Promise((resolve) => {
  wx.openBluetoothAdapter({
    success: () => {
      this._initialized = true
      this._initFailedAt = 0
      resolve(true)
    },
    fail: (err) => {
      this._initialized = false
      // 强制场景不设退避锁，便于用户立即再次点
      this._initFailedAt = force ? 0 : Date.now()
      resolve(false)
    },
  })
})
```

初始化失败时按错误码分级处理：10001 是蓝牙开关没开，10003 是微信没授权蓝牙权限，10004 是 Android 位置服务没开。不同错误码对应不同的引导方式，但 UI 统一显示「未连接」，不打扰用户。

### 第二件：订阅者模式

多个页面可以同时订阅信标更新。用 Map 管理监听者，页面进来注册回调，页面离开删除回调。当所有订阅者都退出后，自动停止扫描释放蓝牙资源。

```javascript
async startScan(options = {}) {
  const { listenerId, onUpdate, uuids } = options
  
  // 注册订阅者
  if (listenerId && typeof onUpdate === 'function') {
    this._listeners.set(listenerId, onUpdate)
  }
  
  // 已在扫描，直接返回（订阅者已注册，会收到后续更新）
  if (this._scanning) return true
  
  // 兜底初始化（支持分享直接进入子页面的场景）
  const inited = await this.init()
  if (!inited) return false
  
  return this._startDiscovery()
}

// 通知所有订阅者信标更新
_notifyUpdate(beacons) {
  const parsed = beacons.map((b) => this._parseBeacon(b))
  this._listeners.forEach((cb) => cb(parsed, beacons))
}
```

这里有个细节值得注意：onBeaconUpdate 全局只绑定一次，内部用 Map 分发给多个订阅者。避免每个页面都绑一次 onBeaconUpdate 导致重复回调。

### 第三件：前后台切换自动恢复

小程序切后台时蓝牙会自动暂停，定时器无意义，清理掉。切前台时如果有订阅者在等，重新初始化蓝牙适配器并恢复扫描。先 stopBeaconDiscovery 再 startBeaconDiscovery，避免状态残留。

```javascript
wx.onAppHide(() => {
  if (this._scanning) {
    this._clearTimer()
    // 蓝牙会自动暂停，定时器无意义
  }
})

wx.onAppShow(() => {
  // 仅在有订阅者时恢复
  if (this._listeners.size === 0) return
  
  // 切后台期间蓝牙适配器可能已关闭，需重新初始化
  this._initialized = false
  this.init().then((ok) => {
    if (ok) this._restartDiscovery()
  })
})
```

### 第四件：信标解析

微信返回的原始信标数据只有 uuid、major、minor、rssi、accuracy。beaconManager 把它解析成业务可直接用的结构，额外算出 proximity（极近/近/中等/远）和 proximityClass（用于 CSS 样式区分）。

```javascript
_parseBeacon(beacon) {
  return {
    uuid: beacon.uuid,
    major: beacon.major,
    minor: beacon.minor,
    rssi: beacon.rssi,
    accuracy: beacon.accuracy ? beacon.accuracy.toFixed(2) : '未知',
    proximity: this._getProximity(beacon.accuracy),
    proximityClass: this._getProximityClass(beacon.accuracy),
  }
}

// 距离分级：<1m 极近，<3m 近，<10m 中等，>10m 远
_getProximity(accuracy) {
  if (!accuracy) return '未知'
  if (accuracy < 1) return '极近'
  if (accuracy < 3) return '近'
  if (accuracy < 10) return '中等'
  return '远'
}
```

### 第五件：扫描间隔可配置

通过接口下发，带 5 分钟缓存，接口失败时回退默认值。目前固定 1000ms，接口预留了动态调整的能力。

## 3. beaconBehavior：一行引入，自动托管

Behavior 是小程序的混入机制。beaconBehavior 把 beaconManager 的能力封装成页面可以直接用的 data 字段和方法，页面引入只需要一行：

```javascript
import beaconBehavior from '../../behavior/beaconBehavior'

Page({
  behaviors: [beaconBehavior],
  // 引入后自动获得以下能力
  ...
})
```

引入后页面自动获得这些东西：

**data 字段**（可直接绑定到 wxml）

- beaconList — 信标列表（解析后）
- beaconScanStatus — 扫描状态文本
- isBeaconScanning — 是否正在扫描
- beaconReady — 蓝牙是否就绪

**生命周期**（自动托管）

- onShow → 自动开始扫描
- onHide → 自动停止扫描
- onUnload → 自动停止并释放

**方法**（页面直接调用）

- startBeaconScan(options) — 启动扫描
- stopBeaconScan() — 停止扫描
- clearBeaconList() — 清空列表

核心是 startBeaconScan 方法。它做了三件事：强制模式下先调 init 跳过退避，然后调 beaconManager.startScan 注册订阅者，回调里 setData 更新 beaconList 和扫描状态。

```javascript
startBeaconScan(options = {}) {
  if (!this._beaconListenerId) {
    this._beaconListenerId = beaconManager.genListenerId()
  }
  
  const uuids = options.uuids || this.data.beaconTargetUUIDs || []
  
  // 强制模式：先强制 init 跳过退避窗口
  const initPromise = options.force 
    ? beaconManager.init(true) 
    : Promise.resolve(beaconManager.getInitState().ready)
  
  return initPromise.then((inited) => {
    const state = beaconManager.getInitState()
    this.setData({ beaconReady: state.ready })
    
    if (!state.ready) {
      this.setData({ beaconScanStatus: '蓝牙未就绪' })
      return false
    }
    
    return beaconManager.startScan({
      listenerId: this._beaconListenerId,
      uuids: uuids.length ? uuids : undefined,
      onUpdate: (parsed, raw, err) => {
        if (err) {
          /* 错误处理 */
          return
        }
        if (parsed) {
          this.setData({
            beaconList: parsed,
            beaconScanStatus: `发现 ${parsed.length} 个信标`,
            isBeaconScanning: true,
          })
        }
      },
    })
  })
}
```

页面还可以重写 `onBeaconUpdate` 和 `onBeaconError` 处理自定义逻辑，比如连接成功后自动填充表单。

## 4. 页面层：状态条 + 表单联动

bind-customer 页面是业务层，做三件事：iBeacon 状态条引导、表单联动、门店搜索填充。

### 状态条：引导用户开蓝牙

页面顶部有一个 iBeacon 状态条，显示三步操作指引（打开蓝牙 → 扫描连接 → 输编码绑定），右侧是一个状态标签。

未连接时标签显示「点击扫描」或「去授权」，点击后初始化蓝牙并开始扫描。扫描到信标后标签变成「已连接」。

```javascript
onBeaconTagTap() {
  const state = beaconManager.getInitState()
  this.setData({ beaconReady: state.ready })
  
  if (state.ready) {
    // 已就绪：直接开始扫描（force 跳过退避）
    this.startBeaconScan({ force: true })
    return
  }
  
  // 未就绪：初始化蓝牙（force=true 跳过退避）
  beaconManager.init(true).then((ok) => {
    if (ok) {
      this.startBeaconScan({ force: true })
    }
  })
}
```

这里的关键是 force 参数。用户主动点击意味着明确授权意图，所以跳过退避窗口直接调 openBluetoothAdapter。初始化成功后立即开始扫描。

### 表单联动：连接前后两套表单

表单根据 beaconList.length 动态切换，这是整个交互的核心：

**未连接**（beaconList.length == 0）

- 客户编码（可输入）
- 客户名称（可输入）
- 对接业务员（可搜索选择）

**已连接**（beaconList.length > 0）

- 门店编码（新增，可输入）
- 客户编码（可输入，标签变「或客户编码」）
- 客户名称（锁定，disabled）
- 对接业务员（锁定，disabled）

连接后的逻辑是：客户既然在店里（信标已连接），门店编码就能锁定客户身份，不需要再手动输客户名称和业务员。输入门店编码后会自动带出这些信息。

### 门店搜索：输入即查，自动填充

输入门店编码后查询门店接口，返回结果自动填充客户编码、客户名称（脱敏）、业务员。多个匹配结果时弹窗让用户选。

```javascript
_fillStoreData(item) {
  const businessPerson = item.businessPerson || ''
  
  this.setData({
    'form.customerCode': item.code || '',
    'form.customerName': item.name || '',
    'form.salesmanName': businessPerson,
    'form.salesmanCode': item.businessCode || '',
  })
  
  // 同步业务员组件内部 input 值
  // 组件内部 data.value 会覆盖外部 property，需实例级设置
  const cmp = this.searchSelectComponent
  if (cmp) {
    cmp.setData({ value: businessPerson })
  }
}
```

这里有个容易踩的坑：自定义组件的内部 data.value 会覆盖外部 property 传入的 value，必须拿到组件实例后手动 setData 同步，否则界面上显示的还是旧值。这个坑后面总结里还会提到。

门店名称还做了脱敏处理，保留前两位，其余用星号替代：

```javascript
// "吉林省珠宝有限公司" → "吉林*********"
const maskName = (name) => {
  if (!name) return '-'
  const prefix = name.slice(0, 2)
  return prefix + '*********'
}
```

## 5. 完整闭环：从进入到绑定成功

把前面几层串起来，完整的用户操作流程是这样的：

```
① 进入绑定页面
   └─ beaconBehavior pageLifetimes.show 触发

② 看到 iBeacon 状态条，标签显示「去授权」
   └─ beaconReady=false, beaconList.length=0

③ 点击标签 → 蓝牙初始化（force=true）
   └─ beaconManager.init(true) → openBluetoothAdapter

④ 初始化成功 → 开始扫描
   └─ startBeaconScan → startBeaconDiscovery

⑤ 发现信标 → beaconList 有数据
   └─ onBeaconUpdate 回调 → setData → 状态变「已连接」

⑥ 表单切换：门店编码输入框出现
   └─ wxml: wx:if="{{beaconList.length>0}}"

⑦ 输入门店编码 → 搜索门店 → 自动填充
   └─ getStoreInfo → _fillStoreData

⑧ 点击确认 → 校验 → 提交绑定
   └─ manual(bindSource:5) → 绑定成功 → 跳转首页
```

提交时有两种结果。如果客户编码、客户名称、业务员三个字段都正确填了，直接绑定成功。如果只填了部分字段，提交给对应业务员审核，提示「已提交给对应业务员处理，请耐心等待」。

## 6. 踩坑总结

实际开发中踩了几个坑，记录一下。

### 坑一：Vant Toast 不能在 utils 模块里用

beaconManager 是全局单例，运行时没有页面上下文。Vant Toast 依赖当前页面挂载的 `<van-toast>` 组件，在 utils 模块里调 Toast 会静默失败，不报错也不显示。

**解法**：beaconManager 里需要提示用户的地方用 `wx.showToast` 替代，或者把错误信息通过回调传给页面层，由页面用 Vant Toast 显示。

### 坑二：真机 bindinput 和 bindconfirm 重复触发

门店编码输入框同时绑了 bindinput（防抖查询）和 bindconfirm（软键盘完成按钮触发查询）。真机上两个都会触发，导致重复请求。

**解法**：通过 `wx.getSystemInfoSync().platform` 区分开发工具和真机。真机只走 bindconfirm，开发工具走防抖 bindinput。

### 坑三：组件内部 data.value 覆盖外部 property

自定义搜索选择组件内部维护了一个 data.value，会覆盖外部通过 property 传入的 value。门店搜索填充业务员名称时，虽然页面 data 更新了，但组件界面上显示的还是旧值。

**解法**：拿到组件实例后手动 setData 同步内部 value：`cmp.setData({ value: businessPerson })`。

### 坑四：蓝牙错误码要分级处理

蓝牙初始化失败有好几种原因，不能一刀切处理：

- 10001 蓝牙系统开关未开 → 引导用户去系统设置开蓝牙
- 10002 设备不支持蓝牙 → 无法使用此功能
- 10003 微信蓝牙权限未授权 → 引导去微信设置开权限
- 10004 位置服务未开（Android）→ 引导开位置服务

UI 层统一显示「未连接」，但内部按错误码分档记录日志，便于排查。用户主动点击时走 force=true 重新初始化，跳过退避窗口。

### 坑五：隐私协议授权导致初始化失败

小程序使用蓝牙接口会触发隐私协议弹窗。如果用户还没同意隐私协议，openBluetoothAdapter 会直接失败。用户点「同意」后，需要重试一次 init，否则会卡在「未连接」状态无法恢复。

**解法**：绑定 `wx.onNeedPrivacyAuthorization` 和 `wx.getPrivacySetting`，检测到已同意隐私协议后自动重试 init。

## 7. 总结：三层架构的核心价值

回头看这套实现，三层架构的价值在于**职责隔离**。

beaconManager 管蓝牙生命周期，不关心谁在用。beaconBehavior 管页面接入，不关心业务逻辑。bind-customer 管表单和绑定，不碰蓝牙 API。每层改起来互不影响——换一套业务页面，beaconManager 和 beaconBehavior 一行不用改；换一种信标协议，只改 beaconManager 的解析方法。

订阅者模式让多页面共享一个扫描实例成为可能。A 页面在扫描时 B 页面进来，不会重复 startBeaconDiscovery，只是注册一个新回调。B 页面离开，A 页面的扫描不受影响。所有页面都离开了，才真正 stopBeaconDiscovery 释放资源。

退避策略和 force 模式的配合，解决了被动场景反复弹授权弹窗的问题，同时保证用户主动点击时能立即重试。这是实际产品里很容易忽略但用户体验影响很大的细节。

iBeacon 在小程序里的应用远不止客户绑定。门店签到、近场营销、室内导航、展品互动——只要需要「确认用户在某个物理位置」的场景，这套架构都能直接复用。把 beaconManager 和 beaconBehavior 抽出来，业务页面只需要管自己的事。

技术方案的好坏，不在于用了多新的 API，而在于把边界划清楚、把异常想到位、把用户体验的细节抠明白。这套实现不复杂，但该兜的底都兜了，该退的退避都退了，该释放的资源都释放了。能跑在生产环境里的代码，靠的就是这些。

*本文代码基于实际项目实践，分析与踩坑总结均为原创*
