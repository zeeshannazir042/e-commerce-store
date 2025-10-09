import { isValidObjectId } from "mongoose";
export const checkId = (req, res, next) => {
    const id = req.params.id || req.params.productId || req.params.categoryId;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    next();
};