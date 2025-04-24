import React from 'react';
import { User, UserRound } from 'lucide-react';

type Persona = 'serious' | 'cheery';

interface PersonaSelectorProps {
  currentPersona: Persona;
  onChange: (persona: Persona) => void;
  disabled: boolean;
}

export function PersonaSelector({ currentPersona, onChange, disabled }: PersonaSelectorProps) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-2">Host Persona:</p>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => onChange('serious')}
          disabled={disabled || currentPersona === 'serious'}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
            currentPersona === 'serious'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          } transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <User size={16} className="mr-1.5" />
          Serious
        </button>
        <button
          type="button"
          onClick={() => onChange('cheery')}
          disabled={disabled || currentPersona === 'cheery'}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
            currentPersona === 'cheery'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          } transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <UserRound size={16} className="mr-1.5" />
          Cheery
        </button>
      </div>
    </div>
  );
}