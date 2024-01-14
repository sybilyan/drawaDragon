// util/request.js
function showLoading(message = '加载中') {
  wx.showLoading({
    title: message,
    mask: true
  });
}

function hideLoading() {
  wx.hideLoading();
}

function showToast(message, icon = 'none') {
  wx.showToast({
    title: message,
    icon: icon,
    duration: 2000
  });
}

// 封装 GET 请求
function get(url, data, successCallback, failCallback) {
  // showLoading();
  wx.request({
    url: getApp().globalData.baseUrl + url, // 使用全局变量拼接完整的请求地址
    data: data,
    method: 'GET',
    success: function (res) {
      hideLoading();
      if (res.statusCode === 200) {
        successCallback(res.data);
      } else {
        failCallback(res.statusCode, res.data);
      }
    },
    fail: function (err) {
      hideLoading();
      failCallback(-1, err);
    }
  });
}

// 封装 POST 请求
function post(url, data, successCallback, failCallback) {
  // showLoading();
  wx.request({
    url: getApp().globalData.baseUrl + url, // 使用全局变量拼接完整的请求地址
    data: data,
    method: 'POST',
    header: {
      'content-type': 'application/json' // 根据实际情况设置请求头
    },
    success: function (res) {
      hideLoading();
      if (res.statusCode === 200) {
        successCallback(res.data);
      } else {
        failCallback(res.statusCode, res.data);
      }
    },
    fail: function (err) {
      hideLoading();
      failCallback(-1, err);
    }
  });
}

module.exports = {
  post: post,
  get: get,
}

