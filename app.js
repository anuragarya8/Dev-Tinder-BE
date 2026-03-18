const express = require("express")
const connectDB = require("./src/config/database")
const User = require("./src/models/user")
const { validateSignUpData, validateLoginData } = require("./src/utils/validation")
const bcrypt = require("bcrypt")
const app = express()
app.use(express.json())
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
        if (!isPasswordValid) {
            return res.status(401).send("Invalid Credentials")
        } else {
            res.send("User logged in successfully")
        }
    } catch (err) {
        res.status(400).send("Error logging in the user : " + err.message)
    }
})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (err) {
        res.status(400).send("Error fetching the users" + err.message)
    }
})

app.delete("/user", async (req, res) => {
    const userId = req.body.id
    try {
        const user = await User.findByIdAndDelete(userId)
        if (!user) {
            return res.status(404).send("User not found")
        }
        res.send("User deleted successfully")
    } catch (err) {
        res.status(400).send("Error deleting the user" + err.message)
    }
})

app.patch("/user", async (req, res) => {

    const userId = req.body.id
    const data = req.body

    try {
        const ALLOWED_UPDATES = [
            "firstName",
            "lastName",
            "age",
            "gender",
            "password",
            "photoUrl",
            "bio",
            "skills"
        ]

        const allowedUpdates = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key))
        if (!allowedUpdates) {
            return res.status(400).send("Updating email not allowed")
        }

        if (data?.skills.length > 10) {
            throw new Error("You can only have 10 skills")
        }

        const user = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "after",
            runValidators: true,
        })
        if (!user) {
            return res.status(404).send("User not found")
        }
        res.send("User updated successfully")
    } catch (err) {
        res.status(400).send("Error updating the user" + err.message)
    }
})

connectDB().then(() => {
    console.log("Database connection established");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}).catch((err) => {
    console.error("Database can't be connected!!");
});
