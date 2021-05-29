// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var userId =event.userId;
  try{
    const result = await cloud.database().collection('users').where({userId: userId}).get()
    return result
  }catch(err){
    return err
  }
}