const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    loadModal:true,
    showModal:false
  },
  closeModal:function() {
    wx.switchTab({
      url: "/pages/index/index",
     })
    // wx.navigateBack({
    //   delta:1,
    //   complete: (res) => {},
    // })
  },
  getuserinfo:function (e) {
    const _this=this
    this.setData({
      loadModal: true,
      showModal:false
    }) 
    wx.cloud.callFunction({
      name: "getUserInfo",
      data:{
        cloudID: e.detail.cloudID
      },
      success: res => {
        _this.setData({
          loadModal: false
        }) 
        app.globalData.user.userInfo=res.result.data
        console.log(res)
      }
    })
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
    let showModal=false
    if(!app.globalData.user.userInfo){ //如果没有用户信息 则请求授权登录
      showModal=true
    }
    if(!app.globalData.user.card){
      this.setData({loadModal:false})
    }
    this.setData({user:app.globalData.user,showModal})
    if(!this.data.user.cardShare){
      wx.hideShareMenu()
    }else{
      wx.showShareMenu({
        complete: (res) => {},
      })
    }
    // console.log(this.data.user)
  },
  cardLoad:function(){
    this.setData({loadModal:false})
  },
  makeCard:function(){
    const _this=this
    if(!this.data.user.photo){
      this.errorMsg('请先完善个人资料！')
    }else{
      wx.navigateTo({url:'makeCard/index'})
    }
  },
  caseManage:function(){
    wx.navigateTo({url:'caseManage/index'})
  },
  mCollection:function(){
    this.errorMsg('功能研发中，敬请期待')
  },
  infoSet:function(){
    wx.navigateTo({url:'info/index'})
  },
  advise:function(){
    wx.navigateTo({url:'advise/index'})
  },
  errorMsg:function(msg){
    wx.showToast({
      title:msg,
      icon:'none',
      duration: 2000
  });
  },
  saveImage:function(){
    wx.showLoading({
      title: '请稍后...',
    })
    wx.cloud.downloadFile({
      fileID: app.globalData.user.card,
      success: res => {
        // get temp file path
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath:res.tempFilePath,
          success(res) { 
            wx.hideLoading({
              complete: (res) => {
                wx.showToast({
                  title: '图片保存成功！',
                })
              },
            })
          },
          fail(e){
            wx.showToast({
              title:'取消保存',
              icon:'none',
              duration: 2000
          });
          }
        })
      },
      fail: err => {
        // handle error
      }
    })
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
  qrCode:function(){
    if(this.data.user.photo){
      wx.navigateTo({url:'qrImage/index'})
    }else{
      this.errorMsg('请先完善个人资料')
    }
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      return {
        title:'',
        path:'/pages/worker/index?id='+this.data.user._id,
        imageUrl:this.data.user.cardShare,
        success(e){
          wx.showShareMenu({
            widthShareTicke:true,
            complete: (res) => {},
          })
        },
        fail(e){

        },
        complete(){

        }
      }
  }
})