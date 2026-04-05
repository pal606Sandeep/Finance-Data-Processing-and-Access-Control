import User from '../models/User.js';
import { generateTokens } from '../utils/generateTokens.js';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// 1. Register User
export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

//   first we check user is already exist or not
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError("User already exists with this email", 400));
  }


//   we create the user if it is not exist in the DB
  await User.create({
    name,
    email,
    password,
    role: role || 'Viewer'
  });

  res.status(201).json({ 
    status: 'success', 
    message: "User registered successfully" 
  });
});

// 2. Login User
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Manual select of password because we set select: false in Model
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  const { accessToken, refreshToken } = generateTokens(user);

  // we Save refresh token to DB for session management
  user.refreshToken = refreshToken;
  await user.save();

  // I Set Access Token in HttpOnly Cookie for XSS protection
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 15 * 60 * 1000 // 15 mins
  });

  res.status(200).json({ 
    status: 'success', 
    role: user.role, 
    name: user.name 
  });
});

// 3. Refresh Token
export const refresh = catchAsync(async (req, res, next) => {
  const { token } = req.body;

//   if there is no token then,
  if (!token) return next(new AppError("Refresh token required", 401));


//   if there is token then we have to decod this token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return next(new AppError("Token expired or invalid", 403));
  }

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== token) {
    return next(new AppError("Invalid refresh token session", 403));
  }

  const tokens = generateTokens(user);
  
  // Rotate Refresh Token (Optional but safer)
  user.refreshToken = tokens.refreshToken;
  await user.save();

  // Update the Access Token Cookie
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 15 * 60 * 1000
  });

  res.status(200).json({
    status: 'success',
    refreshToken: tokens.refreshToken // Send new refresh token for local storage
  });
});