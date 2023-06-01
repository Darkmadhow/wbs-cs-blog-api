import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = asyncHandler(async (req, res, next) => {
  const {
    body: { firstName, lastName, email, password },
  } = req;
  //check if User exists
  const found = await User.findOne({ email });
  if (found) throw new ErrorResponse("User already exists", 400);
  //hash password and generate token
  const hash = await bcrypt.hash(password, 8);
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hash,
  });
  const token = jwt.sign({ uid: newUser._id }, process.env.JWT_SECRET);
  res.json({ token });
});

export const signIn = asyncHandler(async (req, res, next) => {
  const {
    body: { email, password },
  } = req;
  //see if user exists
  const found = await User.findOne({ email }).select("+password");
  if (!found) throw new ErrorResponse("User doesn't exists", 404);
  //compare password
  const match = await bcrypt.compare(password, found.password);
  if (!match) throw new ErrorResponse("Incorrect passwort", 401);
  const token = jwt.sign({ uid: found._id }, process.env.JWT_SECRET);
  res.json({ token });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const { uid } = req;
  const user = await User.findById(uid);
  res.json(user);
});
