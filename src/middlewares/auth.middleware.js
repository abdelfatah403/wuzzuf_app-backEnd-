import { tokenTypes } from "../DB/enums.js";
import User from "../DB/models/user.model.js";
import { asyncHandler } from "../ErrorHandiling/asyncHandler.js";
import { verifyToken } from "../utilis/Token/tokens.js";

export const decodeToken = async ({
  authorization = "",
  tokenType = tokenTypes.access,
  next = {},
}) => {
  const [bearer, token] = authorization.split(" ") || [];
  let ACCESS_SIGNATURE = undefined;
  let REFRESH_SIGNATURE = undefined;
  if (bearer === "user") {
    ACCESS_SIGNATURE = process.env.USER_ACCESS_TOKEN;
    REFRESH_SIGNATURE = process.env.USER_REFRESH_TOKEN;
  } else if (bearer === "admin") {
    ACCESS_SIGNATURE = process.env.ADMIN_ACCESS_TOKEN;
    REFRESH_SIGNATURE = process.env.ADMIN_REFRESH_TOKEN;
  } else {
    return next(new Error("Invalid token type", { cause: 401 }));
  }

  const decoded = verifyToken(
    token,
    tokenType === tokenTypes.access ? ACCESS_SIGNATURE : REFRESH_SIGNATURE
  );

  if (!decoded) {
    return next(new Error("Invalid token", { cause: 401 }));
  }
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (user.changeCredentialTime?.getTime() > decoded.iat * 1000) {
    return next(new Error("invalid-Token", { cause: 401 }));
  }
  return user;
};

export const authentication = () => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    req.user = await decodeToken({ authorization, next });
    return next();
  });
};

export const AllowTo = (roles = []) => {
    return asyncHandler(async (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new Error("forbidden", { cause: 403 }));
      }
      return next();
    });
  };
  

  export const authGRaphql = async ({
    authorization = "",
    tokenType = tokenTypes.access,
    roles = [],
  }) => {
    const [bearar, token] = authorization.split(" ") || [];
    let ACCESS_TOKEN = undefined;
    let REFRESH_TOKEN = undefined;
  
    if (bearar === "user") {
      ACCESS_TOKEN = process.env.USER_ACCESS_TOKEN;
      REFRESH_TOKEN = process.env.USER_REFRESH_TOKEN;
    } else if (bearar === "admin") {
      ACCESS_TOKEN = process.env.ADMIN_ACCESS_TOKEN;
      REFRESH_TOKEN = process.env.ADMIN_REFRESH_TOKEN;
    } else {
      throw new Error("Invalid token type");
    }
    const decoded = verfiyToken(
      token,
      tokenType === tokenTypes.access ? ACCESS_TOKEN : REFRESH_TOKEN
    );
  
    if (!decoded) {
      throw new Error("Invalid token");
    }
  
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }
    if (!roles.includes(req.user.role)) {
      return next(new Error("forbidden", { cause: 403 }));
    }
  
    return user;
  };
