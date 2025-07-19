import mongoose, { Schema, Types} from "mongoose";
const { randomUUID } = require("crypto")

export const skuSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        minLength: 3
    },
    price: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    discount: skuDiscountSchema,
    discountedPrice: Number
});

export const skuDiscountSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        minLength: 3
    },
    startDate: Date,
    endDate: Date,
    discountValue: Number,
    discountUnit: {
        type: String,
        enum: ["%", "$"] // percentage, fixed-value
    },
});


export const productCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 100,
    },
    slug: {
        type: String,
        required: true,
        maxLength: 100,
    },
    parent: {
        type: mongoose.Types.ObjectId
    },
    breadcrumbs: {
        type: [String],
    },
    breadcrumbsPath: {
        type: [String],
    }
});

export const variantAttrSchema = new mongoose.Schema({
    category: {
        // example: clothes_top
        type: String,
    },
    name: {
        // example: clothes_top:size, clothes_top:color
        type: String,
    },
    value: {
        // example: clothes_top:size = s/m/l/xl/xxl/xxxl
        type: String,
    },
});


export const productSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: randomUUID()
    },
    title: {
        type: String,
        maxLength: 150,
    },
    slug: {
        type: String,
        maxLength: 150,
    },
    url: {
        type: String,
    },
    description: {
        type: String,
    },
    sku: skuSchema,
    category: [productCategorySchema],
    variantAttribute: [variantAttrSchema],
    otherVariants: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }],
        select: false
    }
});


export const Skus = mongoose.model("skus", skuSchema);
export const Products = mongoose.model("products", productSchema);

export default Products;


