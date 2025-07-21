import { faker } from "@faker-js/faker";
import Model, { AdminStatusEnum, AdminRoleEnum } from "../../dist/database/models/admin.schema.js";

export const admin_new = () => {
    
    const sex = faker.person.sexType();
    const firstName = faker.person.firstName(sex);
    const lastName = faker.person.lastName(sex);
    const middleName = faker.person.middleName(sex);
    const fullName = `${firstName} ${middleName} ${lastName}`;

    return {
        fullName: fullName,
        email: faker.internet.email({firstName, lastName}),
        phone: "+628" + faker.string.numeric(10),
        password: "testingsaja",
        status: faker.helpers.arrayElement(Object.values(AdminStatusEnum)),
        role: faker.helpers.arrayElements(Object.values(AdminRoleEnum))
    };
};

export const data_sample = () => {

    return [
        {
            _id: '111111222222333333444444',
            uuid: faker.string.uuid(),
            fullName: "Adfaft Lucky",
            email: "adfaft.lucky1@gmail.com",
            phone: "+62857112223333",
            password: "testingsaja",
            status: "active",
            role: ["admin", "author", "editor"]
        }
    ];
};

export const generate = (total) => {

    const data = [];

    for( var i = 0; i < total; i++){
        data.push(admin_new());
    }

    return data;

};


export const seed_new = async (replacer = {}) => {
    const sample = admin_new(replacer);
    const model = await Model.create(sample);

    return { model, sample };
};

export const seed_generate = async (total) => {
    const data = generate(total);

    for(const item of data){
        await Model.create(item);
    }
}

export const seed_default = async () => {
    const sample = data_sample();

    for(const item of sample ){
        await Model.create(item);
    }

}