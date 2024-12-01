import express from 'express';
import { getOmanToTZSTableTransactions, createOmanToTZSTableTransaction } from '../controllers/omanToTZSController.js';
const router = express.Router();
router.get("/alltransection", getOmanToTZSTableTransactions);
router.post("/addtransection", createOmanToTZSTableTransaction);
export default router;
