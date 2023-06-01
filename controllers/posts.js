import Post from "../models/Post.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const getAllPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find();
  res.json(posts);
});

export const createPost = asyncHandler(async (req, res, next) => {
  const { body, uid } = req;
  const newPost = await Post.create({ ...body, author: uid });
  res.status(201).json(newPost);
});

export const getSinglePost = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
  } = req;
  const post = await Post.findById(id).populate("author");
  if (!post)
    throw new ErrorResponse(`Post with id of ${id} doesn't exist`, 404);
  res.send(post);
});

export const updatePost = asyncHandler(async (req, res, next) => {
  const {
    body,
    params: { id },
    uid,
  } = req;
  //check if the post exists
  const found = await Post.findById(id);
  if (!found)
    throw new ErrorResponse(`Post with id of ${id} doesn't exist`, 404);
  //check if the user is also the author
  // const user = await User.findById(uid);
  if (!(uid == found.author.toString()))
    throw new ErrorResponse("You can only modify your own posts", 403);
  //if everything is okay, update post
  const updatedPost = await (
    await Post.findOneAndUpdate({ _id: id }, body, { new: true })
  ).populate("author");
  res.json(updatedPost);
});

export const deletePost = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    uid,
  } = req;
  const found = await Post.findById(id);
  if (!found) throw new Error(`Post with id of ${id} doesn't exist`);
  //check if the user is also the author
  // const user = await User.findById(uid);
  if (!(uid == found.author.toString()))
    throw new ErrorResponse("You can only delete your own posts", 403);
  //if everything is okay, delete post
  await Post.deleteOne({ _id: id });
  res.json({ success: `Post with id of ${id} was deleted` });
});
