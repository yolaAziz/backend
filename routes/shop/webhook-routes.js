const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");
const baseURL = process.env.REACT_APP_API_URL;

// Endpoint لاستقبال إشعارات Webhook من Paymob
router.post("/webhook/paymob", async (req, res) => {
  try {
    const { id, order, success, txn_response_code, amount_cents, currency, paymentId, orderId } = req.body;

    // التحقق من البيانات المرسلة
    if (!id || !order || typeof success === 'undefined') {
      return res.status(400).json({ success: false, message: "Invalid Webhook Data" });
    }

    // الحصول على بيانات الطلب من قاعدة البيانات
    const orderData = await Order.findById(orderId);

    if (!orderData) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // التحقق من نجاح الدفع
    if (success && txn_response_code === "APPROVED") {
      orderData.paymentStatus = "paid";  // الدفع تم بنجاح
    } else {
      orderData.paymentStatus = "failed";  // الدفع فشل أو لم يتم الموافقة عليه
    }

    // تحديث المبلغ المدفوع في الطلب
    orderData.amountPaid = amount_cents / 100;  // تحويل المبلغ من قروش إلى جنيه

    // حفظ حالة الطلب بعد التحديث
    await orderData.save();

    // الرابط الذي سيتم إعادة توجيه المستخدم إليه
    const redirectUrl =`${baseURL}/shop/paymob-return`

    // إعادة توجيه المستخدم إلى الرابط بعد المعالجة
    return res.redirect(redirectUrl);  // إعادة توجيه مباشرة إلى صفحة إتمام الدفع

  } catch (error) {
    console.error("Error in Webhook:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
