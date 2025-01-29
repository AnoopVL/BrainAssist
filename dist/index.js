"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Middleware to parse JSON request bodies.
app.use((0, cors_1.default)()); // Middleware to allow cross-origin requests.
// Route 1: User Signup
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Use zod or a similar library for input validation.
    // TODO: Hash the password before storing it in the database.
    const username = req.body.username;
    const password = req.body.password;
    try {
        // Create a new user with the provided username and password.
        yield db_1.UserModel.create({ username, password });
        res.json({ message: "User signed up" }); // Send success response.
    }
    catch (e) {
        // Handle errors like duplicate usernames.
        res.status(409).json({ message: "User already exists" }); // Conflict status.
    }
}));
// Route 2: User Signin
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    // Find a user with the provided credentials.
    const existingUser = yield db_1.UserModel.findOne({ username, password });
    if (existingUser) {
        // Generate a JWT token with the user's ID.
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, config_1.JWT_SECRET);
        res.json({ token }); // Send the token in response.
    }
    else {
        // Send error response for invalid credentials.
        res.status(403).json({ message: "Incorrect credentials" });
    }
}));
// Route 3: Add Content
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title } = req.body;
    // Create a new content entry linked to the logged-in user.
    yield db_1.ContentModel.create({
        link,
        type,
        title,
        // @ts-ignore
        userId: req.userId, // userId is added by the middleware.
        tags: [], // Initialize tags as an empty array.
    });
    res.json({ message: "Content added" }); // Send success response.
}));
// Route 4: Get User Content
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId; // User ID is fetched from middleware
    // Fetch all content associated with the user ID and populate username
    // The `populate` function is used to include additional details from the referenced `userId`.
    // For example, it will fetch the username linked to the userId.
    // Since we specified "username", only the username will be included in the result,
    // and other details like password won’t be fetched.
    const content = yield db_1.ContentModel.find({ userId: userId }).populate("userId", "username");
    res.json(content); // Send the content as response
}));
// // Route 5: Delete User Content
// app.delete("/api/v1/content", userMiddleware, async (req, res) => {
//   const contentId = req.body.contentId;
//   // Delete content based on contentId and userId.
//   await ContentModel.deleteMany({ contentId, userId: req.userId });
//   res.json({ message: "Deleted" }); // Send success response.
// });
// // Route 6: Share Content Link
// app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
//   const { share } = req.body;
//   if (share) {
//     // Check if a link already exists for the user.
//     const existingLink = await LinkModel.findOne({ userId: req.userId });
//     if (existingLink) {
//       res.json({ hash: existingLink.hash }); // Send existing hash if found.
//       return;
//     }
//     // Generate a new hash for the shareable link.
//     const hash = random(10);
//     await LinkModel.create({ userId: req.userId, hash });
//     res.json({ hash }); // Send new hash in the response.
//   } else {
//     // Remove the shareable link if share is false.
//     await LinkModel.deleteOne({ userId: req.userId });
//     res.json({ message: "Removed link" }); // Send success response.
//   }
// });
// Route 7: Get Shared Content
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    // Find the link using the provided hash.
    const link = yield db_1.LinkModel.findOne({ hash });
    if (!link) {
        res.status(404).json({ message: "Invalid share link" }); // Send error if not found.
        return;
    }
    // Fetch content and user details for the shareable link.
    const content = yield db_1.ContentModel.find({ userId: link.userId });
    const user = yield db_1.UserModel.findOne({ _id: link.userId });
    if (!user) {
        res.status(404).json({ message: "User not found" }); // Handle missing user case.
        return;
    }
    res.json({
        username: user.username,
        content,
    }); // Send user and content details in response.
}));
// Start the server
app.listen(3005, () => {
    console.log("Server is running on port 3005");
});
