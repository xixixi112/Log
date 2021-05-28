// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var $ = cloud.database().command.aggregate   //定义聚合操作符

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return cloud.database().collection('logs').aggregate()
  .lookup({
    from: 'users',
    localField: 'userId',
    foreignField: 'userId',
    as: 'userId'
  })
  .replaceRoot({  
    //replaceRoot指定一个已有字段作为输出的根节点，也可以指定一个计算出的新字段作为根节点。
   //newRoot  代表新的根节点
    newRoot: $.mergeObjects([$.arrayElemAt(['$userId', 0]), '$$ROOT'])
    //mergeObjects 累计器操作符
    //$.mergeObjects([params1,params2...]) 可以合并多个元素
    //$.arrayElemAt(['$uapproval', 0]), '$$ROOT']
    //就是取uapproval数组的第一个元素，与原始的根融合在一起
  })
  .project({
    //project把指定的字段传递给下一个流水线，指定的字段可以是某个已经存在的字段，也可以是计算出来的新字段
    userId: 0
  })
  .end({
    success: function (res) {
      console.log(res);
      return res;
    },
    fail(error) {
      return error;
    }
  })

}