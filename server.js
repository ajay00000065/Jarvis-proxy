 const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const deepseekKey = process.env.deepseekKey;
const huggingKey = process.env.huggingKey;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.post('/deepseek', async (req, res) => {
  try {
    const apiRes = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${deepseekKey}` },
      body: JSON.stringify(req.body)
    });
    const data = await apiRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'DeepSeek Error', details: err.toString() });
  }
});

app.post('/huggingface', async (req, res) => {
  try {
    const apiRes = await fetch('https://api-inference.huggingface.co/models/suno/bark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${huggingKey}` },
      body: JSON.stringify(req.body)
    });
    const buffer = await apiRes.arrayBuffer();
    res.setHeader('Content-Type', 'audio/wav');
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: 'Hugging Face Error', detail : err.toString() });