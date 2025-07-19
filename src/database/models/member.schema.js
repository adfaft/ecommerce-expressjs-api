import mongoose, { Schema, Types} from "mongoose";
import { randomUUID } from "crypto";
import bcrypt  from "bcrypt";
import { getAge } from "../helper/datetime";
import addressSchema from "./address.schema";

const SALT_WORK_FACTOR = 10,
  MAX_LOGIN_ATTEMPTS = 5,
  LOCK_TIME = 2 * 60 * 60 * 1000;


mongoose.set("strictQuery", true);

export const memberAuthSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      select: false,
      required: [true, "Please provide a password"],
      minlength: [8, "at least 8 characters, 1 uppercase, 1 lowercase, 1 numeric and 1 special characters"]
    },
    passwordChanged: {
      changedAt: { 
        type: Date 
      },
      history: { 
        type: [String] 
      }
    },
    login: {
      loginAt: { 
        type: Date 
      },
      lastAttemptAt: { 
        type: Date 
      },
      loginAttempts: { 
        type: Number, 
        required: true, 
        default: 0 
      },
      lockUntil: { 
        type: Number 
      }
    },
    totp: {
      secret: { 
        type: String 
      },
      qr: { 
        type: String 
      },
      recovery: { 
        type: String, 
        select: false
      },
    }
  }
)

export const memberStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['active', 'under_review', 'banned', 'on_delete'],
      index: true
    },
    statusChangedAt: {
      type: Date,
    },
    emailVerified: {
      type: String,
      enum: ['verified', 'unverified']
    },
    phoneVerified: {
      type: String,
      enum: ['verified', 'unverified']
    },
  }
);


export const memberSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: randomUUID(),
      index: { unique: true },
    },
    firstName: {
      type: String,
      required: [true, "Please provide first name"],
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      index: { unique: true },
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      index: true,
    },
    gender: {
      type: String,
      enum: ["f", "m"]
    },
    birtDate: {
      type: Date
    },
    auth: memberAuthSchema,
    status: memberStatusSchema,
    address: addressSchema,
    addressShipping: [addressSchema]
  },
  {
    timestamps: true,
    optimisticConcurrency: true
  }
);

// ---------------
// --- VIRTUAL ---
// ---------------

memberSchema.virtual('fullName').get(function () {
  let middle = this.middleName ? ` ${this.middleName}` : '';
  return `${this.firstName}${middle} ${this.lastName}`;
})

memberSchema.virtual('age').get(() => {
  return getAge(this.birtDate);
})

memberSchema.virtual('isLocked').get(function () {
  // check for a future lockUntil timestamp
  return !!(this.login.lockUntil && this.login.lockUntil > Date.now());
});


// ---------------
// --- METHODS ---
// ---------------

memberSchema.methods.incLoginAttempts = function (cb) {
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
  var updates = { $inc: { login: { loginAttempts: 1 } } };
  // lock the account if we've reached max attempts and it's not locked already
  if (this.login.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.login.isLocked) {
    updates.$set = { login: { lockUntil: Date.now() + LOCK_TIME } };
  }
  return this.update(updates, cb);
};

memberSchema.methods.isValidPassword = async function (password) {
  try {
    // Compare provided password with stored hash
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};


// ---------------
// --- STATICS ---
// ---------------

// expose enum on the model, and provide an internal convenience reference 
var reasons = memberSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
};

memberSchema.statics.getAuthenticated = function (username, password, cb) {
  this.findOne({ username: username }, function (err, user) {
    if (err) return cb(err);

    // make sure the user exists
    if (!user || !user.login) {
      return cb(null, null, reasons.NOT_FOUND);
    }

    // check if the account is currently locked
    if (user.login.isLocked) {
      // just increment login attempts if account is already locked
      return user.incLoginAttempts(function (err) {
        if (err) return cb(err);
        return cb(null, null, reasons.MAX_ATTEMPTS);
      });
    }

    // test for a matching password
    user.comparePassword(password, function (err, isMatch) {
      if (err) return cb(err);

      // check if the password was a match
      if (isMatch) {
        // if there's no lock or failed attempts, just return the user
        if (!user.login.loginAttempts && !user.login.lockUntil) return cb(null, user);
        // reset attempts and lock info
        var updates = {
          $set: { login: { loginAttempts: 0 } },
          $unset: { login: { lockUntil: 1 } }
        };
        return user.update(updates, function (err) {
          if (err) return cb(err);
          return cb(null, user);
        });
      }

      // password is incorrect, so increment login attempts before responding
      user.incLoginAttempts(function (err) {
        if (err) return cb(err);
        return cb(null, null, reasons.PASSWORD_INCORRECT);
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
    if (!this.isModified('password')) return next();

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);

    next(); // Proceed to save
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});



export const Member = mongoose.model("members", memberSchema);

export default Member;