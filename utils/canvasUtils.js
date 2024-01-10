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
module.exports = {
  convertImagePathToBase64: convertImagePathToBase64
}
