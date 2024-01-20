function convertImagePathToBase64(imagePath) {
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath: imagePath,
      encoding: "base64",
      success: function (res) {
        var base64Data = res.data;
        resolve(base64Data);
      },
      fail: function (err) {
        console.error("[error] convert image toBase64 failed:\n", err);
        reject(err);
      },
    });
  });
}

module.exports = {
  convertImagePathToBase64: convertImagePathToBase64,
};
