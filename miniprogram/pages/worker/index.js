const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    loadModal:true,
    page:1,
    listData:[],
    dataRow:[],
    isCustom:false,
    isBack:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('参数：'+JSON.stringify(options))
    if(options.scene){ //扫二维码进来的
      options.id=options.scene
    }
    const _this=this
    if(options.id){
      this.setData({loadModal:true,isCustom:true,isBack:false})
      wx.cloud.callFunction({
        // 云函数名称
        name: 'worker',
        data:{action:"getById",id:options.id}
      }).then(res => {
        console.log(res.result)
        _this.setData({worker:res.result,title:res.result.name+'的主页'})
        _this.getCaseList(res.result._openid)
      })
    }else{
      wx.getStorage({
        key: 'currentWorker',
        success (res) {
          console.log(res.data)
          const workerID=res.data._id
          _this.setData({worker:res.data,title:res.data.name+'的主页'})
          _this.getCaseList(res.data._openid)
          // if(res.data._openid!=app.globalData.user._openid){ //查看自己的案例不算浏览量
            wx.getStorage({
              key: 'viewHistory',
              success (res) {
                const viewData=res.data
                console.log(viewData)
                const list=viewData.workerList
                console.log(list)
                if(!list.some((i,v)=>i==workerID)){ //增加访问量
                  wx.cloud.callFunction({
                    // 云函数名称
                    name: 'workerView',
                    // 传给云函数的参数
                    data: {
                      id: workerID
                    },
                  }).then(res => {
                    if(res.result.statusCode==200){
                      console.log("新增访问量成功")
                      viewData.workerList.push(workerID)
                      wx.setStorage({
                        key:"viewHistory",
                        data:viewData
                      })
                    }
                    
                  })
                }else{
                  console.log('该工匠今天已经访问过了')
                }
              },
              fail:function(){
                console.error('没获取到viewHistory缓存')
              }
            })
          // } 
        }
      })
    }
  },
  getCaseList:function(openid,load_more){ //获取方案列表
    const _this = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'caseList',
      data:{page:this.data.page,openid}
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
  makePhoneCall:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.worker.phone
    })
  },
  clipboard:function(){
    wx.setClipboardData({
      data: this.data.worker.wx,
      success (res) {
        wx.showToast({
          title:'已复制成功！'
      });
      }
    })
  },
  openDetail:function(e){
    const id=e.currentTarget.dataset.id
    this.data.listData.forEach(item=>{
      if(item._id===id){
        console.log(item)
        wx.setStorage({
          key:"currentCase",
          data:item
        })
        wx.navigateTo({url:'../case/index'})
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