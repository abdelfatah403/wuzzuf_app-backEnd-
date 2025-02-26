import User from "../../DB/models/user.model.js";
import cloudinary from "../../utilis/fileUpload/cloudinary.js";
// update User
export const updateUser = async (req, res, next) => {
  const { phone, DOB, firstName, lastName, Gender } = req.body;
  const userfound = await User.findOne({
    _id: req.user._id,
    isDeleted: false,
  });

  if (!userfound) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { phone, DOB, firstName, lastName, Gender },
    { new: true },
    { runValidators: true }
  );
  if (updated) {
    return res
      .status(200)
      .json({ message: "User updated successfully", data: updated });
  }
  return res.status(400).json({ message: "Invalid data" });
};

// get User

export const getUser = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id, isDeleted: false });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  return res.status(200).json({ message: "User found", user });
};

export const ViewProfile = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne(
    { _id: id, isDeleted: false },
    { firstName: 1, lastName: 1, email: 1, phone: 1, profilePic: 1 }
  );
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  return res.status(200).json({ message: "User found", user });
};

export const uploadPofile = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id, isDeleted: false });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const { secure_url, public_id } = cloudinary.uploader.upload(req.file.path);

  user.profilePic = { secure_url, public_id };
  await user.save();
  if (user) {
    return res.status(200).json({ message: "User updated successfully", user });
  }
  return res.status(400).json({ message: "Invalid data" });
};

export const uploadCoverProfile = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id, isDeleted: false });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  for (const file of req.files) {
    const uploadResult = await cloudinary.uploader.upload(file.path);
    user.coverPic.push({
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
    await user.save();
  }

  return res.status(200).json({ message: "User updated successfully", user });
};

export const DeleteuploadPofile = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id, isDeleted: false });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const { public_id } = user.profilePic;
  if (public_id) {
    const deleteResult = await cloudinary.uploader.destroy(public_id);
    user.profilePic = {};
    await user.save();
    return res.status(200).json({ message: "User updated successfully", user });
  }
  return res.status(400).json({ message: "Invalid data" });
};

export const DeleteuploadCover = async (req, res, next) => {
  const { public_id } = req.params;
  const user = await User.findOne({ _id: req.user._id, isDeleted: false });

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const coverPic = user.coverPic.find((pic) => pic.public_id === public_id);
  if (!coverPic) {
    return next(new Error("Cover picture not found", { cause: 404 }));
  }
  const deleteResult = await cloudinary.uploader.destroy(public_id);
  user.coverPic.pull(coverPic);
  await user.save();
  return res.status(200).json({ message: "User updated successfully", user });
};

export const softDeleteAndRestore = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id, isDeleted: false });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (user.isActive) {
    user.isActive = false;
    user.isDeleted = true;
    await user.save();
    return res.status(200).json({ message: "User deactivated successfully" });
  } else {
    user.isActive = true;
    user.isDeleted = false;
    await user.save();
    return res.status(200).json({ message: "User activated successfully" });
  }
 
};
