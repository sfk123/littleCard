// 云函数入口文件
const cloud = require('wx-server-sdk')
const UUID = require("es6-uuid");
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // console.log(event)
  const images=[],deleteFiles=[]
  for(let i=0;i<event.images.length;i++){
    const image=event.images[i]
    if(image.startsWith("cloud://shijing-nvycb.7368-shijing-nvycb-1302376272/temp")){
      const res = await cloud.downloadFile({
        fileID: image,
      })
      deleteFiles.push(image)
      const uploadResult= await cloud.uploadFile({
        fileContent: res.fileContent,
        cloudPath: "case/"+UUID(32)+image.fileType // 使用随机文件名
      })
      if(uploadResult.statusCode==-1){ //上传成功
        images.push(uploadResult.fileID)
      }
    }else{
      images.push(image)
    }

  }
  await cloud.deleteFile({
    fileList:deleteFiles,
  })
  event.updateTime=new Date()
  event.openid=wxContext.OPENID
  event.images=images
  delete event.userInfo
  if(event._id){//更新操作
    const id=event._id
    const dbData=await db.collection('cases').doc(id).get()
    checkImages(event,dbData)
    delete event._id
    delete event.userInfo
    delete event.createTime
    delete event.view
    await db.collection('cases').doc(id).update({
      // data 传入需要局部更新的数据
      data: event
    })
  }else{ //新增操作
    event.createTime=new Date()
    event.view=0 //初始化浏览量值为0
    await db.collection('cases').add({
      // data 字段表示需新增的 JSON 数据
      data: event
    })
  }
  return {
    statusCode:200
  }
}
async function checkImages(event,dbData){
  dbData=dbData.data
  const deleteImages=[]
  dbData.images.forEach(image=>{
    const contain=event.images.some((i,v)=>i===image)
    if(!contain){
      deleteImages.push(image)
    }
  })
  if(deleteImages.length>0){
    const result = await cloud.deleteFile({
      fileList: deleteImages,
    })
  }
}