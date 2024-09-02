const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/images/jobListingApplication");
  },
  filename: function (req, file, cb) {
    const { Id } = req.params;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf(".")
    );
    const newFilename =
      file.fieldname + "-" + Id + "-" + uniqueSuffix + extension;
    cb(null, newFilename);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(
        {
          message: "Invalid file type. Only PDF files are allowed.",
          status: 415,
        },
        false
      );
    }
  },
  limits: {
    fileSize: 3 * 1024 * 1024,
    files: 2,
  },
});
module.exports = { upload, multer };
