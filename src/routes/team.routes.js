import express from 'express';
import { protect, coach } from '../middleware/auth.middleware.js';
import { 
  createTeam, 
  getTeams, 
  joinTeam, 
  filterTeams 
} from '../controllers/team.controller.js';

const router = express.Router();

router.post('/', protect, coach, createTeam);
router.get('/', protect, getTeams);
router.get('/filter', protect, filterTeams);
router.post('/:id/join', protect, joinTeam);

export default router;