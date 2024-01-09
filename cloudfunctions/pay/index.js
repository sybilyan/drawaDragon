// 云函数入口文件
const cloud = require("wx-server-sdk");
const {
  paymentTypes,
  paymentTitle,
  PaymentAmount,
  packageImageCount,
  EarlyBirdDiscount,
} = require("./type");
const { generateOrderNo, generateRandomString } = require("./genOrder");

cloud.init();

const db = cloud.database({ env: "aiyo-3gepuy0fc27f4719" });
const OrderModel = db.collection("order");

const errHandler = (handler) => async (event, context) => {
  try {
    return {
      code: 0,
      data: await Promise.resolve(handler(event, context)),
      message: "",
    };
  } catch (err) {
    console.trace();
    return {
      code: 400,
      data: null,
      message: err.message,
    };
  }
};

exports.main = errHandler(async (event, context) => {
  const { payType, isEarlyBird = true } = event;

  const wxContext = cloud.getWXContext();

  if (!paymentTypes.includes(payType)) {
    throw new Error("未知的支付类型");
  }

  const userId = wxContext.OPENID;
  const orderNo = generateOrderNo();
  const paymentAmount = isEarlyBird ? EarlyBirdDiscount : PaymentAmount;
  const balance = packageImageCount[payType];

  const wxpayParams = {
    body: `aiyo-梗图生成套餐包${paymentTitle[payType]}`,
    outTradeNo: orderNo,
    subMchId: "1650337035",
    totalFee: paymentAmount[payType],
    envId: "aiyo-3gepuy0fc27f4719",
    functionName: "payCallback",
    spbillCreateIp: "127.0.0.1",
    nonceStr: generateRandomString(),
    tradeType: "JSAPI",
  };

  const res = await cloud.cloudPay.unifiedOrder(wxpayParams);

  if (res.returnCode === "FAIL") {
    console.info(wxpayParams);
    throw new Error(`调起微信支付失败: ${res.returnMsg}`);
  }

  await OrderModel.add({
    data: {
      user_id: userId,
      order_no: orderNo,
      type: payType,
      balance,
      // 0 为待支付，1为支付成功，9为支付失败
      status: 0,
      error: "",
    },
  });

  return res;
});
