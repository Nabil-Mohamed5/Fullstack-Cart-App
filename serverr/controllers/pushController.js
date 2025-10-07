const PushSubscription = require("../models/pushSubscriptionModel");

async function subscribe(req, res) {
  try {
    const { subscription, userId } = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: "Invalid subscription" });
    }

    // upsert by endpoint
    const existing = await PushSubscription.findOne({
      endpoint: subscription.endpoint,
    });
    if (existing) {
      existing.keys = subscription.keys || existing.keys;
      if (userId) existing.userId = userId;
      await existing.save();
      return res.status(200).json({ message: "Subscription updated" });
    }

    const doc = new PushSubscription({
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      userId: userId || undefined,
    });
    await doc.save();
    return res.status(201).json({ message: "Subscription saved" });
  } catch (err) {
    console.error("subscribe error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Debug/test: send a push payload to subscriptions for a userId (or all if no userId)
async function sendTest(req, res) {
  try {
    const { userId, payload } = req.body;
    const query = {};
    if (userId) query.userId = userId;

    const subs = await PushSubscription.find(query);
    if (!subs || subs.length === 0) {
      return res.status(404).json({ message: "No subscriptions found" });
    }

    const out = [];
    for (const sub of subs) {
      const subscription = {
        endpoint: sub.endpoint,
        keys: sub.keys,
      };
      try {
        const p = payload || {
          title: "Test notification",
          body: `Test push for user ${userId || "all"}`,
          data: { debug: true },
        };
        await require("../services/pushService").sendNotification(
          subscription,
          p
        );
        out.push({ id: sub._id, status: "sent" });
      } catch (err) {
        console.error(
          "Error sending test push to",
          sub._id,
          err.message || err
        );
        // cleanup stale subscription
        if (err && err.statusCode === 410) {
          await PushSubscription.deleteOne({ _id: sub._id });
          out.push({ id: sub._id, status: "deleted" });
        } else {
          out.push({ id: sub._id, status: "error", error: err.message || err });
        }
      }
    }
    return res.json({ results: out });
  } catch (err) {
    console.error("sendTest error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { subscribe, sendTest };
