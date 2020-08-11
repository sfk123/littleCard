const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {id:1,name:'谏言列表'},
      {id:2,name:'我的谏言'},
    ],
    tabIndex:0,
    loadModal:true,
    adviseList:[],
    page:1,
    haseMore:true,
    inputModal:false,//评论弹框是否显示
    commentValue:''//评论内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
  },
  tabSelect:function(e) {
    this.setData({tabIndex:e.currentTarget.dataset.index,page:1,loadModal:true,adviseList:[]})
    this.loadData()
  },
  loadData:function(loadMore) {
    const _this=this
    const data={
      page:_this.data.page
    }
    if(this.data.tabIndex==1){
      data.my=true
    }
    wx.cloud.callFunction({
      // 云函数名称
      name: 'adviseList',
      // 传给云函数的参数
      data,
    }).then(res => {
      console.log(res.result.data)
      res.result.data.forEach(advise=>{
        console.log(advise)
        advise.createTime=_this.formatTime(advise.createTime)
      })
      if(loadMore){ //加载更多
        const adviseList=_this.data.adviseList
        adviseList.concat(res.result.data)
        _this.setData({adviseList,haseMore:res.result.hasMore})
      }else{
        _this.setData({adviseList:res.result.data,haseMore:res.result.hasMore})
      }
      _this.setData({loadModal:false})
    })
  },
  addAdvise:function() {
    wx.navigateTo({url:'add/index'})
  },
  formatTime:function(time){
    console.log(time)
    const timeStr=time.replace("T"," ")
    return timeStr.substr(0,timeStr.indexOf("."))
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
    const query = wx.createSelectorQuery();
    const _this = this;
    query.select('.scroll-container').boundingClientRect(function (rect) {
            _this.setData({scrollHeight:rect.height})
      }).exec();
  },
  showComment:function(e){ //显示评论输入框
    this.setData({inputModal:true,currentAdviseId:e.currentTarget.dataset.id})
  },
  hideModal:function(){//关闭评论输入框
    this.setData({inputModal:false})
  },
  commentInput:function(event){
    this.setData({commentValue:event.detail.value})
  },
  comment:function(){ //提交评论
    const _this=this
    if(this.data.commentValue.trim()===''){
      wx.showToast({
          title:'请输入评论内容',
          icon:'none',
          duration: 2000
      });
    }else{
      this.setData({loadModal:true})
      wx.cloud.callFunction({
        // 云函数名称
        name: 'addComment',
        // 传给云函数的参数
        data: {
          id:_this.data.currentAdviseId,
          comment:_this.data.commentValue,
          userInfo:app.globalData.user.userInfo
        },
      }).then(res => {
        const adviseList=_this.data.adviseList
        adviseList.forEach(advise=>{
          if(advise._id===_this.data.currentAdviseId){
            advise.comments=res.result.data
          }
        })
        _this.setData({loadModal:false,inputModal:false})
        console.log(res.result.data)
        if(res.result.statusCode==200){
          _this.setData({adviseList})
          wx.showToast({
            title: '评论成功！',
          })
        }
      })
    }
  },
  clickHeart:function(e){
    const _this=this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'commentHeart',
      // 传给云函数的参数
      data: {
        id:e.currentTarget.dataset.id
      },
    }).then(res => {
      console.log(res.result)
      if(res.result===1||res.result===0){
        const adviseList=_this.data.adviseList
        adviseList.forEach(advise=>{
          if(advise._id===e.currentTarget.dataset.id){
            if(res.result===1){
              advise.heart=true
            }else if(res.result===0){
              advise.heart=false
            }
          }
        })
        _this.setData({adviseList})
      }else{
        wx.showToast({
            title:'系统错误，请稍后重试',
            icon:'none',
            duration: 2000
        });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})