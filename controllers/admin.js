const asyncHandler = require("express-async-handler");
const customError = require("http-errors");
const crypto = require("crypto");

const User = require("../models/User");
const Order = require("../models/Order");
const CarouselImage = require("../models/CarouselImage");
const Product = require("../models/Product");
const imagekit = require("./../config/imageKit");
const { generateToken } = require("../utils/generateToken");

exports.getUsers = asyncHandler(async (req, res) => {
  const _users = await User.find().select("_id role name email");
  res.status(200).json({ _users, status: 200 });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const _user = await User.findOne({ _id: userId }).select(
    "-password -updatedAt"
  );

  if (!_user) throw customError(404, "user does not exit");
  res.status(200).json({ _user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId == "60856f56ed20cf0c4a97005c")
    throw customError(403, "No one can delete this user");

  const _user = await User.findOneAndDelete({
    _id: userId,
  });

  if (!_user) throw customError(404, "no such user with this _id");

  res.status(200).json({ status: 200, result: "user deleted successfully!" });
});

exports.updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (userId == "60856f56ed20cf0c4a97005c")
    throw customError(403, "No one can modify this user");

  const _user = await User.findOne({ _id: userId });
  _user.role = role;

  _user.save((err) => {
    if (err) throw customError(500, "Internal Server Error");
    res.status(200).json({ status: 200, result: "role updated successfully" });
  });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const _orders = await Order.find().select("");
  res.status(200).json({ status: 200, _orders });
});

exports.updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { delivered } = req.body;

  const _order = await Order.findByIdAndUpdate(orderId, { delivered });
  if (!_order) throw customError(422, "order does not exist with this _id");

  res.status(200).json({ status: 200, result: "updated successfully" });
});

exports.addCarouselProduct = asyncHandler(async (req, res) => {
  if (!req.file) throw customError(400, `you didn't attach any image`);

  const unique = crypto.randomBytes(16).toString("hex");
  const result = await imagekit.upload({
    file: req.file.buffer,
    fileName: `${unique}-${req.file.originalname}`,
  });
  if (!result) throw customError(500, "Internal Server Error");

  const _carouselImage = await CarouselImage.create({
    image_url: result.url,
    fileId: result.fileId,
  });

  if (!_carouselImage) throw customError(500, "Internal Server Error");

  res.status(201).json({
    status: 201,
    message: "image added successfully",
  });
});

exports.deleteCarouselProduct = asyncHandler(async (req, res) => {
  const { carouselImageId } = req.params;

  if (carouselImageId == "608bf5515c8113001528d324")
    throw customError(403, "No one can delete this image");

  const _carouselImageDoc = await CarouselImage.findOneAndDelete({
    _id: carouselImageId,
  });

  if (!_carouselImageDoc) throw customError(404, "no such image with this _id");

  const result = imagekit.deleteFile(_carouselImageDoc.fileId);
  if (!result) throw customError(500, "Internal Server Error");

  res.status(200).json({ status: 200, result: "image deleted successfully!" });
});

exports.addProduct = asyncHandler(async (req, res) => {
  const { name, price, countInStock, description } = req.body;

  const unique = crypto.randomBytes(16).toString("hex");
  const result = await imagekit.upload({
    file: req.files[0].buffer,
    fileName: `${unique}-${req.files[0].originalname}`,
  });
  if (!result) throw customError(500, "Internal Server Error");

  await Product.create({
    name,
    price,
    countInStock,
    description,
    image_url: result.url,
  });

  res.status(201).json({
    status: 201,
    message: "product created successfully",
  });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, price, countInStock, description } = req.body;

  const _product = await Product.findOne({ _id: productId });
  if (!_product) throw customError(404, "product does not exist");

  if (req.files.length !== 0) {
    const unique = crypto.randomBytes(16).toString("hex");
    const result = await imagekit.upload({
      file: req.files[0].buffer,
      fileName: `${unique}-${req.files[0].originalname}`,
    });
    if (!result) throw customError(500, "Internal Server Error");

    _product.image_url = result.url;
  }

  _product.name = name;
  _product.price = price;
  _product.countInStock = countInStock;
  _product.description = description;

  _product.save((err) => {
    if (err) throw customError(500, "Internal Server Error");

    res.status(200).json({
      status: 200,
      message: "product updated successfully!",
    });
  });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (productId == "608c0f4a1b841b00156a2dae")
    throw customError(403, "No one can delete this product");

  const _product = await Product.findOneAndDelete({
    _id: productId,
  });

  if (!_product) throw customError(404, "no such product with this _id");

  res
    .status(200)
    .json({ status: 200, result: "product deleted successfully!" });
});

exports.loginAsGuest = asyncHandler(async (req, res) => {
  const _user = await User.findOne({ email: "test@test.com" });
  res.status(200).json({
    status: 200,
    name: _user.name,
    email: _user.email,
    role: _user.role,
    token: generateToken(_user._id),
  });
});
