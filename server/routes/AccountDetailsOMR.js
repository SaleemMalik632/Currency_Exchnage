import express from "express";
import { getAccountDetailsOMR, createAccountDetailsOMR } from "../controllers/AccountDetailsOMR.js";
const router = express.Router();
// Get all OMR transactions
router.get("/alltransection", getAccountDetailsOMR);
// Create a new OMR transaction
router.post('/addtransection', createAccountDetailsOMR);


export default router;  