// pages/index/index.js
const request = require("../../utils/request.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    waitTime: 0,
    taskId: "",
    showShareTips: false,
    nativeActionPosition: [0, 0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { bottom, left } = wx.getMenuButtonBoundingClientRect();
    this.setData({
      nativeActionPosition: [left + 4, bottom + 16],
    });

    console.log("options", options);
    let tskId = options.taskId;
    this.getImageForTaskId(tskId).then((getImageResult) => {
      console.log("getImageResult", getImageResult);
      if (getImageResult.status == 200) {
        console.log("success");
        this.setData({
          images: getImageResult.picture_list,
        });
      } else {
        let that = this;
        wx.showModal({
          title: "龙气混乱",
          // content: '点击任意区域查看引导 GIF，再次进入将不再弹出。',
          content: "目前龙气混乱，请重新上传",
          showCancel: false,
          success: (ts) => {
            if (ts.confirm) {
              wx.navigateTo({
                url: '/pages/dragonPage/modify',
              })
            }
          },
        });
      }
    });

    wx.enableAlertBeforeUnload({
      message: "您确定要重新开启唤龙术么?",
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: "/pages/dragonPage/modify",
          });
        }
      },
      fail: function (errMsg) {
      },
    });

  },

  getImageForTaskId(tskId) {
    console.log("getImageForTaskId", tskId);
    return new Promise((resolve, reject) => {
      wx.request({
        url: getApp().globalData.baseUrl + "getImg/" + tskId, // 使用全局变量拼接完整的请求地址
        data: { task_id: tskId },
        method: "GET",
        success: (res) => {
          console.log("success", res);
          resolve(res.data);
        },
        fail: (err) => {
          console.log("fail", err);
          reject(error);
        },
      });
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: "快来与我一起召唤龙年神兽吧！",
      path: "pages/dragonPage/modify",
      // imageUrl: "../../image/todo4-preview.png", // 分享图片的 URL
    };
  },

  onShare() {
    this.setData({
      showShareTips: true,
    });

    this.$timer = setTimeout(() => {
      this.setData({
        showShareTips: false,
      });
      this.$timer = null;
    }, 5000);
  },

  onShareTipsModalClick() {
    this.setData({
      showShareTips: false,
    });

    if (this.$timer) {
      clearTimeout(this.$timer);
      this.$timer = null;
    }
  },

  previewImage: function (e) {
    // 点击图片预览
    const current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.images,
    });
  },

  saveImage: function (e) {
    console.log("长按图片保存");
    const current = e.currentTarget.dataset.src;
    wx.getImageInfo({
      src: current,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: () => {
            wx.showToast({
              title: "保存成功",
              icon: "success",
            });
          },
          fail: (error) => {
            console.error(error);
            wx.showToast({
              title: "保存失败",
              icon: "none",
            });
          },
        });
      },
      fail: (error) => {
        console.error(error);
      },
    });
  },
  //回画板
  goToDraw() {
    wx.showModal({
      title: "提示",
      content: "您确定要重新开启唤龙术么?",
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: "/pages/dragonPage/modify",
          });
        }
      },
    });
  },
});
