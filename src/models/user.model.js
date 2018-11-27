import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/^[\w\.+]+@\w+\.\w+$/, "The 'email' field must be a valid email"],
    required: [true, "The 'email' field is missing"]
  },
  profile: { first: String, last: String, displayName: String },
  password: {
    type: String,
    required: [true, "The 'password' field is missing"]
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
  updatedAt: Number
});

export default mongoose.model('User', UserSchema);
