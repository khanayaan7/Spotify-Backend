const jwt = require("jsonwebtoken")

async function authArtist(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Unauthorized" })

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (decode.role != "artist") return res.status(403).json({ message: "Forbidden" })

        req.user = decode;

        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in token verification" })
    }
}

async function authUser(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Unauthorized" })

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (decode.role != "user" && decode.role != "artist") return res.status(403).json({ message: "Forbidden" })

        req.user = decode;

        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in token verification" })
    }
}

module.exports = { authArtist, authUser };