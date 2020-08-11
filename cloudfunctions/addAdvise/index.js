// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  event.enable=true
  event.createTime=new Date()
  event.comments=[] //初始化评论
  event.hearts=[] //初始化点赞
  try{
    await db.collection('advise').add({
      // data 字段表示需新增的 JSON 数据
      data: event
    })
  }catch(e) {
    console.error(e)
  }
  return {statusCode:200
  }
}