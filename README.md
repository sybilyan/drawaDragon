# drawaDragon
miniprogram for draw a dragon 

## 使用代码

  1. 下载并安装[微信开发者工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)，使用微信号扫码登录开发者工具。

  2. 打开微信开发者工具，点击“小程序项目”按钮，输入小程序 AppID，项目目录选择下载的代码目录，点击确定创建小程序项目。
  
## 功能实现

### 一、图片裁剪

  1. 裁剪界面由image组件和裁剪框组成。image组件用来显示用户载入的图片；裁剪框在用户点击裁剪框按钮后浮动显示在图片上，裁剪框的遮罩效果通过背景颜色透明以及盒阴影（box-shadow）实现。

  2. 在image组件上检测触摸事件，通过事件对象判断触摸点数，单点触摸时通过获取手指移动距离实现图片的自由拖动，两点触摸时，通过获取两点之间的距离计算图片缩放比例，实现图片自由缩放。

  3. 在裁剪框上检测触摸事件，通过获取手指移动距离实现裁剪框自由拖动；监测裁剪框右下圆点的触摸事件，通过获取手指移动距离计算裁剪框宽、高的增减，实现裁剪框的自由缩放功能。

  4. 用户裁剪完成（点击右上角√按钮后），根据保存的裁剪框宽、高以及图片缩放比例计算图片真实裁剪区域，根据计算好的区域将图片画在隐藏canvas上，得到裁剪后的图片。


### 二、涂鸦功能

  1. 涂鸦界面由canvas组件和image组件构成。在canvas上监测touchmove事件连续画线（ctx.moveTo，ctx.lineTo）实现涂鸦功能。线宽、颜色可以由用户在下方工具栏设置。

  2. 由于canvas组件在小程序中层级最高，因此采用动态调整canvas高度的方法显示底部工具菜单栏，即调出和隐藏工具栏时，动态改变canvas的高度。

  3. 为了实现橡皮擦和清除功能（不破坏原图），采用将canvas组件覆盖在image组件上，image组件加载涂鸦前的原图，这样使用橡皮檫时擦掉的区域会显示原图。涂鸦完成后（返回主菜单），先保存canvas得到涂鸦图片，然后在隐藏canvas上先绘制涂鸦前的原图，再绘制涂鸦效果图。就能得到完整的涂鸦后的图片了。

TODO1: UI：需要有一个涂鸦引导，在用户不知道应该怎么画画多大的情况下给予简洁的使用说明。具体形式为第一次进入涂鸦界面会弹出一个框播放gif引导动图，点击任意区域弹窗缩至右下角，再点观看。之后再进入涂鸦界面不需要主动弹出引导。嘿嘿gif还没做好之后发你

<div align="center">
<img alt="涂鸦界面" src="https://github.com/sybilyan/drawaDragon/blob/main/image/todo1.png">
</div>

TODO2：
逻辑：现有个小bug，就是无法将多次涂鸦图合并并保存到临时路径中，保存的都是原图+涂鸦图合并。后端接口最终需要三张图片，原图，多次涂鸦合并图，多次涂鸦和原图的合并图。同时这三张图的尺寸要保持一致（可点击下面链接查看图片详情）
<div align="left">
<img alt="原图" src="https://github.com/sybilyan/drawaDragon/blob/main/image/rawImage.jpg">
</div>
<div align="left">
<img alt="涂鸦界面" src="https://github.com/sybilyan/drawaDragon/blob/main/image/doodle.png">
</div>
<div align="left">
<img alt="多次涂鸦和原图的合并图" src="https://github.com/sybilyan/drawaDragon/blob/main/image/doodleImage.jpg">
</div>


TODO3：
UI：在选择颜色按钮上添加一句话： 选择一个你喜欢的龙的颜色，注意多次绘制只可选择同一颜色。
逻辑：需要把最后一次涂鸦的颜色记下，该参数(用index)传递给后端
<div align="center">
<img alt="线条界面" src="https://github.com/sybilyan/drawaDragon/blob/main/image/todo3.png">
</div>

### 三、保存图片

  1. 小程序的所有图片保存都使用隐藏的canvas组件（left:-9999px）完成，根据图片的定位、缩放比、裁剪以及添加的文字的效果等数据在隐藏canvas上作图，并导出临时路径以便进一步处理。

  2. 为了保证图片的质量（图片画在canvas上后像素不降低），隐藏canvas的宽高等于图片的实际宽高。即在画布上调用drawImage之前，使用wx.getImageInfo获取需要画的图片的真实宽高，进而调整隐藏canvas的宽高。

  3. 用户点击保存按钮后，进入图片预览界面（wx.previewImage），长按图片可选择保存本地相册或者发送给微信朋友。


### 四、我画好了

TODO4：：
  1. 逻辑 将原图，多次涂鸦合并图，多次涂鸦和原图的合并图，颜色这四个参数通过cloudfunction传至后端图片生成服务器（cloudfunction闫姐来写），有两个接口，post接口传参后会返回一个大致等待时间，即loading的时间，loading时间后再调用get接口获得结果图展示。如果还没有结果就加长loading时间，或提示一个网络状态问题需要等待一会（这个exception没有想好怎么做，可以自由发挥一下先）

  2. UI
  2.1 页面效果有一个loading，loading过程中中间文本框会每隔10s切换搞怪的话合集，但第一句话都是“龙龙制作中，请稍后...”。
  2.2 返回有四张图显示，用户可点击任何一个图进入图片预览界面（wx.previewImage），长按图片可选择保存本地相册或者发送给微信朋友。
  <div align="center">
<img alt="等待界面1" src="https://github.com/sybilyan/drawaDragon/blob/main/image/todo4-1.png">
</div>
  <div align="center">
<img alt="等待界面2" src="https://github.com/sybilyan/drawaDragon/blob/main/image/todo4-2.png">
</div>
  <div align="center">
<img alt="显示界面" src="https://github.com/sybilyan/drawaDragon/blob/main/image/todo4-preview.png">
</div>

