import { faker } from "@faker-js/faker";
import kebabCase from "lodash/kebabCase.js";
import Model, { PostStatusEnum, PostTypeEnum } from "../../dist/database/models/post.schema.js"

export const post_new = (replacer = {}) => {

    const title = faker.lorem.sentence();
    const excerpt = faker.lorem.paragraph();
    const posttype = faker.helpers.arrayElement(Object.values(PostTypeEnum));
    const lang = faker.helpers.arrayElement(['id', 'en']);

    return Object.assign({}, {
        title: title,
        slug: kebabCase(title),
        excerpt: excerpt,
        content: faker.lorem.paragraphs(7).split("\n").map((x) => `<p>${x}</p>`).join("\n"),
        type: posttype,
        lang: lang,
        translation: [],
        status: faker.helpers.arrayElement(Object.values(PostStatusEnum)),
        meta: {
            seo: {
                title: title,
                description: excerpt,
            },
            featuredImage: 'image/featured_post.jpg',
            featuredImageMobile: 'image/featured_post_mobile.jpg',
        },
        categories : [
            { categoryId: '111111222222333333444444', slug: 'corporate-announcement'},
            { categoryId: '111111222222333333444446', slug: 'corporate-updates'},
        ],
        tags: ['PostTest', 'Post'],
        author: {
            authorId: '111111222222333333444444',
            name: "Adfaft Lucky",
        },
        editor: {
            editorId: '111111222222333333444444',
            name: "Adfaft Lucky",
        }, 
    }, replacer);  
};

export const generate = (total) => {

    const data = [];

    for( var i = 0; i < total; i++){
        data.push(post_new());
    }

    return data;

};


export const seed_new = async (replacer = {}) => {
    const sample = post_new(replacer);
    const model = await Model.create(sample);

    return {model, sample};
};

export const seed_generate = async (total) => {
    const data = generate(total);

    for(item of data){
        await Model.create(item);
    }
}

export const seed_default = async () => {

    await seed_new({
        _id: '111111222222333333444441',
        title: 'homepage',
        slug: 'home',
        lang: 'en',
        type: 'page'
    });

    await seed_new({
        _id: '211111222222333333444441',
        title: 'Beranda',
        slug: 'beranda',
        lang: 'id',
        type: 'page'
    });

    await seed_new({
        _id: '111111222222333333444442',
        title: 'sample-post',
        slug: 'sample-post',
        lang: 'en',
        type: 'post'
    });

    await seed_new({
        _id: '211111222222333333444442',
        title: 'contoh-post',
        slug: 'contoh-post',
        lang: 'id',
        type: 'post'
    });
}
