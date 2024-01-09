const { default: mongoose } = require("mongoose");

const TaskModel = mongoose.model(
  "aiyo_task",
  new mongoose.Schema(
    {
      taskId: String,
      userId: String,
      status: Number,
      createTime: Date,
      updateTime: Date,
      startTime: Date,
      finishTime: Date,
    },
    {
      collection: "aiyo_task",
      strict: "throw",
    }
  )
);

const ResultModel = mongoose.model(
  "aiyo_task_res",
  new mongoose.Schema(
    {
      taskId: String,
      userId: String,
      markImage: [String],
      originalImage: [String],
      status: Number,
      errMsg: String,
    },
    {
      collection: "aiyo_task_res",
      strict: "throw",
    }
  )
);

module.exports = {
  TaskModel,
  ResultModel,
};
