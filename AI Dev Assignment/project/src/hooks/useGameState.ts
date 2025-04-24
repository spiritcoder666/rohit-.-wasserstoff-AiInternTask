import { useState, useEffect } from 'react';
import { fetchWordVerdict } from '../services/apiService';

// Type definitions for game state
type Persona = 'serious' | 'cheery';

interface GuessHistoryItem {
  guess: string;
  success: boolean;
  targetWord: string;
  globalCount?: number;
}

interface GuessResponse {
  success: boolean;
  message: string;
  globalCount?: number;
}

/**
 * Custom hook that manages the game state and logic
 * This hook handles:
 * - Current word tracking
 * - Score management
 * - Guess history
 * - Game over conditions
 * - AI interactions
 */
export function useGameState() {
  // Core game state
  const [currentWord, setCurrentWord] = useState('Rock');  // Starting word is always 'Rock'
  const [score, setScore] = useState(0);                   // Player's current score
  const [guessHistory, setGuessHistory] = useState<GuessHistoryItem[]>([]); // History of all guesses
  const [gameOver, setGameOver] = useState(false);         // Game over flag
  const [processingGuess, setProcessingGuess] = useState(false); // Loading state
  const [lastResponse, setLastResponse] = useState<GuessResponse | null>(null); // Last AI response
  const [persona, setPersona] = useState<Persona>('serious'); // AI personality type

  /**
   * Resets the game state to initial values
   * Called when starting a new game
   */
  const resetGame = () => {
    setCurrentWord('Rock');
    setScore(0);
    setGuessHistory([]);
    setGameOver(false);
    setLastResponse(null);
  };

  /**
   * Processes a player's guess
   * - Checks for duplicate guesses
   * - Validates guess against current word using AI
   * - Updates game state based on result
   */
  const submitGuess = async (guess: string) => {
    setProcessingGuess(true);
    
    try {
      // Check for duplicate guesses (ends the game)
      const isDuplicate = guessHistory.some(item => 
        item.guess.toLowerCase() === guess.toLowerCase()
      );
      
      if (isDuplicate) {
        setGameOver(true);
        setLastResponse({
          success: false,
          message: `Game Over! You already guessed "${guess}" before.`
        });
        setProcessingGuess(false);
        return;
      }
      
      // Get verdict from AI
      const response = await fetchWordVerdict(guess, currentWord, persona);
      
      // Update game state based on response
      if (response.success) {
        setScore(prev => prev + 1);
        setCurrentWord(guess); // Successful guess becomes new target
      }
      
      // Add to guess history
      setGuessHistory(prev => [
        ...prev, 
        {
          guess,
          success: response.success,
          targetWord: currentWord,
          globalCount: response.globalCount
        }
      ]);
      
      setLastResponse(response);
    } catch (error) {
      setLastResponse({
        success: false,
        message: 'Sorry, an error occurred. Please try again.'
      });
    } finally {
      setProcessingGuess(false);
    }
  };

  // Return all necessary state and functions
  return {
    currentWord,
    score,
    guessHistory,
    gameOver,
    processingGuess,
    lastResponse,
    resetGame,
    submitGuess,
    persona,
    setPersona
  };
}