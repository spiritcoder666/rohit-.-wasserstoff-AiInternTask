import React from 'react';
import { Trophy } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="mt-6 flex items-center justify-center">
      <div className="bg-blue-100 px-6 py-3 rounded-full flex items-center">
        <Trophy size={20} className="text-blue-600 mr-2" />
        <div>
          <p className="text-sm text-blue-800 font-medium">Score</p>
          <p className={`text-xl font-bold text-blue-800 ${score > 0 ? 'pop-animation' : ''}`}>
            {score}
          </p>
        </div>
      </div>
    </div>
  );
}