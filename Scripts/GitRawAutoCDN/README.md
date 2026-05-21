# GitHub Raw Auto CDN

将 `raw.githubusercontent.com` 的请求自动重定向到 jsDelivr CDN，解决 GitHub Raw 访问缓慢或无法连接的问题。

## 原理

脚本在 HTTP 请求阶段拦截所有 `raw.githubusercontent.com` 的请求，通过 302 重定向到 jsDelivr CDN（`cdn.jsdelivr.net`）。

**URL 转换规则：**

```
raw.githubusercontent.com/{user}/{repo}/{branch}/{path}
→ cdn.jsdelivr.net/gh/{user}/{repo}@{branch}/{path}
```

**示例：**

```
https://raw.githubusercontent.com/Yuheng0101/X/main/Scripts/GitRawAutoCDN/index.js
→ https://cdn.jsdelivr.net/gh/Yuheng0101/X@main/Scripts/GitRawAutoCDN/index.js
```

## 支持平台

| 平台 | 安装方式 | 插件文件 |
|---|---|---|
| Surge / Egern / Shadowrocket | 安装 Module | `surge.sgmodule` |
| Loon | 安装 Plugin | `loon.plugin` |
| Stash | [Script-Hub](https://github.com/Script-Hub-Org/Script-Hub) 转换 | — |
| Quantumult X | 安装 Module（需开启资源解析器） | `surge.sgmodule` |

## 安装

### Surge / Egern / Shadowrocket

1. 复制以下安装链接，在 Surge 中打开：

```
https://raw.githubusercontent.com/Yuheng0101/X/main/Scripts/GitRawAutoCDN/surge.sgmodule
```

2. 或手动添加：**首页 → 模块 → 安装新模块**，粘贴上方链接
3. 确保已开启 MITM 并信任证书

### Loon

1. 复制以下安装链接，在 Loon 中打开：

```
https://raw.githubusercontent.com/Yuheng0101/X/main/Scripts/GitRawAutoCDN/loon.plugin
```

2. 或手动添加：**配置 → 插件 → 添加插件**，粘贴上方链接
3. 确保已开启 MITM 并信任证书

### Stash

使用 [Script-Hub](https://github.com/Script-Hub-Org/Script-Hub) 将 `surge.sgmodule` 或 `loon.plugin` 转换为 Stash 格式后导入。

### Quantumult X

1. 确保 QX 已开启 **资源解析器**
2. 复制以下安装链接，在 QX 中添加：

```
https://raw.githubusercontent.com/Yuheng0101/X/main/Scripts/GitRawAutoCDN/surge.sgmodule
```

## 注意事项

- jsDelivr CDN 缓存刷新有延迟（约 10 分钟），刚 push 的文件可能无法立即通过 CDN 访问
- 私有仓库的文件无法通过 jsDelivr CDN 访问，脚本不会对无法匹配的 URL 做处理
