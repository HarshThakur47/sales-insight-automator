const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const analyzeRoute = require('./routes/analyze');
const { limiter } = require('./middleware/security');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
}));
app.use(limiter);
app.use(express.json());

app.use('/api', analyzeRoute);

app.get('/', (req, res) => {
  res.json({ status: 'Sales Insight API is running 🚀' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});