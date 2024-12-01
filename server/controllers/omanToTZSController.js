import OmanToTZSTable from '../models/OmanToTZSTable.js';
import AccountDetailsOMR from '../models/AccountDetailsOMR.js';
import AccountDetailsTZS from '../models/AccountDetailsTZS.js';

// Get all Oman to TZS transactions
export const getOmanToTZSTableTransactions = async (req, res) => {
    try {
        const transactions = await OmanToTZSTable.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Create a new Oman to TZS transaction
export const createOmanToTZSTableTransaction = async (req, res) => {
    try {
        const { cashInBankOMR, cashOutBankTZS, amountInOMR, transactionFeeInOMR, exchangeRateForOMRtoTZS } = req.body;
        const amountInTZS = amountInOMR * exchangeRateForOMRtoTZS;
        const omrBank = await AccountDetailsOMR.findOne({ DepositBankName: cashInBankOMR.bankName });
        if (!omrBank) {
            return res.status(400).json({ message: 'OMR bank not found' });
        }
        const newTotalBalanceOMR = omrBank.TotalBalance + amountInOMR+transactionFeeInOMR;
        await AccountDetailsOMR.updateMany({ DepositBankName: cashInBankOMR.bankName }, { TotalBalance: newTotalBalanceOMR });
        const tzsBank = await AccountDetailsTZS.findOne({ DepositBankName: cashOutBankTZS.bankName });
        if (!tzsBank) {
            return res.status(400).json({ message: 'TZS bank not found' });
        }
        console.log(tzsBank.TotalBalance);
        console.log(amountInTZS);
        if (tzsBank.TotalBalance < amountInTZS) {
            return res.status(400).json({ message: 'Insufficient balance in TZS bank' , TotalBalance: tzsBank.TotalBalance, RequiredAmount: amountInTZS });
        }
        const newTotalBalanceTZS = tzsBank.TotalBalance - amountInTZS;
        await AccountDetailsTZS.updateMany({ DepositBankName: cashOutBankTZS.bankName }, { TotalBalance: newTotalBalanceTZS });
        const newTransaction = new OmanToTZSTable({
            ...req.body,
            amountInTZS,
            RemainingBalanceCheckInBank: newTotalBalanceOMR,
            RemainingBalanceCheckOutBank: newTotalBalanceTZS
        });
        await newTransaction.save();
        res.status(201).json({ message: "Transaction is done" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};