import express from 'express';
import { getTZSToOMRTableTransactions, createTZSToOMRTableTransaction } from '../controllers/tzaToOmanController.js';
const router = express.Router();
router.get("/alltransection", getTZSToOMRTableTransactions);
router.post("/addtransection", createTZSToOMRTableTransaction);
export default router;
