const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    }, 
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
    selectCity: {
      type: [Boolean, String],
      default: false
    },
    customBack:{
      type: [Boolean, String],
      default: false
    },
    mBar:{
      type: [Boolean, String],
      default: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    city:app.globalData.city
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      if(!this.data.customBack){
        wx.navigateBack({
          delta: 1
        });
      }else{
        this.triggerEvent("customBack", {})
      }
      
    },
    toHome(){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    cityClick(){
      this.triggerEvent("select", {})
    },
    refreshCity(){
      this.setData({city:app.globalData.city})
    }
  }
})