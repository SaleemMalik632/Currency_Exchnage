import mongoose from "mongoose";

const AccountDetailsTZSSchema = new mongoose.Schema({
    DepositAmount: { type: Number, required: true },
    DepositDate: { type: Date, required: true },
    TotalBalance: { type: Number, required: true },
    DepositBankName: {
        type: String,
        required: true,
        enum: ['Amour-Ahmed'], // Restrict to only 'Amour-Ahmed'
        message: 'Deposit bank must be Amour-Ahmed'
    },
    createdAt: { type: Date, default: Date.now },
});

const AccountDetailsTZS = mongoose.model('AccountDetailsTZS', AccountDetailsTZSSchema);
export default AccountDetailsTZS;