# Sales Insight Automator

A containerized AI-powered tool that analyzes sales CSV/XLSX files and delivers executive summaries via email.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- AI: Groq (Llama 3.3)
- Email: Resend
- Containerization: Docker + Docker Compose
- CI/CD: GitHub Actions
- Deployment: Vercel (Frontend) + Render (Backend)

## How to Run Locally

### 1. Clone the repo

git clone https://github.com/YOUR_USERNAME/sales-insight-automator.git
cd sales-insight-automator

### 2. Setup environment variables

cp backend/.env.example backend/.env

Fill in the values in backend/.env:
- GROQ_API_KEY → https://console.groq.com
- RESEND_API_KEY → https://resend.com
- FRONTEND_URL → http://localhost:5173

### 3. Run with Docker

docker-compose up --build

### 4. Run without Docker

# Terminal 1 - Backend
cd backend
npm install
node index.js

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

### 5. Open in browser

http://localhost:5173

## API Endpoints

| Method | Endpoint      | Description                        |
|--------|---------------|------------------------------------|
| GET    | /             | Health check                       |
| POST   | /api/analyze  | Upload file and receive AI summary |

## Security

- Rate limiting: 10 requests per 15 minutes per IP
- File validation: Only CSV and XLSX allowed, max 5MB
- CORS: Only frontend URL is whitelisted
- Helmet: Secure HTTP headers applied

## Environment Variables

| Variable        | Description              |
|-----------------|--------------------------|
| PORT            | Backend port (5000)      |
| GROQ_API_KEY    | Groq API key             |
| RESEND_API_KEY  | Resend API key           |
| FRONTEND_URL    | Frontend URL for CORS    |

## CI/CD

GitHub Actions pipeline runs on every push and pull request to main:
- Validates backend build
- Builds frontend