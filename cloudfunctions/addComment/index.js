// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const comment={value:event.comment,userInfo:event.userInfo,time:new Date(),enable:true}
  let getResult= await db.collection('advise').doc(event.id).get()
  const dbComments=getResult.data.comments
  dbComments.push(comment)
  const updateResult=await db.collection('advise').doc(event.id).update({
    data:{comments:dbComments}
  })
  console.log(updateResult)
  return {
    statusCode:200,
    data:dbComments
  }
}