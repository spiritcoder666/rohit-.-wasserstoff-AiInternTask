import React from 'react';
import { X } from 'lucide-react';

interface GameInfoModalProps {
  onClose: () => void;
}

export function GameInfoModal({ onClose }: GameInfoModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">How to Play</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Game Rules</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Start with the given word (e.g., "Rock")</li>
              <li>Enter something that you think "beats" the word</li>
              <li>AI will determine if your guess beats the target word</li>
              <li>If correct, you earn a point and continue</li>
              <li>Each guess must be unique - repeating a previous guess ends the game</li>
            </ol>
            
            <h3 className="font-semibold text-gray-800">Tips</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Be creative with your answers</li>
              <li>Choose different host personas for varied responses</li>
              <li>Keep track of your previous guesses to avoid repeating</li>
              <li>Try to build a logical chain where each guess connects to the previous one</li>
            </ul>
          </div>
        </div>
        
        <div className="p-5 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}