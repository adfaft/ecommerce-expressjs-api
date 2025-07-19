import { faker } from "@faker-js/faker";
import kebabCase from "lodash/kebabCase.js";
import Model, { PostStatusEnum, PostTypeEnum } from "../../dist/database/models/post.schema.js"

export const post_new = (replacer = {}) => {

    const title = faker.lorem.sentence();
    const excerpt = faker.lorem.paragraph();

    return Object.assign({}, {
        title: title,
        slug: kebabCase(title),
        excerpt: excerpt,
        content: faker.lorem.paragraphs(),
        type: faker.helpers.arrayElement(Object.values(PostTypeEnum)),
        lang: faker.helpers.arrayElement(['id', 'en']),
        translation: [],
        status: faker.helpers.arrayElement(Object.values(PostStatusEnum)),
        meta: {
            seo: {
                title: title,
                description: excerpt,
            },
            featuredImage: '/image/featured_post.jpg',
            featuredImageMobile: '/image/featured_post_mobile.jpg',
        },
        categories : [
            {name: 'news', slug: 'news'},
            {name: 'announcement', slug: 'announcement'},
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

    for(item in data){
        await Model.create(item);
    }
}
