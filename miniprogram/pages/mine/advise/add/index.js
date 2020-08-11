const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadModal:false,
    advise:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  textareaAInput:function (e) {
    this.setData({
      advise: e.detail.value
    }) 
  },
  submit:function () {
    if(this.data.advise.trim()===''){
      wx.showToast({
          title:'请输入您的意见或建议',
          icon:'none',
          duration: 2000
      });
    }else{
      const _this=this
      this.setData({
        loadModal: true
      }) 
      wx.cloud.callFunction({
        name: "addAdvise",
        data:{
          text: this.data.advise.trim(),
          userInfo:app.globalData.user.userInfo
        },
        success: res => {
          _this.setData({
            loadModal: false
          })
          if(res.result.statusCode==200){
            wx.showToast({
              title: '发表成功，感谢参与！',
              duration: 2000
            })
            setTimeout(function(){
              wx.navigateBack({
                delta:1,
                complete: (res) => {},
              })
            },2000)
          }
          console.log(res)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})