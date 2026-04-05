import Record from '../models/Record.js';
import catchAsync from '../utils/catchAsync.js';

export const getDashboardSummary = catchAsync(async (req, res) => {
  const summary = await Record.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: null,
        totalIncome: { 
            $sum: { 
                $cond: [
                    { $eq: 
                        ['$type', 'Income'] 
                    }, 
                    '$amount', 0
                ] } },
        totalExpense: { 
            $sum: { 
                $cond: [
                    { $eq: 
                        ['$type', 'Expense'] 
                    }, 
                    '$amount', 0
                ] } }
      }
    },
    {
      $project: {
        _id: 0,
        totalIncome: 1,
        totalExpense: 1,
        netBalance: { 
            $subtract: [
                '$totalIncome', '$totalExpense'
            ] 
        }
      }
    }
  ]);

  const categoryTotals = await Record.aggregate([
    { $match: 
        { isDeleted: 
            { $ne: true } 
        } },
    { $group: 
        { 
            _id: '$category', 
            total: { $sum: '$amount' } 
    } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      summary: summary[0] || { totalIncome: 0, totalExpense: 0, netBalance: 0 },
      categoryTotals
    }
  });
});