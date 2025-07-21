import mongoose, { HydratedDocument, Schema, Types, Model } from "mongoose";

export interface ITranslation{
    categoryId: Types.ObjectId | IPostCategory,
    lang: string,
    name: string,
    slug: string,
}
export interface IPostCategory{
    _id: Schema.Types.ObjectId,
    name: string,
    slug: string,
    lang: string,
    translation: [ITranslation],
    parent?: Types.ObjectId | IPostCategory,
    ancestors: Types.ObjectId[],
    ancestors_slug: string[],
}


export const postCategorySchema = new Schema<IPostCategory>({
    name: { type: String, required: true, maxLength: 150 },
    slug: { type: String, required: true, maxLength: 150, unique: true },
    lang: { type: String, required: true, maxlength: 2},
    translation: [{ 
        categoryId: { type: Types.ObjectId, ref: 'post_categories'},
        lang: String,
        name: String,
        slug: String,
    }],
    parent: { type: Types.ObjectId, ref: 'post_categories'},
    ancestors: { type: [Types.ObjectId], ref: 'post_categories'},
    ancestors_slug: { type: [String] },
});

type PostCategoryModel = Model<IPostCategory>;

export const PostCategories = mongoose.model<IPostCategory, PostCategoryModel>("post_categories", postCategorySchema);

export default PostCategories;


export const refill = async (data: HydratedDocument<IPostCategory>) => {
    
    await data.populate(['parent', 'translation.categoryId']);

    if( data.parent && "name" in data.parent ) {
        data.set('ancestors', [...data.parent.ancestors, data.parent._id]);
        data.set('ancestors_slug', [...data.parent.ancestors_slug, data.parent.slug]);
    }

    const translation:any = [];
    data.translation.map( (x) => {
        if( "name" in x.categoryId ){
            translation[x.categoryId.lang] = {
                categoryId: x.categoryId._id,
                lang: x.categoryId.lang,
                name: x.categoryId.name,
                slug: x.categoryId.slug,
            };
        }
    });

    data.set('translation', Object.values(translation));

    await data.save();

    data.depopulate('parent');

    return data;
} 


