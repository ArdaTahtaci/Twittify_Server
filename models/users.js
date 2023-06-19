import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userId: String,
    name: String,
    userName: String,
    eMail: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
    password: String,
    profilePhoto: String,
    profileBackgroundPhoto: String,
    bio: String,
    followers: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    followings: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    tweets: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }
    ],
    deleted: {
        type: Boolean,
        default: false
    }

})

const User = mongoose.model("User", userSchema);

export default User;
