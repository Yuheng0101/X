/******************************************
 * @name 𝟒𝐊世界
 * @channel https://t.me/yqc_123/
 * @feedback https://t.me/yqc_777/
 * @author 𝐘𝐇
 * @update 20240410
 * @version 1.0.1
 ******************************************
脚本声明:
1. 本脚本仅用于学习研究，禁止用于商业用途
2. 本脚本不保证准确性、可靠性、完整性和及时性
3. 任何个人或组织均可无需经过通知而自由使用
4. 作者对任何脚本问题概不负责，包括由此产生的任何损失
5. 如果任何单位或个人认为该脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明、所有权证明，我将在收到认证文件确认后删除
6. 请勿将本脚本用于商业用途，由此引起的问题与作者无关
7. 本脚本及其更新版权归作者所有
******************************************

网站地址: 
 - https://www.4ksj.com/
BoxJs订阅地址:
 - https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/boxjs.json

******************************************
QuantumultX配置:

[task_local]
0 6 * * * https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/4ksj.js, tag=𝟒𝐊世界每日签到, img-url=https://raw.githubusercontent.com/Yuheng0101/X/main/Assets/4ksj.png, enabled=true
******************************************
Loon配置:

[Script]
cron "0 6 * * *" script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/4ksj.js, timeout=10, tag=𝟒𝐊世界每日签到, img-url=https://raw.githubusercontent.com/Yuheng0101/X/main/Assets/4ksj.png
******************************************
Surge配置:

[Script]
𝟒𝐊世界每日签到 = type=cron,cronexp=0 6 * * *,wake-system=1,script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/4ksj.js,timeout=60
******************************************
青龙配置:
# 是否开启调试模式
export WORLD_4K_DEBUG = 'false'
// 是否开启代理（国内机选配） => 用于拉取github依赖
export WORLD_4K_USE_PROXY = 'false'
# 分隔符标识
export WORLD_4K_SPLIT_CHAR = '&'
# 账号 => 多账号使用分隔符分隔
export WORLD_4K_ACCOUNTS = 'username1&username2&username3'
# 密码 => 多账号使用分隔符分隔
export WORLD_4K_PASSWORDS = 'password1&password2&password3'
******************************************/
const $ = new Env('𝟒𝐊世界', {
    logLevelPrefixs: {
        debug: '==============🛠️调试输出==============\n',
        info: '==============ℹ️日志输出==============\n',
        warn: '==============⚠️𝐖𝐀𝐑𝐍𝐈𝐍𝐆==============\n',
        error: '==============❌错误提示==============\n'
    },
    encoding: 'gb2312'
})
// 数据定义区
const notify = $.isNode() ? require('../../utils/sendNotify') : ''
const baseURL = 'https://www.4ksj.com'
// -------------------------------------
// 开发者模式
$.logLevel = $.toObj($.isNode() ? process.env.WORLD_4K_DEBUG : $.getdata('4k_wrold_debug')) ? 'debug' : 'info'
$.debug(`🔰 模式: ${$.logLevel == 'debug' ? '调试' : '常规'}`)
// 是否开启代理 => 用于拉取github依赖
$.useProxy = $.toObj($.isNode() && process.env.WORLD_4K_USE_PROXY) || false
$.debug(`🔰 代理: ${$.useProxy ? '开启' : '关闭'}`)
// 通知列表
$.message = []
// 统一 headers 请求头
$.headers = {
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'sec-fetch-dest': 'document',
    cookie: ''
}
// 缓存 COOKIE
$.userCookies = $.toObj($.getdata('4k_world_cookies') || '[]')
// -------------------------------------
// 分隔符标识
const SPLIT_CHAR = ($.isNode() ? process.env.WORLD_4K_SPLIT_CHAR : $.getdata('4k_world_split_char')) || '&'
// 账号 => 多账号使用分隔符分隔
const ACCOUNT_ARR = ($.isNode() ? process.env.WORLD_4K_ACCOUNTS : $.getdata('4k_world_accounts') || '')?.split(SPLIT_CHAR) || []
// 密码 => 多账号使用分隔符分隔
const PASSWORD_ARR = ($.isNode() ? process.env.WORLD_4K_PASSWORDS : $.getdata('4k_world_passwords') || '')?.split(SPLIT_CHAR) || []
// 👉 请保证上述账密一一对应 👈
// -------------------------------------
class World4K {
    constructor(user, pwd) {
        this.user = user
        this.pwd = pwd
        this.initCookie()
    }
    // 获取登录参数
    async getHash() {
        try {
            const data = await fetchData({
                url: `${baseURL}/member.php?mod=logging&action=login`,
                headers: $.headers
            })
            const compressHTML = data.replace(/\n|\s|\r/g, '')
            const [, loginhash, formhash] =
                /action=\"member.php\?mod=logging&amp;action=login&amp;loginsubmit=yes&amp;loginhash=(\w+)\"><divclass=\"ccl\"><inputtype=\"hidden\"name=\"formhash\"value=\"(\w+)\"\/>/.exec(
                    compressHTML
                )
            // console.log(loginhash, formhash)
            this.loginhash = loginhash
            this.formhash = formhash
            $.debug(`登陆参数: loginhash: ${this.loginhash}`, `formhash: ${this.formhash}`)
        } catch (e) {
            $.error(`获取登录参数出错: ${e}`)
        }
    }
    // 初始化COOKIE
    initCookie() {
        const { value } = $.userCookies.find((it) => it.key === this.user) || {}
        this.cookie = value || ''
        $.debug(`[${this.user}] COOKIE: ${this.cookie}`)
    }
    // 更新/新增 COOKIE
    updateCookie(ck) {
        const key = this.user
        const index = $.userCookies.findIndex((item) => item.key === key)
        if (index > -1) {
            if ($.userCookies[index].value !== ck) {
                $.userCookies[index].value = ck
                $.info(`[${this.user}] cookie 更新成功`)
            } else {
                $.info(`[${this.user}]cookie 未发生变化`)
            }
        } else {
            $.userCookies.push({ key, value: ck })
            $.info(`[${this.user}] cookie 添加成功`)
        }
        this.cookie = ck
        $.setdata(JSON.stringify($.userCookies), '4k_world_cookies')
    }
    // 获取 saltkey
    async getSaltkey() {
        try {
            const response = await fetchData({
                url: `${baseURL}/qiandao.php`,
                headers: $.headers,
                resultType: 'response'
            })
            const headers = Object.fromEntries(Object.entries(response.headers).map(([k, v]) => [k.toLowerCase(), v]))
            this.saltkey = /HxHg_2132_saltkey=(\w+);/.exec(headers['set-cookie'])?.[1] || ''
            if (!this.saltkey) throw new Error('未获取到 saltkey')
            $.debug(`saltkey: ${this.saltkey}`)
        } catch (e) {
            $.error(`获取 saltkey 出错: ${e}`)
        }
    }
    // 登录
    async login() {
        try {
            await this.getSaltkey()
            await this.getHash()
            const opts = {
                url: `${baseURL}/member.php`,
                params: {
                    mod: 'logging',
                    action: 'login',
                    loginsubmit: 'yes',
                    loginhash: this.loginhash,
                    inajax: 1
                },
                type: 'post',
                headers: {
                    ...$.headers,
                    referer: `${baseURL}/member.php?mod=logging&action=login`,
                    'sec-fetch-dest': 'iframe',
                    'content-type': 'application/x-www-form-urlencoded',
                    cookie: `HxHg_2132_saltkey=${this.saltkey};`
                },
                body: {
                    formhash: this.formhash,
                    referer: encodeURIComponent(`${baseURL}/qiandao.php`),
                    username: escape(this.user),
                    password: this.pwd,
                    questionid: 0,
                    answer: ''
                },
                resultType: 'response'
            }
            const response = await fetchData(opts)
            if (/succeedhandle_/.test(response.body)) {
                // -------------------
                // 这里缓存 COOKIE
                const { 'set-cookie': cookieArr } = Object.fromEntries(Object.entries(response.headers).map(([k, v]) => [k.toLowerCase(), v]))
                const cookieStr = typeof cookieArr === 'string' ? cookieArr : cookieArr.map((item) => item.split(';')[0]).join('; ')
                const saltkey = /HxHg_2132_saltkey=(\w+);/.exec(cookieStr)?.[1] || ''
                const auth = /HxHg_2132_auth=(.+?);/.exec(cookieStr)?.[1] || ''
                const cookie = `HxHg_2132_saltkey=${saltkey || this.saltkey}; HxHg_2132_auth=${auth};`
                this.updateCookie(cookie)
                // -------------------
                $.debug(`[${this.user}] 登录成功 COOKIE: ${cookie}`)
            } else {
                const errorMsg = /errorhandle_\(\'(.+?)\'/.exec(response.body)?.[1] || '未知错误'
                $.error(`登录失败: ${errorMsg}`)
            }
        } catch (e) {
            $.error(`登录出错: ${e}`)
        }
    }
    // 获取个人信息 => 检查 COOKIE 是否有效
    async userinfo() {
        try {
            const data = await fetchData({ url: `${baseURL}/qiandao.php`, headers: { ...$.headers, Cookie: this.cookie } })
            const $_ = $.cheerio.load(data)
            const $slider = $_('.ct2.cl .sd .bm')
            // bm 0 => 打开状态 点击打开(未打卡)|今日已打卡(已打卡)
            // bm 1 => 打卡公告
            // bm 2 => 打卡动态
            // bm 4 => 打卡等级
            this.userInfo = $slider
                .map((i, el) => {
                    switch (i) {
                        case 0: // 打卡状态
                            return {
                                status: /点击打卡/.test($_(el).find('a').text()) ? 0 : 1,
                                signUrl: $_(el).find('a').attr('href'),
                                signText: $_(el).find('a').text()
                            }
                        case 1: // 打卡公告
                            return {
                                notice: $_(el)
                                    .find('.bm_c')
                                    .text()
                                    .replace(/^\n|\n$/g, '')
                            }
                        case 2: // 打卡动态
                            return {
                                dynamic: $_(el)
                                    .find('.xl')
                                    .html()
                                    .replace(/<li>/g, '')
                                    .replace(/<\/li>/g, '\n')
                                    .replace(/\n\n/g, '\n')
                                    .replace(/^\n|\n$/g, '')
                            }
                        case 4: // 打卡等级
                            return {
                                level: $_(el)
                                    .find('.xl')
                                    .html()
                                    .replace(/<li>/g, '')
                                    .replace(/<\/li>/g, '\n')
                                    .replace(/\n\n/g, '\n')
                                    .replace(/^\n|\n$/g, '')
                                    .replace(/&gt;/g, '<')
                            }
                        default:
                            return {}
                    }
                })
                .get()
                .filter((item) => Object.keys(item).length > 0)
                .reduce((prev, next) => ({ ...prev, ...next }), {})
            Object.assign(this.userInfo, {
                nick: $_('.nexmemberintels h5').text(),
                uid: $_('.nexmemberintels p').text().replace('ID：', '')
            })
            $.debug('个人中心:', JSON.stringify(this.userInfo, null, 2))
            if (this.userInfo?.nick && this.userInfo?.uid) {
                this.uid = this.userInfo.uid.replace(/(\d{3})\d+(\d{2})/, `$1**$2`) // uid 脱敏
                $.debug(`用户名: ${this.userInfo?.nick}, UID: ${this.userInfo?.uid}`)
            } else {
                $.warn(`${this.user} 未登录或者COOKIE失效, 尝试重新登录...`)
                this.userInfo = {}
            }
        } catch (e) {
            $.error(`获取个人信息出错: ${e}`)
        }
    }
    // 签到
    async signIn() {
        const that = this
        try {
            const opts = {
                url: `${baseURL}/${that.userInfo.signUrl}`,
                method: 'get',
                headers: {
                    ...$.headers,
                    Cookie: this.cookie,
                    referer: `${baseURL}/qiandao/`
                }
            }
            const data = await fetchData(opts)
            const $_ = $.cheerio.load(data)
            const tipText = $_('#messagetext')
                .find('p')
                .eq(0)
                .text()
                .replace(/setTimeout.+;/, '')
            // 您今天已经打过卡了，请勿重复操作!
            if (/今天已经打过卡了/.test(tipText)) {
                that.userInfo.status = -1
                $.warn(`[${that.userInfo.nick}] ${tipText}`)
                // 恭喜您，打卡成功！
            } else if (/恭喜您，打卡成功/.test(tipText)) {
                that.userInfo.status = 1
                $.info(`[${that.userInfo.nick}] ${tipText}`)
            } else {
                that.userInfo.status = 2
                $.error(`[${that.userInfo.nick}] 签到失败`, `原因: ${tipText}`)
            }

            this.userInfo.signText = tipText
        } catch (e) {
            $.error(`签到出错: ${e}`)
        }
    }
}
;(async () => {
    if (!ACCOUNT_ARR.length || !PASSWORD_ARR.length) return $.msg($.name, '请填写账号密码')
    if (ACCOUNT_ARR.length !== PASSWORD_ARR.length) return $.msg($.name, '账号长度与密码长度不一致')
    await showNotice()
    await loadRemoteScriptByCache('https://cdn.jsdelivr.net/gh/Yuheng0101/X@main/Utils/cheerio.js', 'createCheerio', 'cheerio')
    await loadRemoteScriptByCache('https://cdn.jsdelivr.net/gh/Yuheng0101/X@main/Utils/iconv-lite.js', 'loadIconv', 'iconv')
    for (let i = 0; i < ACCOUNT_ARR.length; i++) {
        const world = new World4K(ACCOUNT_ARR[i], PASSWORD_ARR[i])
        await world.userinfo()
        // 刷新cookie
        if (!world?.userInfo?.uid || !world?.userInfo?.nick) {
            await world.login()
            await world.userinfo()
            if (Object.keys(world.userInfo).length === 0) {
                await showMsg($.name, world.user, '登录失败, 请检查账号密码是否正确')
                continue
            }
        }
        if (world.userInfo.status != 1) {
            await world.signIn()
            $.message.push(`签到结果：${world.userInfo.signText}`)
            if (world.userInfo.status == 1) {
                await world.userinfo()
            }
        } else {
            $.message.push(`签到结果：${world.userInfo.signText}`)
        }
        $.message.push(world.userInfo.dynamic)
        await showMsg($.name, `用户昵称：${world.userInfo.nick}(${world.uid})`, $.message.join('\n'))
        $.message = []
    }
})().finally(() => $.done({ ok: 1 }))
function escape(str) {
    const iconv = $.isNode() ? require('iconv-lite') : $.iconv
    const zhReg =
        /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/
    return Array.from(str)
        .map((char) =>
            zhReg.test(char)
                ? iconv
                      .encode(char, $.encoding)
                      .toString('hex')
                      .toUpperCase()
                      .replace(/(\w{2})/g, '%$1')
                : char
        )
        .join('')
}
// 免责声明
async function showNotice() {
    $.log('==============📣免责声明📣==============')
    $.log('1. 本脚本仅用于学习研究，禁止用于商业用途')
    $.log('2. 本脚本不保证准确性、可靠性、完整性和及时性')
    $.log('3. 任何个人或组织均可无需经过通知而自由使用')
    $.log('4. 作者对任何脚本问题概不负责，包括由此产生的任何损失')
    $.log('5. 如果任何单位或个人认为该脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明、所有权证明，我将在收到认证文件确认后删除')
    $.log('6. 请勿将本脚本用于商业用途，由此引起的问题与作者无关')
    $.log('7. 本脚本及其更新版权归作者所有')
    $.log('')
}
/**
 * 远程脚本加载
 * @param {String} scriptUrl 远程链接
 * @param {String} functionName 脚本内函数名
 * @param {String} scriptName 全局变量名
 * @returns
 */
function loadRemoteScriptByCache(scriptUrl, functionName, scriptName) {
    const cacheName = `${scriptName}.js`
    const cache = $.getdata(cacheName) || ``
    return new Promise((resolve, reject) => {
        if (cache) {
            eval(cache), ($[scriptName] = eval(functionName)())
            $.debug(`☑️ 缓存加载${functionName}成功`)
            resolve()
        } else {
            fetchData({ url: scriptUrl, useProxy: $.useProxy })
                .then((script) => {
                    eval(script), ($[scriptName] = eval(functionName)())
                    $.debug(`☑️ 远程加载${functionName}成功`)
                    $.setdata(script, cacheName)
                    $.debug(`☑️ 缓存${functionName}成功`)
                    resolve()
                })
                .catch((err) => {
                    $.error(`⚠️ 远程加载${functionName}失败`, err)
                    reject(err)
                })
        }
    })
}
// 消息通知
async function showMsg(n, o, i, t) {
    if ($.isNode()) {
        const content = [i]
        t?.['open-url'] && content.push(`🔗打开链接: ${t['open-url']}`)
        t?.['media-url'] && content.push(`🎬媒体链接: ${t['media-url']}`)
        $.log(n, o, content.join('\n'))
        try {
            await notify.sendNotify(`${n}\n${o}`, content.join('\n'))
        } catch (e) {
            $.warn('没有找到sendNotify.js文件 不发送通知')
        }
    } else {
        $.msg(n, o, i, t)
    }
}
/**
 * 网络请求基于env.js的二次封装
 * @param {*} o 相关参数
 * @param {string} o.url 请求地址
 * @param {string} o.type 请求类型
 * @param {object} o.headers 请求头
 * @param {object} o.params 请求参数
 * @param {object} o.body 请求体 post => json
 * @param {object} o.deviceType 设备类型 pc | mobile
 * @param {object} o.dataType 数据类型 json | form
 * @param {object} o.responseType 返回数据类型 response | data
 * @param {object} o.timeout 超时时间
 * @returns {Promise}
 */
async function fetchData(o) {
    // 对象大写转小写
    const ObjectKeys2LowerCase = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]))
    typeof o === 'string' && (o = { url: o })
    if (!o?.url) throw new Error('[发送请求] 缺少 url 参数')
    try {
        const {
            url: u, // 请求地址
            type, // 请求类型
            headers: h, // 请求头
            body: b, // 请求体 ➟ post
            params, // 请求参数 ➟ get/psot
            dataType = 'form', // 请求数据类型
            deviceType = 'mobile', // 设备类型
            resultType = 'buffer', // 返回数据类型
            timeout = 1e4, // 超时时间
            useProxy = false, // 是否使用代理
            autoCookie = false, // 是否自动携带cookie
            followRedirect = false, // 是否重定向
            opts = {}
        } = o
        // type => 因为env中使用method处理post的特殊请求(put/delete/patch), 所以这里使用type
        const method = type ? type.toLowerCase() : b ? 'post' : 'get'
        // post请求需要处理params参数(get不需要, env已经处理)
        const url = u.concat(method === 'post' ? '?' + $.queryStr(params) : '')
        const headers = ObjectKeys2LowerCase(h || {})
        // 根据deviceType给headers添加默认UA
        headers?.['user-agent'] ||
            Object.assign(headers, {
                'user-agent':
                    deviceType === 'pc'
                        ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299'
                        : 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
            })
        // 根据jsonType处理headers
        dataType === 'json' && Object.assign(headers, { 'content-type': 'application/json;charset=UTF-8' })
        const options = { ...o }
        Object.assign(options, {
            url,
            method,
            headers,
            'binary-mode': resultType == 'buffer',
            // Surge/Loon新增字段
            'auto-cookie': autoCookie,
            // env.js默认重定向字段
            followRedirect,
            // Quantumult X特殊字段
            opts
        })
        // 处理params参数
        method === 'get' && params && Object.assign(options, { params })
        // 超时处理兼容Surge => 单位是s
        Object.assign(options, { timeout: $.isSurge() ? timeout / 1e3 : timeout })
        // post请求处理body
        const body = method === 'post' && b && ((o.dataType === 'json' ? $.toStr : $.queryStr)(typeof b === 'object' ? b : '') || b)
        method === 'post' && body && Object.assign(options, { body })
        // 是否使用代理
        if ($.isNode() && useProxy) {
            const PROXY_HOST = process.env.PROXY_HOST || '127.0.0.1'
            const PROXY_PORT = process.env.PROXY_PORT || 7890
            if (PROXY_HOST && PROXY_PORT) {
                const tunnel = require('tunnel')
                const agent = { https: tunnel.httpsOverHttp({ proxy: { host: PROXY_HOST, port: PROXY_PORT * 1 } }) }
                Object.assign(options, { agent })
            } else {
                $.log(`⚠️ 请填写正确的代理地址和端口`)
            }
        }
        // console.log(options)
        const promise = new Promise((resolve, reject) => {
            $[method](options, (err, response, data) => {
                if (err) {
                    let errorMsg = ''
                    if (response) {
                        // errorMsg = `状态码: ${response.statusCode}`
                        $.log(`状态码: ${response.statusCode}`)
                    }
                    if (data) {
                        errorMsg += $.toObj(data)?.message || data
                    }
                    $.log(`请求接口: ${u} 异常: ${errorMsg}`)
                    reject(errorMsg)
                } else {
                    const _decode = (response) => {
                        const buffer = response.rawBody ?? response.body
                        const decoder = new TextDecoder($.encoding)
                        return decoder.decode(new Uint8Array(buffer))
                    }
                    resolve(
                        resultType === 'buffer'
                            ? $.isQuanX()
                                ? response.body
                                : _decode(response)
                            : resultType === 'response'
                            ? response
                            : $.toObj(data) || data
                    )
                }
            })
        })
        // 使用Promise.race来给Quantumult X强行加入超时处理
        return $.isQuanX() ? await Promise.race([new Promise((_, r) => setTimeout(() => r(new Error('网络开小差了~')), timeout)), promise]) : promise
    } catch (e) {
        throw new Error(e)
    }
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,o)=>{s.call(this,t,(t,s,r)=>{t?o(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:"[DEBUG] ",info:"[INFO] ",warn:"[WARN] ",error:"[ERROR] "},this.logLevel="info",this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null,...s){try{return JSON.stringify(t,...s)}catch{return e}}getjson(t,e){let s=e;const o=this.getdata(t);if(o)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,o)=>e(o))})}runScript(t,e){return new Promise(s=>{let o=this.getdata("@chavy_boxjs_userCfgs.httpapi");o=o?o.replace(/\n/g,"").trim():o;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,a]=o.split("@"),n={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,o)=>s(o))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),o=!s&&this.fs.existsSync(e);if(!s&&!o)return{};{const o=s?t:e;try{return JSON.parse(this.fs.readFileSync(o))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),o=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):o?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const o=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of o)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,o)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[o+1])>>0==+e[o+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,o]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,o,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,o,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(o),a=o?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(a);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),o)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),o)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.cookie&&void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar)))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,o)=>{!t&&s&&(s.body=o,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,o)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:o,headers:r,body:i,bodyBytes:a}=t;e(null,{status:s,statusCode:o,headers:r,body:i,bodyBytes:a},i,a)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:o,statusCode:r,headers:i,rawBody:a}=t,n=s.decode(a,this.encoding);e(null,{status:o,statusCode:r,headers:i,rawBody:a,body:n},n)},t=>{const{message:o,response:r}=t;e(o,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),void 0===t.followRedirect||t.followRedirect||((this.isSurge()||this.isLoon())&&(t["auto-redirect"]=!1),this.isQuanX()&&(t.opts?t.opts.redirection=!1:t.opts={redirection:!1})),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,o)=>{!t&&s&&(s.body=o,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,o)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:o,headers:r,body:i,bodyBytes:a}=t;e(null,{status:s,statusCode:o,headers:r,body:i,bodyBytes:a},i,a)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let o=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:a}=t,n=o.decode(a,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:a,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&o.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let o={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in o)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?o[e]:("00"+o[e]).substr((""+o[e]).length)));return t}queryStr(t){let e="";for(const s in t){let o=t[s];null!=o&&""!==o&&("object"==typeof o&&(o=JSON.stringify(o)),e+=`${s}=${o}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",o="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,o=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":o}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,o,i(r));break;case"Quantumult X":$notify(e,s,o,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),o&&t.push(o),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}debug(...t){this.logLevels[this.logLevel]<=this.logLevels.debug&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.debug}${t.join(this.logSeparator)}`))}info(...t){this.logLevels[this.logLevel]<=this.logLevels.info&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.info}${t.join(this.logSeparator)}`))}warn(...t){this.logLevels[this.logLevel]<=this.logLevels.warn&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.warn}${t.join(this.logSeparator)}`))}error(...t){this.logLevels[this.logLevel]<=this.logLevels.error&&(t.length>0&&(this.logs=[...this.logs,...t]),console.log(`${this.logLevelPrefixs.error}${t.join(this.logSeparator)}`))}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,e,t);break;case"Node.js":this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,e,void 0!==t.message?t.message:t,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
