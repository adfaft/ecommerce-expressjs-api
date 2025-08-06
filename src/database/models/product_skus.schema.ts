import mongoose, { Model, Schema } from "mongoose";

export interface ISku{
    code: string,
    price: Schema.Types.Decimal128,
    quantity: number,
}

export const skuSchema = new mongoose.Schema<ISku>({
    code: { type: String, required: true, minLength: 3 },
    price: { type: Schema.Types.Decimal128, required: true },
    quantity: { type: Number, required: true, default: 0 },
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

type SkuModel = Model<ISku>;
export const Skus = mongoose.model<ISku, SkuModel>("skus", skuSchema);
export default Skus;


// ---------------
// --- HELPERS ---
// ---------------



// -----------------
// --- API QUERY ---
// -----------------
export const querySearch = (search: string) => {
    return {
        $or: [
            { code: { $regex: search, $options: "i" } },
        ]
    }
}

export const allowableWhereFields = [
    "code", "startDate", "endDate",
]

export const allowableWhereInFields = []