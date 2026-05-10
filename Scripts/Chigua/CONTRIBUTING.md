# Chigua_Clean · 贡献指南

> 面向贡献者的 PR 指南。欢迎提交新站点规则或修复现有规则。

---

## 目录

1. [项目结构](#项目结构)
2. [工作原理](#工作原理)
3. [规则字段说明](#规则字段说明)
4. [新增站点 · 完整流程](#新增站点完整流程)
5. [如何找广告元素](#如何找广告元素)
6. [本地调试](#本地调试)
7. [提交规范](#提交规范)

---

## 项目结构

```
Chigua/
├── Chigua_Clean.js    # 核心去广告脚本（唯一需要修改的文件）
└── README.md
```

---

## 工作原理

```
HTTP Response
    │
    ▼
Surge/QX 拦截（MITM 解密）
    │  pattern 匹配 → 触发 Chigua_Clean.js
    ▼
handleXxx()        ← 每个站点一个 handle 函数，定义 rules（在 Chigua_Clean.js 中）
    │
    ▼
removeAds(html, rules)   ← 核心处理器，由 Z3rio 解析 HTML 并按规则删除节点
    │
    ▼
$done($response)   ← 返回修改后的响应体
```

**Z3rio** 是内置的纯字符串 HTML 解析库（零浏览器依赖），暴露类 jQuery 的 `doc.find(sel).remove()` API。

脚本顶部的块注释包含 QX 所需的 `[mitm]` 和 `[rewrite_local]` 配置，其他平台通过 Script-Hub 转换使用。

---

## 规则字段说明

`rules` 对象支持以下字段，**所有字段均可选**：

### `removeSelectors` — 直接删除元素

接受 CSS 选择器数组，匹配到的元素**连同自身整体删除**。

支持的选择器格式：

| 格式 | 示例 | 说明 |
|---|---|---|
| 标签名 | `"div"` | 匹配所有该标签 |
| class | `".adspop"` | 精确 class 匹配（不支持通配符） |
| id | `"#button5"` | id 精确匹配 |
| 属性存在 | `"[data-ad]"` | 有该属性即匹配 |
| 属性等于 | `"[type=text]"` | 属性值精确等于 |
| 属性不等于 | `"[data-ad_id!='']"` | 有该属性且值不为空 |
| 属性含有 | `"[class*=ad]"` | ⚠️ 慎用，容易误杀 |

```js
removeSelectors: [
    '.adspop',          // ✅ 精确 class
    '#button5',         // ✅ 精确 id
    '[data-ad]',        // ✅ 属性存在
    '[class*="ad-"]',   // ⚠️ 通配符，确认无误杀再用
]
```

---

### `removeWithParent` — 找到广告元素后向上删祖先容器

适用于广告嵌在正常容器（如 `article`、`li`）里的场景：先定位广告专属特征，再向上找到最近的指定祖先，把整个容器删掉。

```js
removeWithParent: [
    // [广告特征选择器,  祖先容器选择器]
    ['[data-ad_id!=""]', 'article'],   // post 流中的赞助文章
    ['[href="/ai"]',     'li'],         // 导航栏中的 AI 推广项
]
```

> **原则**：广告特征选择器应尽量唯一，避免普通内容被误删。

---

### `removeScripts` — 删除含特定内容/src 的 `<script>`

接受正则数组，匹配 `src` 属性或内联脚本文本：

```js
removeScripts: [
    /\/tbxw\//,          // 匹配 src 含 /tbxw/ 的外链脚本
    /trackAd\(/,         // 匹配内联脚本含 trackAd( 的
]
```

---

### `removeScriptSrc` — 仅匹配外链脚本 `src`

与 `removeScripts` 类似，但**只**匹配 `src` 属性，不匹配内联内容，性能更好：

```js
removeScriptSrc: [
    /\/tbxw\//,
    /googlesyndication/,
]
```

---

### `removeInlineScriptPatterns` — 仅匹配内联脚本内容

只匹配没有 `src` 的内联 `<script>` 文本：

```js
removeInlineScriptPatterns: [
    /pushNotification\(/,
]
```

---

## 新增站点·完整流程

### 第一步：抓取页面 HTML 快照

用浏览器开发工具或代理工具保存目标页面的原始 HTML，存放到 `html/<domain>/index.html`（仅供本地调试，不提交到仓库）。

### 第二步：识别广告元素

打开 HTML 快照，搜索以下关键词定位广告：

```
ad  ads  adv  banner  sponsor  promoted  popup  float  推广  赞助
```

对每个广告元素，判断删除策略：

- **独立容器**（`position: fixed` 的弹窗、横幅） → `removeSelectors`
- **嵌入内容流**（广告文章卡片、广告导航项） → `removeWithParent`
- **广告脚本** → `removeScriptSrc`

### 第三步：在 `Chigua_Clean.js` 中添加 handle 函数

复制以下模板，**命名规范为 `handleXxx`**（Xxx 为站点标识）：

```js
function handleExample() {
    console.log(`─────────────────────`)
    console.log(`开始处理 example.com`)
    console.log(`─────────────────────`)
    const rules = {
        removeSelectors: [
            '.ad-banner',       // 描述：顶部广告横幅
        ],
        removeWithParent: [
            ['[data-ad_id!=""]', 'article'],  // 描述：信息流赞助文章
        ],
        removeScriptSrc: [
            /\/ad-sdk\//,       // 描述：广告 SDK 脚本
        ],
    }
    $response.body = removeAds($response.body, rules)
    console.log(`处理完成`)
}
```

### 第四步：在入口 IIFE 中注册

```js
!(async () => {
    if (/mrds66\.com/.test($request.url))  { handleMrds()    }
    if (/hl365\.com/.test($request.url))   { handleHl365()   }
    if (/example\.com/.test($request.url)) { handleExample() }  // ← 新增
})()
```

### 第五步：更新脚本顶部的块注释

在 `Chigua_Clean.js` 顶部注释中追加新站点的 `hostname` 和 `rewrite` 规则：

```js
/*
[mitm]
hostname= = www.mrds66.com, example.com

[rewrite_local]
# > Example去广告
^https?:\/\/example\.com url script-response-body https://raw.githubusercontent.com/Yuheng0101/X/main/Scripts/Chigua/Chigua_Clean.js
*/
```

---

## 如何找广告元素

### 判断是否为广告专属特征（避免误杀）

```html
<!-- ✅ 广告专属 class —— 安全 -->
<div class="post-card-ads">

<!-- ✅ 广告系统注入的属性 —— 安全 -->
<a data-ad_id="202503060803827191">

<!-- ⚠️ 通用 class，普通内容也用 —— 危险 -->
<a data-event="ad_click">   ← 普通文章也有这个属性！
```

### 检查是否误杀的方法

在浏览器控制台执行，确认只有广告元素被选中：

```js
// 检查 removeSelectors
document.querySelectorAll('.your-selector').forEach(el => console.log(el.outerHTML.slice(0, 100)))

// 检查 removeWithParent（找祖先）
document.querySelectorAll('[data-ad_id!=""]').forEach(el => {
    let cur = el.parentElement
    while (cur) {
        if (cur.tagName === 'ARTICLE') { console.log(cur.outerHTML.slice(0, 200)); break }
        cur = cur.parentElement
    }
})
```

---

## 本地调试

1. 将 QX 中的脚本路径临时改为本地文件路径，或用本机 HTTP 服务托管 `Chigua_Clean.js`
2. 打开目标网站，在 QX 日志中查看 `console.log` 输出，确认规则命中
3. 用浏览器开发工具（审查元素）确认广告节点已被移除、正常内容未被误删

---

## 提交规范

- **一个 PR 只处理一个站点**
- commit message 格式：`feat(example.com): 新增去广告规则` 或 `fix(mrds66.com): 修正赞助文章误删`
- 提交前请在真实设备/模拟器上验证：
  - [ ] 广告元素已消失
  - [ ] 正常文章、图片、导航完整
  - [ ] 页面无明显布局错乱
- 本地用于调试的 HTML 快照文件不要提交到仓库
