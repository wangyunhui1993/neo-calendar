// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const QS = {
  token: '0a13b3dfb334b011ce63010b0c815613',
  cn_to_unicode: 1,
  datatype: 'json',
  methods: 'get'
}
// 云函数入口函数
exports.main = async (event, context) => {
  if(!event.date){
    return {
      success: false,
      msg: "请少日期参数",
      data: {}
    };
  }
  const wxContext = cloud.getWXContext()
  var _openid = wxContext.OPENID;
  var clientip = wxContext.CLIENTIP;
  var source = wxContext.SOURCE;
  const get_options = {
    method: 'GET',
    url: 'https://api.djapi.cn/wannianli/get',
    qs: {
      ...QS,
      date: event.date
    },
    json: true
  };

  var data = await db.collection('t_date').where({
    date: event.date
  }).get();
  if (data.data.length > 0) {
    return {
      success: true,
      data: data.data[0]
    }
  } else {
    //获取get请求数据
    const get_res = await rp(get_options);
    if (get_res.ErrorCode === 0) {
      db.collection('t_date').add({
        data: { ...get_res.Result, _openid,clientip,source,createDate:new Date(),date:event.date},
      })
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
}