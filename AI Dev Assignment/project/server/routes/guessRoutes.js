import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { checkIfGuessBeatsTarget, moderateContent } from '../services/aiService.js';
import { getCachedVerdict, cacheVerdict } from '../cache.js';
import {
  addGuessToHistory,
  incrementGlobalGuessCount,
  getGlobalGuessCount
} from '../database.js';

const router = express.Router();

// Handle guess submission
router.post('/guess', async (req, res, next) => {
  try {
    const { guess, currentWord } = req.body;
    const persona = req.headers['x-persona'] || 'serious';
    
    // Session handling - in a real app, this would be more robust
    let sessionId = req.headers['x-session-id'];
    if (!sessionId) {
      sessionId = uuidv4();
      res.setHeader('X-Session-Id', sessionId);
    }
    
    // Validate input
    if (!guess || !currentWord) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both guess and currentWord are required'
      });
    }
    
    // Moderate content
    const moderationResult = moderateContent(guess);
    if (!moderationResult.isClean) {
      return res.status(400).json({
        success: false,
        message: 'Your guess contains inappropriate content. Please try again with appropriate language.'
      });
    }
    
    // Check cache first
    const cachedResult = await getCachedVerdict(currentWord, guess);
    
    let result;
    if (cachedResult) {
      result = cachedResult;
    } else {
      // Call AI service if not in cache
      result = await checkIfGuessBeatsTarget(currentWord, guess, persona);
      
      // Cache the result
      await cacheVerdict(currentWord, guess, result);
    }
    
    // Record in database
    await addGuessToHistory(sessionId, guess, currentWord, result.success);
    
    let globalCount = 0;
    if (result.success) {
      // Increment global counter for successful guesses
      const updatedGuess = await incrementGlobalGuessCount(guess);
      globalCount = updatedGuess.count;
    }
    
    // Personalize response based on persona
    let responseMessage = '';
    if (result.success) {
      if (persona === 'cheery') {
        responseMessage = `Awesome! "${guess}" beats "${currentWord}"! ${result.explanation} It's been guessed ${globalCount} time${globalCount === 1 ? '' : 's'} by players!`;
      } else {
        responseMessage = `Correct. "${guess}" beats "${currentWord}". ${result.explanation} This answer has been submitted ${globalCount} time${globalCount === 1 ? '' : 's'}.`;
      }
    } else {
      if (persona === 'cheery') {
        responseMessage = `Oops! "${guess}" doesn't beat "${currentWord}". ${result.explanation} Try something else!`;
      } else {
        responseMessage = `Incorrect. "${guess}" does not beat "${currentWord}". ${result.explanation}`;
      }
    }
    
    res.json({
      success: result.success,
      message: responseMessage,
      globalCount: result.success ? globalCount : undefined
    });
  } catch (error) {
    next(error);
  }
});

export default router;