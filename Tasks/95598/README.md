# State Grid Corporation of China (SGCC)

> 网上国网重构版

基于旧版网上国网查询脚本重构，目标是保持原有输出风格，同时把项目拆成更清晰的模块结构，便于后续维护、排查和扩展。

历史更新记录已独立维护在 [CHANGELOG.md](./CHANGELOG.md)。

## 功能特性

- 查询账户余额、本期电量、年度用电、累计花费、预存电费和预计可用天数。
- 支持最近五日用电汇总，并可按天输出近五日明细。
- 支持单户号通知，也支持账号下全部户号通知。
- 输出格式尽量保持旧项目样式，适配移动端通知阅读。
- 使用旧版 BoxJs 缓存 key，兼容原有配置习惯。
- Node.js / 青龙面板环境支持外部通知渠道，iOS 代理工具保持原生通知。
- 调试模式下会打印请求头、请求体、状态码和响应体，敏感字段会做遮挡处理。
- HTTP 请求基于 axios 风格客户端和拦截器处理，失败后固定重试 3 次，间隔 500ms。

## 基础配置

Node.js / 青龙面板请优先参考 [`.env.example`](./.env.example)。常用变量如下：

| 变量名                     | 说明                           |
| -------------------------- | ------------------------------ |
| `SGCC_USERNAME`            | 网上国网登录账号，通常为手机号 |
| `SGCC_PASSWORD`            | 网上国网登录密码               |
| `SGCC_DEBUG`               | 是否开启调试模式               |
| `SGCC_SHOW_RECENT_USAGE`   | 是否输出最近五天逐日用电明细   |
| `SGCC_NOTIFY_ALL_ACCOUNTS` | 是否通知账号下全部户号         |
| `SGCC_SERVICE`             | 是否启用服务模式               |
| `SGCC_SILENT`              | 是否启用静默模式               |

说明：

- HTTP 重试次数和重试间隔是脚本内部固定策略，不对用户暴露配置项。
- iOS 代理工具可继续使用参数或 BoxJs 配置。
- Node.js / 青龙环境会优先读取环境变量。

## 服务模式

命中 `electricity/bill/all` 代理请求，或显式开启 `SGCC_SERVICE=true` 时，脚本会进入服务模式并直接返回 HTTP 响应。

服务模式返回值兼容 `dompling/Script` 的国网小组件接口结构：

```json
[
    {
        "eleBill": {},
        "userInfo": {},
        "dayElecQuantity": {},
        "dayElecQuantity31": {},
        "monthElecQuantity": {},
        "lastYearElecQuantity": {},
        "stepElecQuantity": [],
        "arrearsOfFees": false
    }
]
```

说明：

- 服务模式默认返回全部绑定户号，保持旧版 `bill/all` 接口语义。
- 响应头使用 `application/json;charset=utf8`，以兼容 dompling 版小组件读取方式。
- 支持按需查询参数：`eleBill`、`dayElecQuantity`、`dayElecQuantity31`、`monthElecQuantity`、`lastYearElecQuantity`、`stepElecQuantity`。
- 不带查询参数时会默认查询上述全部数据。

## BoxJs 配置

脚本直接沿用旧版 BoxJs key，不再额外生成一套新的缓存 key：

| Key                    | 说明                     |
| ---------------------- | ------------------------ |
| `95598_log_debug`      | 是否开启调试模式         |
| `95598_username`       | 登录账号                 |
| `95598_password`       | 登录密码                 |
| `95598_recent_elc_fee` | 是否显示最近五日逐日用电 |
| `95598_notify_type`    | 是否通知全部户号         |
| `95598_bizrt`          | 登录态缓存               |
| `95598_bindInfo`       | 旧版绑定户号缓存         |

## 通知说明

在 Surge、Loon、Quantumult X 等 iOS 代理工具中，脚本仍走对应工具的原生通知能力。

在 Node.js / 青龙面板中，如果检测到外部通知配置，会优先调用 [src/runtime/sendNotify.mjs](./src/runtime/sendNotify.mjs)。当前已整理的渠道包括 Bark、Telegram、Server 酱、钉钉、企业微信机器人、企业微信应用、iGot、PushPlus、WxPusher、Gotify、go-cqhttp、Bncr。

Telegram 支持代理配置，适合中国大陆网络环境；Node 专属依赖按需加载，不会影响 iOS 代理工具打包兼容。

各渠道环境变量如下：

| 渠道             | 变量名            | 说明                                      |
| ---------------- | ----------------- | ----------------------------------------- |
| Bark             | `BARK_PUSH`       | 设备 Key 或完整推送地址                   |
|                  | `BARK_SOUND`      | 推送铃声                                  |
|                  | `BARK_GROUP`      | 消息分组                                  |
|                  | `BARK_ICON`       | 自定义图标 URL                            |
| Telegram         | `TG_BOT_TOKEN`    | Bot Token                                 |
|                  | `TG_USER_ID`      | 接收消息的用户 ID                         |
|                  | `TG_API_HOST`     | 自建反代域名，默认 `api.telegram.org`     |
|                  | `TG_PROXY_HOST`   | 代理主机                                  |
|                  | `TG_PROXY_PORT`   | 代理端口                                  |
|                  | `TG_PROXY_AUTH`   | 代理认证，格式 `user:pass`                |
| Server 酱        | `PUSH_KEY`        | SendKey                                   |
| 钉钉             | `DD_BOT_TOKEN`    | 自定义机器人 access_token                 |
|                  | `DD_BOT_SECRET`   | 加签密钥                                  |
| 企业微信机器人   | `QYWX_KEY`        | Webhook Key                               |
| 企业微信应用     | `QYWX_AM`         | 逗号分隔：corpid,corpsecret,touser,agentid,thumb_media_id |
| iGot             | `IGOT_PUSH_KEY`   | 24 位推送 Key                             |
| PushPlus         | `PUSH_PLUS_TOKEN` | Token                                     |
|                  | `PUSH_PLUS_USER`  | 群组编码（可选）                          |
| WxPusher         | `WP_APP_TOKEN`    | appToken                                  |
|                  | `WP_TOPICIDS`     | 主题 ID（多个逗号分隔）                   |
|                  | `WP_UIDS`         | 用户 UID（多个逗号分隔）                  |
|                  | `WP_URL`          | 跳转链接（可选）                          |
| Gotify           | `GOTIFY_URL`      | 服务地址                                  |
|                  | `GOTIFY_TOKEN`    | 应用 Token                                |
|                  | `GOTIFY_PRIORITY` | 消息优先级，默认 `0`                      |
| go-cqhttp        | `GOBOT_URL`       | 服务地址                                  |
|                  | `GOBOT_TOKEN`     | 访问 Token                                |
|                  | `GOBOT_QQ`        | 目标 QQ 号或群号                          |
| Bncr             | `BncrHost`        | 服务地址                                  |
|                  | `BncrToken`       | 访问 Token                                |

## 调试与安全

开启 `SGCC_DEBUG=true` 后，脚本会输出接口请求和响应信息，便于排查登录、验证码、解密和业务接口问题。

调试日志会对敏感字段做遮挡处理。即便如此，也不建议公开完整调试日志。

## 接口逻辑

- 接口命名尽量对齐官方 Web 端命名。
- HTTP 层使用 axios 风格封装，并通过拦截器统一处理日志、响应和固定重试。
- 登录态失效判断集中维护，避免不同模块重复判断同一类错误。

## 使用风险

- 本项目为非官方实现，仅供学习、研究与个人自动化测试使用。
- 脚本依赖第三方网关、网上国网页面接口和目标站点返回结构，可能因接口调整、风控策略或网络波动失效。
- 请自行评估账号安全和运行环境可信度，不要在不可信环境中保存账号密码。
- 若相关平台规则、接口协议或法律法规发生变化，请立即停止使用并以官方渠道为准。

## 重写订阅

| 工具            | 订阅链接                                                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Surge           | [sgcc.surge.sgmodule](https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/95598/profiles/sgcc.surge.sgmodule)                                          |
| Loon            | [sgcc.loon.plugin](https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/95598/profiles/sgcc.loon.plugin)                                               |
| Quantumult X    | [sgcc.qx.snippet](https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/95598/profiles/sgcc.qx.snippet)                                                 |

其他代理工具请自行使用 [Script-Hub](https://github.com/Script-Hub-Org/Script-Hub) 转换。

## 其他链接

- [BoxJs 配置](https://raw.githubusercontent.com/Yuheng0101/X/refs/heads/main/Tasks/boxjs.json)

- [脑瓜 Scriptbale 组件](https://raw.githubusercontent.com/anker1209/Scriptable/refs/heads/main/scripts/sgcc.js)

- [2Ya Scriptbale 组件](https://raw.githubusercontent.com/dompling/Scriptable/master/Scripts/wsgw.js)

- [𝑱𝒂𝒄𝒌𝒊𝒆 Scriptbale 组件](https://cdn.jsdelivr.net/gh/honye/scriptable-scripts@abbfb2e5ac92d1b53483860c5d44574e59c35c23/dist/SGCC.js)
