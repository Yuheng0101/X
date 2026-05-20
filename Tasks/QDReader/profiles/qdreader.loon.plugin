#!name=起点读书签到
#!desc=支持多账号对于"起点读书App"的签到功能，默认仅签到，其他任务需手动开启开关。
#!icon=https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/97/40/5e/97405e49-87bb-3f0a-bf3a-91cf8fdf99a0/AppIcon-0-0-1x_U007epad-0-1-0-0-sRGB-GLES2_U002c0-85-220.png/144x144.png
#!arguments-desc=- 是否开启抓取重写: ["起点读书","#"] \n\n- CRONEXP: 默认每天2点11分执行, 建议自行配置。\n\n- 是否开启调试模式: ["true","false"]\n\n - TIMEOUT: 脚本执行超时时间, 默认60秒。\n\n- 激励任务: ["true","false"]\n\n- 每日任务: ["true","false"]\n\n- 每日抽奖: ["true","false"]\n\n- 每周兑换: ["true","false"]\n\n- 章节卡片: ["true","false"]\n\n- 大咖荐书: ["true","false"]

[Argument]
CAPTURE_ENABLE=switch,"true","false",tag=是否开启抓取重写, desc=是否开启抓取重写
CRONEXP=input,"11 2 * * *",tag=CRONEXP, desc=默认每天2点11分执行, 建议自行配置。
QDREADER_DEBUG=switch,"false","true",tag=是否开启调试模式, desc=是否开启调试模式
TIMEOUT=input,60,tag=脚本执行超时时间, 默认60秒, desc=TIMEOUT
QDREADER_ADV_JOB_ENABLE=switch,"false","true",tag=激励任务, desc=开启后执行激励碎片任务
QDREADER_EXTRA_ADV_JOB_ENABLE=switch,"false","true",tag=每日任务, desc=开启后执行每日广告任务
QDREADER_LOTTERY_ENABLE=switch,"false","true",tag=每日抽奖, desc=开启后执行每日抽奖
QDREADER_WEEKLY_EXCHANGE_ENABLE=switch,"false","true",tag=每周兑换, desc=开启后周日自动兑换章节卡
QDREADER_CHAPTER_CARD_ENABLE=switch,"false","true",tag=章节卡片, desc=开启后查询章节卡信息
QDREADER_MESSAGE_BOX_ENABLE=switch,"false","true",tag=大咖荐书, desc=开启后处理大咖荐书消息

[Script]
http-response ^https?:\/\/h5\.if\.qidian\.com\/argus\/api\/v1\/user\/getlogininfo script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/QDReader/qdreader.js, requires-body=1, tag=起点读书获取Cookie, enable={CAPTURE_ENABLE}, argument=[{QDREADER_DEBUG}]

cron {CRONEXP} script-path=https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/QDReader/qdreader.js, timeout={TIMEOUT}, tag=起点读书自动签到, argument=[{QDREADER_DEBUG},{QDREADER_ADV_JOB_ENABLE},{QDREADER_EXTRA_ADV_JOB_ENABLE},{QDREADER_LOTTERY_ENABLE},{QDREADER_WEEKLY_EXCHANGE_ENABLE},{QDREADER_CHAPTER_CARD_ENABLE},{QDREADER_MESSAGE_BOX_ENABLE}]

[MITM]
hostname = h5.if.qidian.com

