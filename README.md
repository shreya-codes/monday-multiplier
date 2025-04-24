# Monday.com Multiplication Factor Application

A Monday.com integration that automatically calculates output values based on input values and custom multiplication factors. Features real-time updates, calculation history, and a user-friendly item view interface.


## Features

### Item View
- Custom factor input field for each item
- Real-time calculation preview
- Calculation history display with sorting
- Real-time feedback using Monday's notification system

### Column Integration
- Automatic output calculation when input changes
- Null value handling and input validation
- Error recovery with retry mechanism (up to 3 attempts)

### History Tracking
- Complete calculation history per item

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Monday.com account with API access
- Monday.com board with appropriate columns( Note down the column IDs for configuration)
    - Input Column (numbers)
    - Output Column (numbers)
- ngrok (for local development)


### Environment Variables

#### Backend (.env)
```env
# Monday.com Configuration
MONDAY_TOKEN=your_api_token
INPUT_COLUMN_ID=your_input_column_id
OUTPUT_COLUMN_ID=your_output_column_id

# Database
MONGODB_URI=your_mongodb_uri

# Server
PORT=3000
ALLOWED_ORIGINS=http://localhost:3001,be_ngrok_url

#### Frontend (.env)
```env
VITE_API_URL=your_backend_url
```

## Integration Setup

### Webhook Configuration
1. **Create a Webhook Integration**
   - Go to your Monday.com board
   - Click on the "Integrate" button (⚡)
   - Search for "Webhook"
   - Select "Webhook Integration"

2. **Configure Webhook for Input Column**
   ```
   URL: your_ngrok_url/webhooks/input-change
   Event: Change of Column Values
   Board: Select your board
   Column: Select your input column
   ```

3. **Testing the Webhook**
   - Update a value in your input column
   - Check your backend logs for webhook receipt
   - Verify output column updates automatically

### Item View Setup

1. **Create Item View Feature**
   - Go to the Monday.com Developer Center
   - Navigate to your app
   - Click "Add Feature" → "Item View"
   - Select "Build your own" template

2. **Configure View Settings**
   ```
   Custom URL: your_ngrok_url
   View Name: Multiplication Factor
   Description: Set custom multiplication factor and view calculation history
   ```

3. **Install View on Board**
   - Open any item on your board
   - Click the "+" icon in the item view
   - Select your app's view
   - The multiplication factor interface will appear


### Local Development
1. Clone the repository:
```bash
git clone https://github.com/shreya-codes/monday-multiplier.git
cd monday-multiplier
```

1. **Start Development Servers**
   ```bash
   # Terminal 1: Start backend
   cd monday-be
   npm install
   npm run dev

   # Terminal 2: Start frontend
   cd monday-fe
   npm install
   npm run dev

   # Terminal 3: Start ngrok tunnels
   ngrok start --all
   ```

2. **Update URLs**
   - Copy your ngrok HTTPS URL
   - Update webhook URL in Monday.com integration
   - Update item view URL in Monday.com developer center
   - Update ALLOWED_ORIGINS in backend .env

3. **Verify Setup**
   - Open an item in your board
   - Confirm item view loads correctly
   - Test input column changes
   - Verify webhook triggers and updates


## Development

- Frontend: React + TypeScript
- Backend: Node.js
- API: Monday.com SDK
