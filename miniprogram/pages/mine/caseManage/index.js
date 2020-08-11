// miniprogram/pages/mine/caseManage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight:300,
    loadModal:true,
    page:1,
    listData:[],
    dataRow:[]
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
    const query = wx.createSelectorQuery();
    const _this = this;
    query.select('.scroll-container').boundingClientRect(function (rect) {
            const width=rect.width*0.43
            _this.setData({scrollHeight:rect.height,imgWidth:width})
      }).exec();
    let reloadData=false;
    try{
      reloadData=wx.getStorageSync('reloadCases')
    }catch(e){

    }
    if(this.data.listData.length==0||reloadData){
      this.setData({page:1,loadModal:true})
      this.loadData()
      try {
        wx.removeStorageSync('reloadCases')
      } catch (e) {
        // Do something when catch error
      }
    }

  },
  loadData:function(load_more){
    const _this = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'caseListManage',
      data:{page:this.data.page}
    }).then(res => {
      console.log(res)
      let dataRow=[],listData=[]
      if(load_more){ //加载更多
        listData=_this.data.listData
      }else{
        listData=res.result.data
        const rowCount=Math.ceil(listData.length/2)
        dataRow=[]
        for(let i=0;i<rowCount;i++){
          dataRow.push(i)
        }
      }
      console.log(listData)
      _this.setData({loadModal:false,listData,hasMore:res.result.hasMore,dataRow})
      
    }).catch(error=>{
      console.error(error)
      _this.setData({loadModal:false})
    })
  },
  addCase:function(){
    try {
      wx.removeStorageSync('currentCase')
    } catch (e) {
      // Do something when catch error
    }
    wx.navigateTo({url:'add/index'})
  },
  viewCase:function(e){
    const id=e.currentTarget.dataset.id
    this.data.listData.forEach(item=>{
      if(item._id===id){
        wx.setStorage({
          key:"currentCase",
          data:item
        })
        wx.navigateTo({url:'../../case/index'})
      }
    })
  },
  editCase:function(e){
    const id=e.currentTarget.dataset.id
    this.data.listData.forEach(item=>{
      if(item._id===id){
        wx.setStorage({
          key:"currentCase",
          data:item
        })
        wx.navigateTo({url:'add/index'})
      }
    })
  },
  deleteCase:function(e){
    const id=e.currentTarget.dataset.id
    const _this=this
    wx.showModal({
      title: '系统提示',
      content: '案例删除后无法恢复，确认删除？',
      success(res) {
        if (res.confirm) {
　　　　　　_this.deleteAction(id)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  deleteAction:function(id){
    const _this=this
    this.setData({loadModal:true})
    wx.cloud.callFunction({
      // 云函数名称
      name: 'deleteCase',
      data:{id}
    }).then(res => {
      console.log(res)
      _this.setData({loadModal:false})
      if(res.result.statusCode==200){
        wx.showToast({
          title: '删除成功！',
        })
        _this.setData({page:1})
        _this.loadData()
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