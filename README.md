# 市井工匠 小程序名片程序

关于本小程序的名称，本人经过很久思考 仍然没有想到合适的名字，烦请路过的大神有兴趣的话  赐名一个，感激不尽！

本程序旨在打造基于微信生态的名片分享传播工具，可承载各行业的精英人士，只要有能力有技术的都可以使用本套程序快速做出一张利于传播的网络名片

该系统由本人业余时间制作而成，并承诺终生免费试用，由于个人能力有限，现开源出来，希望大家贡献力量，共同打造一套完美且免费的名片系统

接下来想修改下界面风格 可以适配不同行业人士，比如咱们程序员行业等。。。

## 主要功能
  1、城市切换功能 便于有需要的人士定向找到合适的人  
  2、行业或工种选择  
  3、名片列表  
  4、工匠主页（暂且叫工匠吧）  
  5、案例主页  
  6、个人中心  
  7、转发名片  
  8、保存名片图片到本地  
  9、生成或下载自己的名片二维码  
  10、个人资料设置，更新资料后 名片信息自动变化  
  11、案例管理  
  12、意见与建议  

## 感谢 [weilanwl](https://github.com/weilanwl) 的开源 [ColorUI](https://github.com/weilanwl/ColorUI) 项目提供前端页面及框架支持

## 界面预览
<img src="http://test-image.meiyuan.tech/git-image1.jpg" alt="城市选择页面" style="max-width:100%;" width="500">
<img src="http://test-image.meiyuan.tech/git-image2.jpg" alt="首页" style="max-width:100%;" width="500">
<img src="http://test-image.meiyuan.tech/git-image3.png" alt="名片主页" style="max-width:100%;" width="500">
<img src="http://test-image.meiyuan.tech/git-image4.jpg" alt="案例展示页面" style="max-width:100%;" width="500">
<img src="http://test-image.meiyuan.tech/git-image5.png" alt="个人中心" style="max-width:100%;" width="500">
<img src="http://test-image.meiyuan.tech/git-image6.png" alt="资料编辑页面" style="max-width:100%;" width="500">
<img src="http://test-image.meiyuan.tech/git-image7.jpg" alt="案例管理页面" style="max-width:100%;" width="500">
<img src="http://test-image.meiyuan.tech/git-image8.jpg" alt="案例编辑页面" style="max-width:100%;" width="500">
<img src="http://test-image.meiyuan.tech/git-image9.jpg" alt="案例编辑页面" style="max-width:100%;" width="500">

### 扫码体验
<p align="center"><img src="http://test-image.meiyuan.tech/git-imageqr_code.jpg" alt="扫码体验" style="max-width:100%;" width="300"></p>

## 技术架构

# 本程序采用微信小程序原生开发 + 小程序云函数开发
# 整个应用无需域名及服务器，全在小程序开发平台完成
# 应热心网友要求，加上数据库结构（记得是云开发哦，也是用的云数据库,类似MongoDB的非关系型数据库），
# 一共分四张表：
# advise（留言建议表）；
# {
#   "_id", //主键
#   "comments",//评论列表  数组格式，可对评论内容再次评论
#   "createTime",//创建时间
#   "enable",  //是否显示
#   "hearts",  //点赞用户集合 数组格式
#   "text",    //评论内容
#   "userInfo", //评论者用户信息快照
# }
# cases(案例表)；
# {
#   "_id",        //主键
#   "address",    //案例地址
#   "area",       //案例面积数
#   "createTime", //创建时间
#   "fee",        //案例总价
#   "images",     //案例图片集合，数组格式
#   "name",       //案例名称
#   "openid",     //案例所属用户openID
#   "region",     //案例所在省市区
#   "time",       //案例从开始到竣工 耗时时长
#   "updateTime", //最后更新时间
#   "view"        //展示次数
# }
# m_users(用户信息表)
# {
#   "_id",         //主键
#   "_openid",     //用户openid
#   "card",        //个人名片图片地址
#   "cardShare",   //个人名片 分享专用图片地址
#   "company",     //用户所属公司
#   "name",        //用户姓名
#   "phone",       //手机号
#   "photo",       //头像图片地址
#   "qrImg",       //二维码图片地址
#   "region",      //用户做在省市区数据
#   "userInfo",    //用户微信获取到的信息
#   "view",        //用户被浏览次数
#   "workerAge",   //用户工作年限
#   "workerType",  //用户所属工种id
#   "workerTypeName", //用户所属工种名称
#   "wx",          //用户微信号
# }
# worker_type(工种信息表)
# {
#   "_id",          //主键
#   "name"          //工种名称
# }

## 小程序云开发参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

