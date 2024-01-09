const TaskType = {
  TextShadow: "text_shadow",
};

const TaskMaps = Object.keys(TaskType).map((key) => TaskType[key]);

module.exports = {
  TaskType,
  TaskMaps,
};
