const express = require("express")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const connectDB = require("./src/config/database")
const User = require("./src/models/user")
const { validateSignUpData, validateLoginData } = require("./src/utils/validation")
const userAuth = require("./src/middlewares/auth")

const app = express()
app.use(express.json())
app.use(cookieParser())
const port = 6262

app.post("/signup", async (req, res) => {

    try {
        //validation of signup data
        validateSignUpData(req)

        //extracting data from request body
        const { firstName, lastName, emailId, password } = req.body

        //encryption of password
        const hashedPassword = await bcrypt.hash(password, 10)

        //creating new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword
        })
        await user.save();
        res.send("User created successfully");
    } catch (err) {
        res.status(400).send("Error saving the user : " + err.message)
    }
})

app.post("/login", async (req, res) => {
    try {
        validateLoginData(req)
        const { emailId, password } = req.body
        const user = await User.findOne({ emailId })
        if (!user) {
            return res.status(404).send("Invalid Credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {
            // create JWT token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
            console.log(process.env.JWT_SECRET)
            //sending the cookie
            res.cookie("token", token)
            res.send("User logged in successfully")
        } else {
            return res.status(401).send("Invalid Credentials")
        }
    } catch (err) {
        res.status(400).send("Error logging in the user : " + err.message)
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (err) {
        res.status(400).send("Error fetching the user " + err.message)
    }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user
    console.log("Sending connection request ");
    res.send(user.firstName + " sent a connection request")
})


connectDB().then(() => {
    console.log("Database connection established");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}).catch((err) => {
    console.error("Database can't be connected!!");
});
