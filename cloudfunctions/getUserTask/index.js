// 云函数入口文件
const cloud = require("wx-server-sdk");
const mongoose = require("mongoose");
const { TaskModel, ResultModel } = require("./models");

cloud.init();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

mongoose.connect(DB_HOST, {
  user: DB_USER,
  pass: DB_PASS,
  dbName: DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
  const { taskId } = event;

  if (!taskId) {
    throw new Error("无效的 TaskId");
  }

  const wxContext = cloud.getWXContext();
  const userId = wxContext.OPENID;

  const data = await TaskModel.where({
    userId,
    taskId,
  })
    .findOne()
    .lean();

  if (data.taskId) {
    data.result = await ResultModel.where({ taskId: data.taskId })
      .findOne()
      .lean();
  }
  console.log("data:::",data.result.markImage[0])
  return "https://aiyo-1319341997.cos.ap-nanjing.myqcloud.com/"+data.result.markImage[0];

});
