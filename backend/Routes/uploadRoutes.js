import path from "path";
import express from "express";
import multer from "multer";
const router = express.Router();
import formidable from 'express-formidable';
import { checkId } from "../middlewares/checkId.js";
import { authenticator, admin } from "../middlewares/authMiddleware.js";

// Set up multer for file storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter(req, file, cb) {
        const filetypes = /jpg|jpeg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb('Images only! (jpg, jpeg, png, webp)');
    }   
});

// POST /api/uploads - Upload image
router.post("/", upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(200).json({
                message: "No file uploaded, using placeholder",
                filename: "placeholder.png" // default placeholder
            });
        }

        // Return only the filename
        return res.status(200).json({
            message: "File uploaded successfully",
            filename: req.file.filename
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error uploading file" });
    }
});



export default router;