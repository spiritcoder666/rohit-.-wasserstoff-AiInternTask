import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface GameHistoryProps {
  history: Array<{
    guess: string;
    success: boolean;
    targetWord: string;
    globalCount?: number;
  }>;
}

export function GameHistory({ history }: GameHistoryProps) {
  if (history.length === 0) {
    return (
      <p className="text-gray-500 text-center text-sm italic">
        No guesses yet. Start playing!
      </p>
    );
  }

  // Display most recent guesses first, limited to 5
  const recentHistory = [...history].reverse().slice(0, 5);

  return (
    <ul className="space-y-2">
      {recentHistory.map((item, index) => (
        <li 
          key={index} 
          className="history-item flex items-center p-2 rounded-md bg-white border border-gray-200 shadow-sm"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="mr-3">
            {item.success ? (
              <CheckCircle className="text-green-500" size={18} />
            ) : (
              <XCircle className="text-red-500" size={18} />
            )}
          </div>
          <div className="flex-grow">
            <p className="text-sm font-medium">
              "{item.guess}" {item.success ? 'beats' : 'doesn\'t beat'} "{item.targetWord}"
            </p>
            {item.globalCount !== undefined && item.success && (
              <p className="text-xs text-gray-500">
                Guessed {item.globalCount} times globally
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}