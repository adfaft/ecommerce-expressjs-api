import mongoose, { Schema, Types, Model, HydratedDocument } from "mongoose";
import { randomUUID } from "crypto";
import { IAdmin } from "./admin.schema.js";
import PostCategoriesModel, { IPostCategory } from "./post_category.schema.js";
import AdminModel from "./admin.schema.js";

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
    postId: Types.ObjectId | IPost,
    type: string,
    lang: string,
    title: string,
    slug: string,
}

export const translationSchema = new mongoose.Schema<ITranslation>({
    postId: { type: Types.ObjectId, ref: 'posts' },
    type: String,
    lang: String,
    title: String,
    slug: String,
});

export interface IPost{
    _id: Schema.Types.ObjectId,
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
    categories?: [{ 
        categoryId: Types.ObjectId | IPostCategory,
        name: string,
        slug: string,
        parent?: Types.ObjectId,
        ancestors_slug: string[] 
    }],
    author: {
        authorId: Types.ObjectId | IAdmin,
        name: string
    }
    editor: {
        editorId?: Types.ObjectId | IAdmin,
        name?: string
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
    categories: [{
        categoryId: { type: Schema.Types.ObjectId, ref: PostCategoriesModel },
        name: String,
        slug: String,
        parent: { type: Schema.Types.ObjectId, ref: PostCategoriesModel },
        ancestors_slug: [String],
    }],
    tags: [String],
    author: { 
        authorId: { type: Schema.Types.ObjectId, ref: AdminModel },
        name: String,
     },
    editor: {
        editorId: { type: Schema.Types.ObjectId, ref: AdminModel},
        name: String
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
// --- HELPERS ---
// ---------------
export const refill = async function(data: HydratedDocument<IPost>) : Promise<HydratedDocument<IPost>> {

    await data.populate([
        'author.authorId',
        'editor.editorId',
        'translation.postId',
        'categories.categoryId'
    ]);
    

    let author = null;

    if( "uuid" in data.author.authorId ){
        author = {
            authorId: data.author.authorId,
            uuid: data.author.authorId.uuid,
            name: data.author.authorId.fullName
        };
    }

    // karena author wajib ada
    if( author ){
        data.set('author', author);
    }
    
    let editor = null;
    if( data.editor.editorId && "uuid" in data.editor.editorId ){
        editor = {
            editorId: data.editor.editorId,
            uuid: data.editor.editorId.uuid,
            name: data.editor.editorId.fullName
        };
    }

    data.set('editor', editor);


    const categories : any  = [];
    data.categories?.map( (x) => {

        if( "name" in  x.categoryId ){
            categories.push({
                categoryId: x.categoryId._id,
                name: x.categoryId.name,
                slug: x.categoryId.slug,
                parent: x.categoryId.parent,
                ancestors_slug: x.categoryId.ancestors_slug
            });
        }
        
    });

    data.set('categories', categories);

    const translation : any = [];
    data.translation?.map( (x) => {

        if( "title" in  x.postId ){
            translation[x.postId.lang] = {
                postId: x.postId._id,
                title: x.postId.title,
                slug: x.postId.slug,
                type: x.postId.type,
                lang: x.postId.lang
            };
        }
        
    });

    data.set('translation', Object.values(translation));

    await data.save();

    data.depopulate();

    return data;

};


type PostModel = Model<IPost>;

const Posts = mongoose.model<IPost, PostModel>("posts", postSchema);

export default Posts;
