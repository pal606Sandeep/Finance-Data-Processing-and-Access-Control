import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import cookieParser from 'cookie-parser';

export const protect = catchAsync(async (req, res, next) => {
  let token;

  // first we check the cookies, then Header as fallback
  if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2. Verify token
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // 4. Check if user is active 
  if (currentUser.status === 'Inactive') {
    return next(new AppError('Your account is inactive. Please contact admin.', 403));
  }

  // we Grant the Access to the Protected Route
  req.user = currentUser;
  next();
});