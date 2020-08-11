// 云函数入口文件
const cloud = require('wx-server-sdk')

const Canvas = require('canvas');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try{
    const canvas = new Canvas(300, 120) // 按照微信官方要求，长宽比5:4
    const c_context = canvas.getContext('2d')
    // const sourceImg = images('cloud://shijing-nvycb.7368-shijing-nvycb-1302376272/photo/o6I7k5FmVkGlih48Rpwh5fTZ9NR0.jpg');
    console.log(c_context)
  }catch(e){
    console.error(e)
  }
  
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}