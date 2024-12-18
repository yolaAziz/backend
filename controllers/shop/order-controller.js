const paymob = require("../../helpers/paymob");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const mongoose = require("mongoose");
const axios = require("axios");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch");


// const initiatePayment = async (req, res) => {
//     try {
//       const { amount, billingData, orderData } = req.body;
  
//       // مصادقة مع Paymob
//       const authToken = await paymob.authenticate();
  
//       // إنشاء طلب في Paymob
//       const paymobOrderId = await paymob.createOrder(authToken, amount);
  
//       // إنشاء طلب في قاعدة البيانات مع ربطه بـ MongoDB orderId المحلي
//       const order = new Order({
//         ...orderData,
//         orderStatus: "pending",
//         paymentMethod: "paymob",
//         paymentStatus: "pending",
//         totalAmount: amount,
//         orderDate: new Date(),
//         orderUpdateDate: new Date(),
//         paymobOrderId: paymobOrderId, // Paymob orderId
//       });
  
//       // حفظ الطلب في MongoDB
//       const savedOrder = await order.save();
  
//       // إنشاء مفتاح الدفع
//       const paymentKey = await paymob.generatePaymentKey(
//         authToken,
//         paymobOrderId,
//         amount,
//         billingData
//       );
  
//       // إرجاع البيانات إلى العميل
//       res.status(200).json({
//         success: true,
//         paymentKey,
//         orderId: savedOrder._id, // orderId من MongoDB
//         paymobOrderId, // orderId من Paymob
//       });
//     } catch (error) {
//       console.error("Payment initiation error:", error.message);
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };
  

// إرجاع الـ orderId بناءً على الـ paymentId بعد الدفع

const initiatePayment = async (req, res) => {
  try {
    const { amount, billingData, orderData, paymentMethod } = req.body;

    // التحقق من المدخلات الأساسية
    if (!amount || !orderData || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: amount, orderData, or paymentMethod",
      });
    }

    // معالجة الدفع بناءً على طريقة الدفع
    if (paymentMethod === "cod") {
      // منطق الدفع عند الاستلام (Cash on Delivery)
      const order = new Order({
        ...orderData,
        orderStatus: "pending",
        paymentMethod: "cod",
        paymentStatus: "pending",
        totalAmount: amount,
        orderDate: new Date(),
        orderUpdateDate: new Date(),
      });

      const savedOrder = await order.save();
      return res.status(200).json({
        success: true,
        message: "Order created for COD payment",
        orderId: savedOrder._id, // إرجاع ID الطلب
      });
    } else if (paymentMethod === "paymob") {
      // منطق الدفع عبر Paymob
      const authToken = await paymob.authenticate();

      const paymobOrderId = await paymob.createOrder(authToken, amount);

      const order = new Order({
        ...orderData,
        orderStatus: "pending",
        paymentMethod: "paymob",
        paymentStatus: "pending",
        totalAmount: amount,
        orderDate: new Date(),
        orderUpdateDate: new Date(),
        paymobOrderId: paymobOrderId, // Paymob orderId
      });

      const savedOrder = await order.save();

      const paymentKey = await paymob.generatePaymentKey(
        authToken,
        paymobOrderId,
        amount,
        billingData
      );

      return res.status(200).json({
        success: true,
        paymentKey,
        orderId: savedOrder._id, // MongoDB orderId
        paymobOrderId, // Paymob orderId
      });
    } else {
      // طريقة الدفع غير معروفة
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }
  } catch (error) {
    console.error("Error in initiating payment:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const capturePayment = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;

        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order cannot be found",
            });
        }

        // تحديث حالة الدفع بعد النجاح
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = paymentId;  // هنا تقوم بتخزين paymentId من Paymob في order
        order.payerId = payerId;

        // معالجة المنتجات وخصم الكمية
        for (let item of order.cartItems) {
            let product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Not enough stock for this product ${product.title}`,
                });
            }

            product.totalStock -= item.quantity;
            await product.save();
        }

        // حذف الـ Cart المرتبط بالطلب
        await Cart.findByIdAndDelete(order.cartId);

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order confirmed",
            paymentId,  // إرجاع الـ paymentId في الاستجابة بعد التحقق من الدفع
            data: order,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
};


const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const orders = await Order.find({ userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log("Error fetching orders by user:", e.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching orders",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log("Error fetching order details:", e.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching order details",
    });
  }
};

module.exports = {
  initiatePayment,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};







// const paymob = require("../../helpers/paymob");
// const Order = require("../../models/Order");
// const Cart = require("../../models/Cart");
// const Product = require("../../models/Product");
// const mongoose = require("mongoose");
// const axios = require("axios");
// const { LocalStorage } = require("node-localstorage");
// const localStorage = new LocalStorage("./scratch");


// // const initiatePayment = async (req, res) => {
// //     try {
// //       const { amount, billingData, orderData } = req.body;
  
// //       // مصادقة مع Paymob
// //       const authToken = await paymob.authenticate();
  
// //       // إنشاء طلب في Paymob
// //       const paymobOrderId = await paymob.createOrder(authToken, amount);
  
// //       // إنشاء طلب في قاعدة البيانات مع ربطه بـ MongoDB orderId المحلي
// //       const order = new Order({
// //         ...orderData,
// //         orderStatus: "pending",
// //         paymentMethod: "paymob",
// //         paymentStatus: "pending",
// //         totalAmount: amount,
// //         orderDate: new Date(),
// //         orderUpdateDate: new Date(),
// //         paymobOrderId: paymobOrderId, // Paymob orderId
// //       });
  
// //       // حفظ الطلب في MongoDB
// //       const savedOrder = await order.save();
  
// //       // إنشاء مفتاح الدفع
// //       const paymentKey = await paymob.generatePaymentKey(
// //         authToken,
// //         paymobOrderId,
// //         amount,
// //         billingData
// //       );
  
// //       // إرجاع البيانات إلى العميل
// //       res.status(200).json({
// //         success: true,
// //         paymentKey,
// //         orderId: savedOrder._id, // orderId من MongoDB
// //         paymobOrderId, // orderId من Paymob
// //       });
// //     } catch (error) {
// //       console.error("Payment initiation error:", error.message);
// //       res.status(500).json({ success: false, message: error.message });
// //     }
// //   };
  

// // إرجاع الـ orderId بناءً على الـ paymentId بعد الدفع

// const initiatePayment = async (req, res) => {
//   try {
//     const { amount, billingData, orderData, paymentMethod } = req.body;

//     if (paymentMethod === "cash") {
//       // إذا كان الدفع عند الاستلام، يتم إنشاء الطلب دون تهيئة Paymob.
//       const order = new Order({
//         ...orderData,
//         orderStatus: "pending",
//         paymentMethod: "cash",
//         paymentStatus: "pending",
//         totalAmount: amount,
//         orderDate: new Date(),
//         orderUpdateDate: new Date(),
//       });

//       const savedOrder = await order.save();

//       return res.status(200).json({
//         success: true,
//         message: "Cash on delivery order created",
//         orderId: savedOrder._id,
//       });
//     }

//     // إذا كان الدفع عبر Paymob، يتم المتابعة مع Paymob
//     const authToken = await paymob.authenticate();
//     const paymobOrderId = await paymob.createOrder(authToken, amount);

//     const order = new Order({
//       ...orderData,
//       orderStatus: "pending",
//       paymentMethod: "paymob",
//       paymentStatus: "pending",
//       totalAmount: amount,
//       orderDate: new Date(),
//       orderUpdateDate: new Date(),
//       paymobOrderId: paymobOrderId,
//     });

//     const savedOrder = await order.save();
//     const paymentKey = await paymob.generatePaymentKey(
//       authToken,
//       paymobOrderId,
//       amount,
//       billingData,
//       paymentMethod,
//     );

//     res.status(200).json({
//       success: true,
//       paymentKey,
//       orderId: savedOrder._id,
//     });
//   } catch (error) {
//     console.error("Payment initiation error:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



// // const capturePayment = async (req, res) => {
// //     try {
// //         const { paymentId, payerId, orderId } = req.body;

// //         let order = await Order.findById(orderId);

// //         if (!order) {
// //             return res.status(404).json({
// //                 success: false,
// //                 message: "Order cannot be found",
// //             });
// //         }

// //         // تحديث حالة الدفع بعد النجاح
// //         order.paymentStatus = "paid";
// //         order.orderStatus = "confirmed";
// //         order.paymentId = paymentId;  // هنا تقوم بتخزين paymentId من Paymob في order
// //         order.payerId = payerId;

// //         // معالجة المنتجات وخصم الكمية
// //         for (let item of order.cartItems) {
// //             let product = await Product.findById(item.productId);

// //             if (!product) {
// //                 return res.status(404).json({
// //                     success: false,
// //                     message: `Not enough stock for this product ${product.title}`,
// //                 });
// //             }

// //             product.totalStock -= item.quantity;
// //             await product.save();
// //         }

// //         // حذف الـ Cart المرتبط بالطلب
// //         await Cart.findByIdAndDelete(order.cartId);

// //         await order.save();

// //         res.status(200).json({
// //             success: true,
// //             message: "Order confirmed",
// //             paymentId,  // إرجاع الـ paymentId في الاستجابة بعد التحقق من الدفع
// //             data: order,
// //         });
// //     } catch (e) {
// //         console.log(e);
// //         res.status(500).json({
// //             success: false,
// //             message: "Some error occurred!",
// //         });
// //     }
// // };

// const capturePayment = async (req, res) => {
//   try {
//     const { paymentId, payerId, orderId } = req.body;

//     let order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order cannot be found",
//       });
//     }

//     if (order.paymentMethod === "paymob") {
//       // تحديث حالة الدفع بعد النجاح عبر Paymob
//       order.paymentStatus = "paid";
//       order.orderStatus = "confirmed";
//       order.paymentId = paymentId;
//       order.payerId = payerId;

//       // خصم الكمية من المخزون
//       for (let item of order.cartItems) {
//         let product = await Product.findById(item.productId);

//         if (!product) {
//           return res.status(404).json({
//             success: false,
//             message: `Not enough stock for this product ${product?.title}`,
//           });
//         }

//         product.totalStock -= item.quantity;
//         await product.save();
//       }

//       // حذف الـ Cart المرتبط بالطلب
//       await Cart.findByIdAndDelete(order.cartId);

//       await order.save();

//       return res.status(200).json({
//         success: true,
//         message: "Payment successful via Paymob.",
//         paymentId,
//         data: order,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "No Paymob payment was attempted.",
//     });
//   } catch (error) {
//     console.error("Error in processing payment:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred!",
//     });
//   }
// };

// const getAllOrdersByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID is required",
//       });
//     }

//     const orders = await Order.find({ userId });

//     if (!orders || orders.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No orders found for this user",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: orders,
//     });
//   } catch (e) {
//     console.log("Error fetching orders by user:", e.message);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching orders",
//     });
//   }
// };

// const getOrderDetails = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Order ID is required",
//       });
//     }

//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found with this ID",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: order,
//     });
//   } catch (e) {
//     console.log("Error fetching order details:", e.message);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching order details",
//     });
//   }
// };

// module.exports = {
//   initiatePayment,
//   capturePayment,
//   getAllOrdersByUser,
//   getOrderDetails,
// };




////trrry 





// const paymob = require("../../helpers/paymob");
// const Order = require("../../models/Order");
// const Cart = require("../../models/Cart");
// const Product = require("../../models/Product");
// const mongoose = require("mongoose");
// const axios = require("axios");
// const { LocalStorage } = require("node-localstorage");
// const localStorage = new LocalStorage("./scratch");


// const initiatePayment = async (req, res) => {
//   try {
//     const { amount, billingData, orderData, paymentMethod } = req.body;

//     if (paymentMethod === "cash_on_delivery") {
//       const order = new Order({
//         ...orderData,
//         orderStatus: "pending",
//         paymentMethod: "cash_on_delivery",
//         paymentStatus: "pending",
//         totalAmount: amount,
//         orderDate: new Date(),
//         orderUpdateDate: new Date(),
//       });

//       const savedOrder = await order.save();
//       res.status(200).json({
//         success: true,
//         message: "Order placed with cash on delivery",
//         orderId: savedOrder._id,
//       });
//     } else if (paymentMethod === "paymob") {
//       const authToken = await paymob.authenticate();
//       console.log("Paymob Auth Token:", authToken);
//       if (!authToken) throw new Error("Failed to authenticate with Paymob");

//       const paymobOrderId = await paymob.createOrder(authToken, amount);
//       console.log("Paymob Order ID:", paymobOrderId);

//       if (!paymobOrderId) throw new Error("Failed to create Paymob order");

//       const paymentKey = await paymob.generatePaymentKey(
//         authToken,
//         paymobOrderId,
//         amount,
//         billingData
//       );
//       console.log("Paymob Payment Key:", paymentKey);

//       if (!paymentKey) throw new Error("Failed to generate Paymob payment key");

//       const order = new Order({
//         ...orderData,
//         orderStatus: "pending",
//         paymentMethod: "paymob",
//         paymentStatus: "pending",
//         totalAmount: amount,
//         orderDate: new Date(),
//         orderUpdateDate: new Date(),
//         paymobOrderId,
//       });

//       const savedOrder = await order.save();
//       res.status(200).json({
//         success: true,
//         paymentKey,
//         orderId: savedOrder._id,
//         paymobOrderId,
//       });
//     } else {
//       throw new Error("Invalid payment method");
//     }
//   } catch (error) {
//     console.error("Error during payment initiation:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // تأكيد الدفع (عند الدفع عبر Paymob)
// const capturePayment = async (req, res) => {
//   try {
//     const { paymentId, payerId, orderId } = req.body;

//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order cannot be found",
//       });
//     }

//     order.paymentStatus = "paid";
//     order.orderStatus = "confirmed";
//     order.paymentId = paymentId;
//     order.payerId = payerId;

//     for (let item of order.cartItems) {
//       const product = await Product.findById(item.productId);

//       if (!product || product.totalStock < item.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Not enough stock for product ${product?.title}`,
//         });
//       }

//       product.totalStock -= item.quantity;
//       await product.save();
//     }

//     await Cart.findByIdAndDelete(order.cartId);
//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Payment captured and order confirmed",
//       paymentId,
//       data: order,
//     });
//   } catch (error) {
//     console.error("Error during payment capture:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred",
//     });
//   }
// };

// const getAllOrdersByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID is required",
//       });
//     }

//     const orders = await Order.find({ userId });

//     if (!orders || orders.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No orders found for this user",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: orders,
//     });
//   } catch (e) {
//     console.log("Error fetching orders by user:", e.message);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching orders",
//     });
//   }
// };

// const getOrderDetails = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Order ID is required",
//       });
//     }

//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found with this ID",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: order,
//     });
//   } catch (e) {
//     console.log("Error fetching order details:", e.message);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching order details",
//     });
//   }
// };

// module.exports = {
//   initiatePayment,
//   capturePayment,
//   getAllOrdersByUser,
//   getOrderDetails,
// };


