import mongoose, { Schema, Document, Model, Types } from "mongoose";
// import { enum } from "zod";
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
  type: string | ContentType;
  title: string;
  tags: Types.ObjectId[];
  userId: Types.ObjectId;
}

interface Link extends Document {
  hash: string;
  userId: Types.ObjectId;
}

interface Tag extends Document {
  title: string;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const tagSchema: Schema<Tag> = new Schema<Tag>({
  title: { type: String, required: true, unique: true },
});

type ContentType = "image" | "video" | "article" | "audio";

// const contentSchema = new Schema<Content>({
//   link: { type: String, required: true },
//   type: {
//     type: String,
//     enum: ["image", "video", "article", "audio"],
//     required: true,
//   },
//   title: { type: String, required: true },
//   tags: [{ type: Types.ObjectId, ref: "Tag" }],
//   userId: { type: Types.ObjectId, ref: "User", required: true },
// });

const conetentSchema: Schema<Content> = new Schema<Content>({
  link: { type: String, required: true },
  type: {
    type: String,
    enum: ["image", "video", "article", "audio"],
    required: true,
  },
  title: { type: String, required: true },
  tags: [{ type: Types.ObjectId, ref: "Tag" }],
  userId: { type: Types.ObjectId, ref: "User", required: true },
});

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  userSchema
);

export const TagModel: Model<Tag> = mongoose.model<Tag>("Tag", tagSchema);

export const ContentModel: Model<Content> = mongoose.model<Content>("Content", conetentSchema);
