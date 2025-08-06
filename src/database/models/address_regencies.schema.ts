import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { randomUUID } from "crypto";
import Provinces, { IProvince } from "./address_provinces.schema.js";

export interface IRegency {
    uuid: Schema.Types.UUID,
    name: string,
    province: {
        provinceId: Schema.Types.ObjectId,
        province: Schema.Types.ObjectId | IProvince,
        // duplicate anti-pattern
        data: {
            uuid: Schema.Types.UUID
            name: string,
        }
    }

}


const regencySchema = new mongoose.Schema<IRegency>({
    uuid: { type: Schema.Types.UUID, default: () => randomUUID(), unique: true },
    name: { type: String, required: true, maxLength: 150 },
    province: {        
        provinceId: Schema.Types.ObjectId,
        province: { type: Schema.Types.ObjectId, ref: Provinces },
        // duplicate anti pattern
        data: {
            uuid: Schema.Types.UUID,
            name: String
        }
    },

}, {
    timestamps: true,
    toJSON: {
        getters: true,
        transform(doc: IRegency, ret: any) {
            delete ret.__v;
        }
    }
});

// ---------------
// --- INDEX ---
// ---------------


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

type RegencyModel = Model<IRegency>
export const Regencies = mongoose.model<IRegency, RegencyModel>('regencies', regencySchema);
export default Regencies;



// ---------------
// --- HELPERS ---
// ---------------
export const refill = async function (data: HydratedDocument<IRegency>): Promise<HydratedDocument<IRegency>> {

    await data.populate([
        'province.province'
    ]);

    if ("uuid" in data.province.province) {
        data.set('province.data', {
            ...((({ name, uuid }) => ({ name, uuid }))(data.province.province))
        });
    }

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
            { name: { $regex: search, $options: "i" } },
        ]
    }
}

export const allowableWhereFields = [
    "name"
]

export const allowableWhereInFields = []
