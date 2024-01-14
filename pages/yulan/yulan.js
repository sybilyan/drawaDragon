// pages/index/index.js
const request = require('../../utils/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [
    ],
    taskId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("options",options)
   let tskId= options.taskId;
   // let tskId= "20240113_183629_9cb03860b1ff11eea3b83fceaaad50e0";
   //        this.setData({
   //          images:["https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_0.png",
   //            "https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_1.png",
   //            "https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_2.png",
   //            "https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_3.png"]
   //        })
    // 使用 GET 请求

    wx.request({
      url: getApp().globalData.baseUrl + 'getImg', // 使用全局变量拼接完整的请求地址
      data: {"task_id":tskId},
      method: 'GET',
      success:  (res)=> {
        console.log("success",res)
        if (res.statusCode === 200) {
          this.setData({
            images:["https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_0.png",
              "https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_1.png",
              "https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_2.png",
              "https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_3.png"]
          })
        } else {
          this.setData({
            images:["https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_0.png",
              "https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_1.png",
              "https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_2.png",
              "https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_3.png"]
          })
        }
      },
      fail:  (err) =>{
        console.log("fail",err)
        this.setData({
          images:["https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_0.png",
            "https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_1.png",
            "https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_2.png",
            "https://d22742htoga38q.cloudfront.net/dragon/" + tskId + "_3.png"]
        })
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '绘画',
      path: 'pages/dragonPage/modify',
      imageUrl: '../../image/todo4-preview.png', // 分享图片的 URL
    };

  },
  onShare: function () {
    console.log("zidignyifangfa ")
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
    console.log("长按图片保存")
    const current = e.currentTarget.dataset.src;
    wx.getImageInfo({
      src: current,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: () => {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
            });
          },
          fail: (error) => {
            console.error(error);
            wx.showToast({
              title: '保存失败',
              icon: 'none',
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
  goToDraw(){
    wx.navigateTo({
      url: '/pages/dragonPage/modify',
    });
  },
})

