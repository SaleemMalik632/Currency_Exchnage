import mongoose from "mongoose";

const omanToTZSSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  senderPhoneNumber: { type: String, required: true },
  receiverName: { type: String, required: true },
  receiverPhoneNumber: { type: String, required: true },
  amountInOMR: { type: Number, required: true },  // OMR amount being sent
  transactionFeeInOMR: { type: Number, required: true },  // OMR transaction fee
  exchangeRateForOMRtoTZS: { type: Number, required: true },  // Exchange rate from OMR to TZS
  cashInBankOMR: {
    bankName: { type: String, required: true, enum: ['Sohar Bank', 'Muscat Bank'] },  // Name of the OMR bank
  },
  cashOutBankTZS: {
    bankName: { type: String, required: true, enum: ['Amour-Ahmed'] },  // Name of the TZS bank
  },
  RemainingBalanceCheckInBank: { type: Number },  // OMR remaining balance  
  RemainingBalanceCheckOutBank: { type: Number },  // TZS remaining balance
  amountInTZS: { type: Number },  // TZS amount after conversion
  currency: { type: String, default: 'OMR to TZS', required: true },  // Currency pair  
  createdAt: { type: Date, default: Date.now },  // Timestamp of transaction
});

const OmanToTZS = mongoose.model('OmanToTZS', omanToTZSSchema);
export default OmanToTZS; 