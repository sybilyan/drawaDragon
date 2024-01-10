// pages/dragonPage.js
const canvasUtils = require('../../utils/canvasUtils.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    gifImagePath: '../../image/a9c52c073ee44d5d9b343b529f224e1d.gif',
    gifshowFlag:false,
    tempCanvasWidth:0,
    tempCanvasHeight:0,
    imgViewHeight:0,
    page:'mainPage',
    imageNotChoosed:true,
    resultImage:'',
    minScale: 0.5,
    maxScale: 2.5,
    doodleImageSrc:'',
    doodleImageSrcArr:[],
    tempImageSrc:'',
    originImageSrc:'',
    imgWidth:0,
    imgHeight:0,
    imgTop:0,
    imgLeft:0,
    isCroper:false,
    // 裁剪框 宽高
    cutW: 0,
    cutH: 0,
    cutL: 0,
    cutT: 0,
    //涂鸦窗口
    canvasHeight: 0,   //canvas动态高度，单位rpx
    isChooseWidth:false,
    isChooseColor:false,
    // isChooseBack:false,
    isEraser:false,
    allColor: ['#000000', '#FFFFFF', '#00FF00', '#0000FF', '#FFFF00', '#FF0000'],
    lastLineColor: '',
  },

  /**
   * 生命周期函数--监听页面加载
   * self = this 指向的是page
   */
  onLoad(options) {

     // 检查是否是第一次进入涂鸦界面
  let isFirstTime = wx.getStorageSync('isFirstTime');
  if (!isFirstTime) {
    // 如果是第一次，显示引导提示框
    this.showGuideModal();
    // 将 isFirstTime 标记为 true，表示已经进入过涂鸦界面
    // wx.setStorageSync('isFirstTime', true);
  }
  },
  showHB:function(){
    var self = this
    self.device = app.globalData.myDevice
    self.deviceRatio = self.device.windowWidth / 750
    self.imgViewHeight = self.device.windowHeight - 160 * self.deviceRatio
    self.setData({
      imgViewHeight: self.imgViewHeight,
      // tempCanvasHeight: self.imgViewHeight,
      page: 'mainPage'
    })
    //打开图片选择器
    chooseImage(self)
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

  // 自定义函数，用于显示引导提示框
  showGuideModal: function() {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });

    animation.translate(0, 0).step();

    this.setData({
      guideModalAnimation: animation.export(),
    });

    wx.showModal({
      title: '欢迎使用涂鸦功能',
      content: '点击任意区域查看引导 GIF，再次进入将不再弹出。',
      showCancel: false,
      success: (res) => {
        if (res.confirm) {
          this.playGifAndMoveToBottomRight();
        }
      }
    });
  },
  // 在 playGifAndMoveToBottomRight 函数中播放 GIF 并添加动画效果
playGifAndMoveToBottomRight: function() {
  let animation = wx.createAnimation({
    duration: 500,
    timingFunction: 'ease',
  });

  animation.translate(wx.getSystemInfoSync().windowWidth - 120, wx.getSystemInfoSync().windowHeight - 220).step();

  this.setData({
    guideModalAnimation: animation.export(),
  });

  // 播放 GIF
  this.setData({
    isPlayingGif: true,
  });

  // 在动画结束后，可以延时隐藏引导提示框
  // setTimeout(() => {
  //   this.setData({
  //     isPlayingGif: false,
  //   });
  //   this.showHB();
  // }, 2000);
},
// 用户点击  结束播放
stopGifPlayback(){
      this.setData({
      isPlayingGif: false,
    });
    this.showHB();
},
  //展示图片
  bestShow(){
    loadImgOnImage(this)
  },
  //保存照片
  saveImgToPhone(){
    wx.previewImage({
      urls: [this.data.tempImageSrc], // 需要预览的图片http链接列表
    })
  },
  //选择一张照片
  chooseOneImage(){
    chooseImage(this)
  },
  //缩放图片
  uploadScaleStart(e) {
    let self = this
    let xDistance, yDistance
    let [touch0, touch1] = e.touches
    //self.touchNum = 0 //初始化，用于控制旋转结束时，旋转动作只执行一次

    //计算第一个触摸点的位置，并参照该点进行缩放
    self.touchX = touch0.clientX
    self.touchY = touch0.clientY
    //每次触摸开始时图片左上角坐标
    self.imgLeft = self.startX
    self.imgTop = self.startY
    // 两指手势触发
    if (e.touches.length >= 2) {
      self.initLeft = (self.deviceRatio * 750 / 2 - self.imgLeft) / self.oldScale
      self.initTop = (self.imgViewHeight / 2 - self.imgTop) / self.oldScale
      //计算两指距离
      xDistance = touch1.clientX - touch0.clientX
      yDistance = touch1.clientY - touch0.clientY
      self.oldDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance)
    }
  },
  //伸缩框移动
  uploadScaleMove(e) {
    fn(this, e)
  },
  //伸缩框停止
  uploadScaleEnd(e) {
    let self = this
    self.oldScale = self.newScale || self.oldScale
    self.startX = self.imgLeft || self.startX
    self.startY = self.imgTop || self.startY
  },
  //裁剪框开始
  croperStart(e){
    this.croperX = e.touches[0].clientX
    this.croperY = e.touches[0].clientY
  },
  //裁剪框移动
  croperMove(e){
    var self = this
    var dragLengthX = (e.touches[0].clientX-self.croperX)
    var dragLengthY = (e.touches[0].clientY-self.croperY)
    var minCutL = Math.max(0,self.data.imgLeft)
    var minCutT = Math.max(0, self.data.imgTop)
    var maxCutL = Math.min(750 * self.deviceRatio - self.data.cutW, self.data.imgLeft + self.data.imgWidth - self.data.cutW)
    var maxCutT = Math.min(self.imgViewHeight - self.data.cutH, self.data.imgTop + self.data.imgHeight - self.data.cutH)
    var newCutL = self.data.cutL + dragLengthX
    var newCutT = self.data.cutT + dragLengthY
    if (newCutL < minCutL) newCutL = minCutL
    if (newCutL > maxCutL) newCutL = maxCutL
    if (newCutT < minCutT) newCutT = minCutT
    if (newCutT > maxCutT) newCutT = maxCutT
    this.setData({
      cutL: newCutL,
      cutT: newCutT,
    })
    self.croperX = e.touches[0].clientX
    self.croperY = e.touches[0].clientY
  },
  //拖动点开始
  dragPointStart(e){
    var self = this
    self.dragStartX = e.touches[0].clientX
    self.dragStartY = e.touches[0].clientY
    self.initDragCutW = self.data.cutW
    self.initDragCutH = self.data.cutH
  },
  //拖动点移动
  dragPointMove(e){
    var self = this
    var maxDragX = Math.min(750 * self.deviceRatio, self.data.imgLeft + self.data.imgWidth)
    var maxDragY = Math.min(self.imgViewHeight, self.data.imgTop + self.data.imgHeight)
    var dragMoveX = Math.min(e.touches[0].clientX , maxDragX),
      dragMoveY = Math.min(e.touches[0].clientY, maxDragY);
    var dragLengthX = dragMoveX - self.dragStartX
    var dragLengthY = dragMoveY - self.dragStartY
    if (dragLengthX + self.initDragCutW >= 0 && dragLengthY + self.initDragCutH>=0){
      self.setData({
        cutW: self.initDragCutW + dragLengthX,
        cutH: self.initDragCutH + dragLengthY
      })
    } else {
      return
    }
  },
  //裁剪图片
  toCropPage(){
    var self=this
    loadImgOnImage(self)
    self.setData({
      page: 'cropPage',
      allText:{}
    })
  },

  //传递涂鸦和原图
  toUploadPage(){
    //todo
  },

  //涂鸦窗口-点击涂鸦按钮执行
  toDoodlePage(){
    var self = this
    //在涂鸦页面展示图片
    loadImgOnCanvas(self)
    self.setData({
      //这个属性改了有用吗？全局就一个page
      page:'doodlePage',
      canvasHeight: self.device.windowHeight - 160 * self.deviceRatio,
    })
  },
  //涂鸦开始
  doodleStart: function (e) {
    var self = this
    self.lineWidth = self.lineWidth ? self.lineWidth:5
    self.lineColor = self.lineColor ? self.lineColor : '#000000'
    // 开始画图，隐藏所有的操作栏
    this.setData({
      isChooseWidth: false,
      isChooseColor: false,
      // isChooseBack: false,
      canvasHeight: self.device.windowHeight - 160 * self.deviceRatio
    })
    self.doodleStartX = e.touches[0].x - 750 / 2 * self.deviceRatio
    self.doodleStartY = e.touches[0].y - self.imgViewHeight / 2
  },
  // 触摸移动，绘制中。。。，绘制到了self.ctx 也就是myCanvas
  doodleMove: function (e) {
    var self=this
    self.doodled=true
    if (self.data.isEraser) {
      self.ctx.clearRect(e.touches[0].x - 750 / 2 * self.deviceRatio, e.touches[0].y - self.imgViewHeight / 2,30,30)
      self.ctx.draw(true);
      self.cleared=true
    } else {
      self.ctx.setStrokeStyle(self.lineColor);
      self.ctx.setLineWidth(self.lineWidth);
      self.ctx.setLineCap('round');
      self.ctx.setLineJoin('round');
      self.ctx.moveTo(self.doodleStartX, self.doodleStartY);
      self.ctx.lineTo(e.touches[0].x - 750 / 2 * self.deviceRatio, e.touches[0].y - self.imgViewHeight / 2);
      self.ctx.stroke();
      self.ctx.draw(true);
      self.cleared=true
    }
    self.doodleStartX = e.touches[0].x - 750 / 2 * self.deviceRatio
    self.doodleStartY = e.touches[0].y - self.imgViewHeight / 2
  },
  //打开裁剪
  openCroper(){
    var minCutL = Math.max(0, this.data.imgLeft)
    var minCutT = Math.max(0, this.data.imgTop)
    this.setData({
      isCroper:true,
      cutW: 150,
      cutH: 100,
      cutL: minCutL,
      cutT: minCutT
    })
  },
  //完成裁剪
  competeCrop(){
    var self=this
    wx.showLoading({
      title: '截取中',
      mask: true,
    })
    //图片截取大小
    var sX = (self.data.cutL - self.data.imgLeft) * self.initRatio / self.oldScale
    var sY = (self.data.cutT - self.data.imgTop) * self.initRatio / self.oldScale
    var sW = self.data.cutW * self.initRatio /self.oldScale
    var sH = self.data.cutH * self.initRatio / self.oldScale
    self.setData({
      isCroper: false,
      tempCanvasWidth: sW,
      tempCanvasHeight: sH
    })
    //真机疑似bug解决方法
    if (sW < self.scaleWidth * self.initRatio/ self.oldScale / 2) {
      sW *= 2
      sH *= 2
    }
    var ctx = wx.createCanvasContext('tempCanvas')
    ctx.drawImage(self.data.tempImageSrc, sX, sY, sW, sH, 0, 0, sW, sH)
    ctx.draw()
    //保存图片到临时路径
    saveImgUseTempCanvas(self, 100, loadImgOnImage)
  },
  //取消裁剪
  cancelCrop(){
    this.setData({
      isCroper: false
    })
  },
  //选择画笔宽度
  chooseLineWidth(){
    this.setData({
      isChooseColor: false,
      isChooseWidth: true,
      isEraser: false,
      // isChooseBack: false,
      canvasHeight: (this.device.windowHeight - 360 * this.deviceRatio)
    })
  },
  //选定画笔宽度
  widthSliderChange(e){
    this.lineWidth=e.detail.value
  },
  //选择画笔颜色
  chooseLineColor(){
    this.setData({
      isChooseColor: true,
      isChooseWidth: false,
      // isChooseBack: false,
      canvasHeight: (this.device.windowHeight - 360 * this.deviceRatio),
      isEraser: false
    })
  },
  //选定画笔颜色
  lineColorChange(e){
    this.lineColor = e.target.dataset.selected

    this.data.lastLineColor=this.lineColor;
    console.log("lineColorChange  lastLineColor",this.data.lastLineColor)
  },
  //选择橡皮
  chooseEraser(){
    // this.isClear=false
    this.setData({
      isEraser: !this.data.isEraser,
    })
  },
  //选择清除
  chooseClear(){
    this.ctx.clearRect(-750 * this.deviceRatio / 2, -this.imgViewHeight / 2, 750 * this.deviceRatio, this.imgViewHeight);
    this.ctx.draw(true);
    this.setData({
      isEraser: false,
    })
    this.cleared = true
  },
  //返回主页面
  toMainPage(){
    loadImgOnImage(this)
    this.setData({
      page:'mainPage'
    })
  },
  //从涂鸦返回主页面
  doodleToMainPage(){
    if(this.doodled){
      // this.doodled=false
      wx.showLoading({
        title: '保存涂鸦',
        mask: true,
      })
      saveDoodle(this, loadImgOnImage)
      this.doodled=false
      this.setData({
        page: 'mainPage'
      })
    }else{
      loadImgOnImage(this)
    }
    this.setData({
      page: 'mainPage'
    })
  },

  //上传图片到SD
  toSavePage(){

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

  }
})
//选择一个图(点击选择图片页面)
function chooseImage(self){
  wx.chooseImage({
    count: 1,
    sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      //图片选择成功了，res就是选择的图片
      var tempFilePaths = res.tempFilePaths
      console.log('chooseImage tempFilePaths:::'+tempFilePaths)
      //选好了图片，
      self.setData({
        imageNotChoosed: false,
        tempImageSrc: tempFilePaths[0],
        originImageSrc: tempFilePaths[0],
      })
      //把选择好的图片，加载出来
      loadImgOnImage(self)
    },
    fail: function (res) {
      self.setData({
        imageNotChoosed: true
      })
    }
  })
}

//加载图片在图片上
function loadImgOnImage(self){
  wx.getImageInfo({
    src: self.data.tempImageSrc,
    success: function (res) {
      self.oldScale = 1
      self.initRatio = res.height / self.imgViewHeight  //转换为了px 图片原始大小/显示大小
      if (self.initRatio < res.width / (750 * self.deviceRatio)) {
        self.initRatio = res.width / (750 * self.deviceRatio)
      }
      //图片显示大小
      self.scaleWidth = (res.width / self.initRatio)
      self.scaleHeight = (res.height / self.initRatio)

      self.initScaleWidth = self.scaleWidth
      self.initScaleHeight = self.scaleHeight
      self.startX = 750 * self.deviceRatio / 2 - self.scaleWidth / 2;
      self.startY = self.imgViewHeight / 2 - self.scaleHeight / 2;
      self.setData({
        imgWidth: self.scaleWidth,
        imgHeight: self.scaleHeight,
        imgTop: self.startY,
        imgLeft: self.startX
      })
      wx.hideLoading();
    }
  })
}
//加载图片在涂鸦页面的画布上 ,图片应该只在图片容器内加载，不应该放在画布上
function loadImgOnCanvas(self){
  //第二次在page,上加载图片了，第一次是主菜单选择图片
  wx.getImageInfo({
    src: self.data.tempImageSrc,
    success: function (res) {
      //涂鸦背景图加载成功回调
      self.initRatio = res.height / self.imgViewHeight  //转换为了px 图片原始大小/显示大小
      if (self.initRatio < res.width / (750 * self.deviceRatio)) {
        self.initRatio = res.width / (750 * self.deviceRatio)
      }
      //图片显示大小
      self.scaleWidth = (res.width / self.initRatio)
      self.scaleHeight = (res.height / self.initRatio)

      self.initScaleWidth = self.scaleWidth
      self.initScaleHeight = self.scaleHeight
      self.startX = -self.scaleWidth / 2;
      self.startY = -self.scaleHeight / 2;

      //myCanvas 是 page 的画布
      self.ctx = wx.createCanvasContext('myCanvas')
      self.ctx.translate((750 * self.deviceRatio) / 2, self.imgViewHeight/ 2)
      //原点移至中心，保证图片居中显示
      // self.ctx.drawImage(self.data.tempImageSrc, self.startX, self.startY, self.scaleWidth, self.scaleHeight)
      // self.ctx.draw()
    }
  })
}


// 绘制函数，将多张涂鸦图叠加到 canvas 上
function drawAllDoodles(tuyaImgsArr,self) {
  var imagePaths = tuyaImgsArr; // 包含多个图片路径的数组
  console.log('imagePaths image :::' + imagePaths);
  self.ctx = wx.createCanvasContext('resultCanvas', self);
  // 遍历图片路径数组
  imagePaths.forEach(function (imagePath, index) {
    // 获取图片信息
    wx.getImageInfo({
      src: imagePath,
      success: function (res) {
        // 绘制图片
        self.ctx.drawImage(res.path, 0, 0, self.data.tempCanvasWidth, self.data.tempCanvasHeight);

        // 如果是最后一张图片，保存图片
        if (index === imagePaths.length - 1) {
          self.ctx.draw(false, function () {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: self.data.tempCanvasWidth,
              height: self.data.tempCanvasHeight,
              destWidth: self.data.tempCanvasWidth,
              destHeight: self.data.tempCanvasHeight,
              fileType: 'png',
              quality: 1,
              canvasId: 'resultCanvas',
              success: function (res) {
                wx.hideLoading();

                // 最终结果图保存
                self.setData({
                  resultImagePath: res.tempFilePath
                });

                // 打印结果
                console.log('result all tuya  image :::' + self.data.resultImagePath);
                canvasUtils.convertImagePathToBase64(self.data.resultImagePath, function (err, base64Data) {
                  if (!err) {
                    console.log('Base64 data:', base64Data);
                  } else {
                    console.error('Failed to convert image to base64:', err);
                  }
                })

                if (fn) {
                  fn(self);
                }
              }
            });
          });
        }
      }
    });
  });
}
//保存图片到临时路径
function saveImgUseTempCanvas(self, delay, fn){
  setTimeout(function () {
    //保存用户效果图, 保存tempCanvas的图
    wx.canvasToTempFilePath({
      x:0,
      y:0,
      width: self.data.tempCanvasWidth,
      height: self.data.tempCanvasHeight,
      destWidth: self.data.tempCanvasWidth,
      destHeight: self.data.tempCanvasHeight,
      fileType: 'png',
      quality: 1,
      canvasId: 'tempCanvas',
      success: function (res) {
        wx.hideLoading();

        //最终结果图保存
        self.setData({
          tempImageSrc: res.tempFilePath
        })
        //打印结果
        console.log('result background :::' + self.data.originImageSrc);
        console.log('result doodle :::' + self.data.doodleImageSrc);
        console.log('result background + doodle :::' + self.data.tempImageSrc);

        if(fn){
          fn(self)
        }
      }
    })
  }, delay)

  drawAllDoodles(self.data.doodleImageSrcArr,self)
}
function convertImagePathToBase64(imagePath, callback) {
  wx.getFileSystemManager().readFile({
    filePath: imagePath,
    encoding: 'base64',
    success: function (res) {
      var base64Data = res.data;
      callback(null, base64Data);
    },
    fail: function (err) {
      callback(err, null);
    }
  });
}
//保存涂鸦图到临时地址
function saveDoodleTempCanvas(self, delay, fn){
  setTimeout(function () {
    //保存用户效果图
    wx.canvasToTempFilePath({
      x:0,
      y:0,
      width: self.data.tempCanvasWidth,
      height: self.data.tempCanvasHeight,
      destWidth: self.data.tempCanvasWidth,
      destHeight: self.data.tempCanvasHeight,
      fileType: 'png',
      quality: 1,
      canvasId: 'doodleCanvas',
      success: function (res) {
        wx.hideLoading();
        self.setData({
          doodleImageSrc: res.tempFilePath
        })
        if(fn){
          fn(self)
        }
      }
    })
  }, delay)
}

//保存涂鸦, myCanvas的涂鸦
function saveDoodle(self, fn) {
    wx.canvasToTempFilePath({
      x: (750 * self.deviceRatio) / 2 + self.startX,
      y: self.imgViewHeight / 2 + self.startY,
      width: self.scaleWidth,
      height: self.scaleHeight,
      canvasId: 'myCanvas',
      success: function (res) {
        //将myCanvas画布内容保存到临时文件，
        if(self.cleared){
          self.cleared=false
          console.log('pure doodle :::'+res.tempFilePath)
          self.data.doodleImageSrcArr.push(res.tempFilePath)
          //res此时是对的， 白底+涂鸦
          self.setData({
            doodleImageSrc: res.tempFilePath,
            tempCanvasWidth: self.scaleWidth,
            tempCanvasHeight: self.scaleHeight
          })

          //创建一个临时canvas id = tempCanvas
          //这个canvas上画了好几层的image
          //先画出背景图
          var ctx1 = wx.createCanvasContext('tempCanvas')
          ctx1.drawImage(self.data.tempImageSrc, 0, 0, self.scaleWidth,self.scaleHeight)
          console.log('temp canvas background pic =='+self.data.tempImageSrc)

          //在background上绘制涂鸦
          ctx1.drawImage(self.data.doodleImageSrc, 0, 0, self.scaleWidth, self.scaleHeight)
          console.log('temp canvas doodle pic =='+self.data.doodleImageSrc)

          //必须得调用一次draw,tempCanvas 保存临时文件才有内容
          ctx1.draw()

          saveImgUseTempCanvas(self, 1000, fn)
        }else{
          self.setData({
            // doodleImageSrc: res.tempFilePath,
            tempImageSrc: res.tempFilePath,
            originImageSrc: res.tempFilePath
          })
          fn(self)
        }
      }
    })

}


//图片手指伸缩
function throttle(fn, miniTimeCell) {
  var timer = null,
    previous = null;

  return function () {
    var now = +new Date(),
      context = this,
      args = arguments;
    if (!previous) previous = now;
    var remaining = now - previous;
    if (miniTimeCell && remaining >= miniTimeCell) {
      fn.apply(context, args);
      previous = now;
    }
  }
}
//手指触发拖拽或缩放
function drawOnTouchMove(self, e) {
  let { minScale, maxScale } = self.data
  let [touch0, touch1] = e.touches
  let xMove, yMove, newDistance, xDistance, yDistance

  if (e.timeStamp - self.timeOneFinger < 100) {//touch时长过短，忽略
    return
  }

  // 单指手势时触发
  if (e.touches.length === 1) {
    //计算单指移动的距离
    xMove = touch0.clientX - self.touchX
    yMove = touch0.clientY - self.touchY
    //转换移动距离到正确的坐标系下
    self.imgLeft = self.startX + xMove
    self.imgTop = self.startY + yMove

    self.setData({
      imgTop: self.imgTop,
      imgLeft: self.imgLeft
    })
  }
  // 两指手势触发
  if (e.touches.length >= 2) {
    // self.timeMoveTwo = e.timeStamp
    // 计算二指最新距离
    xDistance = touch1.clientX - touch0.clientX
    yDistance = touch1.clientY - touch0.clientY
    newDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance)

    //  使用0.005的缩放倍数具有良好的缩放体验
    self.newScale = self.oldScale + 0.005 * (newDistance - self.oldDistance)

    //  设定缩放范围
    self.newScale <= minScale && (self.newScale = minScale)
    self.newScale >= maxScale && (self.newScale = maxScale)

    self.scaleWidth = self.newScale * self.initScaleWidth
    self.scaleHeight = self.newScale * self.initScaleHeight

    self.imgLeft = self.deviceRatio*750 / 2 - self.newScale * self.initLeft
    self.imgTop = self.imgViewHeight / 2 - self.newScale *self.initTop
    self.setData({
      imgTop: self.imgTop,
      imgLeft: self.imgLeft,
      imgWidth: self.scaleWidth,
      imgHeight: self.scaleHeight
    })
  }
}
const fn = throttle(drawOnTouchMove, 100)
