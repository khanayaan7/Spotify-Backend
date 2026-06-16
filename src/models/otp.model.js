const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    otpHash: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Otp", otpSchema)
