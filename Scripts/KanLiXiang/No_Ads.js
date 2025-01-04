const Pathname = /^(?:https?:\/\/)?[^\/]+(\/[^?#]*)?/.exec($request.url)?.[1];
console.log(Pathname);
const Status = $response.status ?? $request.statusCode;
if (Status !== 200) {
    console.log("非 200 状态码‼️ ‼️" + Status);
    $done({});
}
if ($request.method.toUpperCase() === "OPTIONS") {
    $done({});
}
let body = jsonParse($response.body, null);
if (body === null) {
    console.log("响应体解析失败‼️" + $response.body);
    $done({});
}
if (body?.status !== "success") {
    console.log("响应出错‼️" + body?.data || body);
    $done({});
}

// 配置优化
if (/v2\/other\/config/i.test(Pathname)) {
    body.data.dialog = null;
    body.data.advertisements = [];
    body.data.friend_config.my_buy_image = `http://cdn.vistopia.com.cn/1582885400613.png`;
    body.data.vip_config.my_buy_image = `http://cdn.vistopia.com.cn/1651368454378.png`;
    body.data.vip_config.black_my_buy_image = `http://cdn.vistopia.com.cn/1651368454378.png`;
    for (const key in body.data.app_config) {
        if (key.endsWith("_is_show")) {
            body.data.app_config[key] = "0";
        }
    }
}

// 首页自定义
if (/v2\/home\/header-new/i.test(Pathname)) {
    const Black_Type_List = [
        "home_sliders", // 首页轮播图
        // "home_nav", // 首页分类图标
        // "home_today", // 观念日历
        "card_image" // 外链卡片
        // "home_hots", // 今日榜单
        // "topic_broadcast", // 清明上河图
        // "home_content_update", // 最近更新
        // "listener_discuss", // 听众讨论
        // "lead_read", // 资深评论
        // "card_single_content", // 节目上新
        // "card_single_article", // 今日限免
        // "home_gold", // 每日金句
        // "card_album", // 合辑推荐
        // "home_page_recommend" // 专题推荐
    ];
    console.log("拉黑模块[" + Black_Type_List.join(",") + "]");
    body.data = body.data.filter((item) => {
        return !Black_Type_List.includes(item.type);
    });
    if (!Black_Type_List.includes("home_nav")) {
        const index = body.data.findIndex((item) => item.type === "home_nav");
        body.data[index].data.forEach((item) => {
            item.tips_url = "";
        });
    }
    if (!Black_Type_List.includes("card_single_content")) {
        const index = body.data.findIndex((item) => item.type === "card_single_content");
        body.data[index].data.forEach((item) => {
            // item.sale_price = "";
            item.label = "vip_free_y";
        });
    }
}

// 会员页假解锁
if (/vip\/buy-list/i.test(Pathname)) {
    body.data.is_vip_expire = "0";
    body.data.module_list = [];
    body.data.equity_list = [];
    const trial_index = body.data.goods_equity.findIndex((item) => item.title === "畅听卡");
    body.data.goods_equity[trial_index].buy_btn.bottom_text =
        "<b style='font-size:16px;font-family:PingFang SC;'><span style='color: #000000'>畅听卡永久有效</span></b>";
    body.data.vip_data = {
        expire_time: "2099-12-31",
        vip_left_days: "999",
        vip_type: "lixiangjia_trial",
        h5_gift_url: "",
        buy_text: "立即开通",
        link_url: "",
        equity_intro: {
            title: "我的会员权益",
            link_url:
                "https://shop.vistopia.com.cn/idealist_rights_info?equity_type=TCTK0011&hide_bar=1"
        },
        vip_valide: "畅听卡会员永久有效",
        expire_list: [
            {
                title: "畅听卡会员",
                content: "永久有效"
            }
        ]
    };
}
// 列表假解锁
if (/(class\/content|content\/sales-list)/i.test(Pathname)) {
    body.data?.data?.forEach((item) => {
        item.vip_type = "lixiangjia_trial";
    });
}

// 个人中心假解锁会员
if (/v2\/user\/profile/i.test(Pathname)) {
    body.data.vip_type = "lixiangjia_trial";
    body.data.user_file.equity_txt = "畅听卡会员永久有效";
    body.data.user_file.vip_type = "lixiangjia_trial";
    body.data.user_file.vip_expire_date = "2099-12-31";
    body.data.user_file.vip_left_days = "999";
    body.data.user_file.is_show_equity = "1";
    body.data.user_file.is_vip_expire = "0";
    if (body.data.user_file?.old_vip_type) {
        body.data.user_file.old_vip_type = "";
    }
}

// 文学的记忆
if (/broadcast\/show/i.test(Pathname)) {
    body.data?.articles?.forEach((item) => {
        item.is_listen = "1";
    });
}

// 主讲人
if (/author\/author-show/i.test(Pathname)) {
    body.data?.contents?.forEach((item) => {
        item.vip_type = "lixiangjia_trial";
    });
}

// 文章列表
if (/content\/article_list/i.test(Pathname)) {
    body.data?.article_list?.forEach((item) => {
        item.vip_type = "lixiangjia_trial";
    });
}

// 文章详情
if (/content\/content-show\/\d+/i.test(Pathname)) {
    body.data.is_purchased = "1";
}

$done({ body: jsonStr(body) });

function jsonParse(json, defaultValue) {
    try {
        return JSON.parse(`${json}`);
    } catch {
        return defaultValue || json;
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
