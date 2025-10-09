import express from "express";
import { createUser, loginUser, logoutCurrentUser, allUsers, getCurrentUserProfile,
    updateCurrentUserProfile, deleteUserById, getUserById ,updateUserById } from "../Controllers/userController.js";
import { authenticator, admin } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
    .post(createUser)
    .get(authenticator, admin, allUsers); // only admin can fetch all users

router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);
router.route("/profile").get(authenticator, getCurrentUserProfile).put(authenticator, updateCurrentUserProfile);

//admin routes can be added here in the future
router.route("/:id").delete(authenticator, admin, deleteUserById)
.get(authenticator,admin,getUserById)
.put(authenticator, admin,updateUserById)
 // only admin can delete a user by ID

export default router;
