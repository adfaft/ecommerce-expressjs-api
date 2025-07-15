const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
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

const mediaShortSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Medias", mediaSchema);
module.exports = mediaShortSchema;
