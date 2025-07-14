const mongoose = require("mongoose");
const { randomUUID } = require('crypto');
const productSchema = require("./product.schema");
const addressSchema = require("./address.schema");


mongoose.set("strictQuery", true);

const productShortSchema = new mongoose.Schema({
    productId: String,
    productUuid: String,
    sku: String,
    title: String,
    slug: String,
    url: String,
    image: String,
    price: String,
    stock: Number,
});

const productDetailSchema = new mongoose.Schema({
    ...productSchema.obj
});

const orderAttachmentSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: randomUUID(),
        index: { unique: true }
    },
    type: {
        type: String,
        enum: ["image", 'video', 'file'],
    },
    name: String,
    path: String,
    repository: String,
});

const orderItemSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: randomUUID(),
        index: { unique: true },
    },
    quantity: Number,
    priceTotal: String,
    product: productShortSchema,
    productDetail : productDetailSchema
});

const orderStatusHistorySchema = new mongoose.Schema({
    orderId: mongoose.Types.ObjectId,
    deliveryAt: Date,
    name: String,
    message: String,
    attachment: [orderAttachmentSchema]
},{
    timestamps: true
});

const cartSchema = new mongoose.Schema({
    uuid: {
      type: String,
      default: randomUUID(),
      index: { unique: true },
    },
    memberId : { type: mongoose.Types.ObjectId },
    memberUuid : { type: String, required: true },
    priceTotal : { type: String },
    message: String,
    items: [orderItemSchema]
},
{
    timestamps: true,
    optimisticConcurrency: true
});

const shippingSchema = new mongoose.Schema({
    orderId: mongoose.Schema.ObjectId,
    address: addressSchema,
    weight: Number,
    dimension: {
        width: Number, 
        length: Number,
        height: Number,
        area: Number
    },
    message: String,
    shippingProvider: String,
    shippingPrice: String,
    shippingCode: String,
    shippingTrackUrl: String,
});

const orderShippingHistorySchema = new mongoose.Schema({
    updatedAt: Date,
    destination: String,
    message: String,
    attachment: [orderAttachmentSchema]
});

const orderSchema = new mongoose.Schema({
    ...cartSchema.obj,
    status : String,
    statusHistory : [orderStatusHistorySchema],
    shipping : shippingSchema,
    shippingHistory : [orderShippingHistorySchema]
}); 


// ---------------
// --- VIRTUAL ---
// ---------------



// ---------------
// --- METHODS ---
// ---------------


// ---------------
// --- STATICS ---
// ---------------



// ---------------
// --- HOOKS ---
// ---------------


module.exports = mongoose.model("OrderItems", orderItemSchema);
module.exports = mongoose.model("ProductDetails", productDetailSchema);
module.exports = mongoose.model("Carts", cartSchema);
module.exports = mongoose.model("Orders", orderSchema);
module.exports = mongoose.model("OrderAttachments", orderAttachmentSchema);

