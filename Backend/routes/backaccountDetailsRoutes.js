import express from 'express';
import { upsertBankAccount, getBankAccount } from '../controllers/accountDetailsControllers.js';

const router = express.Router();

router.post('/', upsertBankAccount);
router.get('/:userId', getBankAccount);

export default router;