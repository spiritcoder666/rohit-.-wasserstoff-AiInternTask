# What Beats Rock - AI-Powered Guessing Game

A game where you need to guess what "beats" a given word. The AI will judge if your guess logically beats the target word!

## Features

- AI-powered guessing game that uses a generative AI model to determine if your guess "beats" the target word
- Linked list data structure to track game progression
- Redis caching for improved performance
- PostgreSQL database for persistence
- Different host personas (Serious vs. Cheery)
- Content moderation
- Docker deployment

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Cache**: Redis
- **AI Provider**: OpenAI API
- **Deployment**: Docker, Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- OpenAI API key

### Running with Docker

1. Clone the repository
2. Set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY=your_openai_api_key
```

3. Start the application:

```bash
docker-compose up
```

The application will be available at http://localhost:3000

### Local Development

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the `.env.example` template
4. Start the PostgreSQL and Redis servers (using Docker or local installations)
5. Start the development server:

```bash
# Start the backend server
npm run start:server

# In another terminal, start the frontend dev server
npm run dev
```

## How to Play

1. The game starts with a seed word (e.g., "Rock")
2. Enter something you think "beats" the current word
3. The AI will determine if your guess beats the target word
4. If correct, you earn a point and your guess becomes the new target word
5. If you repeat a previous guess, the game ends

## Testing

Run the tests with:

```bash
npm test
```

## Deployment

The application can be deployed to any platform that supports Docker containers.

## License

This project is licensed under the MIT License