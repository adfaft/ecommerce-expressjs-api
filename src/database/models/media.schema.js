import mongoose, { Schema, Types} from "mongoose";

export const mediaSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: randomUUID(),
        index: { unique: true }
    },
    type: {
        type: String,
        enum: ['image', 'video', 'file'],
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
        width: Number,
        height: Number,
    },
    codec: String,
    directories: [String],
    tags: [String]
});

export const mediaShortSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: randomUUID(),
        index: { unique: true }
    },
    type: {
        type: String,
        enum: ['image', 'video', 'file'],
    },
    name: String,
    path: String,
    repository: String,
});

export const Medias = mongoose.model("medias", mediaSchema);

export default Medias;
