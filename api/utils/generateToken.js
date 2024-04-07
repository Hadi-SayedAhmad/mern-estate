import jwt from "jsonwebtoken";

const generateToken = (res, validUser) => {
  const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
  res
    .cookie("jwt", token, {
      httpOnly: true,
    })
    .json({
      _id: validUser._id,
      name: validUser.username,
      email: validUser.email,
    });
};

export default generateToken;
