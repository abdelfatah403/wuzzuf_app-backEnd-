import e from "cors";
import { Router } from "express";
import { authentication } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../ErrorHandiling/asyncHandler.js";
import * as jobService from "./job.service.js";
import * as JV from "./job.validation.js";

const jobRouter = Router({ mergeParams: true});


jobRouter.patch(
  "/updateJob/:jobId",
  authentication(),
  validation(JV.updateJobSchema),
  asyncHandler(jobService.updateJob)
);

jobRouter.post(
  "/:companyId",
  authentication(),
  validation(JV.jobSchema),
  asyncHandler(jobService.addJob)
);



export default jobRouter;
