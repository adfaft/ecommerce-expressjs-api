import mongoose, { Schema, Types} from "mongoose";
import { randomUUID } from "crypto";
import productSchema from "./product.schema";
import addressSchema from "./address.schema";


mongoose.set("strictQuery", true);

export const productShortSchema = new mongoose.Schema({
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

export const productDetailSchema = new mongoose.Schema({
    ...productSchema.obj
});

export const orderAttachmentSchema = new mongoose.Schema({
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

export const orderItemSchema = new mongoose.Schema({
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

export const orderStatusHistorySchema = new mongoose.Schema({
    orderId: mongoose.Types.ObjectId,
    deliveryAt: Date,
    name: String,
    message: String,
    attachment: [orderAttachmentSchema]
},{
    timestamps: true
});

export const cartSchema = new mongoose.Schema({
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

export const shippingSchema = new mongoose.Schema({
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

export const orderShippingHistorySchema = new mongoose.Schema({
    updatedAt: Date,
    destination: String,
    message: String,
    attachment: [orderAttachmentSchema]
});

export const orderSchema = new mongoose.Schema({
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


export const OrderItems = mongoose.model("order_items", orderItemSchema);
export const ProductDetails = mongoose.model("product_details", productDetailSchema);
export const Carts = mongoose.model("carts", cartSchema);
export const Orders = mongoose.model("orders", orderSchema);
export const OrderAttachments = mongoose.model("order_attachments", orderAttachmentSchema);

export default Orders;