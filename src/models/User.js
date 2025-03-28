import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    mail: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (e) {
    next(e);
  }
});

userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

export default mongoose.model("User", userSchema);
