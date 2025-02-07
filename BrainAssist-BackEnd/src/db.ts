// Importing the required modules and functions from Mongoose
import mongoose, { model, Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;
// Connecting to the MongoDB database using a connection string
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env file");
}

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s
    socketTimeoutMS: 45000, // Keep connection alive
  })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Defining a schema for the 'User' collection
// Each user will have a unique 'username' and a 'password'
const UserSchema = new Schema({
  username: { type: String, unique: true }, // Unique username to ensure no duplicates
  password: { type: String }, // Password for the user
});

// Creating a model for the 'User' collection, enabling interactions with the database
export const UserModel = model("User", UserSchema);

// Defining a schema for the 'Content' collection
// Each content will have a 'title', a 'Link', an array of 'tags', and a reference to a 'userId'
const ContentSchema = new Schema({
  title: String, // Title of the content
  link: String, // URL or link to the content
  type: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "tag" }], // Array of tag IDs, referencing the 'tag' collection
  userId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true, // The 'userId' field is mandatory to link content to a user
    },
  ],
});

// Creating a model for the 'Content' collection to interact with the database
export const ContentModel = model("Content", ContentSchema);

// Importing the Schema and model from Mongoose
// Mongoose is a library that provides a schema-based solution for modeling application data
const LinkSchema = new Schema({
  // 'hash' is a string that represents the shortened or hashed version of a link
  hash: String,

  // 'userId' is a reference to the 'User' collection in the database.
  // It uses Mongoose's ObjectId type for relational data.
  // The 'ref' property specifies the referenced collection name ('User').
  // The 'required' property ensures this field must be provided when creating a document.
  // The 'unique' property enforces that each 'userId' in this collection is unique.
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

// Exporting the LinkModel based on the LinkSchema
// The model represents the 'Links' collection in the database
export const LinkModel = model("Links", LinkSchema);
