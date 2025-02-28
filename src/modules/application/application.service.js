import Application from "../../DB/models/application.model.js";
import cloudinary from "../../utilis/fileUpload/cloudinary.js";
import ExcelJS from "exceljs";
import path from "path";

export const createApplication = async (req, res, next) => {
  const { jobId } = req.params;
  if (!req.file) {
    return next(new Error("please upload your cv", { cause: 400 }));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path);

  const application = await Application.create({
    jobId: jobId,
    userId: req.user._id,
    userCV: { secure_url, public_id },
  });
  return res.status(201).json({ message: "success", application });
};

