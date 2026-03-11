# 中国移动云盘

中国移动云盘自动签到脚本

## 信息

- 名称：`中国移动云盘`
- 描述：`中国移动云盘自动签到脚本`
- 作者：`𝐎𝐍𝐙𝟑𝐕`
- 仓库：[github.com/Yuheng0101/X.git](https://github.com/Yuheng0101/X.git)
- 主页：[github.com/Yuheng0101/X/tree/main/Tasks/cloud139](https://github.com/Yuheng0101/X/tree/main/Tasks/cloud139)
- 分类：`中国移动云盘任务`
- 频道：[t.me/yqc_000](https://t.me/yqc_000/)
- 反馈：[t.me/NobyDa_Chat](https://t.me/NobyDa_Chat/)
- 版本：`1.0.0`
- 发布目录：`Tasks/cloud139`
- 更新时间：`2026-03-11 14:26:08`

## 功能

- 抓取 `https://user-njs.yun.139.com/user/getUser` 请求头中的 `authorization`
- 自动写入持久化存储键 `ydyp_ck`
- 执行签到、任务、云朵、上传、分享等流程

## 目录结构

```text
src/
  api/
    auth.js
    index.js
    note.js
    reward.js
    sign.js
    upload.js
  capture/
    dev.js
    handler.js
    index.js
  common/
    axios.min.js
    client.js
    config.js
    helpers.js
    request.js
  dev/
    index.js
  lib/
    account.js
    core.js
  index.js
scripts/
  generate-assets.mjs
profiles/
  cloud139.plugin
  cloud139.sgmodule
  cloud139.snippet
  local-links.json
dist/
  capture.js
  cloud139.js
```

## 使用方式

### 抓取授权

- 在代理工具中对 `user-njs.yun.139.com` 开启 MITM
- 正式脚本：`dist/capture.js`
- 开发脚本：`dist/capture.dev.js`

### 直接执行

- 正式脚本：`dist/cloud139.js`
- 开发脚本：`dist/cloud139.dev.js`

## 本地测试

- 开发抓取脚本：[capture.dev.js](http://192.168.110.38:9999/scripts-rollup/cloud139/dist/capture.dev.js)
- 开发执行脚本：[cloud139.dev.js](http://192.168.110.38:9999/scripts-rollup/cloud139/dist/cloud139.dev.js)
- 开发抓取二维码：[扫码打开](https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=http%3A%2F%2F192.168.110.38%3A9999%2Fscripts-rollup%2Fcloud139%2Fdist%2Fcapture.dev.js)
- 开发执行二维码：[扫码打开](https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=http%3A%2F%2F192.168.110.38%3A9999%2Fscripts-rollup%2Fcloud139%2Fdist%2Fcloud139.dev.js)

## 配置项

- `ydyp_ck`
- `upload`
- `share`
- `push`
- `dirId`
- `uploadFilename`
- `uploadSizeMb`
- `shareFilename`
- `clickNum`
- `drawTimes`
- `delayMin`
- `delayMax`
- `timeout`

## 环境变量

- `CLOUD139_TIMEOUT`
- `CLOUD139_PUSH`
- `CLOUD139_UPLOAD`
- `CLOUD139_SHARE`

## 平台配置文件

- Surge: `profiles/cloud139.sgmodule`
- Quantumult X: `profiles/cloud139.snippet`
- Loon: `profiles/cloud139.plugin`
- Surge Dev: `profiles/cloud139.dev.sgmodule`
- Quantumult X Dev: `profiles/cloud139.dev.snippet`
- Loon Dev: `profiles/cloud139.dev.plugin`

## 特别致谢

- [@nsnanocat/util](https://github.com/NSNanoCat/util)
- [@Template(Rollup)](https://github.com/NSNanoCat/Template)


## 远程脚本链接

- 正式抓取脚本：[capture.js](https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/cloud139/dist/capture.js)
- 正式执行脚本：[cloud139.js](https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/cloud139/dist/cloud139.js)
