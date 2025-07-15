const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      maxLength: 50
    },
    addressAdditional: {
      type: String,
      maxLength: 50
    },
    postalCode: {
      type: Number,
      required: true,
      min: 10000,
      max: 99999
    },
    coordinate: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      }
    },
    province: {
      _id: {
        type: String,
      },
      name: {
        type: String,
      },
    },
    regency: {
      _id: {
        type: String,
      },
      name: {
        type: String,
      },
    },
  }
);

const provinceSchema = new mongoose.Schema({
    name: {
        type: String,
    },
});

const regencySchema = new mongoose.Schema({
    name: {
        type: String,
    },
});

module.exports = mongoose.model("Provinces", provinceSchema);
module.exports = mongoose.model("Regencies", regencySchema);
module.exports = addressSchema;
