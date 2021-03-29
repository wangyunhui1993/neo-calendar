const config = require('../config')
const util = require('./util')
const keyName = config.key + '-';
/**
 * 存储Storage
 */
export const setStorage = (params = {}) => {
    let {
        name,
        content,
    } = params;
    name = keyName + name
    let obj = {
        dataType: typeof (content),
        content: content,
        datetime: new Date().getTime()
    }
    try {
      wx.setStorageSync(name, obj)
    } catch (e) {
      console.error('存储数据失败',e)
     }
}

/**
 * 获取Storage
 */

export const getStorage = (params = {}) => {
  let {
      name,
      debug
  } = params;
  name = keyName + name
  let obj = {},
      content;
      try {
        obj = wx.getStorageSync(name)
      } catch (e) {
        console.error('读取数据失败',e)
      }
  
  if (util.validatenull(obj)) return;
  if (debug) {
      return obj;
  }
  if (obj.dataType == 'string') {
      content = obj.content;
  } else if (obj.dataType == 'number') {
      content = Number(obj.content);
  } else if (obj.dataType == 'boolean') {
      content = eval(obj.content);
  } else if (obj.dataType == 'object') {
      content = obj.content;
  }
  return content;
}

/**
 * 删除Storage
 */
export const removeStorage = (params = {}) => {
  let {
      name,
  } = params;
  name = keyName + name
  try {
    wx.removeStorageSync(name)
  } catch (e) {
    console.error('删除数据失败',e)
  }
}

/**
 * 清空全部Storage
 */
export const clearStorage = (params = {}) => {
  wx.clearStorageSync()

}