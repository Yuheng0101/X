## 干毛的?
一个switch游戏打折监控脚本
## 食用方法
  * 打开重写规则脚本(eshop.conf)
  * 进入官网点击<span style="color:#87CEFA;">游戏详情页面</span>关注该游戏
  * 关闭脚本
  * 运行Task脚本(eshop.js)
## 配置 (QuanX)

```properties

[rewrite_remote]
https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/eshop/eshop.js, update-interval=172800, opt-parser=true, enabled=true

[task_local]
30 7 * * * https://raw.githubusercontent.com/Yuheng0101/X/main/Tasks/eshop/eshop.js, tag=eshop打折监控, enabled=true

```
## 友情提示
  * 通知记录完游戏记得要关闭重写脚本, 避免每次打开游戏详情页面都会添加到关注列表
  * 重复游戏不会添加关注
  * 当天没有折扣的游戏不会通知
  * 有折扣的游戏会通知, 点击查看该游戏折扣相关详细信息
  * 脚本中自带清理游戏列表功能, isClear设置为true, 运行一次脚本即可
## 网站
<a href="https://eshop-prices.com/" target="_blank">https://eshop-prices.com/</a>