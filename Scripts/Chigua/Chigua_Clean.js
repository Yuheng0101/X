/*
[mitm]
hostname = www.mrds66.com

[rewrite_local]
# > Rx去广告
^https?:\/\/www\.mrds66\.com(?!.*\.(css|js|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|eot|mp[34]|webm|m3u8|ts|json|xml|txt)) url script-response-body https://raw.githubusercontent.com/Yuheng0101/X/main/Scripts/Chigua/Chigua_Clean.js

*/

const startTime = Date.now()
!(async () => {
    if (typeof $response === 'undefined') throw `$response不存在, 请确认执行环境`
    if (!$response?.body?.includes('<!DOCTYPE')) {
        // console.log($response.body)
        throw `${$request.url} >> 响应体非 HTML 结构, 跳过重写`
    }
    if (/mrds66\.com/.test($request.url)) {
        handleMrds()
    }
})()
    .catch((err) => {
        console.log(`⚠️ NoAdv Error: ${err}`)
    })
    .finally(() => {
        const duration = Date.now() - startTime
        console.log(`处理结束，耗时: ${duration}ms`)
        $done($response)
    })

function handleMrds() {
    console.log(`─────────────────────`)
    console.log(`开始处理 mrds66.com`)
    console.log(`─────────────────────`)
    const rules = {
        removeSelectors: [
            '.adspop', // 全屏弹窗广告
            '.application-popup', // 全屏弹窗广告
            '.horizontal-banner', // 底部横幅广告
            '.article-ads-btn', // 文章页底部广告按钮
            '.article-download', // 文章页下载按钮
            '#button5', // 分享推广
            '.content-tabs' // 文章下无用广告
        ],
        removeWithParent: [
            ['[data-ad_id!=""]', 'article'], // post栏插入广告
            ['[href="/ai"]', 'li'] // AI推广
        ]
    }
    $response.body = removeAds($response.body, rules)
    console.log(`处理完成`)
}

// ── 去广告核心 ────────────────────────────────────────
function removeAds(html, rules) {
    rules = rules || {}
    const doc = Z3rio(html)

    function nodeText(n) {
        if (n.nodeType === 3) return n.data || ''
        return (n.children || []).map(nodeText).join('')
    }

    for (const sel of rules.removeSelectors || []) {
        try {
            doc.find(sel).remove()
        } catch (e) {}
    }

    doc.find('script').each((i, el) => {
        const src = el.attrs.src || ''
        const text = nodeText(el)
        const hit =
            (rules.removeScripts || []).some((p) => p.test(src) || p.test(text)) ||
            (rules.removeInlineScriptPatterns || []).some((p) => p.test(text)) ||
            (rules.removeScriptSrc || []).some((p) => p.test(src))
        if (hit && el.parent) el.parent._removeChild(el)
    })

    function matchNode(node, sel) {
        if (!node || node.nodeType !== 1) return false
        if (!sel.startsWith('.') && !sel.startsWith('#')) return node.tagName === sel
        if (sel.startsWith('.')) return (node.attrs?.class || '').split(/\s+/).includes(sel.slice(1))
        if (sel.startsWith('#')) return node.attrs?.id === sel.slice(1)
        return false
    }
    for (const [adSel, ancestorSel] of rules.removeWithParent || []) {
        doc.find(adSel).each((_, adNode) => {
            let cur = adNode.parent
            while (cur && cur.nodeType !== 9) {
                if (matchNode(cur, ancestorSel)) {
                    cur.parent?._removeChild(cur)
                    break
                }
                cur = cur.parent
            }
        })
    }

    return doc.doc()
}

// ══════════════════════════════════════════════════════
//  Z3rio - 纯字符串 HTML 解析库 (零浏览器依赖)
// ══════════════════════════════════════════════════════════════════════════════════════════════════════════════
// prettier-ignore
function Z3rio(t){const n=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]),e=new Set(["script","style"]);class r{constructor(t,n="",e={},r=""){this.nodeType=t,this.tagName=n,this.attrs=e,this.data=r,this.children=[],this.parent=null}_removeChild(t){const n=this.children.indexOf(t);-1!==n&&(this.children.splice(n,1),t.parent=null)}_appendChild(t){t.parent=this,this.children.push(t)}}function s(t){const s=new r(9);s.doctype="";const o=[s];let a=0,h=t.length;for(;a<h;)if("<"===t[a]){if("<!DOCTYPE"===t.substring(a,a+9).toUpperCase()){const n=t.indexOf(">",a+9);if(-1===n)break;s.doctype=t.substring(a,n+1),a=n+1;continue}if("\x3c!--"===t.substring(a,a+4)){const n=t.indexOf("--\x3e",a+4);if(-1===n)break;a=n+3;continue}if("!"===t[a+1]){const n=t.indexOf(">",a+2);if(-1===n)break;a=n+1;continue}if("/"===t[a+1]){const n=t.indexOf(">",a+2);if(-1===n)break;const e=t.substring(a+2,n).trim().toLowerCase();for(let t=o.length-1;t>0;t--)if(o[t].tagName===e){o.length=t;break}a=n+1;continue}const h=i(t,a);if(!h){a++;continue}const c=new r(1,h.name,h.attrs);if(o[o.length-1]._appendChild(c),!h.self&&!n.has(h.name)){if(e.has(h.name)){const n="</"+h.name,e=t.toLowerCase().indexOf(n,h.end);if(-1!==e){c._appendChild(new r(3,"",{},t.substring(h.end,e))),a=t.indexOf(">",e)+1;continue}}o.push(c)}a=h.end}else{const n=t.indexOf("<",a),e=-1===n?h:n;e>a&&o[o.length-1]._appendChild(new r(3,"",{},t.substring(a,e))),a=e}return s}function i(t,n){let e=n+1,r="";for(;e<t.length&&!/[\s\/>]/.test(t[e]);)r+=t[e++];if(r=r.toLowerCase(),!r)return null;const s={};let i=!1;for(;e<t.length;){for(;e<t.length&&/\s/.test(t[e]);)e++;if(e>=t.length)break;if(">"===t[e]){e++;break}if("/"===t[e]){for(i=!0;e<t.length&&">"!==t[e];)e++;e<t.length&&e++;break}let n="";for(;e<t.length&&!/[\s=\/>]/.test(t[e]);)n+=t[e++];if(!n){e++;continue}for(;e<t.length&&/\s/.test(t[e]);)e++;let r=n;if(e<t.length&&"="===t[e]){for(e++;e<t.length&&/\s/.test(t[e]);)e++;if(e<t.length&&('"'===t[e]||"'"===t[e])){const n=t[e++];for(r="";e<t.length&&t[e]!==n;)r+=t[e++];e<t.length&&e++}else for(r="";e<t.length&&!/[\s>]/.test(t[e]);)r+=t[e++]}s[n]=r}return{name:r,attrs:s,self:i,end:e}}function o(t){if(9===t.nodeType)return(t.doctype||"")+t.children.map(o).join("");if(3===t.nodeType)return t.data;if(1!==t.nodeType)return"";const e=t.tagName;let r="<"+e;for(const n in t.attrs)t.attrs.hasOwnProperty(n)&&(r+=t.attrs[n]===n?" "+n:` ${n}="${t.attrs[n].replace(/"/g,"&quot;")}"`);return r+=">",n.has(e)?r:r+t.children.map(o).join("")+"</"+e+">"}function a(t){const n={tag:"",id:"",classes:[],attrs:[]};let e=0;for(;e<t.length&&/[a-zA-Z0-9*\-]/.test(t[e]);)n.tag+=t[e++];for(;e<t.length;)if("#"===t[e]){e++;let r="";for(;e<t.length&&/[a-zA-Z0-9_\-]/.test(t[e]);)r+=t[e++];n.id=r}else if("."===t[e]){e++;let r="";for(;e<t.length&&/[a-zA-Z0-9_\-]/.test(t[e]);)r+=t[e++];n.classes.push(r)}else if("["===t[e]){e++;let r="",s=1;for(;e<t.length&&s>0;)"["===t[e]&&s++,"]"===t[e]&&s--,s>0&&(r+=t[e]),e++;const i=r.match(/^([^\]*^$~!|]+?)(?:([*^$~!|]?=)(.+))?$/);i&&n.attrs.push({name:i[1].trim(),op:i[2]||null,val:i[3]?i[3].replace(/^['"]|['"]$/g,""):null})}else e++;return n}function h(t){return t.split(",").map((t=>t.trim())).filter(Boolean).map((t=>{const n=[];let e=0;for(;e<t.length;){for(;e<t.length&&" "===t[e];)e++;if(e>=t.length)break;let r=0===n.length?null:" ";if(">"===t[e])for(r=">",e++;e<t.length&&" "===t[e];)e++;let s="";for(;e<t.length&&" "!==t[e]&&">"!==t[e];)s+=t[e++];s&&n.push({sel:a(s),comb:r})}return n}))}function c(t,n,e){if(!t||9===t.nodeType)return!1;if(!function(t,n){if(1!==t.nodeType)return!1;if(n.tag&&"*"!==n.tag&&t.tagName!==n.tag)return!1;if(n.id&&t.attrs.id!==n.id)return!1;if(n.classes.length){const e=(t.attrs.class||"").split(/\s+/);if(n.classes.some((t=>!e.includes(t))))return!1}for(const e of n.attrs){const n=t.attrs[e.name];if(void 0===n)return!1;if(e.op){if("="===e.op&&n!==e.val)return!1;if("*="===e.op&&!n.includes(e.val))return!1;if("^="===e.op&&!n.startsWith(e.val))return!1;if("$="===e.op&&!n.endsWith(e.val))return!1;if("~="===e.op&&!n.split(/\s+/).includes(e.val))return!1}}return!0}(t,n[e].sel))return!1;if(0===e)return!0;if(">"===(n[e].comb||" "))return c(t.parent,n,e-1);let r=t.parent;for(;r&&9!==r.nodeType;){if(c(r,n,e-1))return!0;r=r.parent}return!1}function l(t,n){return h(n).some((n=>c(t,n,n.length-1)))}function f(t){return 3===t.nodeType?t.data:1===t.nodeType||9===t.nodeType?t.children.map(f).join(""):""}function u(t){const n=new r(t.nodeType,t.tagName,{...t.attrs},t.data);return n.children=t.children.map((t=>{const e=u(t);return e.parent=n,e})),n}function p(t){let n=t;for(;n.parent;)n=n.parent;return n}return new class{constructor(t){"string"==typeof t?(this._r=s(t),this._n=[this._r]):t instanceof r?(this._r=p(t),this._n=[t]):Array.isArray(t)?(this._n=t,this._r=t.length?p(t[0]):new r(9)):(this._r=new r(9),this._n=[])}get length(){return this._n.length}get(t){return this._n[t<0?this._n.length+t:t]??null}eq(t){const n=this.get(t);return new this.constructor(n?[n]:[])}first(){return this.eq(0)}last(){return this.eq(-1)}find(t){const n=[];return this._n.forEach((e=>function(t,n){const e=h(n),r=[];return function t(n){1===n.nodeType&&e.some((t=>c(n,t,t.length-1)))&&r.push(n),n.children.forEach(t)}(t),r}(e,t).forEach((t=>n.push(t))))),new this.constructor(n)}filter(t){return"function"==typeof t?new this.constructor(this._n.filter(((n,e)=>t(e,n)))):new this.constructor(this._n.filter((n=>l(n,t))))}each(t){return this._n.forEach(((n,e)=>t(e,n))),this}map(t){return new this.constructor(this._n.map(((n,e)=>t(e,n))).filter(Boolean))}parent(){const t=new Set,n=[];return this._n.forEach((e=>{e.parent&&9!==e.parent.nodeType&&!t.has(e.parent)&&(t.add(e.parent),n.push(e.parent))})),new this.constructor(n)}children(t){const n=[];return this._n.forEach((e=>e.children.forEach((e=>{t&&!l(e,t)||n.push(e)})))),new this.constructor(n)}siblings(){const t=[];return this._n.forEach((n=>{n.parent&&n.parent.children.forEach((e=>{e!==n&&t.push(e)}))})),new this.constructor(t)}closest(t){for(const n of this._n){let e=n;for(;e;){if(l(e,t))return new this.constructor([e]);e=e.parent}}return new this.constructor([])}attr(t,n){if(void 0===n){return this._n[0]?.attrs?.[t]??null}return this._n.forEach((e=>{e.attrs&&(e.attrs[t]=n)})),this}removeAttr(t){return this._n.forEach((n=>{n.attrs&&delete n.attrs[t]})),this}data(t,n){const e="data-"+t.replace(/([A-Z])/g,"-$1").toLowerCase();return void 0===n?this.attr(e):this.attr(e,n)}addClass(t){const n=t.split(/\s+/);return this._n.forEach((t=>{if(t.attrs){const e=new Set([...(t.attrs.class||"").split(/\s+/).filter(Boolean),...n]);t.attrs.class=[...e].join(" ")}})),this}removeClass(t){const n=new Set(t.split(/\s+/));return this._n.forEach((t=>{t.attrs?.class&&(t.attrs.class=t.attrs.class.split(/\s+/).filter((t=>!n.has(t))).join(" "),t.attrs.class||delete t.attrs.class)})),this}hasClass(t){return this._n.some((n=>n.attrs?.class?.split(/\s+/).includes(t)))}html(t){return void 0===t?this._n[0]?.children.map(o).join("")??"":(this._n.forEach((n=>{n.children=[],s(t).children.forEach((t=>{t.parent=n,n.children.push(t)}))})),this)}text(t){return void 0===t?this._n.map(f).join(""):(this._n.forEach((n=>{const e=new r(3,"",{},t);e.parent=n,n.children=[e]})),this)}append(t){const n=t instanceof this.constructor?t._n:[t];return this._n.forEach((t=>n.forEach((n=>{const e=u(n);e.parent=t,t.children.push(e)})))),this}prepend(t){const n=t instanceof this.constructor?t._n:[t];return this._n.forEach((t=>n.forEach((n=>{const e=u(n);e.parent=t,t.children.unshift(e)})))),this}before(t){return s(t).children.forEach((t=>{this._n.forEach((n=>{if(n.parent){const e=n.parent.children.indexOf(n),r=u(t);r.parent=n.parent,n.parent.children.splice(e,0,r)}}))})),this}after(t){return s(t).children.forEach((t=>{this._n.forEach((n=>{if(n.parent){const e=n.parent.children.indexOf(n)+1,r=u(t);r.parent=n.parent,n.parent.children.splice(e,0,r)}}))})),this}remove(){return this._n.forEach((t=>t.parent?._removeChild(t))),this._n=[],this}empty(){return this._n.forEach((t=>{t.children=[]})),this}replaceWith(t){const n=s(t).children;return this._n.forEach((t=>{if(t.parent){const e=t.parent.children.indexOf(t);if(-1!==e){const r=n.map((n=>{const e=u(n);return e.parent=t.parent,e}));t.parent.children.splice(e,1,...r),t.parent=null}}})),this._n=[],this}clone(){return new this.constructor(this._n.map(u))}outerHTML(){return this._n.map(o).join("")}innerHTML(){return this._n.map((t=>t.children.map(o).join(""))).join("")}toString(){return this.outerHTML()}doc(){return o(this._r)}}(t)}
