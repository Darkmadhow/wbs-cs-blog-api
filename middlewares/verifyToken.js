import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export default function verifyToken(req, res, next) {
  const {
    headers: { authorization },
  } = req;
  //is a token present?
  if (!authorization) throw new ErrorResponse("Please log in", 401);
  const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
  //attach the payload to the req
  req.uid = decoded.uid;
  next();
}
