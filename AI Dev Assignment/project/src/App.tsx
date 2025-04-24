import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, History, RotateCcw, Info } from 'lucide-react';
import { GuessInput } from './components/GuessInput';
import { GameHistory } from './components/GameHistory';
import { ScoreDisplay } from './components/ScoreDisplay';
import { PersonaSelector } from './components/PersonaSelector';
import { GameInfoModal } from './components/GameInfoModal';
import { useGameState } from './hooks/useGameState';
import { playConfetti } from './utils/confetti';
import './App.css';

/**
 * Main App component that orchestrates the "What Beats Rock" game
 * This component manages the overall game UI and coordinates between different components
 */
function App() {
  // Get game state and functions from custom hook
  const {
    currentWord,      // The word that players need to beat
    score,           // Current player score
    guessHistory,    // History of all guesses made
    gameOver,        // Whether the game has ended
    processingGuess, // Loading state while checking a guess
    lastResponse,    // Last response from the AI
    resetGame,       // Function to reset the game state
    submitGuess,     // Function to submit a new guess
    persona,         // Current AI persona (serious/cheery)
    setPersona       // Function to change AI persona
  } = useGameState();

  // State for showing/hiding the game info modal
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Show confetti animation when player makes a successful guess
  useEffect(() => {
    if (lastResponse && lastResponse.success) {
      playConfetti();
    }
  }, [lastResponse]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Game Header */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-blue-800">What Beats {currentWord}?</h1>
            <button 
              onClick={() => setShowInfoModal(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Game info"
            >
              <Info size={20} className="text-blue-800" />
            </button>
          </div>
          
          {/* Persona Selection */}
          <PersonaSelector
            currentPersona={persona}
            onChange={setPersona}
            disabled={processingGuess}
          />
          
          {/* Main Game Input */}
          <GuessInput 
            onSubmit={submitGuess} 
            disabled={gameOver || processingGuess} 
            processing={processingGuess}
          />
          
          {/* Feedback Message */}
          {lastResponse && (
            <div className={`mt-4 p-4 rounded-lg flex items-center ${
              lastResponse.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {lastResponse.success ? (
                <ThumbsUp className="mr-2 flex-shrink-0" size={20} />
              ) : (
                <ThumbsDown className="mr-2 flex-shrink-0" size={20} />
              )}
              <p className="text-sm">{lastResponse.message}</p>
            </div>
          )}
          
          {/* Score Display */}
          <ScoreDisplay score={score} />
          
          {/* Game Over State */}
          {gameOver && (
            <div className="mt-6 text-center">
              <h2 className="text-xl font-bold text-red-600 mb-2">Game Over!</h2>
              <p className="text-gray-600 mb-4">You've already used that guess before.</p>
              <button
                onClick={resetGame}
                className="flex items-center justify-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RotateCcw size={16} className="mr-2" />
                Play Again
              </button>
            </div>
          )}
        </div>
        
        {/* Game History Section */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center mb-3">
            <History size={18} className="text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Your Guesses</h2>
          </div>
          <GameHistory history={guessHistory} />
        </div>
      </div>
      
      {/* Info Modal */}
      {showInfoModal && (
        <GameInfoModal onClose={() => setShowInfoModal(false)} />
      )}
    </div>
  );
}

export default App;