import mongoose, { Decimal128, HydratedDocument, Model, Schema, Types } from "mongoose";
import { randomUUID } from "crypto"
import Discounts, { discountSchema, IDiscount } from "./product_discounts.schema.js";
import { ISku, skuSchema } from "./product_skus.schema.js";
import ProductCategories, { IProductCategory } from "./product_categories.schema.js";

export enum ProductStatusEnum {
    draft = "draft",
    publish = "publish",
    review = "review"
}


export interface IProduct {
    _id: Schema.Types.ObjectId,
    uuid: Schema.Types.UUID,
    title: string,
    slug: string,
    description: string,

    lang: string,
    translation: Map<string, ITranslation>,
    url?: string, // virtual

    publishedAt: Date,
    status: ProductStatusEnum

    deletedAt: Date,

    // TODO: belum ada SEO
    categories: IProductCategorySchema[],
    attributes: IProductAttribute[],
    variants: IProductVariant[],

    sku: ISku,
    discount: IDiscount,
    skuDiscount: IProductSkuDiscount,
}


export interface IProductCategorySchema {
    categoryId: Schema.Types.ObjectId,
    category: Schema.Types.ObjectId | IProductCategory,
    data: {
        uuid: Schema.Types.UUID,
        name: string,
        slug: string,
        parent: {
            parentId: Schema.Types.ObjectId,
            parent: Schema.Types.ObjectId | IProductCategory,
        }
    }
}

export const productCategorySchema = new mongoose.Schema({
    categoryId: Schema.Types.ObjectId,
    category: { type: Schema.Types.ObjectId, ref: ProductCategories },
    data: {
        uuid: Schema.Types.UUID,
        name: { type: String, required: true, maxLength: 100 },
        slug: { type: String, required: true, maxLength: 100 },
        parent: {
            parentId: { type: Schema.Types.ObjectId },
            parent: { type: Schema.Types.ObjectId, ref: ProductCategories }
        },
    }

});


// attribute pattern
export interface IProductAttribute {
    type: string,
    name: string,
    value: string,
}

export const productAttributeSchema = new mongoose.Schema<IProductAttribute>({
    // example: clothes_top
    type: String,
    // example: clothes_top:size, clothes_top:color
    name: String,
    // example: clothes_top:size = s/m/l/xl/xxl/xxxl
    value: String,
});


export interface IProductVariant {
    productId: Schema.Types.ObjectId,
    product: Schema.Types.ObjectId | IProduct,
    data: {
        uuid: Schema.Types.UUID,
        title: string,
        slug: string,
        lang: string,
        attributes: IProductAttribute[],
    }
}

export const productVariantSchema = new mongoose.Schema<IProductVariant>({
    productId: Schema.Types.ObjectId,
    product: { type: Schema.Types.ObjectId, ref: "products" },
    data: {
        uuid: Schema.Types.ObjectId,
        title: String,
        slug: String,
        lang: String,
        attributes: [productAttributeSchema]
    }
});


export interface ITranslation {
    productId: Schema.Types.ObjectId,
    product: Schema.Types.ObjectId | IProduct,
    data: {
        uuid: Schema.Types.UUID,
        title: string,
        slug: string,
        lang: string,
        url?: string, // virtual
        attributes: Map<string, IProductAttribute>,
    }
}

export const translationSchema = new mongoose.Schema<ITranslation>({
    productId: Schema.Types.ObjectId,
    product: { type: Schema.Types.ObjectId, ref: 'products' },
    data: {
        uuid: Schema.Types.UUID,
        type: String,
        lang: String,
        title: String,
        slug: String,
        attributes: { type: Map, of: productVariantSchema },
    }
});


export interface IProductSkuDiscount {
    code: string,
    discount: {
        discountId: Schema.Types.ObjectId,
        discountUuid: Schema.Types.UUID,
        discount: Schema.Types.ObjectId | IDiscount,
    },
    discountPrice: Decimal128,
}

export const productSkuDiscountSchema = new mongoose.Schema<IProductSkuDiscount>({
    code: { type: String, required: true, minLength: 3 },
    discount: {
        discountId: Schema.Types.ObjectId,
        discountUuid: Schema.Types.UUID,
        discount: { type: Schema.Types.ObjectId, ref: Discounts }
    },
    discountPrice: { type: Schema.Types.Decimal128, required: true }
});

export const productSchema = new mongoose.Schema({
    uuid: { type: String, default: randomUUID(), unique: true },
    title: { type: String, maxLength: 150, },
    slug: { type: String, maxLength: 150, },
    description: { type: String },

    lang: String,
    translation: { type: Schema.Types.Map, of: translationSchema },
    url: { type: String },

    publishedAt: Date,
    status: { type: String, enum: ProductStatusEnum },

    deletedAt: Date,

    categories: [productCategorySchema],
    attributes: [productAttributeSchema],
    variants: [productVariantSchema],

    sku: skuSchema,
    discount: discountSchema,
    skuDiscount: productSkuDiscountSchema,
});



// ---------------
// --- INDEX ---
// ---------------


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



// ---------------
// --- MODEL ---
// ---------------


type ProductModel = Model<IProduct>
export const Products = mongoose.model<IProduct, ProductModel>("products", productSchema);
export default Products;


// ---------------
// --- HELPERS ---
// ---------------
export const refill = async function(data: HydratedDocument<IProduct>) : Promise<HydratedDocument<IProduct>> {

    return data;
};



// -----------------
// --- API QUERY ---
// -----------------
export const querySearch = (search: string) => {
    return {
        $or: [
            { title: { $regex: search, $options: "i" } },
            { excerpt: { $regex: search, $options: "i" } }
        ]
    }
}

export const allowableWhereFields = [
    "uuid", "title", "slug", "lang", "status",
    "translation.data.lang",
]

export const allowableWhereInFields = [
    "categories.slug",
]


