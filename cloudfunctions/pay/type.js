const PaymentType = {
  // 单张照片
  SinglePackage: "single_package",
  // 基础套餐
  BasicPackage: "basic_ackage",
  // 升级套餐
  ProPackage: "pro_package",
};

const paymentTypes = Object.keys(PaymentType).map((key) => PaymentType[key]);

const paymentTitle = {
  [PaymentType.SinglePackage]: "单张照片",
  [PaymentType.BasicPackage]: "基础套餐",
  [PaymentType.ProPackage]: "升级套餐",
};

const PaymentAmount = {
  [PaymentType.SinglePackage]: 2,
  [PaymentType.BasicPackage]: 40,
  [PaymentType.ProPackage]: 60,
};

const EarlyBirdDiscount = {
  [PaymentType.SinglePackage]: 1,
  [PaymentType.BasicPackage]: 30,
  [PaymentType.ProPackage]: 40,
};

const packageImageCount = {
  [PaymentType.SinglePackage]: 1,
  [PaymentType.BasicPackage]: 50,
  [PaymentType.ProPackage]: 100,
};

module.exports = {
  paymentTitle,
  paymentTypes,
  packageImageCount,
  PaymentType,
  PaymentAmount,
  EarlyBirdDiscount,
};
