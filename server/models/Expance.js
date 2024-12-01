import mongoose from "mongoose";

const ExpanceSchema = new mongoose.Schema({
    TotalBankBalance: { type: Number, required: true },
    ExpanceAmount: { type: Number, required: true },
    RemainingBalance: { type: Number, required: true },
    ExpanceDate: { type: Date, required: true },
    ExpanceReason: { type: String, required: true },
    currency: { type: String, required: true }, // Ensure this line is present
    BankName: { type: String, required: true },
    TotalItems: { type: Number, required: true},
    createdAt: { type: Date, default: Date.now },
    
});

const Expance = mongoose.model('Expance', ExpanceSchema);

export default Expance;