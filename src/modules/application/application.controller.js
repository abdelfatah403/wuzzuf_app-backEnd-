import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware.js";
import * as AV from "./application.validation.js";
import * as applicationService from "./application.service.js";
import { asyncHandler } from "../../ErrorHandiling/asyncHandler.js";
import { filterTypes } from "../../DB/enums.js";
import { multerUpload } from "../../utilis/fileUpload/multerUpload.js";

const appRouter = Router();

appRouter.post(
  "/:jobId",
  authentication(),
  multerUpload(filterTypes.pdf).single("file"),
  asyncHandler(applicationService.createApplication)
);



export default appRouter;
