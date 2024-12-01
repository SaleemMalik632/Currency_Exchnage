import TZSToOMRTable from '../models/TZStoOMRTable.js';
import AccountDetailsOMR from '../models/AccountDetailsOMR.js';
import AccountDetailsTZS from '../models/AccountDetailsTZS.js';

// Get all TZS to OMR transactions
export const getTZSToOMRTableTransactions = async (req, res) => {
    try {
        const transactions = await TZSToOMRTable.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Create a new TZS to OMR transaction
export const createTZSToOMRTableTransaction = async (req, res) => {
    try {
        const { cashInBankTZS, cashOutBankOMR, amountInTZS, transactionFeeInTZS, exchangeRateForTZStoOMR } = req.body;
        const amountInOMR = amountInTZS / exchangeRateForTZStoOMR;
        const tzsBank = await AccountDetailsTZS.findOne({ DepositBankName: cashInBankTZS.bankName });
        if (!tzsBank) {
            return res.status(400).json({ message: 'TZS bank not found' });
        }
        const newTotalBalanceTZS = tzsBank.TotalBalance + amountInTZS + transactionFeeInTZS;
        await AccountDetailsTZS.updateMany({ DepositBankName: cashInBankTZS.bankName }, { TotalBalance: newTotalBalanceTZS });
        const omrBank = await AccountDetailsOMR.findOne({ DepositBankName: cashOutBankOMR.bankName });
        if (!omrBank) {
            return res.status(400).json({ message: 'OMR bank not found' });
        }
        if (omrBank.TotalBalance < amountInOMR) {
            return res.status(400).json({ message: 'Insufficient balance in OMR bank', TotalBalance: omrBank.TotalBalance, RequiredAmount: amountInOMR });
        }
        const newTotalBalanceOMR = omrBank.TotalBalance - amountInOMR;
        await AccountDetailsOMR.updateMany({ DepositBankName: cashOutBankOMR.bankName }, { TotalBalance: newTotalBalanceOMR });
        const newTransaction = new TZSToOMRTable({
            ...req.body,
            amountInOMR,
            RemainingBalanceCheckInBank: newTotalBalanceTZS,
            RemainingBalanceCheckOutBank: newTotalBalanceOMR
        });
        await newTransaction.save();
        res.status(201).json({ message: "Transaction is done" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};