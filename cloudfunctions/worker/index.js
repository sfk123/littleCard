// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if(event.action==="getById"){
    const getResult=await db.collection('m_users').doc(event.id).get()
    return getResult.data
  }else if(event.action==="createQR"){
    let result = await cloud.openapi.wxacode.getUnlimited({
      scene: event.id,
      page:'pages/worker/index'
    })
    console.log('----------获取二维码返回------------')
    console.log(result)
    const uploadResult= await cloud.uploadFile({
      fileContent: result.buffer,
      cloudPath: "qr/"+wxContext.OPENID+".jpg" // 使用随机文件名
    })
    console.log('----------获取二维码返回------------')
    console.log(uploadResult)
    result = await db.collection('m_users').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {qrImg:uploadResult.fileID}
    })
    return {statusCode:200,data:uploadResult.fileID}
  }
  return {
    statusCode:200
  }
}