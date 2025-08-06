import mongoose, { HydratedDocument, Schema, Model } from "mongoose";
import { randomUUID } from "crypto";

export interface ITranslation {
    categoryId: Schema.Types.ObjectId,
    category: Schema.Types.ObjectId | IProductCategory,
    data: {
        uuid: Schema.Types.UUID,
        lang: string,
        name: string,
        slug: string,
    }
}

export const translationSchema = new mongoose.Schema<ITranslation>({
    categoryId: Schema.Types.ObjectId,
    category: { type: Schema.Types.ObjectId, ref: 'product_categories' },
    data: {
        uuid: Schema.Types.UUID,
        lang: String,
        name: String,
        slug: String,
    }
});

export interface IProductCategory {
    _id: Schema.Types.ObjectId,
    uuid: Schema.Types.UUID,
    name: string,
    slug: string,
    lang: string,
    translation: Map<string, ITranslation>,
    parent?: {
        parentId: Schema.Types.ObjectId,
        parent: Schema.Types.ObjectId | IProductCategory
    },
    ancestors: Schema.Types.ObjectId[],
    ancestorSlugs: string[]
}

export const productCategorySchema = new mongoose.Schema<IProductCategory>({
    uuid: { type: Schema.Types.UUID, default: () => randomUUID(), unique: true },
    name: { type: String, required: true, maxLength: 150 },
    slug: { type: String, required: true, maxLength: 150, unique: true },
    lang: { type: String, required: true, maxlength: 2 },
    translation: { type: Map, of: translationSchema },
    parent: {
        parentId: Schema.Types.ObjectId,
        parent: { type: Schema.Types.ObjectId, ref: 'product_categories' }
    },
    ancestors: { type: [Schema.Types.ObjectId], ref: 'product_categories' },
    ancestorSlugs: [String],
});

// ---------------
// --- INDEX ---
// ---------------

productCategorySchema.index({ lang: 1, slug: 1 }, { unique: true });


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

type ProductCategoryModel = Model<IProductCategory>;
export const ProductCategories = mongoose.model<IProductCategory, ProductCategoryModel>("product_categories", productCategorySchema);
export default ProductCategories;


// ---------------
// --- HELPERS ---
// ---------------

/**
 * 
 * will refill for consistency of data
 * - ancestors: ObjectId[]
 * - ancestors_slug: string[]
 * - translation: Map<string, ITranslation>
 * 
 * @param data HydratedDocument<IProductCategory>
 * @returns 
 */
export const refill = async (data: HydratedDocument<IProductCategory>) => {

    await data.populate(['parent.parent', 'translation.category']);

    if (data.parent && data.parent.parent && "name" in data.parent.parent) {
        data.set('ancestors', [...data.parent.parent.ancestors, data.parent.parent._id]);
        data.set('ancestorSlugs', [...data.parent.parent.ancestorSlugs, data.parent.parent.slug]);
    }

    data.translation.forEach((value: ITranslation, key: string) => {
        if ("name" in value.category) {
            data.set(`translation.${key}.data`, {                
                ...((({ uuid, name, lang, slug }) => ({ uuid, name, lang, slug }))(value.category))
            })
        }
    });

    await data.save();

    data.depopulate('parent');

    return data;
}


// -----------------
// --- API QUERY ---
// -----------------
export const querySearch = (search: string) => {
    return {
        $or: [
            { name: { $regex: search, $options: "i" } },
        ]
    }
}

export const allowableWhereFields = [
    "uuid", "name", "slug", "lang",
    "translation", "translation.lang",
]

export const allowableWhereInFields = []



