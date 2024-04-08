# 波点音乐

## 脚本注明

1. 不保证脚本合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
3. 转载脚本请注明来源，欢迎分享，拒绝倒卖，倒卖 🐕 必死 🐎。
4. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
5. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明, 本人保留随时更改或补充此声明的权利, 一旦您使用或复制了此脚本，即视为您已接受此免责声明。
6. 欢迎对[本仓库](https://github.com/Yuheng0101/X)Star✅，但请不要 Fork❌。

## 脚本描述

- 签到领取会员（部分用户）。

## 使用方法

- 登录`波点音乐` ➟ 打开`重写规则` ➟ 返回 APP 点击`我的`, 提示 ⟦获取 Cookie 成功⟧ 方可继续食用该脚本。

### 远程重写(抓取的时候打开, 抓取成功后关闭 -> 防止不必要的麻烦)

> [Quantumult X](https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/Bdyy/bdyy.conf)

> [Surge](https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/Bdyy/bdyy.sgmodule)

> [Loon](https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/Bdyy/bdyy.plugin)

## Quantumult X 配置

```
[task_local]
0 1 * * * https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/Bdyy/bdyy.js, tag=波点音乐自动签到, img-url=https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/05/b9/57/05b9577c-3773-cd2b-5a99-49c0dc3f331d/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/144x144.png, enabled=true
```

## Surge 配置

```
[Script]
波点音乐自动签到 = type=cron,cronexp=0 1 * * * *,wake-system=1,script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/Bdyy/bdyy.js,timeout=60
```

## Loon 配置

```
[Script]
cron "0 1 * * *" script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/Bdyy/bdyy.js, timeout=10, tag=波点音乐自动签到, img-url=https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/05/b9/57/05b9577c-3773-cd2b-5a99-49c0dc3f331d/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/144x144.png
```
