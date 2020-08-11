const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataRow:[],//数据行数
    workerList: [],
    TabCur: 0,
    scrollLeft:0,
    workerTypes:[],
    loadModal:true,//是否显示加载框
    page:1,
    showModal:false,
    workListLoading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this=this
    qqmapsdk = new QQMapWX({
      key: 'UIQBZ-KHLRX-GNC4N-72YQM-ADA7S-6HFBJ'
    });
    wx.getLocation({
      type: 'gcj02',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        console.log('latitude:'+latitude)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude,
            longitude
          },
          success: function(res) {
            console.log(res)
            app.globalData.province=res.result.ad_info.province
            app.globalData.city=res.result.ad_info.city
            app.globalData.location=res.result.ad_info
            if(app.globalData.user&&!_this.data.workListLoading){
              _this.setData({
                loadModal: false
              })
            }
          }
        })
      }
     })
    //当日案例浏览记录
    wx.getStorage({
      key: 'viewHistory',
      success (res) {
        const date1=res.data.date.substr(0,res.data.date.indexOf('T'))
        const date2=new Date()
        const month = (date2.getMonth() + 1).toString().padStart(2, '0');
        const strDate = date2.getDate().toString().padStart(2, '0');
        const dateStr=date2.getFullYear()+'-'+month+'-'+strDate
        if(date1!=dateStr){ //当日数据
          console.log("不是当日数据，清空缓存")
          wx.setStorage({
            key:"viewHistory",
            data:{date:new Date(),list:[],workerList:[]}
          })
        }
      },
      fail:function(){
        wx.setStorage({
          key:"viewHistory",
          data:{date:new Date(),list:[],workerList:[]}
        })
      }
    })
  },
  selectCity:function(){
    wx.navigateTo({url:'../citySelect/index'})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const _this=this
    if(!this.data.loadModal){
      this.setData({
        loadModal: true
      })
    }
    wx.cloud.callFunction({
      // 云函数名称
      name: 'homeData',
      // 传给云函数的参数
      data: {
        a: 1,
        b: 2,
      },
    }).then(res => {
        console.log("云函数homeData返回：")
        console.log(res)
        wx.setStorage({
          key:"workerTypes",
          data:res.result.workerTypes
        })
        app.globalData.user=res.result.userInfo
        if(app.globalData.user.workerType){
          res.result.workerTypes.forEach(wt=>{
            if(wt._id==app.globalData.user.workerType){
              app.globalData.user.workerTypeName=wt.name
              console.log("wt.name:"+wt.name)
            }
          })
        }

        _this.setData({workerTypes:res.result.workerTypes,loadModal:false})
        if(app.globalData.province){
          _this.setData({loadModal:false})
        }
        _this.getWorkerList()
      }).catch(error=>{
        console.error(error)
        _this.setData({
          loadModal: false
        })
      })
  },
  getWorkerList:function(loadMore){ //获取工匠列表
    const _this=this
    this.setData({loadModal:true,workListLoading:true})
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getWorkerList',
      // 传给云函数的参数
      data: {
        wType: _this.data.workerTypes[_this.data.TabCur]._id,
        page:_this.data.page
      },
    }).then(res => {
      wx.stopPullDownRefresh();
      console.log(res)
      let workerList,dataRow
      if(loadMore){//加载更多
        workerList=_this.data.workerList
        workerList=workerList.concat(res.result.data)
        const rowCount=Math.ceil(workerList.length/2)
        dataRow=[]
        for(let i=0;i<rowCount;i++){
          dataRow.push(i)
        }
      }else{
        workerList=res.result.data
        // if(workerList.length>0){
        //   workerList.push({...workerList[0]})
        //   workerList.push({...workerList[0]})
        // }
        const rowCount=Math.ceil(workerList.length/2)
        dataRow=[]
        for(let i=0;i<rowCount;i++){
          dataRow.push(i)
        }
      }
      _this.setData({
        workerList,dataRow,workListLoading:false
      })
      if(app.globalData.province){
        _this.setData({loadModal: false})
      }
    }).catch(error=>{
      console.error(error)
      _this.setData({
        loadModal: false
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("当前城市："+app.globalData.city)
    this.selectComponent("#m-navbar").refreshCity()
  },
  tabSelect:function(e){
    this.setData({TabCur:e.currentTarget.dataset.id,page:1})
    this.getWorkerList()
  },
  workerDetail:function(e){
    const index=e.currentTarget.dataset.index
    console.log("index:"+index)
    wx.setStorage({
      key:"currentWorker",
      data:this.data.workerList[index]
    })
    wx.navigateTo({url:'../worker/index'})
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
    console.log('下拉刷新')
    this.setData({page:1})
    this.getWorkerList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('加载更多')
    let page=this.data.page+1
    this.setData({page})
    this.getWorkerList(true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})