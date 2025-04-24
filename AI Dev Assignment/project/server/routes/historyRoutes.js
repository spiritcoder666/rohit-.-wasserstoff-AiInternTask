import express from 'express';
import { getSessionGuessHistory } from '../database.js';

const router = express.Router();

// Get user's guess history
router.get('/history', async (req, res, next) => {
  try {
    const sessionId = req.headers['x-session-id'];
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }
    
    const history = await getSessionGuessHistory(sessionId);
    
    // Format the history for the client
    const formattedHistory = history.map(item => ({
      guess: item.guess_word,
      targetWord: item.target_word,
      success: item.success,
      timestamp: item.created_at
    }));
    
    res.json({
      success: true,
      history: formattedHistory
    });
  } catch (error) {
    next(error);
  }
});

export default router;