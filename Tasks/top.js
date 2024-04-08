/******************************************
 * @name 热搜整合
 * @platform 微博、知乎、头条、抖音、百度、bilibili、贴吧
 * @author 𝒀𝒖𝒉𝒆𝒏𝒈
 * @update 20231117
 * @version 1.0.1
******************************************

# 热搜聚合

## 更新日志

### 20231117

    1.修复头条通知失效。

    2.适配多端通知, 只展示可可用长度的内容, 点击通知查看详细内容。

    3.适配青龙通知, 自行调整 `sendNotify.js` 的位置。

    4.搭配BoxJs使用, 可手动选择通知类型。

## 脚本声明

    1.此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
    2.由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
    3.请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
    4.此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
    5.本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
    6.如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
    7.所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明, 本人保留随时更改或补充此声明的权利, 一旦您使用或复制了此脚本，即视为您已接受此免责声明。

## 使用方法

### 配置 (QuanX)

```properties
[task_local]
30 6-23 * * * https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/top.js, tag=热搜聚合, img-url=https://is3-ssl.mzstatic.com/image/thumb/Purple126/v4/9a/d8/77/9ad877c6-e3d7-61a1-3911-5036239a41a6/AppIcon-1x_U007emarketing-0-7-0-0-sRGB-85-220.png/144x144bb.png, enabled=true
```

### 配置 (Loon)

```properties
[Script]
cron "30 6-23 * * *" script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/top.js, timeout=10, tag=热搜聚合, img-url=https://is3-ssl.mzstatic.com/image/thumb/Purple126/v4/9a/d8/77/9ad877c6-e3d7-61a1-3911-5036239a41a6/AppIcon-1x_U007emarketing-0-7-0-0-sRGB-85-220.png/144x144bb.png
```

### 配置 (Surge)

```properties
热搜聚合 = type=cron,cronexp=0 30 6-23 * * *,wake-system=1,script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/top.js,timeout=60
```

******************************************/
const $ = new Env('热搜合集')
const MAX_MESSAGE_COUNT = 155
// 用户选择 （优先级比程序高）
const USER_CONFIG = $.getdata('top_user_select') || ''
const LIMIT_MAP = {
    weibo: '微博',
    zhihu: '知乎',
    toutiao: '头条',
    douyin: '抖音',
    baidu: '百度',
    tieba: '贴吧',
    bilibili: '哔哩哔哩'
}
class TOP {
    constructor() {
        this.name = ''
        this.openURL = ''
        this.mediaURL = ''
    }

    setProperties(name, openURL, mediaURL) {
        this.name = name
        this.openURL = openURL
        this.mediaURL = mediaURL
    }

    weibo() {
        this.setProperties('微博', 'https://s.weibo.com/top/summary', 'https://file.ipadown.com/tophub/assets/images/media/weibo.com.png_160x160.png')
        return new Promise((resolve, reject) => {
            $.http
                .get({
                    url: `https://weibo.com/ajax/statuses/hot_band`,
                    headers: {
                        Host: `weibo.com`,
                        'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)`,
                        Referer: `https://weibo.com/?category=1760`,
                        Cookie: `SRF-TOKEN=gy-JCKoaCdJaydGgNdGOogST; SUB=_2AkMU9HZyf8NxqwFRmP8XxW7qbY1xww_EieKiqIepJRMxHRl-yT9jqkkDtRB6P3RYnazWoKVAc1j0D2MFZq7dbfgCR7Di; UPSTREAM-V-WEIBO-COM=b09171a17b2b5a470c42e2f713edace0; _s_tentry=www.baidu.com; UOR=www.baidu.com,weibo.com,www.baidu.com; Apache=5141979382819.02.1672025150365; SINAGLOBAL=5141979382819.02.1672025150365; ULV=1672025150482:1:1:1:5141979382819.02.1672025150365:; WBPSESS=dg5zs_KFY81p0FnDKmb34RZVNfWqA4WfanF-eevXRNWdIWtd_kUo1q0Ch7GDzlXpHmvQmi-7BWumVFwxBD1iFRNvgEHYg72tSysad_QtTnFbyJJcw7fgyg68oRbFW1Q2oIzltdkpP0sCHaUZEFtU_fMQvLT71kRQDZfIfEjSY1Y=; PPA_CI=01ab9f68a4bb63b1ffbb251ade53b255`
                    }
                })
                .then(({ body }) => {
                    const {
                        data: { band_list: list }
                    } = JSON.parse(body)
                    resolve(list.map((item, index) => `【${index + 1}】${item.word}`))
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    zhihu() {
        this.setProperties('知乎', 'https://www.zhihu.com/billboard', 'https://file.ipadown.com/tophub/assets/images/media/zhihu.com.png_160x160.png')
        return new Promise((resolve, reject) => {
            $.http
                .get('https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=15&desktop=true')
                .then(({ body }) => {
                    const { data: list } = JSON.parse(body)
                    resolve(list.map((item, index) => `【${index + 1}】${item.target.title}`))
                })
                .catch((error) => reject(error))
        })
    }
    toutiao() {
        this.setProperties('头条', 'https://www.toutiao.com/', 'https://file.ipadown.com/tophub/assets/images/media/so.toutiao.com.png_160x160.png')
        return new Promise((resolve, reject) => {
            $.http
                .get(`https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc`)
                .then(({ body }) => {
                    const { data: list } = JSON.parse(body)
                    resolve(list.map((item, index) => `【${index + 1}】${item.Title}`))
                })
                .catch((error) => reject(error))
        })
    }
    douyin() {
        this.setProperties(
            '抖音',
            'https://www.iesdouyin.com/share/billboard/?id=0',
            'https://file.ipadown.com/tophub/assets/images/media/douyin.com.png_160x160.png'
        )
        return new Promise((resolve, reject) => {
            $.http
                .get(`https://aweme.snssdk.com/aweme/v1/hot/search/list/`)
                .then(({ body }) => {
                    const {
                        data: { word_list: list }
                    } = JSON.parse(body)
                    // https://www.iesdouyin.com/share/billboard/?id=${item.word}
                    resolve(list.map((item, index) => `【${index + 1}】${item.word}`))
                })
                .catch((error) => reject(error))
        })
    }

    baidu() {
        this.setProperties('百度', 'https://top.baidu.com/board?tab=realtime', 'https://file.ipadown.com/tophub/assets/images/media/baidu.com.png_160x160.png')
        return new Promise((resolve, reject) => {
            $.http
                .get(`https://top.baidu.com/board?tab=realtime`)
                .then(({ body }) => {
                    const {
                        data: { cards }
                    } = JSON.parse(body.match(/<!--s-data:(.*?)-->/)[1])
                    const list = cards[0].content
                    resolve(list.map((item, index) => `【${index + 1}】${item.word}`))
                })
                .catch((error) => reject(error))
        })
    }

    tieba() {
        this.setProperties(
            '贴吧',
            'http://tieba.baidu.com/hottopic/browse/topicList?res_type=1',
            'https://file.ipadown.com/tophub/assets/images/media/tieba.baidu.com.png_160x160.png'
        )
        return new Promise((resolve, reject) => {
            $.http
                .get('https://tieba.baidu.com/hottopic/browse/topicList')
                .then(({ body }) => {
                    const {
                        data: {
                            bang_topic: { topic_list: list }
                        }
                    } = JSON.parse(body)
                    resolve(list.map((item) => `【${item.idx_num}】${item.topic_name}`))
                })
                .catch((error) => reject(error))
        })
    }
    bilibili() {
        this.setProperties('哔哩哔哩', 'https://tophub.today/n/74KvxwokxM', 'https://file.ipadown.com/tophub/assets/images/media/bilibili.com.png_160x160.png')
        return new Promise((resolve, reject) => {
            $.http
                .get(`https://api.bilibili.com/x/web-interface/ranking/v2`)
                .then(({ body }) => {
                    const {
                        data: { list }
                    } = JSON.parse(body)
                    resolve(list.map((item, index) => `【${index + 1}】${item.title}`))
                })
                .catch((error) => reject(error))
        })
    }
}
;(async () => {
    let name = ''
    if (USER_CONFIG && Object.keys(LIMIT_MAP).includes(USER_CONFIG)) {
        $.log('', `当前使用用户配置选项:${LIMIT_MAP[USER_CONFIG]}`, '')
        name = USER_CONFIG
    } else {
        name = HelpYouChoose()
        $.log('', `当前使用自动配置选项:${LIMIT_MAP[name]}`, '')
    }
    const top = new TOP()
    const topList = chunkBySize(await top[name]())
    await SendNotify(`【${top.name}】热搜榜`, '', topList, { 'media-url': top.mediaURL, 'open-url': top.openURL })
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
/**
 * 按照指定大小分割数组
 * @param {*} arr 数组
 * @param {*} size 分割总字数
 * @returns
 */
function chunkBySize(arr, size = MAX_MESSAGE_COUNT) {
    arr = typeof arr === 'string' ? arr.split('\n') : arr
    const resultText = `\n=======👉点击通知查看更多👈=======\n`
    let message = []
    if ($.isNode()) {
        message = arr.join('\n').replace(/\n$/, '')
    } else {
        for (const item of arr) {
            if (message.join('\n').length >= size) {
                break
            }
            message.push(item)
        }
        message = `${message.join('\n')}${resultText}`
    }
    return message
}
/**
 * 帮你选择热搜
 * @returns
 */
function HelpYouChoose() {
    var week = new Date().getDay()
    switch (week) {
        case 0:
            return 'weibo'
        case 1:
            return 'zhihu'
        case 2:
            return 'toutiao'
        case 3:
            return 'douyin'
        case 4:
            return 'baidu'
        case 5:
            return 'tieba'
        case 6:
            return 'bilibili'
    }
}
/**
 * 针对不同平台的通知二次封装
 * @param {*} t
 * @param {*} n
 * @param {*} o
 * @param {*} e
 */
async function SendNotify(t, n = '', o = '', e = {}) {
    const s = 'undefined' != typeof $app && 'undefined' != typeof $http,
        i = e['open-url'],
        r = e['media-url']
    if (($.isQuanX() && $notify(t, n, o, e), $.isSurge())) {
        const e = r ? `${o}\n多媒体:${r}` : o
        $notification.post(t, n, e, { url: i })
    }
    if ($.isLoon()) {
        const e = {}
        i && (e.openUrl = i), r && (e.mediaUrl = r), '{}' === JSON.stringify(e) ? $notification.post(t, n, o) : $notification.post(t, n, o, e)
    }
    const c = `${o}${i ? `\n点击跳转: ${i}` : ''}${r ? `\n多媒体: ${r}` : ''}`
    if (s) {
        const o = require('push')
        o.schedule({ title: t, body: `${n ? `${n}\n` : ''}${c}` })
    }
    if ($.isNode())
        try {
            const o = require('../sendNotify')
            await o.sendNotify(`${t}\n${n}`, c)
        } catch (t) {
            console.log('没有找到sendNotify.js文件')
        }
    console.log(`${t}\n${n}\n${c}\n\n`)
}

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,a)=>{s.call(this,t,(t,s,r)=>{t?a(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const a=this.getdata(t);if(a)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,a)=>e(a))})}runScript(t,e){return new Promise(s=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,o]=a.split("@"),n={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,a)=>s(a))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e);if(!s&&!a)return{};{const a=s?t:e;try{return JSON.parse(this.fs.readFileSync(a))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):a?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const a=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of a)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,a)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[a+1])>>0==+e[a+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,a]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,a,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,a,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(a),o=a?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(o);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),a)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),a)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:a,statusCode:r,headers:i,rawBody:o}=t,n=s.decode(o,this.encoding);e(null,{status:a,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:a,response:r}=t;e(a,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let a=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:o}=t,n=a.decode(o,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&a.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let a={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in a)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[e]:("00"+a[e]).substr((""+a[e]).length)));return t}queryStr(t){let e="";for(const s in t){let a=t[s];null!=a&&""!==a&&("object"==typeof a&&(a=JSON.stringify(a)),e+=`${s}=${a}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",a="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,a=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":a}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,a,i(r));break;case"Quantumult X":$notify(e,s,a,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),a&&t.push(a),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
