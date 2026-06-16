const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const sessionModel = require("../models/session.model")
const { sendEmail } = require("../services/nodemailer.service")
const { generateOtp, getOtpHtml } = require("../utils/utils")
const otpModel = require("../models/otp.model")

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

    const otp = generateOtp()
    const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex")
    await otpModel.create({
        otpHash,
        user: user._id,
        email: user.email
    })

    await sendEmail(email, "Verify your email", "Your OTP is: " + otp, getOtpHtml(otp))

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            verified: user.verified
        }
    })

}

async function verifyEmail(req, res) {
    const { otp, email } = req.body

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex")
    const otpData = await otpModel.findOne({ otpHash, email })

    if (!otpData) return res.status(404).json({ message: "OTP not found" })

    const user = await userModel.findById(otpData.user)

    if (!user) return res.status(404).json({ message: "User not found" })

    user.verified = true
    await user.save()

    await otpModel.deleteMany({ user: user._id })

    res.status(200).json({ message: "Email verified successfully" })
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

    if (!user.verified) return res.status(401).json({ message: "User not verified" })

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const refreshtoken = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    )

    const refreshTokenHash = crypto.createHash("sha256").update(refreshtoken).digest("hex")

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accesstoken = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    )


    res.cookie("refreshToken", refreshtoken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
        , accesstoken
    })
}

async function logout(req, res) {

    const refreshtoken = req.cookies.refreshToken;

    if (!refreshtoken) return res.status(401).json({ message: "Unauthorized" })

    try {
        const decode = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET);
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const refreshTokenHash = await crypto.createHash("sha256").update(refreshtoken).digest("hex")
    console.log(refreshtoken)
    console.log(refreshTokenHash)
    const session = await sessionModel.findOne({ refreshTokenHash });
    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }
    session.revoked = true;
    await session.save();


    res.clearCookie("refreshToken")
    res.status(200).json({
        message: "User logged out successfully",
    })
}

async function logoutAll(req, res) {
    const refreshtoken = req.cookies.refreshToken;

    if (!refreshtoken) return res.status(401).json({ message: "Unauthorized" })

    try {
        const decode = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET);
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    await sessionModel.updateMany({ user: decode.id, revoked: false }, { revoked: true });

    res.clearCookie("refreshToken")
    res.status(200).json({
        message: "User logged out successfully from all devices",
    })
}

async function getMe(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) res.status(401).json({ message: "Unauthorized" })

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decode.id)

    return res.status(200).json({
        message: "User fetched successfully",
        user
    })
}

async function refreshToken(req, res) {
    const token = req.cookies.refreshToken;

    if (!token) res.status(401).json({ message: "Unauthorized" })

    const decode = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const refreshTokenHash = await crypto.createHash("sha256").update(token).digest("hex")

    const session = await sessionModel.findOne({ refreshTokenHash, revoked: false })

    if (!session) return res.status(404).json({ message: "Session not found" })

    const user = await userModel.findById(decode.id);

    const newRefreshToken = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    )

    const newRefreshTokenHash = await crypto.createHash("sha256").update(newRefreshToken).digest("hex")

    session.refreshTokenHash = newRefreshTokenHash
    await session.save()

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    const accesstoken = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    )

    res.status(200).json({
        message: "Access token generated successfully",
        accesstoken
    })
}

module.exports = { register, login, logout, getMe, refreshToken, logoutAll, verifyEmail }