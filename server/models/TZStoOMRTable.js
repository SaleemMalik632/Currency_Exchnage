import mongoose from "mongoose";

const tzsToOMRSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  senderPhoneNumber: { type: String, required: true },
  receiverName: { type: String, required: true },
  receiverPhoneNumber: { type: String, required: true },
  amountInTZS: { type: Number, required: true },  // TZS amount being sent
  transactionFeeInTZS: { type: Number, required: true },  // TZS transaction fee
  exchangeRateForTZStoOMR: { type: Number, required: true },  // Exchange rate from TZS to OMR
  cashInBankTZS: {
    bankName: { type: String, required: true, enum: ['Amour-Ahmed'] },  // Name of the TZS bank
  },
  cashOutBankOMR: {
    bankName: { type: String, required: true, enum: ['Sohar Bank', 'Muscat Bank'] },  // Name of the OMR bank
  },
  RemainingBalanceCheckInBank: { type: Number },  // TZS remaining balance  
  RemainingBalanceCheckOutBank: { type: Number },  // OMR remaining balance
  amountInOMR: { type: Number },  // OMR amount after conversion
  currency: { type: String, default: 'TZS to OMR', required: true },  // Currency pair
  createdAt: { type: Date, default: Date.now },  // Timestamp of transaction
});

const TZSToOMRTable = mongoose.model('TZSToOMRTable', tzsToOMRSchema);
export default TZSToOMRTable;