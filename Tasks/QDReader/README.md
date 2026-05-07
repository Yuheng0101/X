# QDReader

> 起点读书自动签到

支持多账号的起点读书自动签到脚本。

历史更新记录已独立维护在 [CHANGELOG.md](./CHANGELOG.md)。

## 功能特性

- 自动完成每日签到，返回签到状态和结果。
- 支持多账号，Cookie 以 JSON Map 格式存储，按 uid 区分。
- Cookie 抓取自动识别账号（从 QDHeader 提取 uid），区分新增与更新。
- 签到成功/失败/已签到分别通知，非 Node.js 环境支持头像展示。
- HTTP 请求超时自动重试（含中文"超时"匹配），默认 3 次，间隔 500ms。
- 调试模式下输出请求头、请求体和响应信息。

## 抓取教程

1. 确保已登录"起点读书"App。
2. 打开 App → **我的** → **福利中心**。
3. 提示抓取成功即可使用该脚本。

> 抓取本质是拦截 `getlogininfo` 请求，提取其中的 Cookie 并写入本地缓存。

## 基础配置

Node.js / 青龙面板请在 `.env` 或环境变量中配置。iOS 代理工具使用模块/插件参数或 BoxJs 配置。

| 变量名              | 说明                                         |
| ------------------- | -------------------------------------------- |
| `QDREADER_COOKIE`   | 账号 Cookie，JSON Map 格式 `{"uid":"cookie"}` |
| `QDREADER_DEBUG`    | 是否开启调试模式                             |

说明：

- Node.js 环境会优先读取环境变量，找不到时回退到 `box.dat`（Storage）。
- iOS 代理工具优先读取模块/插件参数，找不到时读取持久化存储。

## 重写订阅

| 工具         | 订阅链接                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Surge        | [qdreader.surge.sgmodule](https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/QDReader/profiles/qdreader.surge.sgmodule) |
| Loon         | [qdreader.loon.plugin](https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/QDReader/profiles/qdreader.loon.plugin)       |
| Quantumult X | [qdreader.qx.snippet](https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/QDReader/profiles/qdreader.qx.snippet)         |

> Surge / Loon 等工具的抓取 Cookie 和 Cron 定时执行均已集成到模块/插件中，安装即用。

### Quantumult X

Quantumult X 需自行添加获取 Cookie 重写后，在 `[task_local]` 下添加定时任务：

```
11 2 * * * https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/QDReader/qdreader.js, tag=起点读书自动签到, img-url=https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/97/40/5e/97405e49-87bb-3f0a-bf3a-91cf8fdf99a0/AppIcon-0-0-1x_U007epad-0-1-0-0-sRGB-GLES2_U002c0-85-220.png/144x144.png, enabled=true
```

其他代理工具请自行使用 [Script-Hub](https://github.com/Script-Hub-Org/Script-Hub) 转换。

## BoxJs 配置

| Key                | 说明               |
| ------------------ | ------------------ |
| `QDREADER_COOKIE`  | 账号 Cookie 缓存   |
| `QDREADER_DEBUG`   | 是否开启调试模式   |

## 通知说明

在 Surge、Loon、Quantumult X 等 iOS 代理工具中，脚本仍走对应工具的原生通知能力。

在 Node.js / 青龙面板中，如果检测到外部通知配置，会优先调用外部通知模块。当前已整理的渠道包括 Bark、Telegram、Server 酱、钉钉、企业微信机器人、企业微信应用、iGot、PushPlus、WxPusher、Gotify、go-cqhttp、Bncr。

Node.js / 青龙面板请优先参考 [`.env.example`](./.env.example)。各渠道环境变量如下：

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

## 使用风险

- 本项目为非官方实现，仅供学习、研究与个人自动化测试使用，请勿用于任何商业、批量或违法用途。
- 本项目与起点读书或相关运营主体不存在任何隶属、授权或担保关系。
- 脚本依赖第三方接口、加密网关与目标站点返回结构，随时可能因接口调整、风控策略或网络波动而失效。
- 开发者不对脚本可用性、稳定性、时效性、准确性及由此带来的任何直接或间接损失承担责任。
- 请自行评估账号安全与使用风险，敏感凭据请仅在受信任环境中配置，并妥善保管。
- 若相关平台规则、接口协议或法律法规发生变化，请立即停止使用并以官方渠道信息为准。

## 其他链接

- [BoxJs 配置](https://raw.githubusercontent.com/Yuheng0101/X/refs/heads/main/Tasks/boxjs.json)
