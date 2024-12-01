import express from 'express';
import {
   getAccountsByCurrency,
   addBankAccount,
   getAllAccounts, deleteAccountsByCurrency,
   depositAmount,
   editAccount,
   deleteAccount,
   AddAccountExpance,
   getAllExpanceData,
   updateExistingAccounts,
   updateExpanceData,
   deleteExpance,
   updateExpance,

} from '../controllers/AddAccount.js';

const router = express.Router();
router.get('/accountbycurrency/:currency', getAccountsByCurrency);
router.post('/addAccount', addBankAccount);
router.get('/allaccounts', getAllAccounts);
router.delete('/accountbycurrency/:currency', deleteAccountsByCurrency); // Add this line
router.post('/deposit', depositAmount); // Add this line
router.put('/edit/:id', editAccount); // Add this line
router.delete('/delete/:id', deleteAccount);
router.post('/addexpance', AddAccountExpance); // Add this line
router.get('/getexpance', getAllExpanceData); // Add this line
router.put('/updateExistingAccounts', updateExistingAccounts); // Add this line
router.put('/updateExpanceData', updateExpanceData); // Add this line
router.delete('/deleteExpance/:id', deleteExpance); // Add this line
router.put('/updateExpance/:id', updateExpance); // Add this line



export default router;