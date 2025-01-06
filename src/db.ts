import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the User document
interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Define the User schema
const UserSchema: Schema<IUser> = new Schema<IUser>({
  email: { type: String, unique: true, required: true }, // Ensure email is required
  password: { type: String, required: true }, // Ensure password is required
  firstName: { type: String, required: true }, // Ensure firstName is required
  lastName: { type: String, required: true }, // Ensure lastName is required
});

// Create the User model
export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  UserSchema
);
