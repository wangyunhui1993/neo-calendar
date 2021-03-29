// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.callFunction({
    // 要调用的云函数名称
    name: 'getJoke',
    // 传递给云函数的参数
    data: {}
  })
  console.log('res',res);
}