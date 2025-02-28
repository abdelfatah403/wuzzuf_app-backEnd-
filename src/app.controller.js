import cors from "cors";
import connect from "./DB/connection.js";
import { notfoundHandler } from "./ErrorHandiling/asyncHandler.js";
import { globalErrorHandler } from "./utilis/globalErrorHandling/globalErrorHandling.js";
import { limiter } from "./utilis/limiter/limiter.js";
import authRouter from "./modules/auth/auth.controller.js";
import UserRouter from "./modules/user/user.controller.js";
import jobRouter from "./modules/jobs/job.controller.js";
import companyRouter from "./modules/company/company.controller.js";
import appRouter from "./modules/application/application.controller.js";
// import dashBoardSchema from "./modules/dashBoard/schema.js";
import { createHandler } from 'graphql-http/lib/use/express';
import Query from "./modules/dashBoard/schema.js";
import schema from "./modules/dashBoard/schema.js";
const bootStrap = async (app, express) => {
  await connect();
  app.use(cors());
  app.use(limiter);
  app.use(express.json());
  app.use('/auth',authRouter)
  app.use('/user',UserRouter)
  app.use('/job',jobRouter)
  app.use('/company',companyRouter)
  app.use('/application',appRouter)
  app.use('/dashboard', createHandler({schema: schema}));
  app.use('*',notfoundHandler)
  app.use(globalErrorHandler)
};

export default bootStrap;
