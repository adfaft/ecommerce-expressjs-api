import mongoose, { Schema, Types} from "mongoose";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10,
  MAX_LOGIN_ATTEMPTS = 5,
  LOCK_TIME = 2 * 60 * 60 * 1000;


mongoose.set("strictQuery", true);

interface IAdminSchema {
  uuid: Types.ObjectId,
  fullName: string,
  email: string,
  phone: string,
  password: string,
  passwordChanged: {
    changedAt: Date,
    history: Array<string>
  },
  login: {
    loginAt: Date,
    lastAttemptAt: Date,
    loginAttempts: number,
    lockUntil: number,
  },
  status: string,
  role: Array<string>
}

// expose enum on the model, and provide an internal convenience reference 
interface FailedLoginEnum{
  NOT_FOUND: number,
  PASSWORD_INCORRECT: number,
  MAX_ATTEMPTS: number
}


export const FailedLoginReasonEnum:FailedLoginEnum = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
};


const adminSchema = new Schema<IAdminSchema>(
  {
    uuid: {
      type: Schema.Types.ObjectId,
      default: randomUUID(),
      index: { unique: true },
    },
    fullName: {
      type: String,
      required: [true, "Please provide full name"],
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
    password: {
      type: String,
      select: false,
      required: [true, "Please provide a password"],
      minlength: [8, "at least 8 characters"]
    },
    passwordChanged: {
      changedAt: { type: Date },
      history: { type: [String] }
    },
    login: {
      loginAt: { type: Date },
      lastAttemptAt:{ type: Date }, 
      loginAttempts: { type: Number, required: true, default: 0 },
      lockUntil: { type: Number }
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      index: true
    },
    role: {
      type: [String],
      enum: ['admin', 'guest'],
    }
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

// ---------------
// --- VIRTUAL ---
// ---------------

adminSchema.virtual('isLoginLocked').get(function () {
  // check for a future lockUntil timestamp
  return !!(this.login.lockUntil && this.login.lockUntil > Date.now());
});



// ---------------
// --- METHODS ---
// ---------------

adminSchema.methods.incLoginAttempts = function (cb:Function) {
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
  var updates:any = { $inc: { login: { loginAttempts: 1 } } };
  // lock the account if we've reached max attempts and it's not locked already
  if (this.login.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.login.isLocked) {
    updates.$set = { login: { lockUntil: Date.now() + LOCK_TIME } };
  }
  return this.update(updates, cb);
};

adminSchema.methods.isValidPassword = async function (password:string) {
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

adminSchema.statics.getAuthenticated = function (username:string, password:string, cb:Function) {
  this.findOne({ username: username }, function (err:any, user:any) {
    if (err) return cb(err);

    // make sure the user exists
    if (!user || !user.login) {
      return cb(null, null, FailedLoginReasonEnum.NOT_FOUND);
    }

    // check if the account is currently locked
    if (user.login.isLocked) {
      // just increment login attempts if account is already locked
      return user.incLoginAttempts(function (err:any) {
        if (err) return cb(err);
        return cb(null, null, FailedLoginReasonEnum.MAX_ATTEMPTS);
      });
    }

    // test for a matching password
    user.comparePassword(password, function (err:any, isMatch:boolean) {
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
        return user.update(updates, function (err:any) {
          if (err) return cb(err);
          return cb(null, user);
        });
      }

      // password is incorrect, so increment login attempts before responding
      user.incLoginAttempts(function (err:any) {
        if (err) return cb(err);
        return cb(null, null, FailedLoginReasonEnum.PASSWORD_INCORRECT);
      });
    });
  });


};


// ---------------
// --- HOOKS ---
// ---------------

adminSchema.pre('save', async function (next:Function) {
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


export default mongoose.model("Admins", adminSchema);


/***
 * 

// EXAMPLE

// attempt to authenticate user
adminSchema.getAuthenticated('jmar777', 'Password123', function(err, admin, reason) {
    if (err) throw err;

    // login was successful if we have a user
    if (user) {
        // handle login success
        console.log('login success');
        return;
    }

    // otherwise we can determine why we failed
    var reasons = adminSchema.failedLogin;
    switch (reason) {
        case reasons.NOT_FOUND:
        case reasons.PASSWORD_INCORRECT:
            // note: these cases are usually treated the same - don't tell
            // the user *why* the login failed, only that it did
            break;
        case reasons.MAX_ATTEMPTS:
            // send email or otherwise notify user that account is
            // temporarily locked
            break;
    }
});



 */