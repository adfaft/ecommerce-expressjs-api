import mongoose, { Schema, Types, Model, HydratedDocument } from "mongoose";
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

export interface ISeo{
    title?: string,
    description?: string,
    keyword?: string,
    image?: string,
    urlCanonical?: string,
    urlRedirect?: string,
    urlRedirectStatus?: number
}

export const seoSchema = new mongoose.Schema<ISeo>({
    title: String,
    description: String,
    keyword: String,
    image: String,
    urlCanonical: String,
    urlRedirect: String,
    urlRedirectStatus: Number
});

export interface ITranslation{
    postId: Types.ObjectId,
    type: string,
    lang: string,
    title: string,
    slug: string,
    url: string,
}

export const translationSchema = new mongoose.Schema<ITranslation>({
    postId: Types.ObjectId,
    type: String,
    lang: String,
    title: String,
    slug: String,
    url: String,
});

export interface IPost{
    uuid: Schema.Types.UUID,
    title: string,
    slug: string,
    excerpt: string,
    content: string,
    type: string,
    lang: string,
    translation: ITranslation[],
    status: string,
    meta: {
        seo: ISeo,
        featuredImage: string,
        featuredImageMobile: string,
    },
    tags: string[],
    author?: {
        authorId: Types.ObjectId,
        name: string
    },
    editor?: {
        editorId: Types.ObjectId,
        name: string
    }
}

export const postSchema = new mongoose.Schema<IPost, Model<IPost>>({
    uuid: { type: Schema.Types.UUID, default: () => randomUUID(), unique: true },
    title: { type: String, required: true, maxLength: 150 },
    slug: { type: String, required: true, maxLength: 150 },
    excerpt: String,
    content: String,
    type: { type: String, required: true, enum: PostTypeEnum },
    lang: { type: String, required: true },
    translation: [translationSchema],
    status: { type: String, required: true, enum: PostStatusEnum },
    meta: {
        seo: seoSchema,
        featuredImage: String,
        featuredImageMobile: String,
    },
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

postSchema.virtual('post_categories', {
    ref: 'post_categories',
    localField:  '_id',
    foreignField: 'postId',
});


// ---------------
// --- METHODS ---
// ---------------


// ---------------
// --- STATICS ---
// ---------------



// ---------------
// --- HOOKS ---
// ---------------

type PostModel = Model<IPost>;

postSchema.pre(['find', 'findOne'], function(){
    this.populate('post_categories');
});

export const Posts = mongoose.model<IPost, PostModel>("posts", postSchema);

export default Posts;
