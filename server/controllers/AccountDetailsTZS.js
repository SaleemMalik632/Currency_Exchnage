import AccountDetailsTZS from '../models/AccountDetailsTZS.js';

// Get all TZS transactions
export const getAccountDetailsTZS = async (req, res) => {
    try {
        const transactions = await AccountDetailsTZS.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Create a new TZS transaction
export const createAccountDetailsTZS = async (req, res) => {
    try {
        const previousTransactions = await AccountDetailsTZS.find();
        const previousTotalBalance = previousTransactions.reduce((acc, transaction) => acc + transaction.DepositAmount, 0);
        const newTotalBalance = previousTotalBalance + req.body.DepositAmount;
        const newTransaction = new AccountDetailsTZS({
            ...req.body,
            TotalBalance: newTotalBalance
        });
        await newTransaction.save();
        await AccountDetailsTZS.updateMany({}, { TotalBalance: newTotalBalance });
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};