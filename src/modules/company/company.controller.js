import { Router } from "express";
import jobRouter from "../jobs/job.controller.js";
import { asyncHandler } from "../../ErrorHandiling/asyncHandler.js";
import * as companyService from "./company.service.js";
import { AllowTo, authentication } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as CV from "./company.validation.js";
import { multerUpload } from "../../utilis/fileUpload/multerUpload.js";
import { enumRole, filterTypes } from "../../DB/enums.js";

const companyRouter = Router();

companyRouter.use("/:companyId/job", jobRouter);

companyRouter.post(
  "/",
  authentication(),
  validation(CV.companySchema),
  multerUpload(filterTypes.pdf).single('pdf'),
  asyncHandler(companyService.createCompany)
);
companyRouter.patch(
  "/update/:companyId",
  authentication(),
  validation(CV.updateCompanySchema),
  asyncHandler(companyService.updateCompany)
);
companyRouter.get(
    "/searchCompany",
    authentication(),
    asyncHandler(companyService.searchCompany)
  );

companyRouter.delete(
  "/delete/:companyId",
  authentication(),
  AllowTo([enumRole.admin]),
  asyncHandler(companyService.SoftdeleteCompany)
);

companyRouter.get(
  "/:companyId",
  authentication(),
  asyncHandler(companyService.getAllCompany)
);
companyRouter.patch(
    "/uploadlogo/:companyId",
    authentication(),
    multerUpload(filterTypes.image).single("image"),
    asyncHandler(companyService.uploadPofile)
  );
  companyRouter.patch(
    "/uploadCoverProfile/:companyId",
    authentication(),
    multerUpload(filterTypes.image).array("images"),
    asyncHandler(companyService.uploadCoverProfile)
  );
  companyRouter.delete(
    "/DeleteuploadPofile/:companyId",
    authentication(),
    asyncHandler(companyService.DeleteuploadPofile)
  );
  companyRouter.delete(
    "/DeleteuploadCover/:public_id/:companyId",
    authentication(),
    asyncHandler(companyService.DeleteuploadCover)
  );


export default companyRouter;
