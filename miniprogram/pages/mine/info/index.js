const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    workerTypes: [],
    workerIndex:-1,
    imgList:[],
    formData:{},
    regionValue: [],
    loadModal:false,
    canvasHeight:698,
    canvaswidth:1184,
  },
  bindInput:function(e){
    const formData=this.data.formData
    formData[e.currentTarget.dataset.type]=e.detail.value
    this.setData({
      formData
    })
  },
  workerChange:function(e){
    console.log(e)
    const index=e.detail.value
    const formData=this.data.formData
    formData.workerType=this.data.workerTypes[index]._id
    this.setData({workerIndex:index,formData})
  },
  ChooseImage:function(){
    const _this=this
    wx.chooseImage({
      count:1,
      sourceType:['album', 'camera'],
      complete: (res) => {
        console.log(res)
        _this.setData({imgList:res.tempFilePaths})
        wx.navigateTo({url:'../uploader/index?src='+res.tempFilePaths[0]})
      },
    })
  },
  DelImg:function(){
    this.setData({imgList:[]})
  },
  RegionChange:function(e){
    console.log(e)
    const formData=this.data.formData
    formData.region=e.detail
    this.setData({regionValue:e.detail.value,formData})
  },
  saveData:function(){
    const _this=this
    const formData=this.data.formData
    if(!formData.name){
      this.errorMsg('请输入姓名！')
      return
    }else if(!formData.phone){
      this.errorMsg('请输入手机号！')
      return
    }else if(!formData.region){
      this.errorMsg('请选择所在地区！')
      return
    }else if(!formData.workerType){
      this.errorMsg('请选择职业类别！')
      return
    }else if(this.data.imgList.length==0){
      this.errorMsg('请上传职业形象照！')
      return
    }
    this.setData({loadModal:true})
    // if(!this.data.imgList[0].startsWith("cloud://")){
    //   formData.photo=wx.getFileSystemManager().readFileSync(this.data.imgList[0],'base64');
    //   formData.fileType=this.data.imgList[0].substr(this.data.imgList[0].lastIndexOf("."))
    // }    
    formData.id=app.globalData.user._id
    // console.log(formData.fileType)
    formData.photo=this.data.imgList[0]
    wx.cloud.callFunction({
      name:'saveInfo',
      data:formData
    }).then(res=>{
      const {result}=res;
      console.log(result)
      if(result.statusCode==200){
        app.globalData.user=result.data
        _this.data.workerTypes.forEach(wt=>{
          if(wt._id==app.globalData.user.workerType){
            app.globalData.user.workerTypeName=wt.name
            console.log("wt.name:"+wt.name)
          }
        })
        _this.setData({user:result.data})
        wx.showToast({
            title:'保存成功！',
            duration: 2000,
        });
        setTimeout(function(){
          _this.makeCard()
        },2000)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this=this
    wx.getStorage({
      key: 'workerTypes',
      success (res) {
        console.log(res)
        let workerIndex=-1
        let regionValue=[],imgList=[]
        if(app.globalData.user.workerType){
          for(let i=0;i<res.data.length;i++){
            if(res.data[i]._id===app.globalData.user.workerType){
              workerIndex=i
            }
          }
        }
        if(app.globalData.user.region){
          regionValue=app.globalData.user.region.value
        }
        if(app.globalData.user.photo){
          imgList.push(app.globalData.user.photo)
        }
        _this.setData({
          workerTypes: res.data,
          formData:app.globalData.user,
          workerIndex,
          regionValue,
          imgList
        })
      },fail(e){
        _this.errorMsg('缺失缓存【workerTypes】')
      }
    })
  },
  errorMsg:function(msg){
    wx.showToast({
      title:msg,
      icon:'none',
      duration: 2000
  });
  },
  makeCard:function(){ //生成名片
    this.setData({loadModal:true,loadText:'生成名片...'})
    const _this=this
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID: app.globalData.user.photo,
        maxAge: 60 * 60, // one hour
      },{
        fileID: 'cloud://shijing-nvycb.7368-shijing-nvycb-1302376272/card_bg.png',
        maxAge: 60 * 60
      }],
      success: res => {
        try{
          // console.log(res.fileList)
          const imgUrl=res.fileList[0].tempFileURL
          const bgUrl=res.fileList[1].tempFileURL
          const query = wx.createSelectorQuery()
          query.select('#myCanvas')
          .fields({ node: true, size: true })
          .exec((res) => {
            const canvas = res[0].node
            let ctx = canvas.getContext('2d')
            const img = canvas.createImage()
            const bg_img=canvas.createImage()
            let i=0
            img.src = imgUrl
            img.onload = () =>{
                i++
                if(i===2){
                  _this.createCardImage(img,bg_img,ctx,canvas)
                }
                // ctx.drawImage(img, 0, 0, 100, 100, 0, 0, canvas.width, canvas.height)
                
            }
            bg_img.src=bgUrl
            bg_img.onload=()=>{
              i++
              if(i===2){
                _this.createCardImage(img,bg_img,ctx,canvas)
              }
            }
    
            // const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = _this.data.canvaswidth
            canvas.height = _this.data.canvasHeight
          })
        }catch(e){
          console.error(e)
        }
      }
    })
  },
  drawImage:function(photo,bgImage,ctx,canvas){
    let name=app.globalData.user.name.match(/./g).join("  ")
    ctx.drawImage(bgImage, 0, 0,this.data.canvaswidth,this.data.canvasHeight) 
    ctx.drawImage(photo, 70, 126,358,348)
    ctx.font="normal normal bold 50px Arial";
    ctx.fillText(name,600,110);
    ctx.font="normal normal normal 36px Arial";
    let y=200;
    ctx.fillText("工种："+app.globalData.user.workerTypeName,460,y);
    if(app.globalData.user.workAge){
      y+=70
      ctx.fillText("从业年限："+app.globalData.user.workAge+"年",460,y);
    }
    y+=70
    ctx.fillText("所在地："+app.globalData.user.region.value.join("-"),460,y);
    if(app.globalData.user.introduce){
      y+=70
      ctx.fillText(app.globalData.user.introduce,460,y);
    }

    if(!app.globalData.user.wx&&!app.globalData.user.company){//没有微信号 也没有公司的
      ctx.fillText("联系电话："+app.globalData.user.phone,70,600);
    }else{
      y=530
      ctx.fillText("联系电话："+app.globalData.user.phone,70,y);
      if(app.globalData.user.wx){
        y+=70
        ctx.fillText("微信号："+app.globalData.user.wx,70,y);
      }
      if(app.globalData.user.company){
        y+=70
        ctx.fillText("所在公司："+app.globalData.user.company,70,670);
      }
    }
    
    ctx.save();
  },
  createCardImage:function(photo,bgImage,ctx,canvas){
    this.drawImage(photo,bgImage,ctx,canvas)
    const _this=this
    console.log('------createCardImage----------')
    wx.canvasToTempFilePath({
      // x: 100,
      // y: 200,
      // width: 50,
      // height: 50,
      // destWidth: 100,
      // destHeight: 100,
      // canvasId: 'myCanvas',
      canvas:canvas,
      success(res) {
        console.log('------临时图片----------')
        console.log(res)       
        _this.setData({cardImage:res.tempFilePath})
      },
      fail(e){
        console.error(e)
      },
      complete(){
        console.log('canvasToTempFilePath complete')
      }
    })
    // if(!canvas.toDataURL){
    //   this.setData({cardImage:ctx.canvas.toDataURL("image/png",1)}) //开发者工具或安卓机
    // }else{
    //   this.setData({cardImage:canvas.toDataURL("image/png",1)})  //苹果机
    // }
    //生成转发时 使用的图片
    canvas.height = 947
    this.drawImage(photo,bgImage,ctx,canvas)
    wx.canvasToTempFilePath({
      // x: 100,
      // y: 200,
      // width: 50,
      // height: 50,
      // destWidth: 100,
      // destHeight: 100,
      // canvasId: 'myCanvas',
      canvas:canvas,
      success(res) {
        console.log('------临时图片----------')
        console.log(res)       
        _this.setData({cardShareImage:res.tempFilePath,loadText:'保存名片...'})
        _this.saveCard()
      },
      fail(e){
        console.error(e)
      },
      complete(){
        console.log('canvasToTempFilePath complete')
      }
    })
    // if(!canvas.toDataURL){
    //   this.setData({cardShareImage:ctx.canvas.toDataURL("image/png",1)}) //开发者工具或安卓机
    // }else{
    //   this.setData({cardShareImage:canvas.toDataURL("image/png",1)})  //苹果机
    // }
  },
  saveCard:function(){
    const _this=this
    let cardImage,cardShareImage
    this.setData({loadModal:true})
    wx.cloud.uploadFile({
      cloudPath: 'card/'+app.globalData.user._openid+'_'+new Date().getTime()+'.png',
      filePath: this.data.cardImage, // 文件路径
      success: res => {
        // cloud://shijing-nvycb.7368-shijing-nvycb-1302376272/card/o6I7k5IqYT-wWNmyYCOZdqDIznGg.png
        console.log("上传成功："+res.fileID)
        cardImage=res.fileID
        app.globalData.user.card=cardImage
        console.log(app.globalData.user.card)
        wx.cloud.uploadFile({
          cloudPath: 'cardShare/'+app.globalData.user._openid+'_'+new Date().getTime()+'.png',
          filePath: _this.data.cardShareImage, // 文件路径
          success: res => {
            // get resource ID
            console.log("上传成功："+res.fileID)
            cardShareImage=res.fileID
            _this.updateUserInfo(cardImage,cardShareImage)
          },
          fail: err => {
            // handle error
            console.error(err)
          }
        })
      },
      fail: err => {
        // handle error
        console.error(err)
      }
    })
    
  },
  updateUserInfo:function(cardImage,cardShareImage){
    const _this=this
    wx.cloud.callFunction({
      name:'saveCard',
      data:{_id:app.globalData.user._id,cardImage,cardShareImage}
    }).then(res=>{
      const {result}=res;
      console.log(result)
      _this.setData({loadModal:false})
      if(result.statusCode==200){
        app.globalData.user.card=cardImage
        app.globalData.user.cardShare=cardShareImage
        wx.showToast({
          title:'名片保存成功！',
          duration: 2000
        });
      }else{
        wx.showToast({
            title:'系统异常，请稍后重试',
            icon:'none',
            duration: 2000
        });
      }
    }).catch(e=>{
      _this.setData({loadModal:false})
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