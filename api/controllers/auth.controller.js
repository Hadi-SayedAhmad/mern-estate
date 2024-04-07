import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import errorHandler from "../utils/customError.handler.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    } else {
      const validPassword = await bcrypt.compare(password, validUser.password);
      if (!validPassword) {
        return next(errorHandler(401, "Invalid Password!"));
      } else {
        generateToken(res, validUser);
      }
    }
  } catch (error) {
    next(error);
  }
};
