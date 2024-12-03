import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { sendMessage, getMessages } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/', protect, getMessages);
router.get('/:userId', protect, getMessages);
router.post('/', protect, sendMessage);

export default router;