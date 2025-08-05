const express = require('express');
const cors = require('cors');
const pino = require('pino-http');

function setupServer() {
  const app = express();

  // Middleware'ler
  app.use(cors());
  app.use(pino());

  // Örnek rota (ileride /contacts eklenecek)
  app.get('/', (req, res) => {
    res.send('Server is working!');
  });

  // 404 fallback
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Sunucuyu başlat
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = setupServer;
