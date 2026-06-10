require("dotenv").config();

const request = require("supertest");
const app = require("../app");
const connectDB = require("../db/db");
const mongoose = require("mongoose");

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("App", () => {

    test("POST /api/auth/register should return 409 if user already exists", async () => {
        const response = await request(app).post("/api/auth/register").send({
            username: "testuser",
            email: "test@gmail.com",
            password: "password",
            role: "user"
        });
        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBe("User already exists");
    });

    test("POST /api/auth/login should return 200", async () => {
        const response = await request(app).post("/api/auth/login").send({
            username: "test4",
            email: "test4@gmail.com",
            password: "password",
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("User logged in successfully");
    });

    test("POST /api/auth/logout should return 200", async () => {
        const response = await request(app).post("/api/auth/logout").set("Cookie", `token=${process.env.JEST_POST_TOKEN}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("User logged out successfully");
    });

    test("GET /api/music/getAll for user should return 200", async () => {
        const response = await request(app).get("/api/music/getAll").set("Cookie", `token=${process.env.JEST_POST_TOKEN}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Music fetched successfully");
    });
});