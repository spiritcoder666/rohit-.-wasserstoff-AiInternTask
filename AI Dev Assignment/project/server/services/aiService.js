import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates the appropriate prompt for the AI based on the selected persona
 * @param targetWord - The word to beat
 * @param guessWord - The player's guess
 * @param persona - The AI's personality type
 * @returns string - The formatted prompt
 */
function generatePrompt(targetWord, guessWord, persona) {
  const basePrompt = `Does "${guessWord}" beat "${targetWord}"? Consider this carefully in the context of a game like rock-paper-scissors where one thing can beat another.`;
  
  let promptStyle = '';
  
  if (persona === 'serious') {
    // Serious, logical prompt style
    promptStyle = `${basePrompt}
    
Please respond with a JSON object in this exact format:
{
  "beats": true/false,
  "explanation": "A brief, serious explanation of why the guess does or doesn't beat the target."
}

Be logical, factual, and somewhat formal in your reasoning.`;
  } else if (persona === 'cheery') {
    // Playful, enthusiastic prompt style
    promptStyle = `${basePrompt}
    
Please respond with a JSON object in this exact format:
{
  "beats": true/false,
  "explanation": "A fun, enthusiastic explanation of why the guess does or doesn't beat the target."
}

Be playful, use emojis, and make your explanation entertaining!`;
  } else {
    // Default to serious style
    promptStyle = `${basePrompt}
    
Please respond with a JSON object in this exact format:
{
  "beats": true/false,
  "explanation": "A brief explanation of why the guess does or doesn't beat the target."
}`;
  }
  
  return promptStyle;
}

/**
 * Checks if a guess beats the target word using AI
 * @param targetWord - The word to beat
 * @param guessWord - The player's guess
 * @param persona - The AI's personality type
 * @returns Promise<Object> - The AI's verdict
 */
export async function checkIfGuessBeatsTarget(targetWord, guessWord, persona = 'serious') {
  try {
    const prompt = generatePrompt(targetWord, guessWord, persona);
    
    // Make API call to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a judge for a game where players must guess what beats a given word. Evaluate whether their guess logically beats the target word."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    
    return {
      success: result.beats,
      explanation: result.explanation
    };
  } catch (error) {
    console.error('AI service error:', error);
    throw new Error('Failed to evaluate guess');
  }
}

/**
 * Filters out inappropriate content from user input
 * @param text - The text to moderate
 * @returns Object - Moderation result
 */
export function moderateContent(text) {
  // Basic profanity filter - in production, use a more robust solution
  const profanityList = ['fuck', 'shit', 'ass', 'bitch', 'damn', 'cunt', 'dick'];
  
  // Check for profane words
  const containsProfanity = profanityList.some(word => 
    text.toLowerCase().includes(word)
  );
  
  return {
    isClean: !containsProfanity,
    original: text,
    filtered: containsProfanity ? '[filtered]' : text
  };
}