import express from "express";
import mongoose from "mongoose";
import { z } from "zod";
import bcrypt from "bcrypt";
import { UserModel } from "./db";
require("dotenv").config();

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

app.post("/api/v1/signin", (req, res) => {});

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
