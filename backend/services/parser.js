const xlsx = require('xlsx');
const fs = require('fs');
const csv = require('csv-parser');

const parseXLSX = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
};

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

const parseFile = async (filePath, mimetype) => {
  if (mimetype === 'text/csv') {
    return await parseCSV(filePath);
  } else {
    return parseXLSX(filePath);
  }
};

module.exports = { parseFile };