import errorHandler from "../utils/customError.handler.js"
import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
export const updateUser = async (req, res, next) => {
    if (req.user && req.user.id != req.params.id) {
        return next(errorHandler(401, "You can only update your own account!"));
    }
    try {
        if (req.body.password) {
            req.body.password = await bcryptjs.hash(req.body.password, 10)
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {
            new: true
        })
        const {password, ...rest} = updateUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user && req.user.id != req.params.id) {
        return next(errorHandler(401, "You can only delete your own account!"));
    }
    try {
        await User.findByIdAndDelete({_id: req.user.id})
        res.status(200).json("Profile has been deleted successfully!");
    } catch (error) {
        next(error)
    }
}