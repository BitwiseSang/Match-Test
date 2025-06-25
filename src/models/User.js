import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    profileAvatar: {
      type: String,
      default: null,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    phoneNumber: {
      countryCode: {
        type: String,
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
      maxlength: 200,
    },
    city: {
      type: String,
      required: true,
      maxlength: 100,
    },
    country: {
      type: String,
      required: true,
      maxlength: 100,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    devices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get user without password
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// module.exports = mongoose.model('User', userSchema);
export default mongoose.model('User', userSchema);
