// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database({ env: "aiyo-3gepuy0fc27f4719" });
const _ = db.command;

const OrderModel = db.collection("order");
const UserBalanceModel = db.collection("user_balance");

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();

    const { return_code, return_msg, out_trade_no } = event;

    if ("SUCCESS" === return_code) {
      // 支付成功
      await OrderModel.update(
        { order_no: out_trade_no },
        { $set: { status: 1 } }
      );
      const {
        data: [order],
      } = await OrderModel.where({ order_no: out_trade_no }).get();
      const {
        data: [user],
      } = await UserBalanceModel.where({
        user_id: order.user_id,
      }).get();

      if (!user) {
        await UserBalanceModel.add({
          data: {
            user_id: order.user_id,
            balance: order.balance,
          },
        });
      } else {
        await UserBalanceModel.where({ user_id: order.user_id }).update({
          data: {
            balance: _.inc(order.balance),
          },
        });
      }

      return {
        errcode: 0,
        errmsg: "",
      };
    } else {
      // TODO: 支付失败
      console.error("支付失败: ", return_msg);
    }
  } catch (err) {
    return {
      errcode: -1,
      errmsg: err.message,
    };
  }
};
