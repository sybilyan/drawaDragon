// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid, //要推送给那个用户
      page: 'pages/index/index', //要跳转到那个小程序页面
      data: {//推送的内容
        date2: {
          value: '2022年7月6日 17:16'
        },
        thing3: {
          value: '打开小程序查看作品'
        },
        phrase11: {
          value: '生成完成'
        }
      },
      templateId: '_3GhgDtLucHjwTXAn31nERpMI1-urfu-F0Jf5tCdRI8' //模板id
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
