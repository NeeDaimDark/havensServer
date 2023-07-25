import express from 'express';
import { getById,getAll,addOnce,updateOnce,deleteOnce } from '../controllers/playerController.js';

const router = express.Router();

// Get all players
router.get('/', getAll);

// Get player by ID
router.get('/:id', getById);

// Create new player
router.post('/', addOnce);

//update player
router.put('/:id', updateOnce);
// Delete game by ID
router.delete('/:id', deleteOnce);
export default router;
