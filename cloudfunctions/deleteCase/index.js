// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const dto=await db.collection('cases').where({
    _id:event.id,
    openid:wxContext.OPENID
  }).get()
  console.log(dto)
  await cloud.deleteFile({
    fileList: dto.data[0].images,
  })
  await db.collection('cases').where({
    _id:event.id,
    openid:wxContext.OPENID
  }).remove()

  return {
    statusCode:200
  }
}