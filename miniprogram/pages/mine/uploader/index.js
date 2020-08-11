import WeCropper from '../../../components/we-cropper/we-cropper.min.js'

const app = getApp()
const config = app.globalData.config

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper',
      targetId: 'targetCropper',
      pixelRatio: device.pixelRatio,
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      },
      boundStyle: {
        color: 'red',
        mask: 'rgba(0,0,0,0.8)',
        lineWidth: 1
      }
    }
  },
  touchStart (e) {
    this.cropper.touchStart(e)
  },
  touchMove (e) {
    this.cropper.touchMove(e)
  },
  touchEnd (e) {
    this.cropper.touchEnd(e)
  },
  getCropperImage () {
    const _this=this
    this.cropper.getCropperImage(function (path, err) {
      if (err) {
        wx.showModal({
          title: '温馨提示',
          content: err.message
        })
      } else {
        _this.uploadFile(path)
        // wx.previewImage({
        //   current: '', // 当前显示图片的 http 链接
        //   urls: [path] // 需要预览的图片 http 链接列表
        // })
      }
    })
  },
  uploadFile:function(path){
    console.log(path)
    const uploadPath='temp/'+app.globalData.user._openid+path.substr(path.lastIndexOf("."))
    console.log(uploadPath)
    wx.showLoading({title: '上传中...'})
    wx.cloud.uploadFile({
      cloudPath: uploadPath,
      filePath: path, // 文件路径
      success: res => {
        // get resource ID
        wx.hideLoading({
          complete: (res) => {},
        })
        console.log(res.fileID)
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        const imgList=[]
        imgList.push(res.fileID)
        prevPage.setData({imgList})//设置数据
        wx.navigateBack({
          delta: 1
        });
      },
      fail: err => {
        // handle error
        console.error(err)
      }
    })
  },
  uploadTap () {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.cropper.pushOrign(src)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { cropperOpt } = this.data

    cropperOpt.boundStyle.color = 'black'

    this.setData({ cropperOpt })

    if (options.src) {
      cropperOpt.src = options.src
      this.cropper = new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context:`, ctx)
          // wx.showToast({
          //   title: '上传中',
          //   icon: 'loading',
          //   duration: 20000
          // })
        })
        .on('imageLoad', (ctx) => {
          console.log(`picture loaded`)
          console.log(`current canvas context:`, ctx)
          // wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          console.log(`before canvas draw,i can do something`)
          console.log(`current canvas context:`, ctx)
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
    if(!this.data.inited){
      const query = wx.createSelectorQuery();
      const _this = this;
      query.select('.padding-xl').boundingClientRect(function (rect) {
              const cropperOpt = _this.data.cropperOpt
              cropperOpt.height-=rect.height
              _this.setData({cropperOpt,inited:true})
        }).exec();
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