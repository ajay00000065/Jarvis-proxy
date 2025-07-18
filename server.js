// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const deepseekKey = "sk-abbf7f512fbf413ca5ad14996fb6331f";
const huggingKey = "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";

// Allow CORS for All
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Proxy DeepSeek
app.post('/deepseek', async (req, res) => {
  try {
    const apiRes = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekKey}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await apiRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'DeepSeek Proxy Error', details: err.toString() });
  }
});

// Proxy Hugging Face TTS
app.post('/huggingface', async (req, res) => {
  try {
    const apiRes = await fetch('https://api-inference.huggingface.co/models/suno/bark', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${huggingKey}`
      },
      body: JSON.stringify(req.body)
    });
    const buffer = await apiRes.arrayBuffer();
    res.setHeader('Content-Type', 'audio/wav');
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: 'Hugging Face Proxy Error', details: err.toString() });
  }
});

app.listen(3000, () => console.log('Proxy Server Running on Port 3000'));