/******************************************
 * @name 帆书(樊登读书)去广告
 * @author 𝐎𝐍𝐙𝟑𝐕
 * @description 全局净化
 * @channel https://t.me/yqc_123
 * @feedback https://t.me/lanjieguanggao
 * @date 2024-12-18
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
******************************************/
// https://www.npmjs.com/package/@nsnanocat/util
// prettier-ignore
const $app=(()=>{const e=Object.keys(globalThis);switch(!0){case e.includes("$task"):return"Quantumult X";case e.includes("$loon"):return"Loon";case e.includes("$rocket"):return"Shadowrocket";case e.includes("Egern"):return"Egern";case e.includes("$environment"):return $environment["surge-version"]?"Surge":$environment["stash-version"]?"Stash":void 0;default:return}})();
// prettier-ignore
class Storage{static data=null;static dataFile="box.dat";static nameRegex=/^@(?<key>[^.]+)(?:\.(?<path>.*))?$/;static getItem(e,t=null){let a=t;switch(e.startsWith("@")){case!0:{const{key:t,path:r}=e.match(Storage.nameRegex)?.groups;e=t;let s=Storage.getItem(e,{});"object"!=typeof s&&(s={}),a=Lodash.get(s,r);try{a=JSON.parse(a)}catch(e){}break}default:switch($app){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":a=$persistentStore.read(e);break;case"Quantumult X":a=$prefs.valueForKey(e);break;default:a=Storage.data?.[e]||null;break}try{a=JSON.parse(a)}catch(e){}break}return a??t}static setItem(e=new String,t=new String){let a=!1;switch(typeof t){case"object":t=JSON.stringify(t);break;default:t=String(t);break}switch(e.startsWith("@")){case!0:{const{key:r,path:s}=e.match(Storage.nameRegex)?.groups;e=r;let c=Storage.getItem(e,{});"object"!=typeof c&&(c={}),Lodash.set(c,s,t),a=Storage.setItem(e,c);break}default:switch($app){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":a=$persistentStore.write(t,e);break;case"Quantumult X":a=$prefs.setValueForKey(t,e);break;default:a=Storage.data?.[e]||null;break}break}return a}static removeItem(e){let t=!1;switch(e.startsWith("@")){case!0:{const{key:a,path:r}=e.match(Storage.nameRegex)?.groups;e=a;let s=Storage.getItem(e);"object"!=typeof s&&(s={}),keyValue=Lodash.unset(s,r),t=Storage.setItem(e,s);break}default:switch($app){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":t=!1;break;case"Quantumult X":t=$prefs.removeValueForKey(e);break;default:t=!1;break}break}return t}static clear(){let e=!1;switch($app){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":e=!1;break;case"Quantumult X":e=$prefs.removeAllValues();break;default:e=!1;break}return e}}
// https://www.npmjs.com/package/base-64
// prettier-ignore
!function(r){var t=function(r){this.message=r};(t.prototype=new Error).name="InvalidCharacterError";var e=function(r){throw new t(r)},a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n=/[\t\n\f\r ]/g,c={encode:function(r){r=String(r),/[^\0-\xFF]/.test(r)&&e("The string to be encoded contains characters outside of the Latin1 range.");for(var t,n,c,o,h=r.length%3,d="",i=-1,A=r.length-h;++i<A;)t=r.charCodeAt(i)<<16,n=r.charCodeAt(++i)<<8,c=r.charCodeAt(++i),d+=a.charAt((o=t+n+c)>>18&63)+a.charAt(o>>12&63)+a.charAt(o>>6&63)+a.charAt(63&o);return 2==h?(t=r.charCodeAt(i)<<8,n=r.charCodeAt(++i),d+=a.charAt((o=t+n)>>10)+a.charAt(o>>4&63)+a.charAt(o<<2&63)+"="):1==h&&(o=r.charCodeAt(i),d+=a.charAt(o>>2)+a.charAt(o<<4&63)+"=="),d},decode:function(r){var t=(r=String(r).replace(n,"")).length;t%4==0&&(t=(r=r.replace(/==?$/,"")).length),(t%4==1||/[^+a-zA-Z0-9/]/.test(r))&&e("Invalid character: the string to be decoded is not correctly encoded.");for(var c,o,h=0,d="",i=-1;++i<t;)o=a.indexOf(r.charAt(i)),c=h%4?64*c+o:o,h++%4&&(d+=String.fromCharCode(255&c>>(-2*h&6)));return d},version:"1.0.0"};r.base64=c}(globalThis);
// https://www.npmjs.com/package/utf8
// prettier-ignore
!function(r){var n,t,o,e=String.fromCharCode;function i(r){for(var n,t,o=[],e=0,i=r.length;e<i;)(n=r.charCodeAt(e++))>=55296&&n<=56319&&e<i?56320==(64512&(t=r.charCodeAt(e++)))?o.push(((1023&n)<<10)+(1023&t)+65536):(o.push(n),e--):o.push(n);return o}function u(r){if(r>=55296&&r<=57343)throw Error("Lone surrogate U+"+r.toString(16).toUpperCase()+" is not a scalar value")}function f(r,n){return e(r>>n&63|128)}function a(r){if(!(4294967168&r))return e(r);var n="";return 4294965248&r?4294901760&r?4292870144&r||(n=e(r>>18&7|240),n+=f(r,12),n+=f(r,6)):(u(r),n=e(r>>12&15|224),n+=f(r,6)):n=e(r>>6&31|192),n+=e(63&r|128)}function c(){if(o>=t)throw Error("Invalid byte index");var r=255&n[o];if(o++,128==(192&r))return 63&r;throw Error("Invalid continuation byte")}function h(){var r,e;if(o>t)throw Error("Invalid byte index");if(o==t)return!1;if(r=255&n[o],o++,!(128&r))return r;if(192==(224&r)){if((e=(31&r)<<6|c())>=128)return e;throw Error("Invalid continuation byte")}if(224==(240&r)){if((e=(15&r)<<12|c()<<6|c())>=2048)return u(e),e;throw Error("Invalid continuation byte")}if(240==(248&r)&&((e=(7&r)<<18|c()<<12|c()<<6|c())>=65536&&e<=1114111))return e;throw Error("Invalid UTF-8 detected")}let d={version:"3.0.0",encode:function(r){for(var n=i(r),t=n.length,o=-1,e="";++o<t;)e+=a(n[o]);return e},decode:function(r){n=i(r),t=n.length,o=0;for(var u,f=[];!1!==(u=h());)f.push(u);return function(r){for(var n,t=r.length,o=-1,i="";++o<t;)(n=r[o])>65535&&(i+=e((n-=65536)>>>10&1023|55296),n=56320|1023&n),i+=e(n);return i}(f)}};r.utf8=d}(globalThis);
const Arguments =
    typeof $argument !== "undefined"
        ? "object" == typeof $argument
            ? $argument
            : Object.fromEntries($argument.split("&").map((t) => t.split("=")))
        : {};
const Pathname = /^(?:https?:\/\/)?[^\/]+(\/[^?#]*)?/.exec($request.url)?.[1];
const Status = $response.status ?? $request.statusCode;
if (Status !== 200) {
    console.log("非 200 状态码‼️ ‼️" + Status);
    $done({});
}
const EncryptionOrNot =
    `${$response.headers["reqentryption"] ?? $response.headers["reqEntryption"]}`.toLowerCase() ===
    "base64";
// ------------------------------------------------------------
// TODO: 用户选择
const Home_Category_Selection = Arguments["Home_Category_Selection"] ||
    Storage.getItem("home_category_selection") || [
        // "mainBusiness", // 金刚位 - 菜单
        "rankAlgorithm", // 榜单
        "newReport", // 近期新书
        "editorRecommend", // 编辑推荐
        "book", // 讲书
        "singleBookList", // 书单
        "course" // 课程
    ];

const Book_Category_Selection = Arguments["Book_Category_Selection"] ||
    Storage.getItem("book_category_selection") || [
        "newBooks", // 本周新书
        "studyHistory", // 最近在学
        "recommendBookList", // 书单推荐
        "speakers", // 主讲人
        "recommendBook", // 专属推荐
        "algorithmRecom" // 算法推荐
    ];

const User_Setting_Selection =
    Arguments["User_Setting_Selection"] ||
    Storage.getItem("user_setting_selection") ||
    [
        // "227", // 帆书企业版 - 展示[企业版]
        // "141", // 邀请好友页（邀请有礼） - 展示[邀请有礼]
        // "148", // 组队读书 - 展示[组队读书]
        // "153", // web页面 - 展示[职业福利]
        // "216", // 我的-更多服务页面 - 展示[更多服务]
        // "228" // 签到任务中心页 - 展示[大学生福利]
    ];
// ------------------------------------------------------------
let Decode_Body = jsonParse(
    EncryptionOrNot ? utf8.decode(base64.decode($response.body)) : $response.body,
    null
);
if (Decode_Body === null) {
    console.log("响应体解析失败‼️" + $response.body);
    $done({});
}
// ------------------------------------------------------------
// console.log(jsonStr(Decode_Body, null, 2));
// 课程菜单优化
if (Pathname.includes("/chief-orch/home/bookPortal/v105/category")) {
    const headCategories = Decode_Body.data.headCategories;
    Decode_Body.data.headCategories = headCategories.filter((item) => {
        return item.code !== "web";
    });
}
// 各页面banner
if (Pathname.includes("/abtest-front/banner-modular/get")) {
    if (Decode_Body?.data?.banners?.length) {
        console.log(
            `[Banner] - [${Decode_Body.data?.moduleCode}] - [${Decode_Body.data?.planName}] - 移除`
        );
        Decode_Body.data.banners = [];
    }
}
// 听书首页优化
if (Pathname.includes("/resource-orchestration-system/book/channel/v100/info")) {
    Decode_Body.data.moduleList.forEach((item) => {
        if (Book_Category_Selection.includes(item.moduleCode)) {
            console.log(`${item.moduleCode} - [${item.moduleName}] - 保留`);
            item.showFlag = true;
        } else {
            console.log(`${item.moduleCode} - [${item.moduleName}] - 移除`);
            item.showFlag = false;
        }
    });
}
// 个人信息页优化
if (Pathname.includes("/fs-member/user/profile/v100/detail")) {
    Decode_Body.data.vipInfos = [];
}
// 首页优化
if (Pathname.includes("/chief-orch/home/bookPortal/v111/forApp")) {
    const modules = Decode_Body.data.modules;
    Decode_Body.data.modules = modules.filter((item) => {
        return Home_Category_Selection.includes(item.moduleCode);
    });
}
// 个人设置项优化
if (Pathname.includes("/sns-orchestration-system/homePage/api/v100/myPage")) {
    Decode_Body.data.vipConfig.vipConfigs = [];
    Decode_Body.data.serviceCenter.services = Decode_Body.data.serviceCenter?.services?.filter(
        (item) => {
            return User_Setting_Selection.includes(item.linkId);
        }
    );
}
// 会员任务去除
if (Pathname.includes("/task-orchestration/taskCenter/api/v101/taskList")) {
    Decode_Body.data.taskInfoList = [];
}
// 听书页优化
if (Pathname.includes("/resource-orchestration-system/book/v101/content/")) {
    if (Decode_Body.data?.bookComponent) {
        for (const item of Decode_Body.data.bookComponent) {
            if (item.hasOwnProperty("compBanner")) {
                delete item.compBanner;
            }
        }
    }
}
// 听书页下方横幅
if (Pathname.includes("/user-orchestration/user/api/v101/ceiltip")) {
    Decode_Body.data = true;
}
// ------------------------------------------------------------
$done({
    body: EncryptionOrNot ? base64.encode(utf8.encode(jsonStr(Decode_Body))) : jsonStr(Decode_Body)
});

function jsonParse(json, defaultValue) {
    try {
        return JSON.parse(`${json}`);
    } catch {
        return defaultValue ?? json;
    }
}
function jsonStr(json, ...args) {
    if (typeof json === "string") return json;
    try {
        return JSON.stringify(json, ...args);
    } catch {
        return json;
    }
}
