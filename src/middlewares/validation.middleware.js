const { body, validationResult } = require("express-validator")

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

const registerValidation = [
    body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long").isAlphanumeric().withMessage("Password must be alphanumeric"),
    validate
]

module.exports = {
    registerValidation
}
