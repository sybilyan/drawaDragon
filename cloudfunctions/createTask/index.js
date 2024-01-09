// 云函数入口文件
const cloud = require("wx-server-sdk");
const mongoose = require("mongoose");
const axios = require("axios");
const { TaskMaps, TaskType } = require("./type");

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, SD_SERVICE } = process.env;

mongoose.connect(DB_HOST, {
  user: DB_USER,
  pass: DB_PASS,
  dbName: DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

cloud.init(); // 使用当前云环境
const db = cloud.database({ env: "aiyo-3gepuy0fc27f4719" });
const _ = db.command;

const UserBalanceModel = db.collection("user_balance");

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

const generateTextShadowTask = async (args) => {
  const { userId, closeShotText, longShotDesc } = args;
  const { data } = await axios.post(`${SD_SERVICE}/api/v1/task/text_shadow`, {
    userId,
    closeShotText,
    longShotDesc,
  });

  return data;
};

exports.main = errHandler(async (event, context) => {
  const { taskType } = event;
  if (!TaskMaps.includes(taskType)) {
    throw new Error("不支持的任务类型");
  }

  const wxContext = cloud.getWXContext();
  const userId = wxContext.OPENID;

  const {
    data: [user],
  } = await UserBalanceModel.where({
    user_id: userId,
  }).get();

  if (!user || user.balance < 1) {
    // 没有付过钱 or 余额不足
    throw new Error("剩余可生图次数不足");
  }

  let data;
  switch (taskType) {
    case TaskType.TextShadow:
      data = await generateTextShadowTask({ ...event, userId });
    default:
      break;
  }

  await UserBalanceModel.where({
    user_id: userId,
  }).update({
    data: {
      balance: _.inc(-1),
    },
  });

  return data;
});
