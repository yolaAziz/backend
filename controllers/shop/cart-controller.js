// const Cart = require("../../models/Cart");
// const Product = require("../../models/Product");

// // const addToCart = async (req, res) => {
// //   try {
// //     const { userId, productId, quantity } = req.body;

// //     if (!userId || !productId || quantity <= 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid data provided!",
// //       });
// //     }

// //     const product = await Product.findById(productId);

// //     if (!product) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Product not found",
// //       });
// //     }

// //     let cart = await Cart.findOne({ userId });

// //     if (!cart) {
// //       cart = new Cart({ userId, items: [] });
// //     }

// //     const findCurrentProductIndex = cart.items.findIndex(
// //       (item) => item.productId.toString() === productId
// //     );

// //     if (findCurrentProductIndex === -1) {
// //       cart.items.push({ productId, quantity });
// //     } else {
// //       cart.items[findCurrentProductIndex].quantity += quantity;
// //     }

// //     await cart.save();
// //     res.status(200).json({
// //       success: true,
// //       data: cart,
// //     });
// //   } catch (error) {
// //     console.log(error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error",
// //     });
// //   }
// // };



// // const addToCart = async (req, res) => {
// //   try {
// //     const { userId, productId, quantity, color } = req.body;

// //     if (!userId || !productId || quantity <= 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid data provided!",
// //       });
// //     }

// //     const product = await Product.findById(productId);

// //     if (!product) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Product not found!",
// //       });
// //     }

// //     let cart = await Cart.findOne({ userId });

// //     if (!cart) {
// //       cart = new Cart({ userId, items: [] });
// //     }

// //     const findCurrentProductIndex = cart.items.findIndex(
// //       (item) => item.productId.toString() === productId && item.color === color
// //     );

// //     if (findCurrentProductIndex === -1) {
// //       cart.items.push({ productId, quantity, color }); // أضف اللون هنا
// //     } else {
// //       cart.items[findCurrentProductIndex].quantity += quantity;
// //     }

// //     await cart.save();
// //     res.status(200).json({
// //       success: true,
// //       data: cart,
// //     });
// //   } catch (error) {
// //     console.log(error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error",
// //     });
// //   }
// // };



// // const fetchCartItems = async (req, res) => {
// //   try {
// //     const { userId } = req.params;

// //     if (!userId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "User id is manadatory!",
// //       });
// //     }

// //     const cart = await Cart.findOne({ userId }).populate({
// //       path: "items.productId",
// //       select: "image title price salePrice",
// //     });

// //     if (!cart) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Cart not found!",
// //       });
// //     }

// //     const validItems = cart.items.filter(
// //       (productItem) => productItem.productId
// //     );

// //     if (validItems.length < cart.items.length) {
// //       cart.items = validItems;
// //       await cart.save();
// //     }

// //     const populateCartItems = validItems.map((item) => ({
// //       productId: item.productId._id,
// //       image: item.productId.image,
// //       title: item.productId.title,
// //       price: item.productId.price,
// //       color: item.color,
// //       salePrice: item.productId.salePrice,
// //       quantity: item.quantity,
// //     }));

// //     res.status(200).json({
// //       success: true,
// //       data: {
// //         ...cart._doc,
// //         items: populateCartItems,
// //       },
// //     });
// //   } catch (error) {
// //     console.log(error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error",
// //     });
// //   }
// // };

// const addToCart = async (req, res) => {
//   try {
//     const { userId, productId, quantity, color } = req.body;

//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "المنتج غير موجود!",
//       });
//     }

//     let cart = await Cart.findOne({ userId });

//     if (!cart) {
//       cart = new Cart({ userId, items: [] });
//     }

//     const findCurrentProductIndex = cart.items.findIndex(
//       (item) => item.productId.toString() === productId && item.color === color
//     );

//     if (findCurrentProductIndex === -1) {
//       cart.items.push({ productId, quantity, color });
//     } else {
//       cart.items[findCurrentProductIndex].quantity += quantity;
//     }

//     await cart.save();

//     res.status(200).json({
//       success: true,
//       data: cart,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "خطأ في الخادم!",
//     });
//   }
// };
// // const fetchCartItems = async (req, res) => {
// //   try {
// //     const { userId } = req.params;

// //     if (!userId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "User ID is required!",
// //       });
// //     }

// //     const cart = await Cart.findOne({ userId }).populate({
// //       path: "items.productId",
// //       select: "title image price salePrice",
// //     });

// //     if (!cart) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Cart not found!",
// //       });
// //     }

// //     const formattedItems = cart.items.map((item) => ({
// //       productId: item.productId._id,
// //       title: item.productId.title,
// //       image: item.productId.image,
// //       price: item.productId.price,
// //       salePrice: item.productId.salePrice,
// //       color: item.color, // تأكد من تضمين اللون هنا
// //       quantity: item.quantity,
// //     }));

// //     res.status(200).json({
// //       success: true,
// //       data: {
// //         ...cart._doc,
// //         items: formattedItems,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Error fetching cart items:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error fetching cart items",
// //     });
// //   }
// // };


// const fetchCartItems = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const cart = await Cart.findOne({ userId }).populate({
//       path: "items.productId",
//       select: "title image price salePrice",
//     });

//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "لا توجد سلة للطلبات!",
//       });
//     }

//     const formattedItems = cart.items.map((item) => ({
//       productId: item?.productId?._id,
//       title: item?.productId?.title,
//       image: item?.productId?.image,
//       price: item?.productId?.price,
//       salePrice: item?.productId?.salePrice,
//       color: item?.color,
//       quantity: item?.quantity,
//     }));

//     res.status(200).json({
//       success: true,
//       data: {
//         ...cart._doc,
//         items: formattedItems,
//       },
//     });
//   } catch (error) {
//     console.error("خطأ عند جلب السلة:", error);
//     res.status(500).json({
//       success: false,
//       message: "خطأ في الخادم!",
//     });
//   }
// };

// const updateCartItemQty = async (req, res) => {
//   try {
//     const { userId, productId, quantity } = req.body;

//     if (!userId || !productId || quantity <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid data provided!",
//       });
//     }

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found!",
//       });
//     }

//     const findCurrentProductIndex = cart.items.findIndex(
//       (item) => item.productId.toString() === productId
//     );

//     if (findCurrentProductIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart item not present !",
//       });
//     }

//     cart.items[findCurrentProductIndex].quantity = quantity;
//     await cart.save();

//     await cart.populate({
//       path: "items.productId",
//       select: "image title price salePrice",
//     });

//     const populateCartItems = cart.items.map((item) => ({
//       productId: item?.productId ? item?.productId?._id : null,
//       image: item?.productId ? item?.productId?.image : null,
//       title: item?.productId ? item?.productId?.title : "Product not found",
//       price: item?.productId ? item?.productId?.price : null,
//       salePrice: item?.productId ? item?.productId?.salePrice : null,
//       quantity:  item?.productId ? item?.productId.quantity : null,
//       color:  item?.productId ? item?.productId.color : null,

//     }));

//     res.status(200).json({
//       success: true,
//       data: {
//         ...cart._doc,
//         items: populateCartItems,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Error",
//     });
//   }
// };

// const deleteCartItem = async (req, res) => {
//   try {
//     const { userId, productId,color } = req.params;
//     if (!userId || !productId) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid data provided!",
//       });
//     }

//     const cart = await Cart.findOne({ userId }).populate({
//       path: "items.productId",
//       select: "image title price salePrice",
//     });

//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found!",
//       });
//     }

//     cart.items = cart.items.filter(
//       (item) => item.productId._id.toString() !== productId
//     );

//     await cart.save();

//     await cart.populate({
//       path: "items.productId",
//       select: "image title price salePrice",
//     });

//     const populateCartItems = cart.items.map((item) => ({
//       productId: item.productId ? item.productId._id : null,
//       image: item.productId ? item.productId.image : null,
//       title: item.productId ? item.productId.title : "Product not found",
//       price: item.productId ? item.productId.price : null,
//       salePrice: item.productId ? item.productId.salePrice : null,
//       quantity: item.quantity,
//       color: item.color,

//     }));

//     res.status(200).json({
//       success: true,
//       data: {
//         ...cart._doc,
//         items: populateCartItems,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Error",
//     });
//   }
// };

// // const deleteCartItem = async (req, res) => {
// //   try {
// //     const { userId, productId, color } = req.params; // إذا كنت تستخدم اللون
// //     if (!userId || !productId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid data provided!",
// //       });
// //     }

// //     const cart = await Cart.findOne({ userId }).populate({
// //       path: "items.productId",
// //       select: "image title price salePrice",
// //     });

// //     if (!cart) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Cart not found!",
// //       });
// //     }

// //     cart.items = cart.items.filter(
// //       (item) =>
// //         item.productId._id.toString() !== productId || (color && item.color !== color)
// //     );

// //     await cart.save();

// //     await cart.populate({
// //       path: "items.productId",
// //       select: "image title price salePrice",
// //     });

// //     const populateCartItems = cart.items.map((item) => ({
// //       productId: item?.productId ? item?.productId?._id : null,
// //       image: item?.productId ? item?.productId?.image : null,
// //       title: item?.productId ? item?.productId?.title : "Product not found",
// //       price: item?.productId ? item?.productId?.price : null,
// //       salePrice: item?.productId ? item?.productId?.salePrice : null,
// //       quantity:  item?.productId ? item?.productId?.quantity : null,
// //       color:  item?.productId ? item?.productId?.color : null,
// //     }));

// //     res.status(200).json({
// //       success: true,
// //       data: {
// //         ...cart._doc,
// //         items: populateCartItems,
// //       },
// //     });
// //   } catch (error) {
// //     console.log("Error in deleteCartItem:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error",
// //     });
// //   }
// // };


// module.exports = {
//   addToCart,
//   updateCartItemQty,
//   deleteCartItem,
//   fetchCartItems,
// };



// const Cart = require("../../models/Cart");
// const Product = require("../../models/Product");

// // إضافة عنصر للسلة مع التحقق من اللون
// const addToCart = async (req, res) => {
//   try {
//     const { userId, productId, quantity, color } = req.body;

//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "المنتج غير موجود!",
//       });
//     }

//     let cart = await Cart.findOne({ userId });

//     if (!cart) {
//       cart = new Cart({ userId, items: [] });
//     }

//     const findCurrentProductIndex = cart.items.findIndex(
//       (item) => item.productId.toString() === productId && item.color === color
//     );

//     if (findCurrentProductIndex === -1) {
//       cart.items.push({ productId, quantity, color });
//     } else {
//       cart.items[findCurrentProductIndex].quantity += quantity;
//     }

//     await cart.save();

//     res.status(200).json({
//       success: true,
//       data: cart,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "خطأ في الخادم!",
//     });
//   }
// };

// تحديث كمية عنصر في السلة مع التحقق من اللون
// const updateCartItemQty = async (req, res) => {
//   try {
//     const { userId, productId, quantity, color } = req.body;

//     if (!userId || !productId || quantity <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "بيانات غير صحيحة!",
//       });
//     }

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "السلة غير موجودة!",
//       });
//     }

//     const findCurrentProductIndex = cart.items.findIndex(
//       (item) => item.productId.toString() === productId && item.color === color
//     );

//     if (findCurrentProductIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "العنصر غير موجود في السلة!",
//       });
//     }

//     cart.items[findCurrentProductIndex].quantity = quantity;
//     await cart.save();

//     res.status(200).json({
//       success: true,
//       data: cart,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "خطأ في الخادم!",
//     });
//   }
// };

// // حذف عنصر من السلة مع التحقق من اللون
// const deleteCartItem = async (req, res) => {
//   try {
//     const { userId, productId, color } = req.params;

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "السلة غير موجودة!",
//       });
//     }

//     cart.items = cart.items.filter(
//       (item) => !(item.productId.toString() === productId && item.color === color)
//     );

//     await cart.save();

//     res.status(200).json({
//       success: true,
//       data: cart,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "خطأ في الخادم!",
//     });
//   }
// };

// // جلب عناصر السلة مع تضمين اللون
// const fetchCartItems = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const cart = await Cart.findOne({ userId }).populate({
//       path: "items.productId",
//       select: "title image price salePrice",
//     });

//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "لا توجد سلة للطلبات!",
//       });
//     }

//     const formattedItems = cart.items.map((item) => ({
//       productId: item?.productId?._id,
//       title: item?.productId?.title,
//       image: item?.productId?.image,
//       price: item?.productId?.price,
//       salePrice: item?.productId?.salePrice,
//       color: item?.color,
//       quantity: item?.quantity,
//     }));

//     res.status(200).json({
//       success: true,
//       data: {
//         ...cart._doc,
//         items: formattedItems,
//       },
//     });
//   } catch (error) {
//     console.error("خطأ عند جلب السلة:", error);
//     res.status(500).json({
//       success: false,
//       message: "خطأ في الخادم!",
//     });
//   }
// };

// module.exports = {
//   addToCart,
//   updateCartItemQty,
//   deleteCartItem,
//   fetchCartItems,
// };

const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// إضافة عنصر للسلة مع التحقق من اللون
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, color, additionalDetails } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.color === color
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity, color, additionalDetails });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title image price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const formattedItems = cart.items.map((item) => ({
      productId: item?.productId?._id,
      title: item?.productId?.title,
      image: item?.productId?.image,
      price: item?.productId?.price,
      salePrice: item?.productId?.salePrice,
      color: item?.color,
      quantity: item?.quantity,
      additionalDetails: item?.additionalDetails || null,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: formattedItems,
      },
    });
  } catch (error) {
    console.error("Error in fetchCartItems:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity, } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present !",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

// تحديث كمية عنصر في السلة مع التحقق من اللون
// const updateCartItemQty = async (req, res) => {
//   try {
//     const { userId, productId, quantity, color } = req.body;

//     if (!userId || !productId || quantity <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "بيانات غير صحيحة!",
//       });
//     }

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "السلة غير موجودة!",
//       });
//     }

//     const findCurrentProductIndex = cart.items.findIndex(
//       (item) => item.productId.toString() === productId && item.color === color
//     );

//     if (findCurrentProductIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "العنصر غير موجود في السلة!",
//       });
//     }

//     cart.items[findCurrentProductIndex].quantity = quantity;
//     await cart.save();

//     res.status(200).json({
//       success: true,
//       data: cart,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "خطأ في الخادم!",
//     });
//   }
// };

// حذف عنصر من السلة مع التحقق من اللون
// const deleteCartItem = async (req, res) => {
//   try {
//     const { userId, productId, color } = req.params;

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "السلة غير موجودة!",
//       });
//     }

//     cart.items = cart.items.filter(
//       (item) => !(item.productId.toString() === productId && item.color === color)
//     );

//     await cart.save();

//     res.status(200).json({
//       success: true,
//       data: cart,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "خطأ في الخادم!",
//     });
//   }
// };

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      color: item?.color,
      quantity: item?.quantity,
      additionalDetails: item?.additionalDetails || null,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};


module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};



