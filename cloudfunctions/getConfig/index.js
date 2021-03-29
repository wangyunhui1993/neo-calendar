// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  var label = event.label;
  if(!label){
    return {
      success: false,
      data: '请输入lable'
    };
  }
    var data = await db.collection('t_config').where({
      label
    }).get();
    if (data.data.length === 0) {
      return {
        success: false,
        data: '记录不存在'
      };
    }else{
      return {
        success: true,
        data: data.data[0]
      };
    }
}