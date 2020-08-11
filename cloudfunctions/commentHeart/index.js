// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try{
    let getResult= await db.collection('advise').doc(event.id).get()
    const dbHearts=getResult.data.hearts
    let index
    if(dbHearts.some((i,v)=>{
      index=v
      return i==wxContext.OPENID})
      ){//已经点赞过了 取消点赞
        console.log('index:'+index)
        dbHearts.splice(index,1)
        const updateResult= await db.collection('advise').doc(event.id).update({
          data:{hearts:dbHearts}
        })
        return 0
    }else{
      dbHearts.push(wxContext.OPENID)
      const updateResult= await db.collection('advise').doc(event.id).update({
        data:{hearts:dbHearts}
      })
      return 1
    }
  }catch(e){
    console.error(e)
  }
  return -1
}