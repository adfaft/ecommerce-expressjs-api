const mongoose = require("mongoose");


mongoose.set("strictQuery", true);

const postCategorySchema = new mongoose.Schema({
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

const seoSchema = new mongoose.Schema({
    title: String,
    description: String,
    keyword: String,
    image: String,
    urlCanonical: String,
    urlRedirect: String,
    urlRedirectStatus: Number
});

const translationSchema = new mongoose.Schema({
    postId: mongoose.Types.ObjectId,
    type: String,
    lang: String,
    title: String,
    slug: String,
    url: String,
});

const postSchema = new mongoose.Schema(
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



module.exports = mongoose.model("Posts", postSchema);
