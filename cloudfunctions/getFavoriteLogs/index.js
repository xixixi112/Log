// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try{
    const result = await cloud.database().collection('logs').where({_id: _.in(event.arr)}).get()
    return result
  }catch(err){
    return err
  }
}