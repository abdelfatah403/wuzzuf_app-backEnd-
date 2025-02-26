import cors from "cors";
import connect from "./DB/connection.js";
import { notfoundHandler } from "./ErrorHandiling/asyncHandler.js";
import { globalErrorHandler } from "./utilis/globalErrorHandling/globalErrorHandling.js";
import { limiter } from "./utilis/limiter/limiter.js";
import authRouter from "./modules/auth/auth.controller.js";
import UserRouter from "./modules/user/user.controller.js";


const bootStrap = async (app, express) => {
  await connect();
  app.use(cors());
  app.use(limiter);
  app.use(express.json());
  app.use('/auth',authRouter)
  app.use('/user',UserRouter)
  app.use('*',notfoundHandler)
  app.use(globalErrorHandler)
};

export default bootStrap;
