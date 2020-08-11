// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await db.collection('m_users').where({
    _openid: wxContext.OPENID
  }).get()
  let user_data;
  console.log("查询到用户结果："+result.data.length)
  if(result.data.length===0){ //没查到用户 就新建
    user_data={
      _openid: wxContext.OPENID,
      due: new Date(),
      view:0  //访问量
    }
    try{
      await db.collection('m_users').add({
        // data 字段表示需新增的 JSON 数据
        data: user_data
      })
      user_data=await db.collection('m_users').where({
          _openid:wxContext.OPENID
      }).get()
      console.log(user_data)
      user_data=user_data.data[0]
      console.log(user_data)
    }catch(e) {
      console.error(e)
    }
  }else{
    user_data=result.data[0]
  }
  const _ = db.command
  result = await db.collection('worker_type').where({
    _id:_.in(['38d78ca75edf623c0075e86f5960a620', '75777da85edf62480067c913384a4819'])
  }).get()
  // result = await db.collection('worker_type').get()
  return {
    workerTypes:result.data,
    userInfo:user_data
  }
}