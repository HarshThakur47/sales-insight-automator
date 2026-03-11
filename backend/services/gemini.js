const Groq = require('groq-sdk');

const generateSummary = async (data) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const dataString = JSON.stringify(data.slice(0, 50), null, 2);

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `
          You are a senior sales analyst. Analyze the following sales data and generate
          a professional executive summary report.

          Include:
          1. Overall performance overview
          2. Top performing products/regions
          3. Revenue trends
          4. Key concerns or anomalies
          5. Actionable recommendations

          Keep it concise, professional, and suitable for executive leadership.

          Sales Data:
          ${dataString}
        `
      }
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  return completion.choices[0].message.content;
};

module.exports = { generateSummary };