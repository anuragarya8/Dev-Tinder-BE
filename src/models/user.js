const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: [true, "First name is required"],
        minlength: [3, "First name must be at least 3 characters long"],
        maxlength: [50, "First name must be at most 50 characters long"],
        trim: true,
        validate: [validator.isAlpha, "First name must contain only letters"]
    },

    lastName: {
        type: String,
        minlength: 3,
        maxlength: 50,
        trim: true,
        validate: [validator.isAlpha, "Last name must contain only letters"]
    },

    age: {
        type: Number,
        min: 18
    },

    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        }
    },

    emailId: {
        type: String,
        lowercase: true,
        required: [true, "Email is required"],
        unique: true,
        validate: [validator.isEmail, "Please use a valid email address"]
        // trim: true,
        // maxlength: 254,
        // match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },

    password: {
        type: String,
        required: true,
        validate: [validator.isStrongPassword, "Password is not strong enough. It should contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"]
    },

    photoUtl: {
        type: String,
        validate: [validator.isURL, "Please use a valid URL"],
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },

    bio: {
        type: String,
        default: "Default bio",
        maxLength: [500, "Bio must be at most 1000 characters long"],
        trim: true,
    },

    skills: {
        type: [String]
    },

},
    {
        timestamps: true
    });

module.exports = mongoose.model("User", userSchema);