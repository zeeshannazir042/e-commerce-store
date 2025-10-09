import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,   
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,   
        required: true,
        minlength: 6
    },
    isAdmin: {                  // fixed camelCase
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
