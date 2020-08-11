// 案例新增访问量
const cloud = require('wx-server-sdk')

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let caseDB=await db.collection('cases').doc(event.id).get()
  caseDB=caseDB.data
  let viewCount=caseDB.view
  viewCount++
  console.log('viewCount:'+viewCount)
  await db.collection('cases').doc(event.id).update({
    // data 传入需要局部更新的数据
    data:{view: viewCount}
  })
  return {statusCode:200}
}