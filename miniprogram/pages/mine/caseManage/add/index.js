const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'新增案例',
    scrollHeight:300,
    regionValue:[],
    imgList:[],
    formData:{},
    loadModal:false,
    loadText:'请稍后...'
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
        _this.setData({formData:res.data,title:'编辑案例',regionValue:res.data.region.value,imgList:res.data.images})
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
    const query = wx.createSelectorQuery();
    const _this = this;
    query.select('.scroll-container').boundingClientRect(function (rect) {
            _this.setData({scrollHeight:rect.height})
      }).exec();
  },
  bindInput:function(e){
    const formData=this.data.formData
    formData[e.currentTarget.dataset.type]=e.detail.value
    this.setData({
      formData
    })
  },
  RegionChange:function(e){
    console.log(e)
    const formData=this.data.formData
    formData.region=e.detail
    this.setData({regionValue:e.detail.value,formData})
  },
  ChooseImage:function(){
    const _this=this
    wx.chooseImage({
      count:10,
      sourceType:['album', 'camera'],
      complete: (res) => {
        console.log(res)
        if(res.tempFilePaths.length>0){
          wx.showLoading({title: '上传中...'})
          _this.uploadFile(0,res.tempFilePaths)
        }
        
      },
    })
  },
  uploadFile:function(index,paths){
    const imgList=this.data.imgList
    const _this=this
    console.log('-------上传图片--------')
    // for(let i=0;i<paths.length;i++){
      const uploadPath='temp/case/'+app.globalData.user._openid+'_'+(index+1)+paths[index].substr(paths[index].lastIndexOf("."))
      wx.cloud.uploadFile({
        cloudPath: uploadPath,
        filePath: paths[index], // 文件路径
        success: res => {
          console.log(res.fileID)
          imgList.push(res.fileID)
          _this.setData({imgList})
          if((index+1)==paths.length){
            wx.hideLoading({
              complete: (res) => {
                console.log('------图片上传完成--------')
              },
            })
          }else{
            _this.uploadFile(index+1,paths)
          }
        },
        fail: err => {
          // handle error
          console.error(err)
        }
      })
    // }

  },
  DelImg:function(e){
    const index=e.currentTarget.dataset.index
    const imgList=this.data.imgList
    imgList.splice(index,1)
    this.setData({imgList})
  },
  addCase:function(){
    if(!this.data.formData.name){
      this.errorMsg('请输入项目名称！')
    }else if(!this.data.formData.area){
      this.errorMsg('请输入项目面积！')
    }else if(!this.data.formData.time){
      this.errorMsg('请输入项目周期！')
    }else if(!this.data.formData.region){
      this.errorMsg('请选择所在地区！')
    }else if(this.data.imgList.length==0){
      this.errorMsg('请上传项目图片！')
    }else{
      this.setData({loadModal:true})
      const _this=this
      const images=[]
      this.data.imgList.forEach(img=>{
        if(!img.startsWith("cloud://")){
          const image={}
          image.photo=wx.getFileSystemManager().readFileSync(img,'base64');
          image.fileType=img.substr(img.lastIndexOf("."))
          images.push(image)
        }else{
          images.push(img)
        }
      })
      const formData=this.data.formData
      formData.images= images
      wx.cloud.callFunction({
        name:'saveCase',
        data:formData
      }).then(res=>{
        const {result}=res;
        console.log(result)
        _this.setData({loadModal:false})
        if(result.statusCode==200){
          wx.setStorage({
            key:"reloadCases",
            data:true
          })
          wx.showToast({
              title:'保存成功！',
              duration: 2000
          });
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            });
          }, 2000);
        }
      }).catch(error=>{
        console.error(error)
        _this.setData({loadModal:false})
        _this.errorMsg('系统错误，请稍后重试')
      })
    }
  },  
  errorMsg:function(msg){
    wx.showToast({
        title:msg,
        icon:'none',
        duration: 2000
    });
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