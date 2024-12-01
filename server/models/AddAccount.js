import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    AccountID: { type: String, required: true },
    accountName: { type: String, required: true },
    initialDeposit: { type: Number, required: true },
    TotalBalance: { type: Number, required: true },
    currency: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },    
});

const Account = mongoose.model('Account', accountSchema);
export default Account;