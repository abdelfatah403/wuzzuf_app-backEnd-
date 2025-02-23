import cors from "cors";
import connect from "./DB/connection.js";
import { notfoundHandler } from "./ErrorHandiling/asyncHandler.js";

const bootStrap = async (app, express) => {
  await connect();
  app.use(cors());
  // app.use(limiter);
  app.use(express.json());
  app.use('*',notfoundHandler)
};

export default bootStrap;
