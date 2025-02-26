import multer, { diskStorage } from "multer";

export const multerUpload = (types = []) => {
    const storage = diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads");
      },
    })
  const fileFilter = (req, file, cb) => {
    if (!types.includes(file.mimetype)) {
      return cb(new Error("invalid type"), false);
    }
    cb(null, true);
  };

  const multerUpload = multer({ storage: storage, fileFilter: fileFilter });
  return multerUpload;
};
