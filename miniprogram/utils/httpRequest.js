function requestAjax(url, postData,method, success, fail) {
  const requestHeader={}
  wx.request({
  //可以写上请求的域名  后期改测试服正式服 改一个地方就可以 前缀写上后期上线改地址好改
    url: url,
    // url='/index/video'
    data: postData,
    header: requestHeader,
    method,//方法
    success,
    fail,
    complete: function (res) {

    },
  })
}
module.exports = {
  requestAjax
}