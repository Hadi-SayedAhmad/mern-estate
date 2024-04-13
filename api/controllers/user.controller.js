import errorHandler from "../utils/customError.handler.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import sendEmail from "../utils/nodemailer.js";
import jwt from "jsonwebtoken";
import validator from "validator";
export const updateUser = async (req, res, next) => {
  if (req.user && req.user.id != req.params.id) {
    return next(errorHandler(401, "You can only update your own account!"));
  }
  try {
    if (
      req.body.username &&
      !validator.isAlphanumeric(String(req.body.username))
    ) {
      next(
        errorHandler(
          401,
          "Your username is not valid! It should only contain letters and numbers."
        )
      );
    } else if (req.body.email && !validator.isEmail(String(req.body.email))) {
      next(errorHandler(401, "Your email is not valid!"));
    } else if (
      req.body.password &&
      !validator.isStrongPassword(String(req.body.password))
    ) {
      next(
        errorHandler(
          401,
          "Your password is not valid! It should be at least 8 characters, containing capital letter, small letter, number and a symbol."
        )
      );
    } else {
      if (req.body.password) {
        req.body.password = await bcryptjs.hash(req.body.password, 10);
      }
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          },
        },
        {
          new: true,
        }
      );
      
      if (req.body.email) {
        updateUser.confirmed = false;
        await updateUser.save();
        const tokenToConfirmEmail = jwt.sign(
          { id: updateUser._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        const result = await sendEmail(updateUser, tokenToConfirmEmail);
        res
          .clearCookie("jwt")
          .status(201)
          .json(
            "Your account was updated successfully! Please confirm your new email before trying to login again."
          );
      } else {
        const {password, ...rest} = updateUser._doc;
        res.status(201).json(rest);
      }
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user && req.user.id != req.params.id) {
    return next(errorHandler(401, "You can only delete your own account!"));
  }
  try {
    await User.findByIdAndDelete({ _id: req.user.id });
    res
      .clearCookie("jwt")
      .status(200)
      .json("Profile has been deleted successfully!");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found!"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
