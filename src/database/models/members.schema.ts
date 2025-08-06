import mongoose, { Model, Schema } from "mongoose";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { getAge } from "@app/utils/datetime.js";
import Provinces, { IProvince } from "./address_provinces.schema.js";
import Regencies, { IRegency } from "./address_regencies.schema.js";
import Districts, { IDistrict } from "./address_districts.schema.js";

const SALT_WORK_FACTOR = 10,
  MAX_LOGIN_ATTEMPTS = 5,
  LOCK_TIME = 2 * 60 * 60 * 1000;


export enum GenderEnum {
  male = "m",
  female = "f"
}

export enum MemberStatusEnum {
  active = 'active',
  under_review = 'under_review',
  banned = 'banned',
  deleted = 'deleted'
}

export enum VerifiableEnum {
  verified = "verified",
  unverified = "unverified"
}

export enum FailedLoginEnum {
  NOT_FOUND = 0,
  PASSWORD_INCORRECT = 1,
  MAX_ATTEMPTS = 2
}


export interface ICoordinate {
  latitude: number,
  longitude: number
}

export interface IAddress {
  isDefault: boolean,
  address: string,
  addressAdditional: string,
  postalCode: number,
  coordinate: ICoordinate,
  province: {
    provinceId: Schema.Types.ObjectId,
    province: Schema.Types.ObjectId | IProvince,
    data: {
      name: string,
      uuid: Schema.Types.UUID
    }
  },
  regency: {
    regencyId: Schema.Types.ObjectId,
    regency: Schema.Types.ObjectId | IRegency,
    data: {
      name: string,
      uuid: Schema.Types.UUID
    }
  },
  district: {
    districtId: Schema.Types.ObjectId,
    district: Schema.Types.ObjectId | IDistrict,
    data: {
      name: string,
      uuid: Schema.Types.UUID
    }
  },
}

export const addressSchema = new mongoose.Schema<IAddress>(
  {
    isDefault: { type: Boolean, default: false },
    address: { type: String, required: true, maxLength: 50 },
    addressAdditional: { type: String, maxLength: 50 },
    postalCode: { type: Number, required: true, min: 10000, max: 99999 },
    coordinate: {
      latitude: Number,
      longitude: Number
    },
    province: {
      provinceId: Schema.Types.ObjectId,
      province: { type: Schema.Types.ObjectId, ref: Provinces },
      data: {
        name: String,
        uuid: Schema.Types.UUID
      }
    },
    regency: {
      regencyId: Schema.Types.ObjectId,
      regency: { type: Schema.Types.ObjectId, ref: Regencies },
      data: {
        name: String,
        uuid: Schema.Types.UUID
      }
    },
    district: {
      ditrictId: Schema.Types.ObjectId,
      ditrict: { type: Schema.Types.ObjectId, ref: Districts },
      data: {
        name: String,
        uuid: Schema.Types.UUID
      }
    },
  }
);

export interface IMember {
  _id: Schema.Types.ObjectId,
  uuid: Schema.Types.UUID,
  identityName: { // tidak bisa pakai `name` karena error di typescript
    first: string,
    middle?: string,
    last: string,
    full: string
  }
  email: string,
  phone: string,
  gender: GenderEnum,
  birtDate: Date,

  auth: {
    password: string,
    passwordChanged: {
      changedAt: Date,
      history: Array<string>
    },
    login: {
      loginAt: Date,
      lastAttemptAt: Date,
      loginAttempts: number,
      lockUntil: number
    },
    totp: {
      secret: string,
      qr: string,
      recovery: string,
    }
  },
  status: {
    status: MemberStatusEnum,
    statusChangedAt: Date,
    emailVerified: VerifiableEnum,
    phoneVerified: VerifiableEnum
  },
  address: IAddress,
  addressShipping: IAddress[]
}

interface MemberModel extends Model<IMember> {
  fullName(): string
  age(): number
  isLoginLocked(): boolean
  incLoginAttempts(): Promise<IMember>
  isValidPassword(): Promise<boolean>
}

const memberSchema = new Schema<IMember>(
  {
    uuid: { type: Schema.Types.UUID, default: randomUUID(), unique: true },
    identityName: {
      first: { type: String, required: true },
      middle: String,
      last: { type: String, required: true },
      full: String,
    },
    email: { type: String, required: true, unique: true },
    phone: { type: String, index: true, },
    gender: { type: String, enum: GenderEnum },
    birtDate: Date,

    auth: {
      password: { type: String, select: false, required: true, minlength: 8 },
      passwordChanged: {
        changedAt: Date,
        history: { type: [String], select: false }
      },
      login: {
        loginAt: Date,
        lastAttemptAt: Date,
        loginAttempts: { type: Number, default: 0 },
        lockUntil: Number
      },
      totp: {
        secret: String,
        qr: String,
        recovery: { type: String, select: false },
      }
    },
    status: {
      status: { type: String, enum: MemberStatusEnum, index: true },
      statusChangedAt: Date,
      emailVerified: { type: String, enum: VerifiableEnum },
      phoneVerified: { type: String, enum: VerifiableEnum },
    },
    address: addressSchema,
    addressShipping: [addressSchema]
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: {
      getters: true,
      transform(doc: IMember, ret: any) {
        delete ret.__v;
      }
    }
  }
);

// ---------------
// --- INDEX ---
// ---------------



// ---------------
// --- VIRTUAL ---
// ---------------




// ---------------
// --- METHODS ---
// ---------------


memberSchema.methods.age = function () {
  return getAge(this.birtDate.toDateString());
};


memberSchema.methods.fullName = function () {
  let middle = this.middleName ? ` ${this.middleName}` : '';
  return `${this.firstName}${middle} ${this.lastName}`;
};

memberSchema.methods.isLoginLocked = function () {
  // check for a future lockUntil timestamp
  return !!(this.auth.login.lockUntil && this.auth.login.lockUntil > Date.now());
};

memberSchema.methods.incLoginAttempts = function (cb: Function) {
  // if we have a previous lock that has expired, restart at 1
  if (this.login.lockUntil && this.login.lockUntil < Date.now()) {
    return this.update({
      $set: {
        login: {
          loginAttempts: 1
        }
      },
      $unset: {
        login: {
          lockUntil: 1
        }
      }
    }, cb);
  }
  // otherwise we're incrementing
  var updates: any = { $inc: { login: { loginAttempts: 1 } } };
  // lock the account if we've reached max attempts and it's not locked already
  if (this.login.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.login.isLocked) {
    updates.$set = { login: { lockUntil: Date.now() + LOCK_TIME } };
  }
  return this.update(updates, cb);
};

memberSchema.methods.isValidPassword = async function (password: string) : Promise<boolean> {
  try {
    // Compare provided password with stored hash
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

memberSchema.methods.comparePassword = function(candidatePassword: string, cb: Function) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};



// ---------------
// --- STATICS ---
// ---------------

memberSchema.statics.getAuthenticated = function (email: string, password: string, cb: Function) {
  this.findOne({ email: email }, function (err: any, user: any) {
    if (err) return cb(err);

    // make sure the user exists
    if (!user || !user.auth || !user.auth.login) {
      return cb(null, null, FailedLoginEnum.NOT_FOUND);
    }

    // check if the account is currently locked
    if (user.isLoginLocked()) {
      // just increment login attempts if account is already locked
      return user.incLoginAttempts(function (err: any) {
        if (err) return cb(err);
        return cb(null, null, FailedLoginEnum.MAX_ATTEMPTS);
      });
    }

    // test for a matching password
    user.comparePassword(password, function (err: any, isMatch: boolean) {
      if (err) return cb(err);

      // check if the password was a match
      if (isMatch) {
        // if there's no lock or failed attempts, just return the user
        if (!user.auth.login.loginAttempts && !user.auth.login.lockUntil) return cb(null, user);
        // reset attempts and lock info
        var updates = {
          $set: { login: { loginAttempts: 0 } },
          $unset: { login: { lockUntil: 1 } }
        };
        return user.update(updates, function (err: any) {
          if (err) return cb(err);
          return cb(null, user);
        });
      }

      // password is incorrect, so increment login attempts before responding
      user.incLoginAttempts(function (err: any) {
        if (err) return cb(err);
        return cb(null, null, FailedLoginEnum.PASSWORD_INCORRECT);
      });
    });
  });


};


// ---------------
// --- HOOKS ---
// ---------------

memberSchema.pre('save', async function (next) {
  try {
    // Check if the password has been modified
    if (!this.isModified('auth.password')) return next();

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.auth.password = await bcrypt.hash(this.auth.password, salt);

    next(); // Proceed to save
  } catch (error) {
    if (error instanceof Error) {
      next(error); // Pass any errors to the next middleware
    }
    
  }
});

// ---------------
// --- MODEL ---
// ---------------

export const Members = mongoose.model<IMember, MemberModel>("members", memberSchema);
export default Members;


// -----------------
// --- API QUERY ---
// -----------------
export const querySearch = (search: string) => {
  return {
    $or: [
      {
        name: {
          full: { $regex: search, $options: "i" }
        }
      },
    ]
  }
}

export const allowableWhereFields = [
  "name.full", "status",
]

export const allowableWhereInFields = [
  "roles",
]
