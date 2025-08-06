import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";
import { randomUUID } from "crypto";

export interface IProvince {
    uuid: Schema.Types.UUID,
    name: string
}


const provinceSchema = new mongoose.Schema<IProvince>({
    uuid: { type: Types.UUID, default: () => randomUUID(), unique: true },
    name: { type: String, required: true, maxLength: 150 },
}, {
    timestamps: true,
    toJSON: {
        getters: true,
        transform(doc: IProvince, ret: any) {
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

type ProvinceModel = Model<IProvince>
export const Provinces = mongoose.model<IProvince, ProvinceModel>("provinces", provinceSchema);
export default Provinces;



// ---------------
// --- HELPERS ---
// ---------------



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
