import AppError from '../utils/appError.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Access Denied: Your role (${req.user.role}) is not allowed to access this.`, 403));
    }
    next();
  };
};