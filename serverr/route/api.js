const express = require("express");
const apiRouter = express.Router();
const app = express();

/* ------------- controllers ------------------- */

const productApiController = require("../controllers/productApiController");

const authController = require("../controllers/authController");

const orderController = require("../controllers/orderController");
const pushController = require("../controllers/pushController");
const pushService = require("../services/pushService");

/* -------------- parse of form ------------------- */
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/uploades/");
  },
  filename: (req, file, cb) => {
    if (file) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  },
});

const upload = multer({
  storage: storage,
});

/* -------------- route roles ------------------------ */

/* ---------- auth ----------------- */

apiRouter.post("/signin", (req, res) => {
  authController.signin(req, res);
});

apiRouter.post("/signup", (req, res) => {
  authController.signup(req, res);
});
///////////////////////
/* apiRouter.use(authController.verifySignin); */

/* -------------------products route roles----------------------- */
apiRouter.get("/products", (req, res) => {
  productApiController.index(req, res);
});
apiRouter.get("/products/show/:id", (req, res) => {
  productApiController.show(req, res);
});
apiRouter.get("/products/createForm", (req, res) => {
  productApiController.createForm(req, res);
});

/* ---****---- */
apiRouter.post("/products/store", upload.single("photo"), (req, res) => {
  productApiController.store(req, res);
});

apiRouter.get("/products/updateForm/:id", (req, res) => {
  productApiController.updateForm(req, res);
});
apiRouter.post("/products/update", upload.single("photo"), (req, res) => {
  productApiController.update(req, res);
});
apiRouter.get("/products/destroy/:id", (req, res) => {
  productApiController.destroy(req, res);
});
// add more route roles

/* -------------------orders route roles----------------------- */
apiRouter.use(express.json());
apiRouter.use(
  express.urlencoded({
    extended: true,
  })
);

apiRouter.post("/orders/store", orderController.store);
apiRouter.get("/orders", orderController.getOrders);

// Push subscription endpoints
apiRouter.post("/push/subscribe", pushController.subscribe);
apiRouter.get("/push/vapidPublicKey", (req, res) => {
  res.json({ publicKey: pushService.VAPID_PUBLIC_KEY });
});

// Debug/test endpoint to send a push to subscriptions
apiRouter.post("/push/sendTest", pushController.sendTest);

module.exports = apiRouter;
