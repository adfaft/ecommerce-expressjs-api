import mongoose, { Schema, Model, HydratedDocument } from "mongoose";
import { randomUUID } from "crypto";
import { IAdmin } from "./admins.schema.js";
import PostCategories, { IPostCategory } from "./post_categories.schema.js";
import Admins from "./admins.schema.js";

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
    postId: Schema.Types.ObjectId,
    post: Schema.Types.ObjectId | IPost,
    data: {
        uuid: Schema.Types.UUID,
        type: string,
        lang: string,
        title: string,
        slug: string,
    }
}

export const translationSchema = new mongoose.Schema<ITranslation>({
    postId: Schema.Types.ObjectId,
    post: { type: Schema.Types.ObjectId, ref: 'posts' },
    data: {
        uuid: Schema.Types.UUID,
        type: String,
        lang: String,
        title: String,
        slug: String,
    }
});

export interface IPost{
    _id: Schema.Types.ObjectId,
    uuid: Schema.Types.UUID,
    title: string,
    slug: string,
    excerpt: string,
    content: string,
    type: PostTypeEnum,
    lang: string,
    translation: Map<string, ITranslation>,
    status: PostStatusEnum,
    meta: {
        seo: ISeo,
        featuredImage: string,
        featuredImageMobile: string,
    },
    tags: string[],
    categories?: {
        categoryId: Schema.Types.ObjectId,
        category: Schema.Types.ObjectId | IPostCategory,
        data: {
            uuid: Schema.Types.UUID,
            name: string,
            slug: string,
            lang: string,
            ancestors_slug: string[] 
        }
       
    }[],
    author: {
        authorId: Schema.Types.ObjectId,
        author: Schema.Types.ObjectId | IAdmin,
        data: {
            fullName: string
        }
    }
    editor: {
        editorId?: Schema.Types.ObjectId,
        editor?: Schema.Types.ObjectId | IAdmin,
        data: {
            fullName?: string
        }
        
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
    translation: { type: Map, of: translationSchema },
    status: { type: String, required: true, enum: PostStatusEnum },
    meta: {
        seo: seoSchema,
        featuredImage: String,
        featuredImageMobile: String,
    },
    categories: [{
        categoryId: Schema.Types.ObjectId,
        category: { type: Schema.Types.ObjectId, ref: PostCategories },
        data: {
            uuid: Schema.Types.UUID,
            name: String,
            slug: String,        
            lang: String,
            ancestors_slug: [String],
        }
    }],
    tags: [String],
    author: { 
        authorId: Schema.Types.ObjectId,
        author: { type: Schema.Types.ObjectId, ref: Admins },
        data: {
            fullName: String,
        }
        
     },
    editor: {
        editorId: Schema.Types.ObjectId,
        editor: { type: Schema.Types.ObjectId, ref: Admins},
        data: {
            fullName: String
        }
    }

}, {
    timestamps: true,
    toJSON: {
        getters: true,
        transform(doc: IPost, ret: any){
            delete ret.__v;
        }
    }
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



// ---------------
// --- MODEL ---
// ---------------

type PostModel = Model<IPost>;
export const Posts = mongoose.model<IPost, PostModel>("posts", postSchema);
export default Posts;



// ---------------
// --- HELPERS ---
// ---------------
export const refill = async function(data: HydratedDocument<IPost>) : Promise<HydratedDocument<IPost>> {

    await data.populate([
        'author.author',
        'editor.editor',
        'translation.post',
        'categories.category'
    ]);
    


    if( "uuid" in data.author.author ){
        data.set('author.data', {
            ...((({ fullName }) => ({ fullName }))(data.author.author))
        });
    }

    if( data.editor.editor && "uuid" in data.editor.editor ){
         data.set('editor.data', {
            ...((({ fullName }) => ({ fullName }))(data.editor.editor))
        });
    }

    data.categories?.map( (v, i) => {
        if( "name" in  v.category ){
            data.set(`categories.${i}.data`, {
                ...((({ name, uuid, slug, parent, ancestorSlugs }) => ({ name, uuid, slug, parent, ancestorSlugs }))(v.category))
            });
        }
        
    });

    data.translation.forEach((value, key) => {
        if ("uuid" in value.post) {
            data.set(`translation.${key}.data`, {                
                ...((({ uuid, type, title, lang, slug }) => ({ uuid, type, title, lang, slug }))(value.post))
            })
        }
    });

    await data.save();

    data.depopulate();

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
    "uuid", "title", "slug", "type", "lang", "status",
    "translation.data.lang",
]

export const allowableWhereInFields = [
    "categories.slug",
    "tags"
]
