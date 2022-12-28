const userRouter = require("../routers/userRouter");
const categoryRouter = require("../routers/categoryRouter");
const productRouter = require("../routers/productRouter");
const cartItemRouter = require("../routers/cartItemRouter");
const profileRouter = require("../routers/profileRouter");
const PaymentRouter = require("../routers/PaymentRouter");

module.exports = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/product", productRouter);
  app.use("/api/cart", cartItemRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/payment", PaymentRouter);
};
