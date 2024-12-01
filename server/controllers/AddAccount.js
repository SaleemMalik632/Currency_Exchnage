import mongoose from 'mongoose';
import Account from '../models/AddAccount.js';
import Expance from '../models/Expance.js';

// Get all accounts with total money in the specified currency
export const getAccountsByCurrency = async (req, res) => {
    const { currency } = req.params;
    try {
        const accounts = await Account.find({ currency });
        const AllAccount = await Account.find();
        if (accounts.length === 0) {
            return res.status(200).json({ message: `No accounts found for currency: ${currency}` });
        }
        const totalMoney = accounts.reduce((acc, account) => acc + account.TotalBalance, 0);
        res.status(200).json({ accounts, totalMoney, AllAccount });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Add a new bank account
export const addBankAccount = async (req, res) => {
    const { accountName, initialDeposit, currency, Date } = req.body;

    try {
        // Get the count of existing accounts to generate the new AccountID
        const accountCount = await Account.countDocuments();
        const newAccountID = `ID-${accountCount + 1}`;

        const newAccount = new Account({
            AccountID: newAccountID,
            accountName,
            initialDeposit,
            TotalBalance: initialDeposit,
            currency,
            Date,
        });

        await newAccount.save();
        res.status(201).json({ message: 'Bank account created successfully', newAccount });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Edit an existing bank account
export const editAccount = async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const updatedData = req.body;
    console.log(updatedData);
    console.log(id);
    try {
        const account = await Account.findByIdAndUpdate(id, updatedData, { new: true });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json({ message: 'Account updated successfully', account });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteAccount = async (req, res) => {
    const { id } = req.params;
    console.log("Received request to delete account with ID:", id); // Debug log
    try {
        const account = await Account.findByIdAndDelete(id);
        if (!account) {
            console.log(`Account with ID ${id} not found.`);
            return res.status(404).json({ message: 'Account not found' });
        }
        console.log(`Account with ID ${id} deleted successfully.`);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error("Error in deleteAccount:", error);
        res.status(500).json({ message: error.message });
    }
};


// Deposit amount into an existing bank account
export const depositAmount = async (req, res) => {
    const { accountName, depositAmount, Date } = req.body;
    try {
        const account = await Account.findOne({ accountName });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        account.TotalBalance += depositAmount;
        account.updatedAt = Date;
        await account.save();
        res.status(200).json({ message: 'Deposit successful', updatedAccount: account });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add expance amount into an existing bank account 
export const AddAccountExpance = async (req, res) => {
    const { accountName, AddExpanceData, Date, Reason } = req.body;
    try {
        //  pass the AccountName and get it Currany 
        const currency = await Account.findOne({ accountName });
        console.log(currency.currency);
        const account = await Account.findOne({ accountName });
        if (!account) {
            console.log('Account not found');
            return res.status(404).json({ message: 'Account not found' });
        }
        console.log(account.TotalBalance);
        account.TotalBalance -= AddExpanceData;
        console.log(account.TotalBalance);
        const allExpances = await Expance.find({});
        const totalItems = allExpances.reduce((acc, exp) => acc + exp.TotalItems, 0); // Sum up all TotalItems
        const newTotalItems = totalItems + 1; // Increment the total item count
        const newExpance = new Expance({

            TotalBankBalance: account.TotalBalance,
            ExpanceAmount: AddExpanceData,
            RemainingBalance: account.TotalBalance,
            ExpanceDate: Date,
            ExpanceReason: Reason,
            BankName: accountName,
            currency: currency.currency,
            TotalItems: newTotalItems,
        });
        const savedExpance = await newExpance.save();
        account.updatedAt = Date;
        await account.save();
        res.status(200).json({ message: 'Expance Added successfully', updatedAccount: account, newExpance: savedExpance });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all expenses with total amount in the specified currency
export const getAllExpanceData = async (req, res) => {
    try {
        // const result = await Expance.deleteMany({}); 
        // console.log(result);
        const allExpancesData = await Expance.find().sort({ TotalItems: -1 });
        if (allExpancesData.length === 0) {
            return res.status(200).json({ message: 'No expenses found.' });
        } 
        const totalAmount = allExpancesData.reduce((acc, expance) => acc + expance.ExpanceAmount, 0);
        res.status(200).json({ allExpancesData, totalAmount });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Delete an expense by ID
export const deleteExpance = async (req, res) => {
    const { id } = req.params;
    try {
        const expance = await Expance.findByIdAndDelete(id);
        if (!expance) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update an expense by ID and update expance all info 
export const updateExpance = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const expance = await Expance.findByIdAndUpdate
            (id, updatedData, { new: true });
        if (!expance) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense updated successfully', expance });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};






// Update existing expense data with TotalItems and remove records with missing fields
export const updateExpanceData = async (req, res) => {
    try {
        const allExpances = await Expance.find();
        if (allExpances.length === 0) {
            return res.status(200).json({ message: 'No expenses found to update.' });
        }
        const updatePromises = allExpances.map(async (expance, index) => {
            const requiredFields = ['TotalBankBalance', 'ExpanceAmount', 'RemainingBalance', 'ExpanceDate', 'ExpanceReason', 'currency', 'BankName', 'TotalItems'];
            const isMissingField = requiredFields.some(field => !expance[field]);
            if (isMissingField) {
                await Expance.deleteOne({ _id: expance._id });
                return null; // Return null for deleted items
            } else {
                expance.TotalItems = index + 1; // Set TotalItems
                return expance.save(); // Return the save promise
            }
        });
        await Promise.all(updatePromises);
        res.status(200).json({ message: 'All existing expense data updated with TotalItems. Records with missing fields have been removed.' });
    } catch (error) {
        console.error('Error updating existing expense data:', error);
        res.status(500).json({ message: error.message });
    }
};







// Get all accounts
export const getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find();
        res.status(200).json(accounts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Delete all accounts with the specified currency
export const deleteAccountsByCurrency = async (req, res) => {
    const { currency } = req.params;
    try {
        const result = await Account.deleteMany({ currency });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: `No accounts found for currency: ${currency}` });
        }
        res.status(200).json({ message: `Deleted ${result.deletedCount} accounts for currency: ${currency}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Update all existing accounts with unique AccountID
export const updateExistingAccounts = async (req, res) => {
    try {
        const accounts = await Account.find();
        for (let i = 0; i < accounts.length; i++) {
            accounts[i].AccountID = `ID-${i + 1}`;
            await accounts[i].save();
        }
        res.status(200).json({ message: 'All existing accounts updated with AccountID.' });
    } catch (error) {
        console.error('Error updating existing accounts:', error);
        res.status(500).json({ message: error.message });
    }
};
