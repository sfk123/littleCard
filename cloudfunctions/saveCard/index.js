// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try{
    const getResult= await db.collection('m_users').doc(event._id).get()
    const deleteFiles=[]
    if(getResult.data.card){
      deleteFiles.push(getResult.data.card)
      deleteFiles.push(getResult.data.cardShare)
      await cloud.deleteFile({
        fileList: deleteFiles,
      })
    }
    const cardImage=event.cardImage
    const cardShareImage=event.cardShareImage
    const updateResult = await db.collection('m_users').doc(event._id).update({
        // data 传入需要局部更新的数据
        data: {card:cardImage,cardShare:cardShareImage}
      })
    // }
    return {statusCode:200,card:cardImage,cardShare:cardShareImage}
  }catch(e){
    console.error(e)
  }
  return {
    statusCode:500
  }
}