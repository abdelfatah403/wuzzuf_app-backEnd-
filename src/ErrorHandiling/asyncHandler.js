export const asyncHandler = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch((error) => {
      if (Object.keys(error).length === 0) {
        return next(new Error(error.message, { cause: 500 }));
      }
      return next(error);
    });
  };
};


export const notfoundHandler = (req, res) => {
    res.status(404).json({ error: "Route not found" });
  }
