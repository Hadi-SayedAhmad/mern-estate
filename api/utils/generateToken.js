import jwt from "jsonwebtoken";

const generateToken = (res, validUser) => {
  const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
  res
    .cookie("jwt", token, {
      httpOnly: true,
    })
    .json({
      _id: validUser._id,
      username: validUser.username,
      email: validUser.email,
      avatar: validUser.avatar,
      createdAt: validUser.createdAt,
      updatedAt: validUser.updatedAt
    });
};

export default generateToken;
