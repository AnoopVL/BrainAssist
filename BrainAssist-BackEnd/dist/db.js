"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.ContentModel = exports.UserModel = void 0;
// Importing the required modules and functions from Mongoose
const mongoose_1 = __importStar(require("mongoose"));
// Connecting to the MongoDB database using a connection string
mongoose_1.default.connect("mongodb+srv://admin:1234rewq@demo1.cpr8n.mongodb.net/brainassist");
// Defining a schema for the 'User' collection
// Each user will have a unique 'username' and a 'password'
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true }, // Unique username to ensure no duplicates
    password: { type: String }, // Password for the user
});
// Creating a model for the 'User' collection, enabling interactions with the database
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
// Defining a schema for the 'Content' collection
// Each content will have a 'title', a 'Link', an array of 'tags', and a reference to a 'userId'
const ContentSchema = new mongoose_1.Schema({
    title: String, // Title of the content
    link: String, // URL or link to the content
    type: String,
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: "tag" }], // Array of tag IDs, referencing the 'tag' collection
    userId: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "User",
            required: true, // The 'userId' field is mandatory to link content to a user
        },
    ],
});
// Creating a model for the 'Content' collection to interact with the database
exports.ContentModel = (0, mongoose_1.model)("Content", ContentSchema);
// Importing the Schema and model from Mongoose
// Mongoose is a library that provides a schema-based solution for modeling application data
const LinkSchema = new mongoose_1.Schema({
    // 'hash' is a string that represents the shortened or hashed version of a link
    hash: String,
    // 'userId' is a reference to the 'User' collection in the database.
    // It uses Mongoose's ObjectId type for relational data.
    // The 'ref' property specifies the referenced collection name ('User').
    // The 'required' property ensures this field must be provided when creating a document.
    // The 'unique' property enforces that each 'userId' in this collection is unique.
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
});
// Exporting the LinkModel based on the LinkSchema
// The model represents the 'Links' collection in the database
exports.LinkModel = (0, mongoose_1.model)("Links", LinkSchema);
