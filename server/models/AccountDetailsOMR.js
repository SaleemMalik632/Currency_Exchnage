import mongoose from "mongoose";

const AccountDetailsOMRSchema = new mongoose.Schema({
    DepositAmount: { type: Number, required: true },
    DepositDate: { type: Date, required: true },
    TotalBalance: { type: Number, required: true },
    DepositBankName: {
        type: String,
        required: true,
        enum: ['Sohar Bank', 'Muscat Bank'], // Restrict to these two options
    },
    createdAt: { type: Date, default: Date.now },
});

const AccountDetailsOMR = mongoose.model('AccountDetailsOMR', AccountDetailsOMRSchema);
export default AccountDetailsOMR;