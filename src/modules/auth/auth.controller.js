import { Router } from "express";
import * as AuthService from "./auth.service.js";
import { asyncHandler } from "../../ErrorHandiling/asyncHandler.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as AV from "./auth.validation.js";
import { authentication } from "../../middlewares/auth.middleware.js";


const authRouter = Router();

authRouter.post(
  "/",
  validation(AV.SignUpSchema),
  asyncHandler(AuthService.signUp)
);
authRouter.post(
  "/confirm",
  validation(AV.confirmEmail),
  asyncHandler(AuthService.confirmEmail)
);

authRouter.post(
  "/login",
  validation(AV.LoginSchema),
  asyncHandler(AuthService.login)
);
authRouter.post(
  "/refreshtoken",
  validation(AV.LoginSchema),
  asyncHandler(AuthService.RefreshToken)
);

authRouter.post(
  "/LoginAndSignupWithGoogle",
  asyncHandler(AuthService.LoginAndSignupWithGoogle)
);
authRouter.patch(
  "/forgetPassword",
  authentication(),
  validation(AV.forgetPassword),
  asyncHandler(AuthService.forgetPassword)
);
authRouter.patch(
  "/resetPassword",
  authentication(),
  validation(AV.resetPassword),
  asyncHandler(AuthService.resetPassword)
);

export default authRouter;
