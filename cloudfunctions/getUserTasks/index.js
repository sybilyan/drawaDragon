// 云函数入口文件
const cloud = require("wx-server-sdk");
const mongoose = require("mongoose");
const { TaskModel, ResultModel } = require("./models");

cloud.init();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, SD_SERVICE } = process.env;

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
  const { page = 1, pageSize = 10 } = event;

  const wxContext = cloud.getWXContext();
  const userId = wxContext.OPENID;

  const data = await TaskModel.where({
    userId,
  })
    .limit(pageSize)
    .skip((page - 1) * pageSize)
    .lean();

  const taskIds = data.map((task) => task.taskId);
  const taskResults = (
    await ResultModel.find({ taskId: { $in: taskIds } }).lean()
  ).reduce(
    (acc, next) => ({
      ...acc,
      [next.taskId]: next,
    }),
    {}
  );

  return data.map((task) => {
    return {
      ...task,
      result: taskResults[task.taskId],
    };
  });
});
