const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadModal:false,
    list:[],
    provinces:[],
    currentProvince:undefined,
    currentLocation:undefined,
    level:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this=this
    this.setData({currentLocation:app.globalData.location})
    console.log(app.globalData.location)
    wx.getStorage({
      key: 'region',
      success (res) {
        console.log(res.data)
        _this.setData({
          list: res.data[0],
          provinces:res.data[0],
          cities:res.data[1],
        })
      },fail(e){
        _this.loadCityData()
      }
    })
    
  },
  loadCityData:function(){
    const _this=this
    this.setData({
      loadModal: true
    })
    qqmapsdk = new QQMapWX({
      key: 'UIQBZ-KHLRX-GNC4N-72YQM-ADA7S-6HFBJ'
    });
    qqmapsdk.getCityList({
      success: function(res) {//成功后的回调
        console.log(res)
        wx.setStorage({
          key:"region",
          data:res.result
        })
        _this.setData({
          list: res.result[0],
          provinces:res.result[0],
          cities:res.result[1],
        })
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        _this.setData({
          loadModal: false
        })
      }
    })
  },
  getChildren(e){
    const _this=this
    if(this.data.level==0){
      const id=parseInt(Number(e.currentTarget.dataset.id)/10000)
      const list=[]
      const cities=this.data.cities
      const provinces=this.data.provinces
      provinces.forEach(province=>{
        if(province.id===e.currentTarget.dataset.id){
          _this.setData({
            currentProvince:province
          })
        }
      })
      for(let i=0;i<cities.length;i++){
        let city=cities[i]
        const p_id=parseInt(Number(city.id)/10000)
        if(p_id===id){
          list.push(city)
        }
      }
      this.setData({list,level:1})
    }else{
      const cities=this.data.list
      cities.forEach(city=>{
        if(city.id===e.currentTarget.dataset.id){
          app.globalData.city=city.fullname
          app.globalData.province=_this.data.currentProvince.name
          wx.navigateBack({
            delta: 1
          });
        }
      })
    }
  },
  pageBack:function(){
    const _this=this
    if(this.data.level==0){
      wx.navigateBack({
        delta: 1
      });
    }else{
      wx.getStorage({
        key: 'region',
        success (res) {
          console.log(res.data)
          _this.setData({
            list: res.data[0],
            provinces:res.data[0],
            cities:res.data[1],
            level:0
          })
        },fail(e){
          _this.loadCityData()
        }
      })
    }
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