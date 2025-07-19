import mongoose, { Schema, Types } from "mongoose";
import { randomUUID } from "crypto";

export enum PostTypeEnum {
    page = "page",
    post = "post"
}

export enum PostStatusEnum {
    draft = "draft",
    publish = "publish",
    review = "review"
}


export const postCategorySchema = new Schema({
    name: { type: String, required: true, maxLength: 150 },
    slug: { type: String, required: true, unique: true, maxLength: 150 },
    parent: { type: mongoose.Types.ObjectId },
    breadcrumbsId: { type: [String], },
    breadcrumbsSlug: { type: [mongoose.Types.ObjectId], },
});

export const seoSchema = new mongoose.Schema({
    title: String,
    description: String,
    keyword: String,
    image: String,
    urlCanonical: String,
    urlRedirect: String,
    urlRedirectStatus: Number
});

export const translationSchema = new mongoose.Schema({
    postId: mongoose.Types.ObjectId,
    type: String,
    lang: String,
    title: String,
    slug: String,
    url: String,
});

export const postSchema = new mongoose.Schema({
    uuid: { type: String, default: () => randomUUID(), unique: true },
    title: { type: String, required: true, maxLength: 150 },
    slug: { type: String, required: true, maxLength: 150 },
    excerpt: String,
    content: String,
    type: { type: String, required: true, enum: PostTypeEnum },
    lang: { type: String, required: true },
    url: String,
    translation: [translationSchema],
    status: { type: String, required: true, enum: PostStatusEnum },
    meta: {
        seo: seoSchema,
        featuredImage: String,
        featuredImageMobile: String,
    },
    category: [{ 
        categoryId: { type: Schema.Types.ObjectId, ref: 'post_categories' },
        name: String,
        slug: String,
        breadcrumbsSlug: [String]
     }],
    tags: [String],
    author: { 
        authorId: { type: Schema.Types.ObjectId, ref: 'admins' },
        name: String,
    },
    editor: {
        editorId: { type: Schema.Types.ObjectId, ref: 'admins'},
        name: String
    }

}, {
    timestamps: true
});

// ---------------
// --- INDEX ---
// ---------------

postSchema.index({ type: 1, lang: 1, slug: 1 }, { unique: true });


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


export const PostCategories = mongoose.model("post_categories", postCategorySchema);
export const Posts = mongoose.model("posts", postSchema);

export default Posts;
