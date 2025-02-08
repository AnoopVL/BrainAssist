import express from "express";
import { random } from "./utils";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";
import { corsMiddleware } from "./middleware";
import cors from "cors";

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies.
// app.use(cors()); // Middleware to allow cross-origin requests.

const corsOptions = {
  origin: "https://brain-assist.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200, // Add this line
};

app.use(cors(corsOptions));

// app.use(
//   cors({
//     origin: "https://brain-assist.vercel.app", // Your frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
// Make sure this is placed BEFORE your route definitions

app.use(corsMiddleware); // Add the corsMiddleware as a middleware function

app.options("/api/v1/signup", cors()); // Enable pre-flight request for signup route
// Route 1: User Signup
app.post("/api/v1/signup", async (req, res) => {
  console.log("Received signup request:", req.body);
  const username = req.body.username;
  const password = req.body.password;

  try {
    await UserModel.create({ username, password });
    console.log("User created successfully");
    res.json({ message: "User signed up" });
  } catch (e) {
    console.error("Error creating user:", e);
    res.status(409).json({ message: "User already exists" });
  }
});

// Route 2: User Signin
app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Find a user with the provided credentials.
  const existingUser = await UserModel.findOne({ username, password });
  if (existingUser) {
    // Generate a JWT token with the user's ID.
    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET);
    res.json({ token }); // Send the token in response.
  } else {
    // Send error response for invalid credentials.
    res.status(403).json({ message: "Incorrect credentials" });
  }
});

// Route 3: Add Content
app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const { link, type, title } = req.body;
  // Create a new content entry linked to the logged-in user.
  await ContentModel.create({
    link,
    type,
    title,
    // @ts-ignore
    userId: req.userId, // userId is added by the middleware.
    tags: [], // Initialize tags as an empty array.
  });

  res.json({ message: "Content added" }); // Send success response.
});

// Route 4: Get User Content
app.get("/api/v1/content", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId; // User ID is fetched from middleware
  // Fetch all content associated with the user ID and populate username
  // The `populate` function is used to include additional details from the referenced `userId`.
  // For example, it will fetch the username linked to the userId.
  // Since we specified "username", only the username will be included in the result,
  // and other details like password won’t be fetched.
  const content = await ContentModel.find({ userId: userId }).populate(
    "userId",
    "username"
  );
  res.json(content); // Send the content as response
});

// Route 5: Delete User Content
app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  // Delete content based on contentId and userId.
  // @ts-ignore
  await ContentModel.deleteMany({ contentId, userId: req.userId });
  res.json({ message: "Deleted" }); // Send success response.
});

// Route 6: Share Content Link
app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const { share } = req.body;
  if (share) {
    // Check if a link already exists for the user.
    // @ts-ignore
    const existingLink = await LinkModel.findOne({ userId: req.userId });
    if (existingLink) {
      res.json({ hash: existingLink.hash }); // Send existing hash if found.
      return;
    }

    // Generate a new hash for the shareable link.
    const hash = random(10);
    // @ts-ignore
    await LinkModel.create({ userId: req.userId, hash });
    res.json({ hash }); // Send new hash in the response.
  } else {
    // Remove the shareable link if share is false.
    // @ts-ignore
    await LinkModel.deleteOne({ userId: req.userId });
    res.json({ message: "Removed link" }); // Send success response.
  }
});

// Route 7: Get Shared Content
app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  // Find the link using the provided hash.
  const link = await LinkModel.findOne({ hash });
  if (!link) {
    res.status(404).json({ message: "Invalid share link" }); // Send error if not found.
    return;
  }

  // Fetch content and user details for the shareable link.
  const content = await ContentModel.find({ userId: link.userId });
  const user = await UserModel.findOne({ _id: link.userId });

  if (!user) {
    res.status(404).json({ message: "User not found" }); // Handle missing user case.
    return;
  }

  res.json({
    username: user.username,
    content,
  }); // Send user and content details in response.
});

// Start the server
app.listen(3005, () => {
  console.log("Server is running on port 3005");
});

export default app;
