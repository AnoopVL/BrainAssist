import express from "express";
import mongoose from "mongoose";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";
require("dotenv").config();
const JWT_USER_SECRET = process.env.JWT_USER_SECRET;

const app = express();

app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const requireBody = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  });

  const parsedDataWithSuccess = requireBody.safeParse(req.body);
  if (!parsedDataWithSuccess.success) {
    res.status(400).json({
      message: "Invalid format try again",
      error: parsedDataWithSuccess.error,
    });
    return;
  }

  const { email, password, firstName, lastName } = parsedDataWithSuccess.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await UserModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    res.status(201).send({ message: "User Signup successful" });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).send({ message: "Email already exists" });
    } else {
      res.status(500).send({ message: "Error creating user", error: err });
    }
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const requireBody = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  const parsedDataWithSuccess = requireBody.safeParse(req.body);
  if (!parsedDataWithSuccess.success) {
    res.status(400).json({
      message: "Invalid format try again!!",
      error: parsedDataWithSuccess.error,
    });
    return;
  }
  // Extract validated data
  const { email, password } = parsedDataWithSuccess.data;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    const isPasswordVaild = await bcrypt.compare(password, user.password);
    if (!isPasswordVaild) {
      return res.status(401).json({
        message: "Invalid email or password!!",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_USER_SECRET ?? "default-secret"
    );

    return res.status(200).json({
      message: "SignIN successful",
      token,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: "Error occured while signin",
      err,
    });
  }
});

app.post("/api/v1/content", (req, res) => {});

app.get("/api/v1/content", (req, res) => {});

app.delete("/api/v1/content", (req, res) => {});

app.post("/api/v1/brain/share", (req, res) => {});

app.get("/api/v1/brain/:shareLink", (req, res) => {});

async function main() {
  await mongoose.connect(
    process.env.MONGO_URI ??
      "mongodb+srv://admin:1234rewq@demo1.cpr8n.mongodb.net/brainassist"
  );
  app.listen(3005, () => {
    console.log("Running on port 3005");
  });
}

main();
