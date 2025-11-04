# JitFrontend

A full-stack application with a React frontend (powered by Vite) and a Node.js + TypeScript backend. The application generates UI elements from natural language prompts using OpenAI's API.

## Project Structure

```
JitFrontend/
├── frontend/              # React + Vite frontend application
│   ├── src/
│   │   ├── app/          # Application root component
│   │   ├── features/     # Feature-based modules
│   │   │   └── elements/ # Elements generation feature
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── shared/       # Shared components and utilities
│   ├── package.json
│   └── vite.config.ts
├── backend/              # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── config/       # Configuration and constants
│   │   ├── middleware/   # Express middleware
│   │   ├── services/     # Business logic services
│   │   │   ├── generateElements/
│   │   │   └── openAI/
│   │   └── utils/        # Utility functions
│   │       └── security/ # Security utilities
│   ├── package.json
│   └── tsconfig.json
└── shared/               # Shared TypeScript types between frontend and backend
    └── types/
        └── elements.ts   # Element-related DTOs
```

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- OpenAI API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd JitFrontend
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Development Mode

You'll need to run both the frontend and backend servers simultaneously.

#### Terminal 1 - Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

#### Terminal 2 - Frontend Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### Production Build

#### Backend

```bash
cd backend
npm run build
npm start
```

#### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## API Endpoints

### Base URL
- Development: `http://localhost:5000`
- Production: Configure as needed

### Endpoints

- `GET /api` - API information and health check
  - Returns: `{ status: 'ok', message: 'Welcome to Jit Backend API', version: '1.0.0' }`

- `POST /api/generate-elements` - Generate UI elements from natural language prompts
  - Request Body:
    ```json
    {
      "prompt": "create a blue button"
    }
    ```
  - Response:
    ```json
    {
      "elements": [
        {
          "id": "element-1234567890-0",
          "html": "<button style=\"background-color: #007bff; color: white; ...\">Button</button>"
        }
      ],
      "prompt": "create a blue button"
    }
    ```
  - Validation:
    - Prompt is required
    - Maximum length: 100 characters
    - Security validation for prompt injection attacks
  - Rate Limit: 100 requests per 15 minutes per IP address

## Features

### Security

- **Prompt Injection Protection**: Comprehensive validation and sanitization of user inputs
- **HTML Sanitization**: All generated HTML is sanitized using `sanitize-html`
- **Rate Limiting**: 100 requests per 15 minutes per IP address
- **Request Size Limits**: 10KB limit on request body size
- **Input Validation**: Multi-layer validation on both frontend and backend

### Backend Features

- **TypeScript**: Full type safety across the application
- **Structured Logging**: Winston logger with environment-aware formatting
- **Error Handling**: Global error handling middleware with proper HTTP status codes
- **Service Architecture**: Clean separation of concerns with service classes
- **Security Middleware**: Prompt validation and sanitization middleware

### Frontend Features

- **React Query**: Server state management and caching
- **Styled Components**: CSS-in-JS styling
- **Feature-Based Architecture**: Organized by features for scalability
- **TypeScript**: Type-safe frontend code
- **Axios**: HTTP client for API requests
- **Input Validation**: Real-time character count and validation feedback

## Technologies Used

### Frontend
- **React 18** - UI library
- **Vite 5** - Build tool and dev server
- **TypeScript** - Type safety
- **@tanstack/react-query** - Server state management
- **Axios** - HTTP client
- **styled-components** - CSS-in-JS styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **OpenAI API** - AI element generation
- **Winston** - Logging
- **express-rate-limit** - Rate limiting
- **sanitize-html** - HTML sanitization
- **validator** - Input validation
- **CORS** - Cross-origin resource sharing

## Environment Variables

### Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes | - |
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `LOG_LEVEL` | Logging level (debug/info/warn/error) | No | debug (dev) / info (prod) |

## Development

### Frontend Proxy

The frontend is configured to proxy API requests to the backend server. All requests to `/api/*` will be forwarded to `http://localhost:5000`.

### TypeScript

Both frontend and backend use TypeScript. The shared types are located in the `shared/types/` directory and can be imported by both applications.

### Code Structure

- **Backend**: Follows a service-oriented architecture with middleware for cross-cutting concerns
- **Frontend**: Feature-based architecture with shared components and utilities
- **Shared Types**: Common DTOs and interfaces shared between frontend and backend

## Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run type-check` - Type check without building

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Usage Examples

### Generate a Blue Button
```json
POST /api/generate-elements
{
  "prompt": "blue button"
}
```

### Generate a Form Input
```json
POST /api/generate-elements
{
  "prompt": "create a text input with placeholder"
}
```

### Generate Multiple Elements
```json
POST /api/generate-elements
{
  "prompt": "create a red submit button and a green cancel button"
}
```

## Security Considerations

1. **API Key**: Never commit your `.env` file or expose your OpenAI API key
2. **Input Validation**: All user inputs are validated and sanitized
3. **Rate Limiting**: API endpoints are rate-limited to prevent abuse
4. **HTML Sanitization**: All generated HTML is sanitized before being sent to the frontend
5. **Prompt Injection**: Multiple layers of protection against prompt injection attacks

## License

ISC
