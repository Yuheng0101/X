/******************************************
 * @name 𝐋𝐨𝐜𝐤𝐞𝐝𝐓𝐫𝐞𝐚𝐬𝐮𝐫𝐞𝐬 𝐊𝐞𝐞𝐩𝐞𝐫
 * @description 全局净化、解锁VIP权限、解锁头等舱
 * @channel https://t.me/yqc_123
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
hostname = jk.*.com, jk.*.cn

# 开屏/弹窗广告通杀
^https?://jk\.(.+)\.c(n|om)\/api\/operation\/ads url reject
^https?://jk\.(.+)\.c(n|om)\/api\/mailbox\/local_msg url reject
^https?://jk\.(.+)\.c(n|om)\/api\/version url reject
^https?://jk\.(.+)\.c(n|om)\/api\/operation\/applist url reject
^https?://jk\.(.+)\.c(n|om)\/api\/rich_new\/index url reject
^https?://jk\.(.+)\.c(n|om)\/api\/app\? url reject
# 初始化/解锁/去广告/优化
^https?:\/\/jk\.(.+)\.c(n|om)\/api\/(account\/init|bootstrap|tags\/navicate|user\/read|monographic\/list|v1\/homeIndex|content\/(getNav|index)|video\/(details|playNew\/\d+)) url script-response-body https://raw.githubusercontent.com/Yuheng0101/X/main/Scripts/LockedTreasuresKeeper.js
******************************************/