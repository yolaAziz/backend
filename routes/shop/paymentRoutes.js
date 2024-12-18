const express = require("express");
const {
  createAuthToken,
  createOrder,
  generatePaymentKey,
} = require("../../helpers/paymob");

const router = express.Router();

// إنشاء الدفع (الـ payment key)
router.post("/paymob-return", async (req, res) => {
  try {
    const { totalAmount, cartItems, addressInfo } = req.body;

    // إنشاء Auth Token
    const authToken = await createAuthToken();

    // إنشاء Order
    const orderId = await createOrder(authToken, totalAmount, cartItems);

    const integrationId = "4877571"; // أو احصل عليها من إعدادات Paymob الخاصة بك

    // إنشاء Payment Key
    const paymentKey = await generatePaymentKey(
      authToken,
      orderId,
      totalAmount,
      req.body, // تمرير جميع بيانات الطلب
      integrationId
    );

    // إرجاع الـ paymentKey للمستخدم
    res.status(200).json({ paymentKey });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Failed to process payment" });
  }
});

// يمكنك إضافة المزيد من المسارات هنا بناءً على الحاجة، مثل:

// إضافة عملية دفع إذا كانت هناك حاجة للـ capture
router.post("/capture", async (req, res) => {
  try {
    const { paymentToken, orderId } = req.body;

    // مثال على عملية الدفع باستخدام token من Paymob
    const captureResponse = await axios.post(
      `${paymob.baseUrl}/acceptance/transactions/${paymentToken}/capture`,
      {
        auth_token: paymentToken,
        order_id: orderId,
      }
    );

    res.status(200).json(captureResponse.data); // إرجاع تفاصيل الدفع
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).json({ error: "Failed to capture payment" });
  }
});

// عرض الطلبات الخاصة بالمستخدم
router.get("/list/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // استرجاع جميع الطلبات الخاصة بالمستخدم من قاعدة البيانات
    const orders = await getOrdersByUser(userId); // عليك استبدال هذه الدالة بـ دالة الاسترجاع من الـ DB
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// عرض تفاصيل الطلب بناءً على الـ id
router.get("/details/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // استرجاع تفاصيل الطلب بناءً على الـ id
    const orderDetails = await getOrderDetailsById(id); // استبدل بـ دالة الاسترجاع من الـ DB
    res.status(200).json(orderDetails);
  } catch (error) {
    console.error("Error retrieving order details:", error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

module.exports = router;
