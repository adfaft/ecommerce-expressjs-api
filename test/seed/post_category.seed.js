import { faker } from "@faker-js/faker";
import { kebabCase } from "lodash-es";
import Model, { refill } from "../../dist/database/models/post_category.schema.js"

export const post_new = (replacer = {}) => {

    const name = faker.lorem.words(2);

    return Object.assign({}, {
        title: name,
        slug: kebabCase(name),
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
    let model = await Model.create(sample);
    model = await refill(model);

    return {model, sample};
};

export const seed_generate = async (total) => {
    const data = generate(total);

    for(const item of data){
        let model = await Model.create(item);
        await refill(model);
    }
}

export const seed_default = async () => {
    const sample = data_sample();

    const data = [];
    for(const item of sample){
        let model = await Model.create(item);
        data.push(model);
    }

    for(const item of data){
        await refill(item);
    }
    
}


export const data_sample = () => {

    return [
        {
            _id: '111111222222333333444441',
            name: "News",
            slug: "news",
            lang: "en",
            translation: {
                categoryId: '211111222222333333444441'
            }
        },
        {
            _id: '111111222222333333444442',
            name: "Announcement",
            slug: "announcement",
            lang: "en",
            parent: '111111222222333333444441',
            translation: {
                categoryId: '211111222222333333444442'
            }
        },
        {
            _id: '111111222222333333444443',
            name: "HR Announcement",
            slug: "hr-announcement",
            lang: "en",
            parent: '111111222222333333444442',
            translation: {
                categoryId: '211111222222333333444443'
            }
        },
        {
            _id: '111111222222333333444444',
            name: "Corporate Announcement",
            slug: "corporate-announcement",
            lang: "en",
            parent: '111111222222333333444442',
            translation: {
                categoryId: '211111222222333333444444'
            }
        },
        {
            _id: '111111222222333333444445',
            name: "Updates",
            slug: "updates",
            lang: "en",
            parent: '111111222222333333444441',
            translation: {
                categoryId: '111111222222333333444445'
            }
        },
        {
            _id: '111111222222333333444446',
            name: "Corporate Updates",
            slug: "corporate-updates",
            lang: "en",
            parent: '111111222222333333444445',
            translation: {
                categoryId: '111111222222333333444446'
            }
        },
        {
            _id: '111111222222333333444447',
            name: "CSR Updates",
            slug: "csr-updates",
            lang: "en",
            parent: '111111222222333333444445',
            translation: {
                categoryId: '111111222222333333444447'
            }
        },
        {
            _id: '111111222222333333444448',
            name: "Report",
            slug: "report",
            lang: "en",
            parent: '111111222222333333444441',
            translation: {
                categoryId: '111111222222333333444448'
            }
        },
        {
            _id: '211111222222333333444441',
            name: "Berita",
            slug: "berita",
            lang: "id",
            translation: {
                categoryId: '111111222222333333444441'
            }
        },
        {
            _id: '211111222222333333444442',
            name: "Pengumuman",
            slug: "pengumuman",
            lang: "id",
            parent: '211111222222333333444441',
            translation: {
                categoryId: '111111222222333333444442'
            }
        },
        {
            _id: '211111222222333333444443',
            name: "Pengumuman HRD",
            slug: "pengumuman HRD",
            lang: "id",
            parent: '211111222222333333444442',
            translation: {
                categoryId: '111111222222333333444443'
            }
        },
        {
            _id: '211111222222333333444444',
            name: "Pengumuman Perusahaan",
            slug: "pengumuman-perusahaan",
            lang: "id",
            parent: '211111222222333333444442',
            translation: {
                categoryId: '111111222222333333444444'
            }
        },
        {
            _id: '211111222222333333444445',
            name: "Update",
            slug: "update",
            lang: "id",
            parent: '211111222222333333444441',
            translation: {
                categoryId: '111111222222333333444445'
            }
        },
        {
            _id: '211111222222333333444446',
            name: "Berita Korporasi",
            slug: "berita-korporasi",
            lang: "id",
            parent: '211111222222333333444445',
            translation: {
                categoryId: '111111222222333333444446'
            }
        },
        {
            _id: '211111222222333333444447',
            name: "Berita CSR",
            slug: "berita-csr",
            lang: "id",
            parent: '211111222222333333444445',
            translation: {
                categoryId: '111111222222333333444447'
            }
        },
        {
            _id: '211111222222333333444448',
            name: "Laporan",
            slug: "laporan",
            lang: "id",
            parent: '211111222222333333444441',
            translation: {
                categoryId: '111111222222333333444448'
            }
        },
    ];
};
