const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("First Name and Last Name are required")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is too weak")
    } else {
        return true
    }
}

const validateLoginData = (req) => {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
        throw new Error("Email and Password are required")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email")
    } else {
        return true
    }
}


module.exports = { validateSignUpData, validateLoginData }