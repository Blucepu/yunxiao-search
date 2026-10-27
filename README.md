# yunxiao-search

云效工作项**全局搜索**页面应用：全局搜索 + 枚举字段筛选 + 数据表格 + 抽屉详情 + 数据汇总（可自选时间范围）。
纯静态 SPA，可整目录上传 OSS 供他人访问；数据来自同级仓库 `yunxiao-insight` 产出的 `data.json`。

- **UI**：React 19 + Tailwind v4 + coss/shadcn 组件（`src/components/ui/`）
- **路由**：HashRouter —— `#/items`、`#/items/:id`（抽屉）、`#/weekly`（数据汇总），筛选条件在 query 上，可分享
- **数据**：运行时拉取 `./data.json` + 30s 轮询；本地实时模式下自动改用 `/api`（见下）

## 快速开始

```bash
bun install
bun dev        # 开发服务器；/api 与 /data.json 自动代理到 localhost:4173（yunxiao-insight serve）
bun run build  # 类型检查 + 构建到 dist/
bun run check  # 类型检查 + 单元测试
```

## 三级数据模式（自动探测）

| 优先级 | 场景 | 数据源 | 实时性 |
|---|---|---|---|
| 1 | `dist/config.js` 配置了 `apiBase` | 跨域实时代理（自持，如云函数） | 点「实时搜索」即取最新 |
| 2 | 本地 `yunxiao-insight` 跑 `bun run serve`（或 dev proxy） | 同源 `/api/data`，服务端持 token | 点「实时搜索」/ 回车即取最新（直达云效，无间隔限制） |
| 3 | 纯 OSS 静态部署 | 同目录 `data.json`，30s 轮询 | 取决于数据侧重新生成并上传的频率 |

模式自动探测（依次请求健康检查），页面右上角有标识。`data.json` 的生成与刷新由
`yunxiao-insight` 的 `sync` 命令负责（会优先写入本仓库 `dist/`）。

### 为什么浏览器不能直调云效？

已实测验证：`openapi-rdc.aliyuncs.com` 对跨域预检（OPTIONS）直接 307 跳文档页，
**不返回任何 `Access-Control-Allow-Origin` 头**，浏览器脚本无法跨域调用。
且云效个人访问令牌一旦下发到公开页面即等于泄露——所以实时能力必须经过
服务端代理（本地 serve 或自持云函数），页面产物里永远不含凭证。

### 给 OSS 访客也开通实时（可选）

1. 部署一个持有 token 的轻量代理（如函数计算 HTTP 触发器），实现
   `GET /api/health` 与 `GET /api/data`，并对你的 OSS 域名开启 CORS；
   可直接复用 yunxiao-insight 的 `serve` 命令逻辑部署。
2. 上传前编辑 `dist/config.js`，填 `apiBase: "https://你的代理域名"`——无需重新构建。
3. 代理不可达时页面自动回退到 `data.json` 轮询，不会报错。

## OSS 部署

整目录上传 `dist/` 为静态网站即可。产物不含 token / 组织 id / API 地址，但含工作项明细，
请用 bucket 私有 / 签名 URL / 内网网关控制访问。

## 数据契约

页面数据的类型定义 import 自 `../yunxiao-insight/src/explore/types.ts`（type-only，构建期擦除），
两个仓库需保持在同一父目录下。契约版本见 `meta.version`。

## 目录结构

```
src/
  pages/ExplorePage.tsx     主页面（顶栏 + 筛选 + Tab + 抽屉）
  components/explore/       FilterChips / FilterTriggerButton / FilterPanel (抽屉) / DateRangePicker / DataTable / DetailSheet / WeeklyView / StatCards
  lib/explore/
    core.ts                 纯逻辑：筛选 / 排序 / 聚合 / 路由序列化 / 数据汇总（Vitest 覆盖）
    api.ts                  数据源：live 探测 + data.json 轮询
    data.tsx                数据 Provider（加载、轮询、刷新、toast）
    filters.ts              筛选状态 ⇄ URL search params
  components/ui/            shadcn 组件库（模板自带）
tests/core.test.ts          纯逻辑单测
```
