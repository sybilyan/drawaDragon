// app.js
App({
  globalData: {
    baseUrl: "https://dragon.aurobitai.com/dragon/",
    longShotImages: "",
    longShotWord: "",
    longImageUse: true,
    closeShotImages: "",
    closeShotWord: "",
    closeImageUse: true,
    userInfo: null,
    // openId:null,
    taskId: "",
    countTime: 0,
    waitTime: 50,
    userInfo: null,
    myDevice: null,
    imgUrl: [],
  },
  onLoad(options) {
    console.log("app.js onLoad");
    wx.loadFontFace({
      family: "Ali",
      source:
        'url("https://puhuiti.oss-cn-hangzhou.aliyuncs.com/AlibabaPuHuiTi-2/AlibabaPuHuiTi-2-75-SemiBold/AlibabaPuHuiTi-2-75-SemiBold.ttf")',
      success: console.log,
    });

    //在全局变量中存入openid
    wx.cloud.callFunction({
      name: "getOpenid",
      complete: (res) => {
        that.globalData.openid = res.result.openid;
        console.log("that.globalData.openid", that.globalData.openid);
        //查找数据库里是否有当前用户
        wx.cloud
          .database()
          .collection("login_user")
          .where({
            _openid: res.result.openid,
          })
          .get({
            success(result) {
              that.globalData.userInfo = result.data[0];
            },
          });
      },
    });
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);
    this.globalData.myDevice = wx.getSystemInfoSync();
    wx.cloud.init({
      // // env 参数说明：
      // //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      // //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
      // //   如不填则使用默认环境（第一个创建的环境）
      // env: "aiyo-3gepuy0fc27f4719",
      // traceUser: true,
    });
  },
});
