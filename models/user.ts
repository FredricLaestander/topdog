import { Schema, model } from "mongoose";
import { hashSync } from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    const hashedPassword = hashSync(this.password, 12);
    this.password = hashedPassword;
    next();
  }

  next();
});

export const User = model("User", userSchema);
