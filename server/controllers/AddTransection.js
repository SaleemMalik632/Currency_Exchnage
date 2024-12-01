import AddTransections from '../models/AddTransections.js';
import Account from '../models/AddAccount.js';

export const addTransaction = async (req, res) => {
    const {
        AmmountCheckin,
        transactionFee, 
        NameofCashInBank, NameofCashOutBank,
        RemainingBalanceCheckInBank, RemainingBalanceCheckOutBank,
        NameofCheckInCurrency, NameofCheckOutCurrency, AmmountCheckout,
        isCancel, 
    } = req.body;

    // Log the entire request body
    console.log('Request Body:', req.body);

    req.body.AmmountCheckin = parseInt(AmmountCheckin, 10);
    req.body.transactionFee = parseInt(transactionFee, 10);
    req.body.AmmountCheckout = parseInt(AmmountCheckout, 10);
    req.body.RemainingBalanceCheckInBank = parseInt(RemainingBalanceCheckInBank, 10);
    req.body.RemainingBalanceCheckOutBank = parseInt(RemainingBalanceCheckOutBank, 10);

    if (NameofCheckInCurrency === 'TZS') {
        req.body.transactionFee = 0;
        req.body.TotalAfterFee = req.body.AmmountCheckin;
    } else {
        req.body.TotalAfterFee = req.body.AmmountCheckin + req.body.transactionFee;
    }

    console.log('isCancel:', req.body.isCancel);

    if (!isCancel) {
        req.body.RemainingBalanceCheckInBank += req.body.TotalAfterFee;
        req.body.RemainingBalanceCheckOutBank -= req.body.AmmountCheckout;
        console.log('RemainingBalanceCheckInBank:', req.body.RemainingBalanceCheckInBank);
        console.log('RemainingBalanceCheckOutBank:', req.body.RemainingBalanceCheckOutBank);
    }

    const newTransaction = new AddTransections(req.body);

    try {
        console.log(newTransaction);
        const savedTransaction = await newTransaction.save();
        await Account.findOneAndUpdate(
            { accountName: NameofCashInBank },
            { $set: { TotalBalance: req.body.RemainingBalanceCheckInBank } }
        );
        await Account.findOneAndUpdate(
            { accountName: NameofCashOutBank },
            { $set: { TotalBalance: req.body.RemainingBalanceCheckOutBank } }
        );
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




export const cancelTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTransaction = await AddTransections.findByIdAndUpdate(id, { isCancel: true }, { new: true });
        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getAllCompletedTransactions = async (req, res) => {
    try {
        // const result = await AddTransections.deleteMany({});   
        const transactions = await AddTransections.find({ isCancel: false });
        res.status(200).json(transactions); 
    } catch (error) {  
        res.status(400).json({ message: error.message });
    }
};
export const getAllCanceledTransactions = async (req, res) => {
    try {
        const transactions = await AddTransections.find({ isCancel: true });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//  get all done transactions wiht giveen check in crruncy
export const getDoneTransactionByCheckInCurrency = async (req, res) => {
    const { currency } = req.params;
    try {
        const transactions = await AddTransections.find({ NameofCheckInCurrency: currency, isCancel: false });
        res.status(200).json(transactions);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}
// get all canceled transactions with given check in currency
export const getCanceledTransactionByCheckInCurrency = async (req, res) => {
    const { currency } = req.params;
    try {
        const transactions = await AddTransections.find({ NameofCheckInCurrency: currency, isCancel: true });
        res.status(200).json(transactions);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//  get the count of all transactions
export const getTransactionCount = async (req, res) => {
    try {
        const count = await AddTransections.countDocuments();
        res.status(200).json(count);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// make api end point that will update the transaction
export const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const transaction = await AddTransections.findByIdAndUpdate(id, updatedData, { new: true });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// simplete api end point that will delete the transaction
export const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await AddTransections.findByIdAndDelete(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};