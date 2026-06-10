const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

async function register(req, res) {
    const { username, email, password, role = "user" } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExists) return res.status(409).json({ message: "User already exists" })

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hashPassword,
        role
    })

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET
    )


    res.cookie("token", token)

    res.status(200).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

}

async function login(req, res) {
    const { username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET
    )

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            role: user.role
        }
    })
}

async function logout(req, res) {
    res.clearCookie("token")
    res.status(200).json({
        message: "User logged out successfully",
    })
}

module.exports = { register, login, logout }