import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema(
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

export const provinceSchema = new mongoose.Schema({
    name: {
        type: String,
    },
});

export const regencySchema = new mongoose.Schema({
    name: {
        type: String,
    },
});

export const Provinces = mongoose.model("Provinces", provinceSchema);
export const Regencies = mongoose.model('Regencies', regencySchema);
export const Address = mongoose.model("Address", addressSchema);

export default Address;
