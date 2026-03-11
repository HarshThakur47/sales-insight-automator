const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

const { validateFile, validateEmail } = require('../middleware/security');
const { parseFile } = require('../services/parser');
const { generateSummary } = require('../services/gemini');
const { sendSummaryEmail } = require('../services/email');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/analyze', upload.single('file'), validateFile, validateEmail, async (req, res) => {
  const filePath = req.file.path;

  try {
    const data = await parseFile(filePath, req.file.mimetype);

    if (!data || data.length === 0) {
      return res.status(400).json({ error: 'The file appears to be empty.' });
    }

    const summary = await generateSummary(data);

    await sendSummaryEmail(req.body.email, summary);

    fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'Success! Your sales insight report has been sent to your email.',
    });

  } catch (error) {
    console.error(error.message);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;