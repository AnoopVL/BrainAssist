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
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
require("dotenv").config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requireBody = zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
        firstName: zod_1.z.string().min(1),
        lastName: zod_1.z.string().min(1),
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
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        yield db_1.UserModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });
        res.status(201).send({ message: "User Signup successful" });
    }
    catch (err) {
        if (err.code === 11000) {
            res.status(409).send({ message: "Email already exists" });
        }
        else {
            res.status(500).send({ message: "Error creating user", error: err });
        }
    }
}));
app.post("/api/v1/signin", (req, res) => { });
app.post("/api/v1/content", (req, res) => { });
app.get("/api/v1/content", (req, res) => { });
app.delete("/api/v1/content", (req, res) => { });
app.post("/api/v1/brain/share", (req, res) => { });
app.get("/api/v1/brain/:shareLink", (req, res) => { });
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        yield mongoose_1.default.connect((_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : "mongodb+srv://admin:1234rewq@demo1.cpr8n.mongodb.net/brainassist");
        app.listen(3005, () => {
            console.log("Running on port 3005");
        });
    });
}
main();
