import { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !email) {
      setStatus('error');
      setMessage('Please provide both a file and an email.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);

    try {
      setStatus('loading');
      setMessage('');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/analyze`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setStatus('success');
      setMessage(response.data.message);

    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h1>📊 Sales Insight Automator</h1>
      <p>Upload your sales file and receive an AI-generated summary in your inbox.</p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Upload CSV or XLSX File</label>
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
          />
          {file && <span className="file-name">📄 {file.name}</span>}
        </div>

        <div className="field">
          <label>Recipient Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Analyzing...' : 'Generate & Send Report'}
        </button>
      </form>

      {status === 'success' && (
        <div className="alert success">✅ {message}</div>
      )}

      {status === 'error' && (
        <div className="alert error">❌ {message}</div>
      )}
    </div>
  );
};

export default UploadForm;