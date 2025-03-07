export const globalErrorHandler = (err, req, res, next) => {
    return res
      .status(err["cause"] || 500)
      .json({ message: err.message, stack: err.stack });
  };
  