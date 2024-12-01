import express from "express";
import { getAccountDetailsTZS, createAccountDetailsTZS } from "../controllers/AccountDetailsTZS.js";
const router = express.Router();

// Get all TZS transactions
router.get("/alltransection", getAccountDetailsTZS);

// Create a new TZS transaction
router.post("/addtransection", createAccountDetailsTZS);

export default router;