import Company from "../../DB/models/company.model.js";
import cloudinary from "../../utilis/fileUpload/cloudinary.js";

export const createCompany = async (req, res, next) => {
  const {
    companyName,
    companyEmail,
    companyPhone,
    address,
    industry,
    description,
  } = req.body;
  const company = await Company.findOne({ companyEmail });
  if (company) {
    return next(new Error("company already exist", { cause: 409 }));
  }
  //   const { secure_url, public_id } = await cloudinary.uploader.upload(
  //     req.file.path
  //   );

  const newCompany = await Company.create({
    companyName,
    companyEmail,
    companyPhone,
    address,
    industry,
    description,
    CreatedBy: req.user._id,
    // legalAttachment: { secure_url, public_id },
  });
  return res.status(201).json({ message: "success", newCompany });
};

export const updateCompany = async (req, res, next) => {
  const {
    companyName,
    companyEmail,
    companyPhone,
    address,
    industry,
    description,
  } = req.body;
  const { companyId } = req.params;
  let company = await Company.find({ _id: companyId, CreatedBy: req.user._id });
  if (!company) {
    return next(
      new Error("company not found or you not a owner", { cause: 404 })
    );
  }
  company = await Company.findOneAndUpdate(
    { _id: companyId, CreatedBy: req.user._id },
    {
      companyName,
      companyEmail,
      companyPhone,
      address,
      industry,
      description,
    },
    { new: true }
  );
  return res.status(200).json({ message: "success", company });
};

export const SoftdeleteCompany = async (req, res, next) => {
  const { companyId } = req.params;
  let company = await Company.find({ _id: companyId });
  if (!company) {
    return next(
      new Error("company not found or you not a owner", { cause: 404 })
    );
  }
  company = await Company.findOneAndUpdate(
    { _id: companyId },
    { isDeleted: true },
    { new: true }
  );
  return res.status(200).json({ message: "success", company });
};

export const getAllCompany = async (req, res, next) => {
  const { companyId } = req.params;
  const find = await Company.find({ _id: companyId,CreatedBy:req.user._id }).populate([
    {
      path: "jobs",
      closed: false,
    },
  ]);
  if (!find) {
    return next(new Error("company not found", { cause: 404 }));
  } else {
    return res.status(200).json({ message: "success", find });
  }
};

export const searchCompany = async (req, res, next) => {
  const { searchKey } = req.query;
  const search = await Company.find({
    companyName: { $regex: searchKey },
  }).select("companyName industry address description");

  if (!search) {
    return next(new Error("company not found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", search });
};

export const uploadPofile = async (req, res, next) => {
  const { companyId } = req.params;
  const company = await Company.findOne({
    _id: companyId,
    isDeleted: false,
  });
  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path
  );

  company.profilePic = { secure_url, public_id };
  await company.save();
  if (company) {
    return res
      .status(200)
      .json({ message: "company updated successfully", company });
  }
  return res.status(400).json({ message: "Invalid data" });
};

export const uploadCoverProfile = async (req, res, next) => {
  const { companyId } = req.params;
  const company = await Company.findOne({
    _id: companyId,
    isDeleted: false,
  });
  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }

  for (const file of req.files) {
    const uploadResult = await cloudinary.uploader.upload(file.path);
    company.coverPic.push({
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
    await company.save();
  }

  return res
    .status(200)
    .json({ message: "Company updated successfully", company });
};

export const DeleteuploadPofile = async (req, res, next) => {
  const { companyId } = req.params;
  const company = await Company.findOne({
    _id: companyId,
    isDeleted: false,
  });
  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  const { public_id } = company.profilePic;
  if (public_id) {
    const deleteResult = await cloudinary.uploader.destroy(public_id);
    company.profilePic = {};
    await company.save();
    return res
      .status(200)
      .json({ message: "Company updated successfully", company });
  }
  return res.status(400).json({ message: "Invalid data" });
};

export const DeleteuploadCover = async (req, res, next) => {
  const { public_id, companyId } = req.params;
  const company = await Company.findOne({
    _id: companyId,
    isDeleted: false,
  });

  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  const coverPic = company.coverPic.find((pic) => pic.public_id === public_id);
  if (!coverPic) {
    return next(new Error("Cover picture not found", { cause: 404 }));
  }
  const deleteResult = await cloudinary.uploader.destroy(public_id);
  company.coverPic.pull(coverPic);
  await company.save();
  return res
    .status(200)
    .json({ message: "Company updated successfully", company });
};
