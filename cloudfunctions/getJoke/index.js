// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const QS = {
  token: '0a13b3dfb334b011ce63010b0c815613',
  cn_to_unicode: 0,
  datatype: 'json',
  limit: 1
}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var _openid = wxContext.OPENID;
  var clientip = wxContext.CLIENTIP;
  var source = wxContext.SOURCE;
  const get_options = {
    method: 'GET',
    url: 'https://api.djapi.cn/joke/get',
    qs: {
      ...QS,
    },
    json: true
  };



   //获取get请求数据
   const get_res = await rp(get_options);
   if (get_res.ErrorCode === 0) {
    var data = await db.collection('t_joke').where({
      content: get_res.Result.content
    }).get();
    if (data.data.length === 0) {
      db.collection('t_joke').add({
        data: { ...get_res.Result, _openid,clientip,source,createDate:new Date()},
      })
    }
     return {
       success: true,
       data: get_res.Result
     };
   } else {
     return {
       success: false,
       msg: get_res.ErrorReason,
       data: {}
     };
   }



 
}