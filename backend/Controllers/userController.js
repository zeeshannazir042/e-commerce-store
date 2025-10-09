import User from "../Models/userModel.js";
import asyncHandler from "../Middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../Utils/createToken.js";

// @desc Create new user
const createUser = asyncHandler(async (req, res) => {
    const { username, email, password, isAdmin } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false
    });

    createToken(res, newUser._id);

    res.status(201).json({
        user: {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        },
        message: "User created successfully"
    });
});

// @desc Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(401);
        throw new Error("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        res.status(401);
        throw new Error("Invalid password");
    }

    createToken(res, user._id);

    res.status(200).json({
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        },
        message: "Login successful"
    });
});

// @desc Logout user
const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
});

// @desc Get all users (admin only)
const allUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
});
// @desc Get current user profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.status(200).json({
            _id: user._id,
            username: user.username,    
            email: user.email,
       
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc Update current user profile
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }   
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc Delete user by ID (admin only)
const deleteUserById = asyncHandler(async (req, res) =>{
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin){
        res.status(400)
        throw new Error ("cannot delete admin user")
      }
      await User.deleteOne({ _id:user._id})
      res.json({message:"user removed"})
    } else {
        res.status(404)
        throw new Error("user not found")
      
    }

})   
//@dec admin Get User By ID
const getUserById = asyncHandler(async(req, res)=>{
  
    const user = await User.findById(req.params.id).select('-password')

    if(user){
        res.json(user)
    }
    else{
        res.status(404)
        throw new Error("user not found");
    }

})
//@DEC ADMIN updateUser by ID
const updateUserById = asyncHandler(async (req, res)=>{

    const user = await User.findById(req.params.id)

    if(user){
        user.username=req.body.username|| user.username
        user.email = req.body.email || user.email
        user.isAdmin =  Boolean(req.body.isAdmin)

        const updatedUser = await user.save()

        res.json({
            _id:updatedUser._id,
            username:updatedUser.username,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin

        })
    } else{
        res.status(404)
        throw new Error("user not found");
    }
})
    


export { createUser, loginUser, logoutCurrentUser, 
    allUsers, getCurrentUserProfile, updateCurrentUserProfile, deleteUserById,getUserById,updateUserById
};
