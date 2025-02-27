import { Router } from "express";
import * as userService from "./user.service.js";
import { asyncHandler } from "../../ErrorHandiling/asyncHandler.js";
import { authentication } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as UV from "./user.validation.js";
import { multerUpload } from "../../utilis/fileUpload/multerUpload.js";
import { filterTypes } from "../../DB/enums.js";

const UserRouter = Router();

UserRouter.patch(
  "/update",
  authentication(),
  validation(UV.updateSchema),
  asyncHandler(userService.updateUser)
);
UserRouter.get("/", authentication(), asyncHandler(userService.getUser));
UserRouter.get(
  "/ViewProfile/:id",
  authentication(),
  asyncHandler(userService.ViewProfile)
);
UserRouter.patch(
  "/uploadPofile",
  authentication(),
  multerUpload(filterTypes.image).single("image"),
  asyncHandler(userService.uploadPofile)
);
UserRouter.patch(
  "/uploadCoverProfile",
  authentication(),
  multerUpload(filterTypes.image).array("images"),
  asyncHandler(userService.uploadCoverProfile)
);
UserRouter.delete(
  "/DeleteuploadPofile",
  authentication(),
  asyncHandler(userService.DeleteuploadPofile)
);
UserRouter.delete(
  "/DeleteuploadCover/:public_id",
  authentication(),
  asyncHandler(userService.DeleteuploadCover)
);
UserRouter.patch(
  "/softDeleteAndRestore",
  authentication(),
  asyncHandler(userService.softDeleteAndRestore)
);
UserRouter.delete(
  "/DeleteuploadCover/:public_id",
  authentication(),
  asyncHandler(userService.DeleteuploadCover)
);

export default UserRouter;
