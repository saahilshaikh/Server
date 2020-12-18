const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
  },
  ref_id: {
    type: String
  },
  doa: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("users", UserSchema);
