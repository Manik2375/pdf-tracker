import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  provider: "email" | "google" | "github";
  providerID?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "email";
      },
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (password: string) {
          if (this.provider !== "email") return true;
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      },
    },
    avatar: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      enum: ["email", "google", "github"],
      default: "email",
    },
    providerID: {
      type: String,
      sparse: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ provider: 1, providerId: 1 });

const saltRounds = 13;
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, saltRounds);

  next();
});

// passing out model directly
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
