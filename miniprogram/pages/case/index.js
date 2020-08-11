const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this=this
    wx.getStorage({
      key: 'currentCase',
      success (res) {
        console.log(res)
        const caseID=res.data._id
        _this.setData({case:res.data,title:res.data.name})
        if(res.data.openid!=app.globalData.user._openid){ //查看自己的案例不算浏览量
          wx.getStorage({
            key: 'viewHistory',
            success (res) {
              const viewData=res.data
              const list=viewData.list
              if(!list.some((i,v)=>i==caseID)){ //增加访问量
                wx.cloud.callFunction({
                  // 云函数名称
                  name: 'caseView',
                  // 传给云函数的参数
                  data: {
                    id: caseID
                  },
                }).then(res => {
                  if(res.result.statusCode==200){
                    console.log("新增访问量成功")
                    viewData.list.push(caseID)
                    wx.setStorage({
                      key:"viewHistory",
                      data:viewData
                    })
                  }
                  
                })
              }else{
                console.log('该方案今天已经访问过了')
              }
            },
            fail:function(){
              console.error('没获取到viewHistory缓存')
            }
          })
        }

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