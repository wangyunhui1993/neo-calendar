// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var _openid = wxContext.OPENID;
  var clientip = wxContext.CLIENTIP;
  var source = wxContext.SOURCE;
    var data = await db.collection('t_user').where({
      _openid
    }).get();
    if (data.data.length === 0) {
      db.collection('t_user').add({
        data: {_openid,clientip,source,createDate:new Date(),isNewUser:true},
      })
    }else{
      db.collection('t_user').add({
        data: {_openid,clientip,source,createDate:new Date(),isNewUser:false},
      })
    }
     return {
       success: true,
       data: '操作成功'
     };
}