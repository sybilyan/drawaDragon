// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  let{ APPID,OPENID}=cloud.getWXContext()
  console.log("openid:::",OPENID)
  console.log("appid:::",APPID)
  return {
     APPID,
     OPENID
  }}