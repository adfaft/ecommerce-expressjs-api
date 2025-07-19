import mongoose, { HydratedDocument, Schema, Types, Model } from "mongoose";

export interface IPostCategory{
    name: string,
    slug: string,
    parent?: Types.ObjectId,
    breadcrumbsId?: Types.ObjectId[],
    breadcrumbsSlug?: string[],
}


export const postCategorySchema = new Schema<IPostCategory>({
    name: { type: String, required: true, maxLength: 150 },
    slug: { type: String, required: true, maxLength: 150, unique: true },
    parent: { type: Types.ObjectId },
    breadcrumbsId: { type: [Types.ObjectId], },
    breadcrumbsSlug: { type: [String] },
});

postCategorySchema.post<HydratedDocument<IPostCategory, Model<IPostCategory>>>('init', async function(
    this: HydratedDocument<IPostCategory, Model<IPostCategory>>, 
    next: Function
){

    if( ! this.parent ){
        next();
    }

    if( ! this.populated('parent') ){
        this.populate('parent');
    }

    next();
});


export const PostCategories = mongoose.model("post_categories", postCategorySchema);

export default PostCategories;


