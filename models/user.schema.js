const mongoose = require("mongoose");
const { randomUUID } = require('crypto');

const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5,
  LOCK_TIME = 2 * 60 * 60 * 1000;


mongoose.set("strictQuery", true);

const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: 'UUID',
      default: randomUUID()
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
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "at least 8 characters"]
    },
    passwordChanged: {
      changedAt: { type: Date },
      history: { type: [String] }
    },
    login: {
      loginAt: { type: Date },
      loginAttempts: { type: Number, required: true, default: 0 },
      lockUntil: { type: Number }
    },
    status: {
      type: String,
      enum: ['active', 'inactive']
    },
    role: {
      type: [String],
      enum: ['admin', 'guest'],
    }
  },
  {
    timestamps: true,
    optimisticConcurrency: true
  }
);

userSchema.pre('save', async function (next) {
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

userSchema.methods.isValidPassword = async function (password) {
  try {
    // Compare provided password with stored hash
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

userSchema.virtual('isLocked').get(function () {
  // check for a future lockUntil timestamp
  return !!(this.login.lockUntil && this.login.lockUntil > Date.now());
});


userSchema.methods.incLoginAttempts = function (cb) {
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

// expose enum on the model, and provide an internal convenience reference 
var reasons = userSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
};

userSchema.statics.getAuthenticated = function (username, password, cb) {
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

module.exports = mongoose.model("User", userSchema);


/***
 * 
 * 
 * 


// attempt to authenticate user
User.getAuthenticated('jmar777', 'Password123', function(err, user, reason) {
    if (err) throw err;

    // login was successful if we have a user
    if (user) {
        // handle login success
        console.log('login success');
        return;
    }

    // otherwise we can determine why we failed
    var reasons = User.failedLogin;
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