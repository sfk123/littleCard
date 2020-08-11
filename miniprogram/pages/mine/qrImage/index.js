const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.user.qrImg){
      this.setData({src:app.globalData.user.qrImg})
    }else{
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name:'worker',
        data:{id:app.globalData.user._id,action:'createQR'}
      }).then(res=>{
        app.globalData.user.qrImg=res.result.data
        this.setData({src:res.result.data})
        wx.hideLoading({
          complete: (res) => {},
        })
        console.log(res.result)
      })
    }
  },
  checkAuth:function(){
    const _this=this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success () {
              console.log('授权成功')
              _this.saveImage()
            }
          })
        }else{
          console.log('已经授权')
          _this.saveImage()
        }
      }
    })
  },
  saveImage:function(){
    wx.showLoading({
      title: '请稍后...',
    })
    wx.cloud.downloadFile({
      fileID: app.globalData.user.qrImg,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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