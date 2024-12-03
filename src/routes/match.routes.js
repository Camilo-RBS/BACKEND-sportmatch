import express from 'express';
import { protect, coach } from '../middleware/auth.middleware.js';
import { 
  createMatch, 
  getMatches, 
  updateMatch, 
  getMatchHistory 
} from '../controllers/match.controller.js';

const router = express.Router();

router.post('/', protect, coach, createMatch);
router.get('/', protect, getMatches);
router.get('/history', protect, getMatchHistory);
router.put('/:id', protect, coach, updateMatch);

export default router;