import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
    deviceName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    deviceOS: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    osLanguage: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    browsers: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        version: {
          type: String,
          trim: true,
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// module.exports = mongoose.model('Device', deviceSchema);
export default mongoose.model('Device', deviceSchema);
