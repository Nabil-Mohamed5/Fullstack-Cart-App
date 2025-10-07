require("dotenv").config();
const webpush = require("web-push");

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const CONTACT_EMAIL =
  process.env.VAPID_CONTACT_EMAIL || "mailto:admin@example.com";

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.warn(
    "VAPID keys are not set. Push notifications will not work until VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY are provided in .env"
  );
}

webpush.setVapidDetails(CONTACT_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

async function sendNotification(subscription, payload) {
  try {
    const res = await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
    return res;
  } catch (err) {
    // caller should handle delete on 410 or other cleanup
    throw err;
  }
}

module.exports = {
  sendNotification,
  VAPID_PUBLIC_KEY,
};
