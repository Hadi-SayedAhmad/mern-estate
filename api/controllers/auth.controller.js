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

export const googleAuth = async (req, res) => {
  const userData = req.body;
  const searchUser = await User.findOne({email: userData.email});
  if (searchUser) {
    generateToken(res, searchUser);
  } else {
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const newUser = new User({
      username: userData.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8),
      email: userData.email,
      password: hashedPassword,
      avatar: userData.photoUrl
    })
    await newUser.save();
    generateToken(res, newUser);
  }
}

export const signOut = (req, res, next) => {
  try {
    res.clearCookie("jwt").status(200).json("Signed out successfully!");
  } catch (error) {
    next(error)
  }
  
}
