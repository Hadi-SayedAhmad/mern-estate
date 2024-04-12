import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import errorHandler from "../utils/customError.handler.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/nodemailer.js";
import validator from "validator";
import jwt from 'jsonwebtoken'
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!email || !password || !username) {
    next(errorHandler(401, "Fields must be filled!"));
  } else if (!validator.isAlphanumeric(String(username))) {
    next(
      errorHandler(
        401,
        "Your username is not valid! It should only contain letters and numbers."
      )
    );
  } else if (!validator.isEmail(String(email))) {
    next(errorHandler(401, "Your email is not valid!"));
  } else if (!validator.isStrongPassword(String(password))) {
    next(
      errorHandler(
        401,
        "Your password is not valid! It should be at least 8 characters, containing capital letter, small letter, number and a symbol."
      )
    );
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const tokenToConfirmEmail = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    try {
      const result = await sendEmail(newUser, tokenToConfirmEmail);

      res
        .status(201)
        .json(
          "Your account was created successfully! Please confirm your email before trying to login."
        );
    } catch (error) {
      next(error);
    }
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    } else {
      if (!validUser.confirmed) {
        return next(errorHandler(404, "Please confirm your email first, then login!"));
      } else {
        const validPassword = await bcrypt.compare(
          password,
          validUser.password
        );
        if (!validPassword) {
          return next(errorHandler(401, "Invalid Password!"));
        } else {
          generateToken(res, validUser);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res) => {
  const userData = req.body;
  const searchUser = await User.findOne({ email: userData.email });

  if (searchUser) {
    if (!searchUser.confirmed) {
      return next(errorHandler(404, "Please confirm your email first, then login!"));
    } else {
      generateToken(res, searchUser);
    }
    
  } else {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const newUser = new User({
      username:
        userData.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-8),
      email: userData.email,
      password: hashedPassword,
      avatar: userData.photoUrl,
    });
    const user = await newUser.save();

    try {
      const tokenToConfirmEmail = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      const result = await sendEmail(newUser, tokenToConfirmEmail);
    } catch (error) {
      next(errorHandler("1001", "We are not able to find your email account."));
    }
  }
};

export const signOut = (req, res, next) => {
  try {
    res.clearCookie("jwt").status(200).json("Signed out successfully!");
  } catch (error) {
    next(error);
  }
};

export const confirmEmail = async (req, res, next) => {
  const token = req.params.token;
  let userId;
  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, user) => {
      if (err) {
        next(errorHandler(401, "Forbidden!"));
      } else {
        userId = user.id;
      }
    }
  );
  try {
    const userInDb = await User.findOne({ _id: userId });
    if (!userInDb) {
      next(errorHandler(401, "User not found!"));
    } else {
      userInDb.confirmed = true;
      await userInDb.save();
      res
        .status(200)
        .json("Your email was confirmed successfully! You can sign in now.");
    }
  } catch (error) {
    next(error.message);
  }
};
