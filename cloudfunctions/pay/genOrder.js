const generateOrderNo = () => {
  const timestamp = Date.now().toString();

  const characters = "0123456789";
  let result = timestamp;

  for (let i = 0, len = 32 - timestamp.length; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

const generateRandomString = (length = 30) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length && i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = {
  generateOrderNo,
  generateRandomString,
};
