import mongoose, { Model, Schema, Types} from "mongoose";
import { randomUUID } from "crypto";

export enum MediaTypeEnum{
    image = 'image', 
    video = 'video', 
    file = 'file'
}

export interface IMedia {
    uuid: Schema.Types.UUID,
    type: string,
    name: string,
    path: string,
    repository: string,
    originalName: string,
    alternateName: string,
    size: number,
    extension: string,
    mime: string,
    dimension: {
        width: number,
        height: number
    },
    codec: string,
    directories: string[],
    tags: string[],
}


export const mediaSchema = new mongoose.Schema<IMedia>({
    uuid: { type: String, default: randomUUID(), unique: true },
    type: { type: String,
        enum: [],
    },
    name: String,
    path: String,
    repository: String,
    originalName: String,
    alternateName: String,
    size: Number,
    extension: String,
    mime: String,
    dimension: {
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
    },
    codec: String,
    directories: [String],
    tags: [String]
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

type MediaModel = Model<IMedia>
export const Medias = mongoose.model<IMedia, MediaModel>("medias", mediaSchema);
export default Medias;


// ---------------
// --- HELPERS ---
// ---------------


// -----------------
// --- API QUERY ---
// -----------------
export const querySearch = (search: string) => {
    return {
        $or: [
            { title: { $regex: search, $options: "i" } },
            { excerpt: { $regex: search, $options: "i" } }
        ]
    }
}

export const allowableWhereFields = [
    "uuid", "name", "repository"
]

export const allowableWhereInFields = [
    "directories",
    "tags"
]
