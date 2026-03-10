const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://kumaranurag296:Anurag%4012@devtinder.guj7dxk.mongodb.net/devTinder"
    );
};

module.exports = connectDB;
