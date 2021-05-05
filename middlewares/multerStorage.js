const customError = require("http-errors");
const multer = require("multer");
// const crypto = require("crypto");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `tmp`);
//   },
//   filename: function (req, file, cb) {
//     const unique = crypto.randomBytes(16).toString("hex");
//     cb(null, `${unique}-${file.originalname}`);
//   },
// });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(customError(415, "Accept only PNG or JPEG or PNG files"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 }, // 1mb,
});

module.exports = upload;
