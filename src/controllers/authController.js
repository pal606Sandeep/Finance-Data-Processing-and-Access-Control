import User from '../models/User.js';
import { generateTokens } from '../utils/generateTokens.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ 
        name, 
        email, 
        password, 
        role: role || 'Viewer' 
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
  
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user);
  
      user.refreshToken = refreshToken;
      await user.save();
  
      res.cookie('accessToken', accessToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Lax',
        maxAge: 15 * 60 * 1000 
      });
  
      res.json({ status: 'success', role: user.role, name: user.name });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  };

export const refresh = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "Refresh token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json(tokens);
  } catch (error) {
    res.status(403).json({ message: "Token expired or invalid" });
  }
};