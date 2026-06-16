function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
}

function getOtpHtml(otp) {
    return `
    <html>
    <style>
        div{
            font-family: sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
            background-color: #121212;
            color: #fff;
        }
    </style>
    <div>
        <h1>Spotify's OTP is: ${otp}</h1>
        <p>This OTP will expire in 10 minutes</p>
        <p>Thank you for using Spotify</p>
    </div>
    </html>
    `
}

module.exports = { generateOtp, getOtpHtml };