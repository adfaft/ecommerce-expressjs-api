import mongoose, { Model, Schema } from "mongoose";
import { randomUUID } from "crypto"

export enum DiscountUnitEnum{
    percentage = "%",
    fixed = "$"
}

export interface IDiscount{
    _id: Schema.Types.ObjectId,
    uuid:  Schema.Types.UUID,
    code: string,
    startDate: Date,
    endDate: Date,
    discountValue: Schema.Types.Decimal128,
    discountUnit: DiscountUnitEnum
}

export const discountSchema = new mongoose.Schema<IDiscount>({    
    uuid:  { type: Schema.Types.UUID, default: randomUUID(), unique: true },
    code: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    discountValue: Schema.Types.Decimal128,
    discountUnit: DiscountUnitEnum
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

type DiscountModel = Model<IDiscount>;
export const Discounts = mongoose.model<IDiscount, DiscountModel>("discounts", discountSchema);
export default Discounts;


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

