import mongoose, { Schema, Types} from "mongoose";
import { randomUUID } from "crypto";


mongoose.set("strictQuery", true);

export const postCategorySchema = new Schema({
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

export const postSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: randomUUID(),
      index: { unique: true },
    },
    title : { type: String, required: true},
    slug : { type: String, required: true},
    excerpt : String,
    content : String,
    type : { 
        type: String, 
        required: true,
        enum: ['post', 'page']
    },
    lang : { type: String, required: true},
    url : { type: String, required: true},
    translation : [translationSchema],
    status : { 
        type: String, 
        required: true, 
        enum : ['draft', 'published', 'review']
    },
    meta : {
        seo: seoSchema,
        featuredImage: String,
        featuredImageMobile: String,
    },
    category : [postCategorySchema],
    tags : [String]

    },
    {
        timestamps: true,
    }
);

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


export const Posts = mongoose.model("Posts", postSchema);

export default Posts;
