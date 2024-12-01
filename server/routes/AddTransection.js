import express from 'express';
import {
    addTransaction, cancelTransaction, getAllCompletedTransactions,
     getAllCanceledTransactions, getDoneTransactionByCheckInCurrency,
    getCanceledTransactionByCheckInCurrency,getTransactionCount ,deleteTransaction ,updateTransaction
}
    from '../controllers/AddTransection.js';
const router = express.Router();
router.post('/add', addTransaction);
router.patch('/cancel/:id', cancelTransaction);
router.get('/completed', getAllCompletedTransactions);
router.get('/canceled', getAllCanceledTransactions);
router.get('/done/:currency', getDoneTransactionByCheckInCurrency);
router.get('/canceled/:currency', getCanceledTransactionByCheckInCurrency);
router.get('/count', getTransactionCount);
router.delete('/delete/:id', deleteTransaction);
router.put('/update/:id', updateTransaction); 
export default router;