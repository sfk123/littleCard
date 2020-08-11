// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const page=event.page?event.page:1
  const pageSize=10
  const where={enable: true}
  if(event.my){
    where.userInfo.openId=wxContext.OPENID
  }
  const countResult=await db.collection('advise').where(where).count()
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

  const result = await db.collection('advise').where(where).skip((page-1)*pageSize).limit(pageSize).orderBy('createTime', 'desc').get()
  result.hasMore=hasMore
  result.data.forEach(advise=>{
    if(advise.hearts.includes(wxContext.OPENID)){
      advise.heart=true
    }else{
      advise.heart=false
    }
  })
  return result
}