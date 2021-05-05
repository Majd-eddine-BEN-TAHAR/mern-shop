const { Schema, model } = require("mongoose");

const carouselImageSchema = new Schema({
  image_url: String,
  fileId: String,
});

module.exports = model("CarouselImage", carouselImageSchema);
