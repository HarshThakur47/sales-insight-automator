const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: 'Too many requests. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const validateFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const allowedMimes = [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  if (!allowedMimes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Only CSV or XLSX files are allowed.' });
  }

  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File size must be under 5MB.' });
  }

  next();
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  next();
};

module.exports = { limiter, validateFile, validateEmail };