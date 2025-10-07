const { default: mongoose } = require("mongoose");
const orderModel = require("../models/orderModel");
const PushSubscription = require("../models/pushSubscriptionModel");
const pushService = require("../services/pushService");

async function store(req, res) {
  const { userId, products } = req.body;

  const order = new orderModel({
    userId: new mongoose.Types.ObjectId(userId),
    products,
  });
  await order.save();
  res.status(200).json({ message: "Order set successfully" });
}

async function getOrders(req, res) {
  const orders = await orderModel.find();
  res.status(200).json(orders);
}

async function ordersIndex(req, res) {
  const orders = await orderModel.find();
  res.render("pages/orders/index", { orders });
}

async function showOrderEdit(req, res) {
  const id = req.params["id"];
  const order = await orderModel.findById(id);
  res.render("pages/orders/updateForm", { order });
}

async function editOrderStatus(req, res) {
  const { status, id } = req.body;
  const order = await orderModel.findById(id);
  const prevStatus = order.status;
  order.status = status;
  await order.save();

  // only notify if status changed
  if (prevStatus !== status) {
    try {
      const subs = await PushSubscription.find({ userId: order.userId });
      const payload = {
        title: "Order status updated",
        body: `Your order ${order._id} status changed to ${status}`,
        data: { orderId: order._id.toString(), status },
      };

      for (const sub of subs) {
        const subscription = {
          endpoint: sub.endpoint,
          keys: sub.keys,
        };
        try {
          await pushService.sendNotification(subscription, payload);
        } catch (err) {
          // if subscription is gone, remove it
          if (err && err.statusCode === 410) {
            await PushSubscription.deleteOne({ _id: sub._id });
          } else {
            console.error(
              "Failed to send push to",
              sub._id,
              err.message || err
            );
          }
        }
      }
    } catch (err) {
      console.error("Error sending push notifications", err);
    }
  }

  res.redirect("/orders");
}

module.exports = {
  store,
  getOrders,
  ordersIndex,
  showOrderEdit,
  editOrderStatus,
};
