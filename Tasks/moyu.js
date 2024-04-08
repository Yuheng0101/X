/******************************************
 * @name 摸鱼来啦~
 * @channel https://t.me/yqc_123
 * @feedback https://t.me/yqc_777
 * @version 1.1.8
******************************************
## 更新日志

### 20240304
    修复Loon/iOS16上不通知的问题
    传入日期时可选择是否显示另外的阳历/阴历倒计时
    修改部分节日的过节祝福语

### 20240229
    优化排版
    新增控制参数(详细请看配置说明)

### 20240228
    新增媒体图片自定义(自行更新BoxJS并修改), 不填默认随机
    新增自定义规则,可同一个日期同时显示阳历|阴历倒计时
    当输入$农历$阳历或$阳历$农历时, 都会输出倒计时

### 20240227
    新增自定义节日配置
    优化代码
    优化通知内容

### 20231023
    处理通知显示不全的问题

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
6 9 * * * https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/moyu.js, tag=摸鱼来啦, img-url=https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/67/04/ff/6704ff4c-b49b-de91-70ac-201c62d5296f/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/144x144bb.png, enabled=true
```
### 配置 (Loon)
```properties
[Script]
cron "6 9 * * *" script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/moyu.js, timeout=20, tag=摸鱼来啦, img-url=https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/67/04/ff/6704ff4c-b49b-de91-70ac-201c62d5296f/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/144x144bb.png
```
### 配置 (Surge)
```properties
摸鱼来啦 = type=cron,cronexp=6 9 * * *,script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/moyu.js,script-update-interval=604800
```
******************************************/
const $ = new Env('摸鱼来啦~')
// ----------------------------------
// 模块依赖
$.isTrue = (val) => val === 'true' || val === true
// prettier-ignore
$.qs = {stringify(e,n,r,t){var o=function(e){switch(typeof e){case"string":return e;case"boolean":return e?"true":"false";case"number":return isFinite(e)?e:"";default:return""}};return n=n||"&",r=r||"=",null===e&&(e=void 0),"object"==typeof e?Object.keys(e).map(function(t){var a=encodeURIComponent(o(t))+r;return Array.isArray(e[t])?e[t].map(function(e){return a+encodeURIComponent(o(e))}).join(n):a+encodeURIComponent(o(e[t]))}).filter(Boolean).join(n):t?encodeURIComponent(o(t))+r+encodeURIComponent(o(e)):""},parse(e,n,r,t){function o(e,n){return Object.prototype.hasOwnProperty.call(e,n)}n=n||"&",r=r||"=";var a={};if("string"!=typeof e||0===e.length)return a;var s=/\+/g;e=e.split(n);var u=1e3;t&&"number"==typeof t.maxKeys&&(u=t.maxKeys);var i=e.length;u>0&&i>u&&(i=u);for(var c=0;c<i;++c){var p,f,y,l,m=e[c].replace(s,"%20"),d=m.indexOf(r);d>=0?(p=m.substr(0,d),f=m.substr(d+1)):(p=m,f=""),y=decodeURIComponent(p),l=decodeURIComponent(f),o(a,y)?Array.isArray(a[y])?a[y].push(l):a[y]=[a[y],l]:a[y]=l}return a}}
/**
 * @1900-2100区间内的公历、农历互转
 * @charset UTF-8
 * @Author Jea杨(JJonline@JJonline.Cn)
 * @Time  2014-7-21
 * @Time  2016-8-13 Fixed 2033hex、Attribution Annals
 * @Time  2016-9-25 Fixed lunar LeapMonth Param Bug
 * @Version 1.0.2
 * @公历转农历：calendar.solar2lunar(1987,11,01); //[you can ignore params of prefix 0]
 * @农历转公历：calendar.lunar2solar(1987,09,10); //[you can ignore params of prefix 0]
 */
// prettier-ignore
const calendar = { lunarInfo: [19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970, 19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450, 38320, 84343, 18800, 42160, 46261, 27216, 27968, 109396, 11104, 38256, 21234, 18800, 25958, 54432, 59984, 28309, 23248, 11104, 100067, 37600, 116951, 51536, 54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344, 46423, 27808, 46416, 86869, 19872, 42416, 83315, 21168, 43432, 59728, 27296, 44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925, 19152, 42192, 54484, 53840, 54616, 46400, 46752, 103846, 38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256, 19189, 18800, 25776, 29859, 59984, 27480, 21952, 43872, 38613, 37600, 51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893, 43344, 46240, 47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312, 31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576, 23200, 30371, 38608, 19195, 19152, 42192, 118966, 53840, 54560, 56645, 46496, 22224, 21938, 18864, 42359, 42160, 43600, 111189, 27936, 44448, 84835, 37744, 18936, 18800, 25776, 92326, 59984, 27424, 108228, 43744, 41696, 53987, 51552, 54615, 54432, 55888, 23893, 22176, 42704, 21972, 21200, 43448, 43344, 46240, 46758, 44368, 21920, 43940, 42416, 21168, 45683, 26928, 29495, 27296, 44368, 84821, 19296, 42352, 21732, 53600, 59752, 54560, 55968, 92838, 22224, 19168, 43476, 41680, 53584, 62034, 54560], solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Gan: ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"], Zhi: ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"], Animals: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"], solarTerm: ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"], sTermInfo: ["9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c3598082c95f8c965cc920f", "97bd0b06bdb0722c965ce1cfcc920f", "b027097bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd0b06bdb0722c965ce1cfcc920f", "b027097bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd0b06bdb0722c965ce1cfcc920f", "b027097bd097c36b0b6fc9274c91aa", "9778397bd19801ec9210c965cc920e", "97b6b97bd19801ec95f8c965cc920f", "97bd09801d98082c95f8e1cfcc920f", "97bd097bd097c36b0b6fc9210c8dc2", "9778397bd197c36c9210c9274c91aa", "97b6b97bd19801ec95f8c965cc920e", "97bd09801d98082c95f8e1cfcc920f", "97bd097bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec95f8c965cc920e", "97bcf97c3598082c95f8e1cfcc920f", "97bd097bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c3598082c95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c3598082c95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd097bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf97c359801ec95f8c965cc920f", "97bd097bd07f595b0b6fc920fb0722", "9778397bd097c36b0b6fc9210c8dc2", "9778397bd19801ec9210c9274c920e", "97b6b97bd19801ec95f8c965cc920f", "97bd07f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c920e", "97b6b97bd19801ec95f8c965cc920f", "97bd07f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bd07f1487f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c965cc920e", "97bcf7f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b97bd19801ec9210c9274c920e", "97bcf7f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c91aa", "97b6b97bd197c36c9210c9274c920e", "97bcf7f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c8dc2", "9778397bd097c36c9210c9274c920e", "97b6b7f0e47f531b0723b0b6fb0722", "7f0e37f5307f595b0b0bc920fb0722", "7f0e397bd097c36b0b6fc9210c8dc2", "9778397bd097c36b0b70c9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e37f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc9210c8dc2", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9274c91aa", "97b6b7f0e47f531b0723b0787b0721", "7f0e27f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c91aa", "97b6b7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "9778397bd097c36b0b6fc9210c8dc2", "977837f0e37f149b0723b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f5307f595b0b0bc920fb0722", "7f0e397bd097c35b0b6fc9210c8dc2", "977837f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e37f1487f595b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc9210c8dc2", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd097c35b0b6fc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14998082b0787b06bd", "7f07e7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0b0bb0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14998082b0723b06bd", "7f07e7f0e37f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e397bd07f595b0b0bc920fb0722", "977837f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f1487f595b0b0bb0b6fb0722", "7f0e37f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e37f1487f531b0b0bb0b6fb0722", "7f0e37f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e37f1487f531b0b0bb0b6fb0722", "7f0e37f0e37f14898082b072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e37f0e37f14898082b072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f149b0723b0787b0721", "7f0e27f1487f531b0b0bb0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14998082b0723b06bd", "7f07e7f0e47f149b0723b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14998082b0723b06bd", "7f07e7f0e37f14998083b0787b0721", "7f0e27f0e47f531b0723b0b6fb0722", "7f0e37f0e366aa89801eb072297c35", "7ec967f0e37f14898082b0723b02d5", "7f07e7f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e36665b66aa89801e9808297c35", "665f67f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b0721", "7f07e7f0e47f531b0723b0b6fb0722", "7f0e36665b66a449801e9808297c35", "665f67f0e37f14898082b0723b02d5", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e36665b66a449801e9808297c35", "665f67f0e37f14898082b072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e26665b66a449801e9808297c35", "665f67f0e37f1489801eb072297c35", "7ec967f0e37f14998082b0787b06bd", "7f07e7f0e47f531b0723b0b6fb0721", "7f0e27f1487f531b0b0bb0b6fb0722"], nStr1: ["日", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"], nStr2: ["初", "十", "廿", "卅"], nStr3: ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"], lYearDays: function (b) { var f, c = 348; for (f = 32768; f > 8; f >>= 1)c += calendar.lunarInfo[b - 1900] & f ? 1 : 0; return c + calendar.leapDays(b) }, leapMonth: function (b) { return 15 & calendar.lunarInfo[b - 1900] }, leapDays: function (b) { return calendar.leapMonth(b) ? 65536 & calendar.lunarInfo[b - 1900] ? 30 : 29 : 0 }, monthDays: function (b, f) { return f > 12 || f < 1 ? -1 : calendar.lunarInfo[b - 1900] & 65536 >> f ? 30 : 29 }, solarDays: function (b, f) { if (f > 12 || f < 1) return -1; var c = f - 1; return 1 == c ? b % 4 == 0 && b % 100 != 0 || b % 400 == 0 ? 29 : 28 : calendar.solarMonth[c] }, toGanZhiYear: function (b) { var f = (b - 3) % 10, c = (b - 3) % 12; return 0 == f && (f = 10), 0 == c && (c = 12), calendar.Gan[f - 1] + calendar.Zhi[c - 1] }, toAstro: function (b, f) { return "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(2 * b - (f < [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22][b - 1] ? 2 : 0), 2) + "座" }, toGanZhi: function (b) { return calendar.Gan[b % 10] + calendar.Zhi[b % 12] }, getTerm: function (b, f) { if (b < 1900 || b > 2100) return -1; if (f < 1 || f > 24) return -1; var c = calendar.sTermInfo[b - 1900], e = [parseInt("0x" + c.substr(0, 5)).toString(), parseInt("0x" + c.substr(5, 5)).toString(), parseInt("0x" + c.substr(10, 5)).toString(), parseInt("0x" + c.substr(15, 5)).toString(), parseInt("0x" + c.substr(20, 5)).toString(), parseInt("0x" + c.substr(25, 5)).toString()], a = [e[0].substr(0, 1), e[0].substr(1, 2), e[0].substr(3, 1), e[0].substr(4, 2), e[1].substr(0, 1), e[1].substr(1, 2), e[1].substr(3, 1), e[1].substr(4, 2), e[2].substr(0, 1), e[2].substr(1, 2), e[2].substr(3, 1), e[2].substr(4, 2), e[3].substr(0, 1), e[3].substr(1, 2), e[3].substr(3, 1), e[3].substr(4, 2), e[4].substr(0, 1), e[4].substr(1, 2), e[4].substr(3, 1), e[4].substr(4, 2), e[5].substr(0, 1), e[5].substr(1, 2), e[5].substr(3, 1), e[5].substr(4, 2)]; return parseInt(a[f - 1]) }, toChinaMonth: function (b) { if (b > 12 || b < 1) return -1; var f = calendar.nStr3[b - 1]; return f += "月" }, toChinaDay: function (b) { var f; switch (b) { case 10: f = "初十"; break; case 20: f = "二十"; break; case 30: f = "三十"; break; default: f = calendar.nStr2[Math.floor(b / 10)], f += calendar.nStr1[b % 10] }return f }, getAnimal: function (b) { return calendar.Animals[(b - 4) % 12] }, solar2lunar: function (b, f, c) { if (b < 1900 || b > 2100) return -1; if (1900 == b && 1 == f && c < 31) return -1; if (b) e = new Date(b, parseInt(f) - 1, c); else var e = new Date; var a, r = 0, d = (b = e.getFullYear(), f = e.getMonth() + 1, c = e.getDate(), (Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()) - Date.UTC(1900, 0, 31)) / 864e5); for (a = 1900; a < 2101 && d > 0; a++)d -= r = calendar.lYearDays(a); d < 0 && (d += r, a--); var n = new Date, t = !1; n.getFullYear() == b && n.getMonth() + 1 == f && n.getDate() == c && (t = !0); var s = e.getDay(), l = calendar.nStr1[s]; 0 == s && (s = 7); var u = a, o = calendar.leapMonth(a), i = !1; for (a = 1; a < 13 && d > 0; a++)o > 0 && a == o + 1 && 0 == i ? (--a, i = !0, r = calendar.leapDays(u)) : r = calendar.monthDays(u, a), 1 == i && a == o + 1 && (i = !1), d -= r; 0 == d && o > 0 && a == o + 1 && (i ? i = !1 : (i = !0, --a)), d < 0 && (d += r, --a); var h = a, D = d + 1, g = f - 1, y = calendar.toGanZhiYear(u), p = calendar.getTerm(u, 2 * f - 1), m = calendar.getTerm(u, 2 * f), v = calendar.toGanZhi(12 * (b - 1900) + f + 11); c >= p && (v = calendar.toGanZhi(12 * (b - 1900) + f + 12)); var M = !1, T = null; p == c && (M = !0, T = calendar.solarTerm[2 * f - 2]), m == c && (M = !0, T = calendar.solarTerm[2 * f - 1]); var I = Date.UTC(b, g, 1, 0, 0, 0, 0) / 864e5 + 25567 + 10, C = calendar.toGanZhi(I + c - 1), S = calendar.toAstro(f, c); return { lYear: u, lMonth: h, lDay: D, Animal: calendar.getAnimal(u), IMonthCn: (i ? "闰" : "") + calendar.toChinaMonth(h), IDayCn: calendar.toChinaDay(D), cYear: b, cMonth: f, cDay: c, gzYear: y, gzMonth: v, gzDay: C, isToday: t, isLeap: i, nWeek: s, ncWeek: "星期" + l, isTerm: M, Term: T, astro: S } }, lunar2solar: function (b, f, c, e) { e = !!e; var a = calendar.leapMonth(b); calendar.leapDays(b); if (e && a != f) return -1; if (2100 == b && 12 == f && c > 1 || 1900 == b && 1 == f && c < 31) return -1; var r = calendar.monthDays(b, f), d = r; if (e && (d = calendar.leapDays(b, f)), b < 1900 || b > 2100 || c > d) return -1; for (var n = 0, t = 1900; t < b; t++)n += calendar.lYearDays(t); var s = 0, l = !1; for (t = 1; t < f; t++)s = calendar.leapMonth(b), l || s <= t && s > 0 && (n += calendar.leapDays(b), l = !0), n += calendar.monthDays(b, t); e && (n += r); var u = Date.UTC(1900, 1, 30, 0, 0, 0), o = new Date(864e5 * (n + c - 31) + u), i = o.getUTCFullYear(), h = o.getUTCMonth() + 1, D = o.getUTCDate(); return calendar.solar2lunar(i, h, D) } }
const send = $.isNode() ? require('./sendNotify') : ''
// ----------------------------------
// 时间定义
const Now = new Date()
const Year = Now.getFullYear()
const Month = Now.getMonth() + 1
const Today = Now.getDate()
const Hour = Now.getHours()
// ----------------------------------
// 配置项
// 如果只传入某一日期, 是否需要显示另外一个日期
$.SHOW_ANOTHER_DATE = $.isTrue($.isNode() ? process.env.MOYU_SHOW_ANOTHER_DATE : $.getdata('moyu_show_another_date'))
// $.SHOW_LUNAR = $.isTrue($.isNode() ? process.env.MOYU_SHOW_LUNAR : $.getdata('moyu_show_lunar'))
// 是否需要显示黄历
$.SHOW_ALMANAC = $.isTrue($.isNode() ? process.env.MOYU_SHOW_ALMANAC : $.getdata('moyu_show_almanac'))
// 用户自定义通知图片
$.CUSTOM_NOTIFY_IMG = ($.isNode() ? process.env.MOYU_CUSTOM_NOTIFY_IMG : $.getdata('moyu_custom_notify_img')) || ''
// 剩余多少天开始提醒
$.REMIND_DAYS = ($.isNode() ? process.env.MOYU_REMIND_DAYS : $.getdata('moyu_remind_days')) || 100
// 自定义规范: <节日1>&<节日2>&节日名称:(YYYY年)?MM月DD日($农历)($阳历)?&...
$.FESTIVAL_CONF = ($.isNode() ? process.env.MOYU_FESTIVAL_CONF : $.getdata('moyu_festival_conf')) || '<元宵节>&<清明节>&<劳动节>&<端午节>&<中秋节>&<国庆节>&<元旦>&<春节>'
// ----------------------------------
// 摸鱼图片@薛定谔的大灰机
const images = [
    'https://s2.loli.net/2022/02/24/SG5svAxd1eXwVDK.jpg',
    'https://s2.loli.net/2022/02/24/St2w79Qq5eDABiH.jpg',
    'https://s2.loli.net/2022/02/24/UQhuHPlIAnSY4fw.jpg',
    'https://s2.loli.net/2022/02/24/5S2DBWdz4nciIp6.jpg',
    'https://s2.loli.net/2022/02/24/SRLnuJQscvxzTlV.jpg',
    'https://s2.loli.net/2022/02/24/FjANmSHr4lYkPXL.jpg',
    'https://s2.loli.net/2022/02/24/qxhrKHpGmQzluao.jpg',
    'https://s2.loli.net/2022/02/24/thvwPN1VCesn9FK.jpg',
    'https://s2.loli.net/2022/02/24/eDM18l5tbwNkXCS.jpg',
    'https://s2.loli.net/2022/02/24/iVUOzxqIBNTA5v4.jpg'
]
// 固定节假日
const defaultFestivalMap = {
    元宵节: Lunar2Solar(Year, 1, 15),
    清明节: getQingMingDate(Year),
    劳动节: `${Year}/05/01`,
    端午节: Lunar2Solar(Year, 5, 5),
    中秋节: Lunar2Solar(Year, 8, 15),
    国庆节: `${Year}/10/01`,
    元旦: `${Year + 1}/01/01`,
    春节: Lunar2Solar(Year + 1, 1, 1)
}
// 星期对应摸鱼语句
const MOYU_COPY_WRITE = {
    星期一: `周一周一，奄奄一息(`,
    星期二: `周二摆烂，啥也不干`,
    星期三: `周三划水，给加薪水`,
    星期四: `周四不倦, 卧倒消遣`,
    星期五: `周五一到, 快乐冒泡)`
}
// ----------------------------------
// 用户格式化节日配置
const yearReg = /(\d{4})年(\d{1,2})月(\d{1,2})日/
const monthDayReg = /(\d{1,2})月(\d{1,2})日/
// 固定节日匹配
const fixedFestivalReg = /<(\S+)>/
// 根据用户是否配置年字段, 返回不同的日期格式
const getDateStr = (dateStr, year) => {
    if (dateStr.includes('年')) {
        return dateStr.replace(yearReg, '$1/$2/$3')
    }
    return `${year}/${dateStr.replace(monthDayReg, '$1/$2')}`
}
const festivalList = $.FESTIVAL_CONF.split('&')
    .map((it) => {
        const fixedFestivalMatch = it.match(fixedFestivalReg)
        // 固定节假日
        if (fixedFestivalMatch) {
            const festival = fixedFestivalMatch[1]
            if (defaultFestivalMap.hasOwnProperty(festival)) {
                return {
                    name: festival,
                    date: defaultFestivalMap[festival],
                    diff: getDiffDays(defaultFestivalMap[festival])
                }
            }
        } else {
            let [name, date] = it.split(':')
            const hasLunar = date.includes('$农历')
            const hasSolar = date.includes('$阳历')
            // 不包含任意或只包含阳历默认农历阳历都输出
            if (!hasLunar && !hasSolar) {
                date = getDateStr(date, Year)
                const [y, m, d] = date.split('/').map(Number)
                return {
                    name,
                    date,
                    lunar: Lunar2Solar(y, m, d),
                    diff: getDiffDays(date),
                    userIpt: ''
                }
            }
            if (hasSolar && !hasLunar) {
                date = getDateStr(date.replace('$阳历', ''), Year)
                const [y, m, d] = date.split('/').map(Number)
                return {
                    name,
                    date,
                    lunar: Lunar2Solar(y, m, d),
                    diff: getDiffDays(date),
                    userIpt: 'solar'
                }
            }
            // 只包含农历的只输出农历
            if (hasLunar && !hasSolar) {
                date = getDateStr(date.replace('$农历', ''), Year)
                const [y, m, d] = date.split('/').map(Number)
                const lunar = Lunar2Solar(y, m, d)
                const diff = getDiffDays(lunar)
                return { name, date, lunar, diff, userIpt: 'lunar' }
            }
            // 两者都包含的, 先判断哪个在前, 传入的日期为哪个，如果传入的是阳历, 则都输出, 如果传入的是农历, 则只输出农历
            if (hasLunar && hasSolar) {
                const reg = /\$(农历|阳历)\$(农历|阳历)/
                const isSolar = date.match(reg)[1] === '阳历'
                date = getDateStr(date.replace(reg, ''), Year)
                const [y, m, d] = date.split('/').map(Number)
                const lunar = Lunar2Solar(y, m, d)
                return {
                    name,
                    date: isSolar ? date : lunar,
                    lunar,
                    diff: getDiffDays(isSolar ? date : lunar),
                    userIpt: isSolar ? 'solar' : 'lunar'
                }
            }
        }
    })

    .filter((it) => it.diff >= 0)
    .sort((a, b) => a.diff - b.diff)
// ----------------------------------
/**
 * 每日一言
 * https://hitokoto.cn/
 */
const getOneWord = async (random = true) => {
    try {
        if (random) {
            const { hitokoto } = await fetchData('https://v1.hitokoto.cn')
            return `${hitokoto}`
        }
        const list = await fetchData('https://dict.youdao.com/infoline/style/cardList?mode=publish&client=mobile&style=daily&size=2')
        return list?.[0]?.summary || ''
    } catch (e) {
        console.log(e)
        return ``
    }
}
/** 通知  */
const notify = async () => {
    // 黄历输出
    const almanac = await getTodayAlmanac()
    const title = `【来摸鱼啦】${$.time('MM月dd日')} ${almanac.lunar}`
    const timeFrame = Hour < 12 ? '早上' : Hour < 18 ? '下午' : '晚上'
    const todayOneWord = await getOneWord(0)
    const subTitle = `${timeFrame}好, 摸鱼人, ${todayOneWord ? `${todayOneWord}` : '生活不止眼前的苟且, 还有摸鱼的快乐~'}`
    // 周末提醒
    const weekendDays = getWeekendDays()
    let content =
        weekendDays === 0
            ? `🎉周末快乐, ${(await getOneWord()) || `记得多陪陪家人哦~`}`
            : `${weekendDays == 1 ? `今天是周五哦` : `距离周末还有${weekendDays}天`}, ${MOYU_COPY_WRITE[getWeekDay()]}`
    // 节日提醒
    for (let { name: festival, date, diff, lunar, userIpt } of festivalList) {
        if (diff === 0) {
            switch (festival) {
                case '清明节':
                    content += `\n🕯️清明节到了, 抛却无尽的忧伤, 迎接幸福的曙光`
                    break
                case '端午节':
                    content += `\n🐲端午节到了, 清香的叶子层层叠叠, 薪酬总涨不跌`
                    break
                case '中秋节':
                    content += `\n🥮中秋节倒了, 月圆家圆人圆事圆圆圆团团, 国和家和人和事和和和美美`
                    break
                case '春节':
                    content += `\n🧨时光荏苒, 岁月如梭, 又是一年春节`
                    break
                default:
                    const bless = await getOneWord()
                    content += `\n🎉${festival}快乐${bless ? ', ' + bless : '!'}`
                    if (userIpt === '' || userIpt === 'solar') {
                        // 取阳历
                        content += `\n${$.SHOW_ANOTHER_DATE && lunar ? `距离${festival}农历(${lunar})还有${getDiffDays(lunar)}天` : ''}`
                    } else {
                        // 取农历
                        // 阳历比农历先过, 所以这里不做处理
                    }
                    break
            }
        } else if (diff > 0 && diff <= $.REMIND_DAYS) {
            if (userIpt === 'lunar') {
                // 取阳历判断是否需要显示
                content += `\n距离${festival}还有${diff}天`
                if ($.SHOW_ANOTHER_DATE) {
                    const dateDiff = getDiffDays(date)
                    if (dateDiff === 0) {
                        content += `, 今天是${festival}, 请注意哦~`
                    } else if (dateDiff > 0) {
                        content += `, 阳历(${date})还有${dateDiff}天`
                    } else {
                        console.log(`${festival}阳历${date}已过, 不在范围内, 已跳过`)
                    }
                }
            } else {
                // 取农历判断是否需要显示
                content += `\n距离${festival}还有${diff}天${$.SHOW_ANOTHER_DATE && lunar ? `, 农历(${lunar})还有${getDiffDays(lunar)}天` : ''}`
            }
        }
    }
    // 黄历
    if ($.SHOW_ALMANAC) {
        almanac.suit && (content += `\n【宜】${almanac.suit.replace(/^宜/, '')}`)
        almanac.avoid && (content += `\n【忌】${almanac.avoid.replace(/^忌/, '')}`)
        // 节气/冲/煞/星座
        const detail = almanac.detail.find((it) => it.includes('节气')).replace('节气:', '')
        // content += `\n【🌱】${detail}`
        content += `\n【节】${detail}`
    }
    // 发送通知
    const imageUrl = $.CUSTOM_NOTIFY_IMG || images[Math.floor(Math.random() * images.length)]
    await SendNotify(title, subTitle, content, {
        'media-url': imageUrl
    })
}
/** 阴历转阳历 */
function Lunar2Solar(year, month, day) {
    const { cYear, cMonth, cDay } = calendar.lunar2solar(year, month, day)
    return `${cYear}/${cMonth}/${cDay}`
}
/** 判断当前日期与传入日期相差x天
 * @param {string} date 日期 格式: 2022/01/01
 * @returns {number} 相差天数 正数表示未来日期 负数表示过去日期
 */
function getDiffDays(date) {
    const timestamp = new Date(date).getTime()
    const now = new Date().getTime()
    return Math.floor((timestamp - now) / 1000 / 60 / 60 / 24) + 1
}
/**
 * 获取星期几
 * @param {string | Date} date 日期
 * @returns {string} 星期几
 */
function getWeekDay(date = Now) {
    date = typeof date === 'string' ? new Date(date) : date
    const u = calendar.nStr1[date.getDay()]
    return `星期${u}`
}
/**
 * 判断传入日期距离周末还有几天
 * @param {string | Date} date 日期
 * @returns {number} 距离周末还有几天
 */
function getWeekendDays(date = Now) {
    date = typeof date === 'string' ? new Date(date) : date
    const day = date.getDay()
    return day === 0 ? 0 : 6 - day
}
/**
 * 获取清明节日期
 * 清明节的日期是不固定的，规律是：闰年开始的前2年是4月4日，闰年开始的第3年和第4年是4月5日
 */
function getQingMingDate(year) {
    const isLeapYear = (y) => (y % 4 == 0 && y % 100 != 0) || y % 400 == 0
    return isLeapYear(year) || isLeapYear(year - 1) ? `${year}/04/04` : `${year}/04/05`
}
// ----------------------------------
!(async () => {
    await loadRemoteScriptByCache('https://cdn.jsdelivr.net/gh/Yuheng0101/X@main/Utils/cheerio.js', 'createCheerio', 'cheerio')
    await notify()
})()
    .catch((e) => $.log('', `❗️${$.name}, 请求失败: ${e}`))
    // TODO: 适配Surge的面板
    .finally(() => $.done())
/**
 * 获取今日黄历
 */
async function getTodayAlmanac() {
    // 清除老数据
    $.getdata(`moyu_${Year}${Month}`) && $.setdata('', `moyu_${Year}${Month}`)
    let almanacList = $.toObj($.getdata(`moyu_${Year}${Month}_new`))
    if (!almanacList) {
        const html = await fetchData(`https://wannianrili.bmcx.com/${$.time(`yyyy-MM-dd`)}__wannianrili/`)
        const O = $.cheerio.load(html)
        // 黄历
        const almanac = O('.wnrl_k_you')
            .map((_, e) => {
                const day = O(e).find(`.wnrl_k_you_id_wnrl_riqi`).text()
                const lunar = O(e).find(`.wnrl_k_you_id_wnrl_nongli`).text()
                const suit = O(e).find(`.wnrl_k_you_id_wnrl_yi`).text()
                const avoid = O(e).find(`.wnrl_k_you_id_wnrl_ji`).text()
                return { day, lunar, suit, avoid }
            })
            .get()
        // 详细信息
        const detail = O('.wnrl_k_xia_id')
            .map((_, e) => {
                return {
                    day:
                        O(e)
                            .find(`.wnrl_k_xia_top`)
                            .text()
                            .match(/月(\d+)日/)?.[1] || '',
                    detail: O(e)
                        .find(`.wnrl_k_xia_nr`)
                        .find('.wnrl_k_xia_nr_wnrl_beizhu')
                        .map((_, it) => {
                            const title = O(it).find(`.wnrl_k_xia_nr_wnrl_beizhu_biaoti`).text()
                            const content = O(it).find(`.wnrl_k_xia_nr_wnrl_beizhu_neirong`).text()
                            return `${title}:${content}`
                        })
                        .get()
                }
            })
            .get()
        almanacList = almanac.map((item) => {
            const { detail: detailItem } = detail.find((it) => it.day === item.day)
            return { ...item, detail: detailItem }
        })
        $.setdata($.toStr(almanacList), `moyu_${Year}${Month}_new`)
        $.getdata(`moyu_${Year}${Month - 1}_new`) && $.setdata('', `moyu_${Year}${Month - 1}_new`) // 清除上个月的数据
    }
    return almanacList.find((item) => Number(item.day) === Today)
}
/**
 * 远程脚本加载
 * @param {*} scriptUrl 远程链接
 * @param {*} functionName 脚本内函数名
 * @param {*} scriptName 全局变量名
 * @returns
 */
function loadRemoteScriptByCache(scriptUrl, functionName, scriptName) {
    const cacheName = `${scriptName}.js`
    const cache = $.getdata(cacheName) || ``
    return new Promise((resolve, reject) => {
        if (cache) {
            eval(cache), ($[scriptName] = eval(functionName)())
            $.log(`☑️ 缓存加载${functionName}成功`)
            resolve()
        } else {
            $.getScript(scriptUrl)
                .then((script) => {
                    eval(script), ($[scriptName] = eval(functionName)())
                    $.log(`☑️ 远程加载${functionName}成功`)
                    $.setdata(script, cacheName)
                    $.log(`☑️ 缓存${functionName}成功`)
                    resolve()
                })
                .catch((err) => {
                    $.logErr(`⚠️ 远程加载${functionName}失败`, err)
                    reject(err)
                })
        }
    })
}
/**
 * 网络请求基于env.js的二次封装 适配Quantumult X/Surge/Loon/Shadowrocket 其他平台未测试
 * @param {object} o 请求参数
 * @param {string} o.url 请求地址 必填
 * @param {string} o.type 请求类型 非必填 默认get
 * @param {object} o.headers 请求头 非必填
 * @param {object} o.params 请求参数 非必填
 * @param {object} o.body 请求体 post => json 非必填
 * @param {string} o.deviceType 设备类型 pc | mobile 非必填 默认mobile
 * @param {string} o.dataType 数据类型 json | form 非必填 默认form
 * @param {string} o.responseType 返回数据类型 response | data 非必填 默认data
 * @param {number} o.timeout 超时时间 单位ms 非必填 默认5000
 * @returns {Promise}
 */
async function fetchData(o) {
    const ObjectKeys2LowerCase = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]))
    typeof o === 'string' && (o = { url: o })
    if (!o?.url) throw new Error('[发送请求] 缺少 url 参数')
    try {
        // type => 因为env中使用method处理post的特殊请求(put/delete/patch), 所以这里使用type
        const { url: u, type, headers: h, body: b, params, dataType = 'form', deviceType = 'mobile', responseType = 'data' } = o
        const method = type ? type.toLowerCase() : 'get'
        // post请求需要处理params参数(get不需要, env已经处理)
        const url = u.concat(method === 'post' ? '?' + $.qs.stringify(params) : '')
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
        dataType === 'json' &&
            Object.assign(headers, {
                'content-type': 'application/json;charset=UTF-8'
            })
        // 超时处理兼容Surge => 单位是s
        const timeout = o?.timeout ? ($.isSurge() ? o.timeout / 1e3 : o.timeout) : 5e3
        // post请求处理body
        // const body = method === 'post' && b ? (o.dataType === 'json' ? typeof b ===  'object' ? $.toStr(b) || b : b : typeof b === 'object' ? $.qs.stringify(b) : b) : ''
        const body = method === 'post' && b && ((o.dataType === 'json' ? $.toStr : $.qs.stringify)(typeof b === 'object' ? b : '') || b)
        const request = {
            url,
            headers,
            ...(method === 'post' && { body }),
            ...(method === 'get' && params && { params }),
            timeout
        }
        const promise = new Promise((resolve, reject) => {
            $[method](request, (err, response, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(responseType === 'response' ? response : $.toObj(data) || data)
                }
            })
        })
        // 使用Promise.race来给Quantumult X强行加入超时处理
        return $.isQuanX() ? await Promise.race([new Promise((_, r) => setTimeout(() => r(new Error('网络开小差了~')), timeout)), promise]) : promise
    } catch (e) {
        throw new Error(e)
    }
}
/**
 * 通用通知
 * 兼容Node.js/Quantumult X/Surge/Loon/Shadowrocket
 * @param {*} title 标题
 * @param {*} subtitle 副标题
 * @param {*} content 内容
 * @param {*} options 附加参数
 */
async function SendNotify(title, subtitle = '', content = '', options = {}) {
    // --------------------------------------------------
    const isJSBox = typeof $app !== 'undefined' && typeof $http !== 'undefined'
    // --------------------------------------------------
    const openURL = options['open-url']
    const mediaURL = options['media-url']

    if ($.isQuanX()) {
        $notify(title, subtitle, content, options)
    }
    if ($.isSurge()) {
        // const contentWithMedia = mediaURL ? `${content}\n多媒体:${mediaURL}` : content
        const contentWithMedia = mediaURL ? `${content}` : content // 应佬要求去掉Surge的媒体链接
        $notification.post(title, subtitle, contentWithMedia, { url: openURL })
    }
    if ($.isLoon()) {
        const opts = {}
        if (openURL) opts['openUrl'] = openURL
        if (mediaURL) opts['mediaUrl'] = mediaURL
        const iOS_Version = $loon.split(' ')[1].split('.')[0]
        if (JSON.stringify(opts) === '{}' || Number(iOS_Version) === 16) {
            $notification.post(title, subtitle, content)
        } else {
            $notification.post(title, subtitle, content, opts)
        }
    }
    const content_ = `${content}${openURL ? `\n点击跳转: ${openURL}` : ''}${mediaURL ? `\n多媒体: ${mediaURL}` : ''}`
    if (isJSBox) {
        const push = require('push')
        push.schedule({
            title,
            body: `${subtitle ? `${subtitle}\n` : ''}${content_}`
        })
    }
    if ($.isNode()) {
        try {
            await send.sendNotify(`${title}\n${subtitle}`, content_)
        } catch (e) {
            console.log('没有找到sendNotify.js文件')
        }
    }
    console.log(`${title}\n${subtitle}\n${content_}\n\n`)
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,a)=>{s.call(this,t,(t,s,r)=>{t?a(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}getEnv(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.getEnv()}isQuanX(){return"Quantumult X"===this.getEnv()}isSurge(){return"Surge"===this.getEnv()}isLoon(){return"Loon"===this.getEnv()}isShadowrocket(){return"Shadowrocket"===this.getEnv()}isStash(){return"Stash"===this.getEnv()}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const a=this.getdata(t);if(a)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,a)=>e(a))})}runScript(t,e){return new Promise(s=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[i,o]=a.split("@"),n={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":i,Accept:"*/*"},timeout:r};this.post(n,(t,e,a)=>s(a))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e);if(!s&&!a)return{};{const a=s?t:e;try{return JSON.parse(this.fs.readFileSync(a))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),a=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):a?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const a=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of a)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,a)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[a+1])>>0==+e[a+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,a]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,a,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,a,r]=/^@(.*?)\.(.*?)$/.exec(e),i=this.getval(a),o=a?"null"===i?null:i||"{}":"{}";try{const e=JSON.parse(o);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),a)}catch(e){const i={};this.lodash_set(i,r,t),s=this.setval(JSON.stringify(i),a)}}else s=this.setval(t,e);return s}getval(t){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(t);case"Quantumult X":return $prefs.valueForKey(t);case"Node.js":return this.data=this.loaddata(),this.data[t];default:return this.data&&this.data[t]||null}}setval(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(t,e);case"Quantumult X":return $prefs.setValueForKey(t,e);case"Node.js":return this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0;default:return this.data&&this.data[e]||null}}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){switch(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"],delete t.headers["content-type"],delete t.headers["content-length"]),t.params&&(t.url+="?"+this.queryStr(t.params)),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:a,statusCode:r,headers:i,rawBody:o}=t,n=s.decode(o,this.encoding);e(null,{status:a,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:a,response:r}=t;e(a,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";switch(t.body&&t.headers&&!t.headers["Content-Type"]&&!t.headers["content-type"]&&(t.headers["content-type"]="application/x-www-form-urlencoded"),t.headers&&(delete t.headers["Content-Length"],delete t.headers["content-length"]),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,a)=>{!t&&s&&(s.body=a,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,a)});break;case"Quantumult X":t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:a,headers:r,body:i,bodyBytes:o}=t;e(null,{status:s,statusCode:a,headers:r,body:i,bodyBytes:o},i,o)},t=>e(t&&t.error||"UndefinedError"));break;case"Node.js":let a=require("iconv-lite");this.initGotEnv(t);const{url:r,...i}=t;this.got[s](r,i).then(t=>{const{statusCode:s,statusCode:r,headers:i,rawBody:o}=t,n=a.decode(o,this.encoding);e(null,{status:s,statusCode:r,headers:i,rawBody:o,body:n},n)},t=>{const{message:s,response:r}=t;e(s,r,r&&a.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let a={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in a)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[e]:("00"+a[e]).substr((""+a[e]).length)));return t}queryStr(t){let e="";for(const s in t){let a=t[s];null!=a&&""!==a&&("object"==typeof a&&(a=JSON.stringify(a)),e+=`${s}=${a}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",a="",r){const i=t=>{switch(typeof t){case void 0:return t;case"string":switch(this.getEnv()){case"Surge":case"Stash":default:return{url:t};case"Loon":case"Shadowrocket":return t;case"Quantumult X":return{"open-url":t};case"Node.js":return}case"object":switch(this.getEnv()){case"Surge":case"Stash":case"Shadowrocket":default:{let e=t.url||t.openUrl||t["open-url"];return{url:e}}case"Loon":{let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}case"Quantumult X":{let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,a=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":a}}case"Node.js":return}default:return}};if(!this.isMute)switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,s,a,i(r));break;case"Quantumult X":$notify(e,s,a,i(r));break;case"Node.js":}if(!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),a&&t.push(a),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){switch(this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️${this.name}, 错误!`,t);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,t.stack)}}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;switch(this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.getEnv()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(t);break;case"Node.js":process.exit(1)}}}(t,e)}
