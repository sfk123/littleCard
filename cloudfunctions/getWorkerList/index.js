// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()
// 云函数入口函数
const _ = db.command
exports.main = async (event, context) => {
  const page=event.page?event.page:1
  const pageSize=10
  const countResult=await db.collection('m_users').where({
    workerType: event.wType,
    card:_.exists(true)
  }).count()
  if(countResult.total==0){
    return {data:[],hasMore:false}
  }
  const totalPage=Math.ceil(countResult.total/pageSize)
  let hasMore
  if(page>totalPage||page==totalPage){
    hasMore=false
  }else{
    hasMore=true
  }

  const result = await db.collection('m_users').where({
    workerType: event.wType,
    card:_.exists(true)
  }).skip((page-1)*pageSize).limit(pageSize).get()
  result.hasMore=hasMore
  for(let i=0;i<result.data.length;i++){
    const worker=result.data[i]
    const countSelect=await db.collection('cases').where({
      openid:worker._openid,
    }).count()
    console.log(countSelect)
    worker.caseCount=countSelect.total
    console.log('案例数量：'+worker.caseCount)
  }
  return result
}