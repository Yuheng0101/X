
/******************************************
 * @name 网上国网🌏
 * @description 网上国网电费查询
 * @channel https://t.me/yqc_123/
 * @feedback https://t.me/yqc_777/
 * @author 𝒀𝒖𝒉𝒆𝒏𝒈
 * @update 20240318
 * @version 1.0.0
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
BoxJs订阅地址:
https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/boxjs.json

******************************************
QuantumultX配置:
[mimt]
hostname = osg-open.sgcc.com.cn

[rewrite_local]
^https?:\/\/osg-open\.sgcc\.com\.cn\/osg-open-p0001\/member\/c5\/f05 url script-request-header https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/95598/95598.weapp.js

[task_local]
5 21 * * * https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/95598/95598.weapp.js, tag=网上国网电费查询, img-url=https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/83/d8/8a/83d88a92-5a4d-7a2f-118c-80d795e7a9f6/AppIcon-0-0-1x_U007emarketing-0-5-0-0-sRGB-85-220.png/144x144.png, enabled=true
******************************************
Loon配置:
[MITM]
hostname = osg-open.sgcc.com.cn

[Script]
http-request ^https?:\/\/osg-open\.sgcc\.com\.cn\/osg-open-p0001\/member\/c5\/f05 tag=网上国网获取 OpenID, script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/95598/95598.weapp.js
cron "5 21 * * *" script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/95598/95598.weapp.js, timeout=10, tag=网上国网电费查询, img-url=https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/83/d8/8a/83d88a92-5a4d-7a2f-118c-80d795e7a9f6/AppIcon-0-0-1x_U007emarketing-0-5-0-0-sRGB-85-220.png/144x144.png
******************************************
Surge配置:
[MITM]
hostname = osg-open.sgcc.com.cn

[Script]
网上国网获取 OpenID = type=http-request,pattern=^https?:\/\/osg-open\.sgcc\.com\.cn\/osg-open-p0001\/member\/c5\/f05,requires-body=0,max-size=0,timeout=1000,script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/95598/95598.weapp.js,script-update-interval=0
网上国网电费查询 = type=cron,cronexp=5 21 * * *,wake-system=1,script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/95598/95598.weapp.js,timeout=60
******************************************
青龙配置:
# 调试模式
export WSGW_DEBUG = 'false'
# openid => 用户标识
export WSGW_OPENID = ''
# 用户凭证
export WSGW_TOKEN = ''
# 登录凭证
export WSGW_AUTH = ''
******************************************/
const $ = new Env('𝟗𝟓𝟓𝟗𝟖') // 网上国网电费查询
$.isRequest = () => typeof $request !== 'undefined'
$.isTrue = (val) => val === 'true' || val === true
$.message = []
const notify = $.isNode() ? require('./sendNotify') : '' // 青龙通知
// 服务器地址 (本人保证不会记录任何用户信息, 服务器仅为不公开算法而提供加解密服务)
const MY_SERVER = 'https://free.yuhengy17.me'
// 参数配置
const WSGW_CONFIG = {
    client_id: '1fe09e7a89c4405b86343c71fcb90017',
    client_screct: 'b346d209508e4ce0a89f59b0afb314bf',
    base_url: 'https://osg-open.sgcc.com.cn',
    accountType: '02',
    channelCode: '3369'
}
// 是否开启调试模式
const WSGW_DEBUG = $.isTrue($.isNode() ? process.env.WSGW_DEBUG : $.getdata('wsgw_debug')) 
// openid => 用户唯一标识
var WSGW_OPENID = ($.isNode() ? process.env.WSGW_OPENID : $.getdata('wsgw_openid')) || ''
// token => 接口请求凭证
var WSGW_TOKEN = ($.isNode() ? process.env.WSGW_TOKEN : $.getdata('wsgw_token')) || ''
// Authorization => 授权凭证
var WSGW_AUTH = ($.isNode() ? process.env.WSGW_AUTH : $.getdata('wsgw_auth')) || ''
;(async () => {
    await showNotice()
    const wsgw = new WSGW()
    if ($.isRequest()) {
        await wsgw.getBaseInfo() // ✔
    } else {
        if (!WSGW_OPENID) throw `请先开启抓包获取 OpenID`
        // --------------------------
        // TODO 数据持久化
        await wsgw.initLogin() // ✔
        await wsgw.getAuthCode() // ✔
        await wsgw.getMiniPGToken() // ✔
        // --------------------------
        await wsgw.getUserInfo() // ✔
        const arrearsList = await wsgw.getElectricityInfo() // ✔
        const subTitle = `用户昵称: ${$.userInfo.nickname}(${$.userInfo.mobile_dst})`
        if (!arrearsList?.length) return await showNotification(`网上国网`, subTitle, `请先绑定户号`)
        // 处理多户 => 这里携带户号和省份编码去继续查询用电量
        if (arrearsList.length > 1) {
            for (let i = 0; i < arrearsList.length; i++) {
                const _arrearsList = await wsgw.getElectricityInfo(arrearsList[i].POWER_USER_ID, arrearsList[i].PROVINCE_CODE)
                // 统一数据
                Object.assign(arrearsList[i], ..._arrearsList)
            }
        }
        for (let i = 0; i < arrearsList.length; i++) {
            const {
                PROVINCE_CODE, // 省份编码
                AVALIABLE_BALANCE, // 电费余额, 单位: 分
                BALANCE, // 余额, 单位: 分
                POWER_USER_NAME, // 用电户名
                POWER_COMPANY_SHOW_NAME, // 供电公司
                POWER_COMPANY_NM, // 供电公司编码
                POWER_USER_ADDR, // 用电地址
                POWER_USER_ID // 用电户号
            } = arrearsList[i]
            // 这里部分用户余额是AVALIABLE_BALANCE，另一部分是BALANCE
            const balance = +(AVALIABLE_BALANCE == '0' ? BALANCE : AVALIABLE_BALANCE) / 100
            // ----------------------------------------------
            const electricityUsage = await wsgw.getElectricityUsage(POWER_USER_ID, PROVINCE_CODE) // ✔
            const {
                totalAmount, // 本期电费
                ym, // 月份
                firstRefPq, // 第一阶梯
                totalPq, // 本期用电量
                levelAccuPq // 累计用电量
            } = electricityUsage
            $.message.push(`本月用电: ${totalPq}(千瓦时) | 本期电费: ${totalAmount}(元)`)
            $.message.push(`账户余额: ${balance}(元) | 累计用电: ${levelAccuPq}(千瓦时)`)
            $.message.push(`户主信息: ${POWER_USER_NAME}(${POWER_USER_ID})`)
            $.message.push(`供电公司: ${POWER_COMPANY_SHOW_NAME}`) // (${POWER_COMPANY_NM})
            $.message.push(`用电地址: ${POWER_USER_ADDR}`)
            await showNotification(`网上国网`, subTitle, $.message.join('\n').replace(/\n$/, ''))
            $.message = []
        }
    }
})()
    .catch((e) => $.log(`❌ 异常: ${e}`))
    .finally(() => $.done())
// ---------------------------------------------
// 免责声明
async function showNotice() {
    $.log('')
    $.log('1. 本脚本仅用于学习研究，禁止用于商业用途')
    $.log('2. 本脚本不保证准确性、可靠性、完整性和及时性')
    $.log('3. 任何个人或组织均可无需经过通知而自由使用')
    $.log('4. 作者对任何脚本问题概不负责，包括由此产生的任何损失')
    $.log('5. 如果任何单位或个人认为该脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明、所有权证明，我将在收到认证文件确认后删除')
    $.log('6. 请勿将本脚本用于商业用途，由此引起的问题与作者无关')
    $.log('7. 本脚本及其更新版权归作者所有')
    $.log('')
}
function uuid(t) {
    for (var e = [], n = t, r = 0; r < 36; r++) e[r] = n.substr(Math.floor(16 * Math.random()), 1)
    return (e[14] = '4'), (e[19] = n.substr((3 & e[19]) | 8, 1)), (e[8] = e[13] = e[18] = e[23] = '-'), e.join('')
}
// 主类
function WSGW(){return new class{async getBaseInfo(){const t=$request.headers,e=t.Authorization||t.authorization;WSGW_DEBUG&&$.log(`🔐 Authorization: ${e}`);const a=t.t;WSGW_DEBUG&&$.log(`🔐 t: ${a}`);try{const t={url:MY_SERVER+"/api/get_openid",method:"POST",headers:{auth:e,token:a},body:{}},{data:o}=await fetchData(t),{mobile_dst:n,openId:i,nickname:r,photo:s}=o;WSGW_DEBUG&&$.log(`🔐 用户标识: ${i}`),$.setdata(i,"wsgw_openid"),$.setdata(a,"wsgw_token"),$.setdata(e,"wsgw_auth");const c=i.slice(0,3)+"****"+i.slice(-4);await showNotification("网上国网","🎉数据获取成功",`手机号码: ${n}\n用户昵称: ${r}\n用户标识: ${c}`,{"media-url":s})}catch(t){throw`获取用户唯一标识失败, 请排查: ${t}`}}async initLogin(){$.log("⏳ 开始初始化登录...");try{const t=await fetchData({url:MY_SERVER+"/api/oauth_http_api",method:"POST",dataType:"json",body:{yuheng:{quInfo:{thirdPartnerId:WSGW_OPENID,thirdUnionId:WSGW_OPENID,accountType:WSGW_CONFIG.accountType},uscInfo:{member:WSGW_CONFIG.channelCode,proNo:"00000"},client_id:WSGW_CONFIG.client_id,client_secret:WSGW_CONFIG.client_screct}}});if(!t?.body)throw"⚠ 初始化登录加密数据失败";const e={url:WSGW_CONFIG.base_url+"/osg-open-uc0001/outer/c03/initLogin",method:"post",dataType:"json",headers:{wsgwType:"mnpg","content-type":"application/json",version:"1.0",Accept:"application/json;charset=UTF-8",client_id:WSGW_CONFIG.client_id,t:WSGW_TOKEN,Authorization:WSGW_AUTH},body:t.body},a=await fetchData(e),o=await fetchData({url:MY_SERVER+"/api/decrypt_new",method:"POST",dataType:"json",body:{yuheng:a.encryptData,RSI:t.randomkey}});if(!o?.bizrt?.token)throw"初始化登录解密失败";const{bizrt:n,srvrt:{resultCode:i,resultMessage:r}}=o;if("0000"!==i)throw`初始化登录失败: ${r}`;WSGW_TOKEN=n.token,$.log(`🎉 初始化登录成功: ${n.token}`),$.setdata(n.token,"wsgw_token")}catch(t){throw`初始化登录异常: ${t}`}finally{$.log("⏳ 初始化登录结束")}}async getAuthCode(){$.log("⏳ 开始获取授权码...");try{const t=(new Date).getTime(),e=await fetchData({url:MY_SERVER+"/api/get_sign",method:"POST",dataType:"json",body:{yuheng:`${WSGW_CONFIG.client_id}${t}`}}),a={url:WSGW_CONFIG.base_url+"/oauth2/oauth/authorize",headers:{xweb_xhr:1,"X-Tingyun":"c=B|4gA5HRiCw8g","user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x6309092b) XWEB/8555",referer:"https://servicewechat.com/wx5899bdb8721621d6/47/page-frame.html"},body:{client_id:WSGW_CONFIG.client_id,response_type:"code",redirect_url:"/OPF_TRQG5UQN/OPF_M0K4URCA/index.html",timestamp:t,rsi:WSGW_TOKEN,sign:e}},o=await fetchData(a),n=await fetchData({url:MY_SERVER+"/api/decrypt_new",method:"POST",dataType:"json",body:{yuheng:o.data,RSI:WSGW_TOKEN}});if(!n)throw"获取授权码解密失败";const{code:i,message:r,data:s}=n;if("1"!=i)throw`获取授权码失败: ${r}`;this.authCode=s.redirect_url.split("code=")[1],$.log(`🎉 获取授权码成功: ${this.authCode}`)}catch(t){throw`❌ 获取授权码异常: ${t}`}finally{$.log("⏳ 获取授权码结束")}}async getMiniPGToken(){$.log("⏳ 开始刷新授权...");try{const t=WSGW_CONFIG.base_url+"/oauth2/oauth/getMiniPGToken",e=(new Date).getTime(),a=await fetchData({url:MY_SERVER+"/api/get_sign",method:"POST",dataType:"json",body:{yuheng:`${WSGW_CONFIG.client_id}${e}`}}),o={url:t,body:{grant_type:"authorization_code",client_id:WSGW_CONFIG.client_id,client_secret:WSGW_CONFIG.client_screct,state:uuid(t).toString(),timestamp:e,sign:a,code:this.authCode}},n=await fetchData(o),{code:i,message:r,data:s}=n;if("1"!=i)throw`刷新授权失败: ${r}`;$.log(`🎉 刷新授权成功: ${s.access_token}`),WSGW_AUTH=`Bearer ${s.access_token}`,$.setdata(WSGW_AUTH,"wsgw_auth")}catch(t){throw`❌ 刷新授权异常: ${t}`}finally{$.log("⏳ 刷新授权结束")}}async getUserInfo(){$.log("⏳ 开始获取用户信息...");try{const t=WSGW_CONFIG.base_url+"/osg-open-uc0001/member/arg/020360030",e=await fetchData({url:MY_SERVER+"/api/ph_http_api",dataType:"json",body:{yuheng:{token:WSGW_TOKEN,uscInfo:{tenant:"state_grid",member:WSGW_CONFIG.channelCode,devciceId:"",devciceIp:""},quInfo:{addressProvince:"",addressCity:"",addressRegion:"",optSys:""}}}});if(!e?.body)throw"获取用户信息加密数据失败";const a={url:t,dataType:"json",headers:{Accept:"application/json;charset=UTF-8","Content-Type":"application/json",wsgwType:"mnpg",version:"1.0",t:WSGW_TOKEN,Authorization:WSGW_AUTH},body:e.body},o=await fetchData(a),n=await fetchData({url:MY_SERVER+"/api/decrypt_new",dataType:"json",body:{yuheng:o.encryptData,RSI:e.randomkey}});if(!n?.bizrt)throw"获取用户信息解密失败";const{bizrt:i,srvrt:{resultCode:r,resultMessage:s}}=n;if("0000"!==r)throw`获取用户信息失败: ${s}`;{const{userInfo:t}=i;$.userInfo=t,WSGW_DEBUG&&($.log("===================================="),$.log("用户信息:"),$.log($.toStr(t)),$.log("====================================")),$.log(`🎉 获取用户信息成功: ${$.userInfo.nickname}`)}}catch(t){}finally{$.log("⏳ 获取用户信息结束")}}async getElectricityInfo(t,e){const a=(new Date).getTime(),o=t&&e?{TYPE:"2",PROVINCE_CODE:e,POWER_USER_ID:t,SENSITIVE_POWER_USER_ID:t,timestamp:a}:{TYPE:"0",timestamp:a};$.log("⏳ 开始获取电费信息...");try{const t=WSGW_CONFIG.base_url+"/osg-open-p0001/member/c5/f05",e=await fetchData({url:MY_SERVER+"/api/oauth_http_api",dataType:"json",body:{yuheng:{target:"12101",source:"app",serviceCode:"0102150",data:{common:{CHANNEL_RESOURCE:"5",REQTYPE:"3",PLAT:"4",WSGW_PLAT:"6",REQUEST_SOURCE:"10",SDKVERSION:"1.2024.03.08.01",TOKEN:WSGW_TOKEN,token:WSGW_TOKEN},data:o},_t:WSGW_TOKEN.substring(WSGW_TOKEN.length/2)}}});if(!e?.body)throw"获取电费信息加密数据失败";const a={url:t,dataType:"json",headers:{Accept:"application/json;charset=UTF-8","Content-Type":"application/json",wsgwType:"mnpg",version:"1.0",t:WSGW_TOKEN,Authorization:WSGW_AUTH,client_id:WSGW_CONFIG.client_id},body:e.body},n=await fetchData(a),i=await fetchData({url:MY_SERVER+"/api/decrypt_new",dataType:"json",body:{yuheng:n.encryptData,RSI:e.randomkey}});if(!i?.data)throw"获取电费信息解密失败";const{code:r,message:s,data:c}=i;if(1===r){const{data:{ELEC_TYPE_LIST:t}}=c;return WSGW_DEBUG&&($.log("===================================="),$.log("电费信息:"),$.log($.toStr(t[0].ARREARS_LIST)),$.log("====================================")),$.log("🎉 获取电费信息成功"),t[0].ARREARS_LIST}throw`获取电费信息失败: ${s}`}catch(t){throw`获取电费信息异常: ${t}`}finally{$.log("⏳ 获取电费信息结束")}}async getElectricityUsage(t,e){$.log("⏳ 开始查询用电量信息...");try{const a=WSGW_CONFIG.base_url+"/osg-open-bc0001/member/arg/010070001",o=(new Date).getTime(),n={data:{serialNo:o,srvCode:"emss-bia-bill-front/member/c31/f01",channelCode:WSGW_CONFIG.channelCode,funcCode:"11",acctId:"manager",userName:"111",promotType:"1",promotCode:"1",endDate:$.time("yyyyMM"),bgnDate:$.time("yyyyMM"),consNo:t,userAccountId:"123",provinceCode:e},serviceCode:"BCP_00026",searchType:"0",source:"manager",target:e,timestamp:o,_t:WSGW_TOKEN.substring(WSGW_TOKEN.length/2)},i=await fetchData({url:MY_SERVER+"/api/ph_http_api",dataType:"json",body:{yuheng:n}});if(!i?.body)throw"查询用电量信息加密数据失败";const r={url:a,dataType:"json",headers:{Accept:"application/json;charset=UTF-8","Content-Type":"application/json",wsgwType:"mnpg",version:"1.0",t:WSGW_TOKEN,Authorization:WSGW_AUTH,client_id:WSGW_CONFIG.client_id},body:i.body},s=await fetchData(r),c=await fetchData({url:MY_SERVER+"/api/decrypt_new",dataType:"json",body:{yuheng:s.encryptData,RSI:i.randomkey}});if(!c?.data)throw"查询用电量信息解密失败";const{code:d,message:_,data:h}=c;if(1===d)return WSGW_DEBUG&&($.log("===================================="),$.log("用电量信息:"),$.log($.toStr(h)),$.log("====================================")),$.log("🎉 查询用电量信息成功"),h;throw`查询用电量信息失败: ${_}`}catch(t){throw`查询用电量信息异常: ${t}`}finally{$.log("⏳ 查询用电量信息结束")}}}}
// ---------------------------------------------
/**
 * 请求封装
 * @param {Object|String} e 请求参数相关
 * @param {String} e.url 请求地址
 * @param {String} e.type 请求类型
 * @param {Object} e.headers 请求头
 * @param {String|Object} e.body 请求体
 * @param {Object} e.params 请求参数
 * @param {String} e.dataType 数据类型
 * @param {String} e.deviceType 设备类型
 * @param {String} e.resultType 返回类型
 * @param {Number} e.timeout 超时时间
 * @param {Boolean} e.useProxy 是否使用代理
 * @returns
 */
// prettier-ignore
async function fetchData(e){if("string"==typeof e&&(e={url:e}),!e?.url)throw new Error("[发送请求] 缺少 url 参数");try{let{url:o,type:r,headers:s={},body:n,params:i,dataType:a="form",deviceType:p="mobile",resultType:c="data",timeout:l=1e4,useProxy:u=!1,opts:m={}}=e;const y=r?r.toLowerCase():n?"post":"get";o+="post"===y&&i?`?${$.queryStr(i)}`:"",t=s,s=Object.fromEntries(Object.entries(t).map((([e,t])=>[e.toLowerCase(),t])));const h="pc"===p?"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299":"Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1";s["user-agent"]=s["user-agent"]||h,"json"===a&&(s["content-type"]="application/json;charset=UTF-8");const f={...e,url:o,method:y,headers:s,opts:m,timeout:$.isSurge()?l/1e3:l};if("get"===y&&i&&(f.params=i),"post"===y){const e="json"===a?$.toStr:$.queryStr;f.body=n&&("object"==typeof n?e(n):n)||n}if($.isNode()&&u){const{PROXY_HOST:e="127.0.0.1",PROXY_PORT:t=7890}=process.env,o=require("tunnel");f.agent={https:o.httpsOverHttp({proxy:{host:e,port:+t}})}}const w=new Promise(((e,t)=>{$[y](f,((r,s,n)=>{if(r){const e=n?`${$.toObj(n)?.message||n}`:"";console.log(`请求接口: ${o} 异常: ${e}`),t(new Error(e))}else e("response"===c?s:$.toObj(n)||n)}))}));return $.isQuanX()?await Promise.race([w,new Promise(((e,t)=>setTimeout((()=>t(new Error("网络开小差了~"))),l)))]):w}catch(e){throw new Error(e)}var t}
/**
 * 兼容多端通知
 * 2024/03/12: 已修复Loon/iOS16上存在媒体不通知的情况
 * @param {String} n 通知标题
 * @param {String} o 通知副标题
 * @param {String} i 通知详情
 * @param {Object|String} t 通知参数 {open-url: '', media-url: ''}
 */
// prettier-ignore
async function showNotification(n,o="",i="",t={}){const e="undefined"!=typeof $app&&"undefined"!=typeof $http,s=t["open-url"],f=t["media-url"];if($.isQuanX()&&$notify(n,o,i,t),$.isSurge()&&$notification.post(n,o,i,{url:s}),$.isLoon()){const t={},$=$loon.split(" ")[1].split(".")[0];s&&(t.openUrl=s),f&&16!==Number($)&&(t.mediaUrl=f),"{}"===JSON.stringify(t)?$notification.post(n,o,i):$notification.post(n,o,i,t)}const c=`${i}${s?`\n点击跳转: ${s}`:""}${f?`\n多媒体: ${f}`:""}`;if(e){require("push").schedule({title:n,body:`${o?`${o}\n`:""}${c}`})}if($.isNode())try{await notify.sendNotify(`${n}\n${o}`,c)}catch(n){console.log("没有找到sendNotify.js文件 不发送通知")}console.log(`${n}\n${o}\n${c}\n`)}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,a)=>{s.call(this,t,(t,s,r)=>{t?a(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const a=this.getdata(t);if(a)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,a)=>e(a))})}runScript(t,e){return new Promise(s=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,o]=a.split("@"),n={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,a)=>s(a))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e);if(!s&&!a)return{};{const a=s?t:e;try{return JSON.parse(this.fs.readFileSync(a))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):a?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const a=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of a)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,a)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[a+1])>>0==+e[a+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,a]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,a,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,a,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(a),o=a?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(o);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),a)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),a)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:a,statusCode:r,headers:i,rawBody:o}=t,n=s.decode(o,this.encoding);e(null,{status:a,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:a,response:r}=t;e(a,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let a=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:o}=t,n=a.decode(o,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&a.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let a={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in a)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[e]:("00"+a[e]).substr((""+a[e]).length)));return t}queryStr(t){let e="";for(const s in t){let a=t[s];null!=a&&""!==a&&("object"==typeof a&&(a=JSON.stringify(a)),e+=`${s}=${a}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",a="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,a=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":a}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,a,i(r));break;case"Quantumult X":$notify(e,s,a,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),a&&t.push(a),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
