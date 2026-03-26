const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Token not valid")
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken._id)
        if (!user) {
            throw new Error("User not found")
        }

        req.user = user
        next()
    } catch (err) {
        res.status(400).send("Error authenticating the user " + err.message)
    }
}

module.exports = userAuth
