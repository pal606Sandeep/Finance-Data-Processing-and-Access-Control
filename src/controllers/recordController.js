import Record from '../models/Record.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const createRecord = catchAsync(async (req, res) => {
  const record = await Record.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json({ status: 'success', data: record });
});

export const getAllRecords = catchAsync(async (req, res) => {
  const { type, category, startDate, endDate, search, page = 1, limit = 10 } = req.query;
  const queryObject = { 
    isDeleted: 
    { $ne: true } 
}; 

  if (type) queryObject.type = type;
  if (category) queryObject.category = category;
  if (search) queryObject.description = { $regex: search, $options: 'i' }; // Basic Search
  if (startDate || endDate) {
    queryObject.date = {};
    if (startDate) queryObject.date.$gte = new Date(startDate);
    if (endDate) queryObject.date.$lte = new Date(endDate);
  }

  // Here is the Pagination Logic
  const skip = (page - 1) * limit;
  const records = await Record.find(queryObject).sort('-date').skip(skip).limit(Number(limit));

  res.status(200).json({ status: 'success', results: records.length, page, data: records });
});

export const updateRecord = catchAsync(async (req, res, next) => {
  const record = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!record) return next(new AppError('No record found', 404));
  res.status(200).json({ status: 'success', data: record });
});

// Here is the Safe Delete(Mention in the optional Enchancment)
export const deleteRecord = catchAsync(async (req, res, next) => {
  const record = await Record.findByIdAndUpdate(req.params.id, { isDeleted: true });
  if (!record) return next(new AppError('No record found', 404));
  res.status(204).json({ status: 'success', data: null });
});