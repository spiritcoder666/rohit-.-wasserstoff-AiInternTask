import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';
let sessionId;

describe('What Beats Rock game API', () => {
  beforeAll(() => {
    // Generate a random session ID for testing
    sessionId = `test-${Date.now()}`;
  });
  
  it('should accept a valid guess and return a verdict', async () => {
    const response = await axios.post(
      `${API_URL}/guess`,
      { 
        guess: 'Paper',
        currentWord: 'Rock'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
          'X-Persona': 'serious'
        }
      }
    );
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('success', true);
    expect(response.data).toHaveProperty('message');
    expect(response.data.message).toContain('beats');
    expect(response.data).toHaveProperty('globalCount');
  });
  
  it('should end the game when a duplicate guess is made', async () => {
    // First guess
    await axios.post(
      `${API_URL}/guess`,
      { 
        guess: 'Scissors',
        currentWord: 'Paper'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
          'X-Persona': 'serious'
        }
      }
    );
    
    // Duplicate guess (should trigger game over)
    const response = await axios.post(
      `${API_URL}/guess`,
      { 
        guess: 'Scissors',
        currentWord: 'Something'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
          'X-Persona': 'serious'
        }
      }
    );
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('success', false);
    expect(response.data.message).toContain('Game Over');
  });
  
  it('should retrieve user history', async () => {
    const response = await axios.get(
      `${API_URL}/history`,
      {
        headers: {
          'X-Session-Id': sessionId
        }
      }
    );
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('success', true);
    expect(response.data).toHaveProperty('history');
    expect(Array.isArray(response.data.history)).toBe(true);
    expect(response.data.history.length).toBeGreaterThan(0);
  });
  
  it('should reject inappropriate content', async () => {
    try {
      await axios.post(
        `${API_URL}/guess`,
        { 
          guess: 'shit',
          currentWord: 'Something'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Session-Id': sessionId,
            'X-Persona': 'serious'
          }
        }
      );
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toContain('inappropriate');
    }
  });
});