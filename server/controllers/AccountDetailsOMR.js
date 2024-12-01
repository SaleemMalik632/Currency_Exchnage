import AccountDetailsOMR from '../models/AccountDetailsOMR.js';

// Get all OMR transactions
export const getAccountDetailsOMR = async (req, res) => {
  try {
    const transactions = await AccountDetailsOMR.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



// Create a new OMR transaction
export const createAccountDetailsOMR = async (req, res) => {
    try {
        const { DepositBankName, DepositAmount } = req.body;
        const previousTransactions = await AccountDetailsOMR.find({ DepositBankName });
        const previousTotalBalance = previousTransactions.reduce((acc, transaction) => acc + transaction.DepositAmount, 0);
        const newTotalBalance = previousTotalBalance + DepositAmount;
        const newTransaction = new AccountDetailsOMR({
            ...req.body,
            TotalBalance: newTotalBalance
        });
        await newTransaction.save();
        await AccountDetailsOMR.updateMany({ DepositBankName }, { TotalBalance: newTotalBalance });
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};