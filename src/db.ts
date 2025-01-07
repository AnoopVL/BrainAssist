import mongoose, { Schema, Document, Model } from "mongoose";
import { enumUtil } from "zod/lib/helpers/enumUtil";
// import { Schema, Document, Model } from "mongoose";
// import { Schema, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface Content extends Document {
  link: string;
  // type: string | EnumType;
  type: string;
  title: string;
  tags: tagReference[];
  userId: UserRef;
}

interface Link extends Document {
  hash: string;
  userId: UserRef;
}

interface Tag extends Document {
  title: string;
}

// Define the User schema
const userSchema: Schema<IUser> = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const tagSchema: Schema<Tag> = new Schema<Tag>({
  title: { type: String, required: true, unique: true },
});

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  userSchema
);

export const TagModel: Model<Tag> = mongoose.model<Tag>("Tag", tagSchema);
