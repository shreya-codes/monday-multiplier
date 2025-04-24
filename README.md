# Monday.com Multiplication Factor Application

A Monday.com integration that allows users to set a multiplication factor for items in their board. The factor is applied to input values to calculate output values, with a history of calculations maintained for reference.

## Features

- Real-time multiplication factor updates
- Calculation history tracking
- Error handling with retry mechanism

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Monday.com account with API access
- Monday.com board with appropriate columns
- ngrok (for local development)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/shreya-codes/monday-multiplier.git
cd monday-multiplier
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd monday-be
npm install

# Install frontend dependencies
cd ../monday-fe
npm install
```

3. Copy the environment files and update the values:
```bash
# Backend
cd ../monday-be
cp .env.example .env

# Frontend
cd ../monday-fe
cp .env.example .env
```

4. Start the development servers:

In one terminal:
```bash
# Start backend
cd monday-be
npm run dev
```

In another terminal:
```bash
# Start frontend
cd monday-fe
npm run dev
```

5. Start ngrok for the backend:
```bash
ngrok http 3000
```

6. Update your Monday.com app settings with the ngrok URL

## Configuration

1. Create a Monday.com app and get your API token
2. Update the `.env` files with your credentials
3. Configure your Monday.com board with the required columns
4. Update the frontend `.env` with your ngrok URL

## Development

- Frontend: React + TypeScript
- Backend: Node.js
- API: Monday.com SDK
