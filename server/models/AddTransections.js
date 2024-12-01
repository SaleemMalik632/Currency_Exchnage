import mongoose from "mongoose";

const AddTransectionsSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true },
    date: { type: Date, required: true },
    senderName: { type: String, required: true },
    senderPhoneNumber: { type: String, required: true },
    receiverName: { type: String, required: true },
    receiverPhoneNumber: { type: String, required: true },
    AmmountCheckin: { type: Number, required: true },  // TZS amount being sent
    transactionFee: { type: Number, default: 0, required: true },  // TZS transaction fee
    TotalAfterFee: { type: Number, required: true },  // TZS total after fee
    exchangeRate: { type: Number, required: true },  // Exchange rate from TZS to TZS
    NameofCashInBank: { type: String, required: true },  // Name of the OMR bank
    NameofCashOutBank: { type: String, required: true },  // Name of the TZS bank
    RemainingBalanceCheckInBank: { type: Number },  // OMR remaining balance
    RemainingBalanceCheckOutBank: { type: Number },  // TZS remaining balance
    NameofCheckInCurrency: { type: String, default: 'TZS to TZS', required: true },  // Currency pair
    NameofCheckOutCurrency: { type: String, default: 'TZS to TZS', required: true },  // Currency pair
    AmmountCheckout: { type: Number },  // TZS amount after conversion
    isCancel: { type: Boolean, default: false, required: true },  // Transaction status
    createdAt: { type: Date, default: Date.now },  // Timestamp of transaction
    updateAt: { type: Date, default: Date.now },
});

const AddTransections = mongoose.model('AddTransections', AddTransectionsSchema);
export default AddTransections;