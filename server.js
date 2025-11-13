// server.js - servidor simples para proteger chaves de API
// Requer Node 18+ para usar fetch nativo. Se usar Node <18, instale e configure um polyfill (ex: node-fetch).
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Servir arquivos estáticos do diretório do projeto (index.html, css, imagens, etc.)
app.use(express.static('.'));

app.get('/api/reviews', async (req, res) => {
  const key = process.env.GOOGLE_API_KEY;
  const placeId = process.env.PLACE_ID;

  if (!key || !placeId) {
    return res.status(500).json({ error: 'GOOGLE_API_KEY ou PLACE_ID não configurados' });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${key}&language=pt-BR`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Erro na Google API', status: response.status });
    }

    const data = await response.json();
    if (data.status && data.status !== 'OK') {
      return res.status(500).json({ error: 'Google API retornou status: ' + data.status });
    }

    const result = data.result || {};
    const reviews = (result.reviews || []).map(r => ({
      author_name: r.author_name || r.authorAttribution?.displayName || 'Avaliador do Google',
      profile_photo_url: r.profile_photo_url || r.profilePhotoUrl || null,
      rating: r.rating || 5,
      text: r.text || r.comment || '',
      time: r.time || r.publishTime || null
    }));

    res.json({ reviews, rating: result.rating || 5, userRatingCount: result.user_ratings_total || 0 });
  } catch (err) {
    console.error('Erro ao consultar Google Places API:', err);
    res.status(500).json({ error: 'Erro no servidor ao buscar avaliações' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
