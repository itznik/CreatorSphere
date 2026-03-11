const express = require('express');
const app = express();
app.get('/api/health', (req, res) => res.json({ status: 'Backend is alive!' }));
app.listen(5000, () => console.log('Server running on port 5000'));