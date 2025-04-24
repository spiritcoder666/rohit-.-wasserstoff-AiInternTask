import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';

interface GuessInputProps {
  onSubmit: (guess: string) => void;
  disabled: boolean;
  processing: boolean;
}

export function GuessInput({ onSubmit, disabled, processing }: GuessInputProps) {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !disabled) {
      onSubmit(guess.trim());
      setGuess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={disabled}
          placeholder="Enter your guess..."
          className={`flex-grow px-4 py-2 border ${
            disabled ? 'bg-gray-100 border-gray-300' : 'border-blue-300'
          } rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          aria-label="Your guess"
        />
        <button
          type="submit"
          disabled={disabled || !guess.trim()}
          className={`px-4 py-2 ${
            disabled || !guess.trim() 
              ? 'bg-gray-400' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded-r-lg transition-colors flex items-center justify-center min-w-[50px]`}
          aria-label="Submit guess"
        >
          {processing ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Type something that beats "{processing ? '...' : 'Rock'}"
      </p>
    </form>
  );
}