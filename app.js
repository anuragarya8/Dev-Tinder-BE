const express = require("express")
const connectDB = require("./src/config/database")
const app = express()
const User = require("./src/models/user")
app.use(express.json())
const port = 6262

app.post("/signup", async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save();
        res.send("User created successfully");
    } catch (err) {
        res.status(400).send("Error saving the user" + err.message)
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

