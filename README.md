# Event App

基于 [Ticketmaster Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/) 的移动端活动发现应用，使用 **uni-app (Vue 3)** + **Pinia** 构建。

## 功能特性

- 支持**列表 / 网格**两种视图切换浏览活动
- 支持**关键词搜索**活动
- 支持**加载更多**（分页）
- 查看**活动详情**（日期、场馆、价格、分类、购票链接）
- 兼容 **Android**、**iOS**、**H5**

## 技术栈

| 层级 | 技术 |
|------|-----|
| 框架 | uni-app (Vue 3 + Vite) |
| 状态管理 | Pinia |
| 接口 | Ticketmaster Discovery API v2 |
| 样式 | Scoped CSS + rpx 适配 |

## 项目结构

```
src/
├── api/            # 接口层 (event.js)
├── components/     # 公共组件 (EventCard.vue)
├── pages/
│   ├── index/      # 首页 - 活动列表/网格
│   └── event-detail/ # 活动详情页
├── store/          # Pinia 状态管理 (event.js)
├── utils/          # 请求工具 & 辅助函数
├── App.vue
├── main.js
├── manifest.json
└── pages.json
```

## 架构设计

```
视图层 (Pages / Components)
    ↕ 事件驱动
状态层 (Pinia - useEventStore)
    ↕ 异步 Actions
接口层 (api/event.js)
    ↕ HTTP 请求
请求工具 (utils/request.js)
    ↕ uni.request
Ticketmaster API
```

## 快速开始

### 环境要求

- Node.js >= 16
- HBuilderX（用于 App 打包）或仅使用 npm 运行 H5

### 安装与运行

```bash
# 安装依赖
npm install

# 启动 H5 开发服务器
npm run dev:h5

# 构建 H5 生产版本
npm run build:h5
```

## 打包为 Android APK

### 方式一：使用 HBuilderX 云打包（推荐）

1. 下载并安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. 在 HBuilderX 中打开本项目根目录
3. 确认 `src/manifest.json` 中的应用信息（名称、AppId 等）已正确填写
4. 菜单栏选择 **发行 → 原生App-云打包**
5. 勾选 **Android**，填写包名（如 `com.eventapp.tms`）
6. 选择使用 **公共测试证书**（测试）或上传自有签名证书（正式发布）
7. 点击 **打包**，等待云端编译完成
8. 编译完成后会在控制台输出 APK 下载链接，点击即可下载

### 方式二：使用 HBuilderX 离线打包（进阶）

1. 在 HBuilderX 中选择 **发行 → 生成本地打包App资源**
2. 生成的资源位于 `dist/build/app` 目录
3. 参考 [uni-app 离线打包文档](https://nativesupport.dcloud.net.cn/AppDocs/usesdk/android) 配置 Android Studio 工程
4. 将资源放入 Android 工程的 `assets/apps/` 目录
5. 使用 Android Studio 编译生成 APK

### 方式三：命令行打包 H5（无需 APK 场景）

```bash
npm run build:h5
```

构建产物位于 `dist/build/h5`，可直接部署到 Web 服务器。

## API Key 配置

应用使用 Ticketmaster Discovery API，密钥配置在 `.env.*` 文件中：

```
VITE_TMS_API_KEY = 'your-api-key'
VITE_TMS_BASE_URL = 'https://app.ticketmaster.com/discovery/v2'
```

可在 [Ticketmaster 开发者平台](https://developer.ticketmaster.com/) 免费注册获取 API Key。

## 页面说明

### 首页（Discover Events）
- 展示 Ticketmaster 前 20 条活动
- 支持列表/网格视图切换
- 关键词搜索
- 底部「加载更多」分页

### 活动详情页（Event Detail）
- 活动头图
- 日期与时间
- 场馆名称及地址
- 票价区间
- 售票状态标签
- 分类标签
- 活动描述/备注
- 购票按钮（App 端复制链接，H5 端打开浏览器）