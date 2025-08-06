import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { randomUUID } from "crypto";
import Provinces, { IProvince } from "./address_provinces.schema.js";
import Regencies, { IRegency } from "./address_regencies.schema.js";

export interface IDistrict {
    uuid: Schema.Types.UUID,
    name: string,
    regency: {
        regencyId: Schema.Types.ObjectId,
        regency: Schema.Types.ObjectId | IRegency,
         // duplicate anti-pattern
        data: {
            name: string,
            uuid: Schema.Types.UUID
        }
        
    }
    province: {
        provinceId: Schema.Types.ObjectId,
        province: Schema.Types.ObjectId | IProvince,
         // duplicate anti-pattern
        data: {
            name: string,
            uuid: Schema.Types.UUID
        }
        
    }
}


const districtSchema = new mongoose.Schema<IDistrict>({
    uuid: { type: Schema.Types.UUID, default: () => randomUUID(), unique: true },
    name: { type: String, required: true, maxLength: 150 },
    province: {
        provinceId: Schema.Types.UUID,
        province: { type: Schema.Types.UUID, ref: Provinces },
        // duplicate anti-pattern
        data: {
            name: String,
            uuid: Schema.Types.UUID
        }
        
    },
    regency: {
        regencyId: Schema.Types.UUID,
        regency: { type: Schema.Types.UUID, ref: Regencies },
        // duplicate anti-pattern
        data: {
            name: String,
            uuid: Schema.Types.UUID
        }
    },
}, {
    timestamps: true,
    toJSON: {
        getters: true,
        transform(doc: IDistrict, ret: any) {
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



// ---------------
// --- MODEL ---
// ---------------

type DistrictModel = Model<IDistrict>
export const Districts = mongoose.model<IDistrict, DistrictModel>('districts', districtSchema);
export default Districts;



// ---------------
// --- HELPERS ---
// ---------------
export const refill = async function (data: HydratedDocument<IDistrict>): Promise<HydratedDocument<IDistrict>> {

    await data.populate([
        'province.province',
        'regency.regency'
    ]);

    if ("uuid" in data.province.province) {
        data.set('province.data', {            
            ...((({ name, uuid }) => ({ name, uuid }))(data.province.province))
        });
    }

    if ("uuid" in data.regency.regency) {
        data.set('regency.data', {
            ...((({ name, uuid }) => ({ name, uuid }))(data.regency.regency))
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
