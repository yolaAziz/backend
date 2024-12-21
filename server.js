// const express = require("express");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const authRouter = require("./routes/auth/auth-routes");
// const adminProductsRouter = require("./routes/admin/products-routes");
// const adminOrderRouter = require("./routes/admin/order-routes");

// const shopProductsRouter = require("./routes/shop/products-routes");
// const shopCartRouter = require("./routes/shop/cart-routes");
// const shopAddressRouter = require("./routes/shop/address-routes");
// const shopOrderRouter = require("./routes/shop/order-routes");
// const shopSearchRouter = require("./routes/shop/search-routes");
// const shopReviewRouter = require("./routes/shop/review-routes");
// const paymobWebhook = require("./routes/shop/webhook-routes");


// const commonFeatureRouter = require("./routes/common/feature-routes");


// //create a database connection -> u can also
// //create a separate file for this and then import/use that file here

// mongoose
// .connect("mongodb+srv://yolaaziz22:uolyanamoner@cluster0.ll29u.mongodb.net/")
// .then(() => console.log("MongoDB connected"))
//   .catch((error) => console.log(error));

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173", // الواجهة الأمامية المحلية
//       "https://9597-41-43-251-164.ngrok-free.app", // رابط Ngrok
//     ],
//     methods: ["GET", "POST", "DELETE", "PUT"],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Cache-Control",
//       "Expires",
//       "Pragma",
//     ],
//     credentials: true,
//   })
// );

// app.use(cookieParser());
// app.use(express.json());
// app.use("/api/auth", authRouter);
// app.use("/api/admin/products", adminProductsRouter);
// app.use("/api/admin/orders", adminOrderRouter);

// app.use("/api/shop/products", shopProductsRouter);
// app.use("/api/shop/cart", shopCartRouter);
// app.use("/api/shop/address", shopAddressRouter);
// app.use("/api/shop/order", shopOrderRouter);
// app.use("/api/shop/search", shopSearchRouter);
// app.use("/api/shop/review", shopReviewRouter);

// app.use("/api/paymob", paymobWebhook);



// app.use("/api/common/feature", commonFeatureRouter);


// app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));


const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config(); // تحميل متغيرات البيئة

// استيراد الـ Routes
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const paymobWebhook = require("./routes/shop/webhook-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

// الاتصال مع قاعدة البيانات MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

// إعداد التطبيق Express
const app = express();
const PORT = process.env.PORT || 5000; // البورت من البيئة أو 5000 محليًا

// إعداد CORS
app.use(
  cors({
    origin: "https://backend-nine-topaz.vercel.app", // رابط الواجهة الأمامية
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true, // السماح باستخدام الكوكيز
  })
);

// التعامل مع طلب OPTIONS لجميع المسارات
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cache-Control, Expires, Pragma"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

// إعداد Headers ديناميكيًا لجميع الطلبات
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://earnest-renewal-production.up.railway.app",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cache-Control, Expires, Pragma"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// استخدام الـ Middlewares
app.use(cookieParser());
app.use(express.json());

// تعريف Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/paymob", paymobWebhook);

app.use("/api/common/feature", commonFeatureRouter);

// معالجة الأخطاء العامة
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// إعداد الاستماع للسيرفر
app.listen(PORT, async () => {
  console.log(`Server is now running on port ${PORT}`);
  await connectToMongoDB(); // الاتصال بقاعدة البيانات عند بدء السيرفر
});
