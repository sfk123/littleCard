// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try{
    delete event.userInfo
    let result
    if(event.photo.startsWith("cloud://shijing-nvycb.7368-shijing-nvycb-1302376272/temp")){
      const res = await cloud.downloadFile({
        fileID: event.photo,
      })
      const uploadResult= await cloud.uploadFile({
        fileContent: res.fileContent,
        cloudPath: "photo/"+wxContext.OPENID+event.photo.substr(event.photo.lastIndexOf(".")) // 使用随机文件名
      })
      if(uploadResult.statusCode==-1){ //上传成功
        delete event.fileType
        const id=event._id
        delete event._id
        await cloud.deleteFile({
          fileList:[event.photo],
        })
        event.photo=uploadResult.fileID
        result = await db.collection('m_users').doc(id).update({
          // data 传入需要局部更新的数据
          data: event
        })
        result = await db.collection('m_users').where({
          _id: id
        }).get()
      }
    }else{ //没上传图片
      const id=event._id
      delete event._id
      console.log('更新数据，没上传图片')
      result = await db.collection('m_users').doc(id).update({
        // data 传入需要局部更新的数据
        data: event
      })
      result = await db.collection('m_users').where({
        _id: id
      }).get()
    }
    return {
      statusCode:200,
      data:result.data[0]
    }
  }catch(e){
    console.error(e)
    return e
  }
  
}