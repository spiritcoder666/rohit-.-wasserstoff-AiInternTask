import axios from 'axios';

// Get API URL from environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Type definition for AI verdict response
export interface VerdictResponse {
  success: boolean;
  message: string;
  globalCount?: number;
}

/**
 * Fetches the AI's verdict on whether a guess beats the current word
 * @param guess - The player's guess
 * @param currentWord - The word to beat
 * @param persona - The AI's personality type (serious/cheery)
 * @returns Promise<VerdictResponse> - The AI's verdict
 */
export async function fetchWordVerdict(
  guess: string, 
  currentWord: string, 
  persona: string
): Promise<VerdictResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/guess`, 
      { 
        guess,
        currentWord
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Persona': persona,
        }
      }
    );
    
    return response.data;
  } catch (error) {
    // Enhanced error handling with specific error messages
    if (axios.isAxiosError(error)) {
      console.error('Error fetching verdict:', error.message);
      throw new Error(`Failed to validate guess: ${error.message}`);
    }
    console.error('Error fetching verdict:', error);
    throw new Error('Failed to validate guess');
  }
}

/**
 * Fetches the user's guess history from the server
 * @returns Promise<any[]> - Array of historical guesses
 */
export async function fetchUserHistory(): Promise<any[]> {
  try {
    const response = await axios.get(`${API_URL}/history`);
    return response.data.history;
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
}