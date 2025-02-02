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
exports.userMiddleware = void 0;
const config_1 = require("./config"); // Importing the JWT secret key from a configuration file.
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Importing the jsonwebtoken library for token verification.
// Middleware to validate user authentication using a JWT token.
const userMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the "authorization" header from the request.
    const header = req.headers["authorization"];
    // Verify the JWT token using the secret key.
    const decoded = jsonwebtoken_1.default.verify(header, config_1.JWT_SECRET);
    // If the token is successfully decoded, attach the user ID to the request object.
    if (decoded) {
        // @ts-ignore
        req.userId = decoded.id; // Store the decoded user ID for later use in request handling.
        next(); // Call the next middleware or route handler.
    }
    else {
        // If the token is invalid, send a 401 Unauthorized response.
        res.status(401).json({ message: "Unauthorized User" });
    }
});
exports.userMiddleware = userMiddleware;
