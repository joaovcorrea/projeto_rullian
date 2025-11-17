/**
 * Script auxiliar para configurar as chaves API do Google Reviews
 * 
 * Uso:
 * node setup-api-keys.js "SUA_CHAVE_API" "SEU_PLACE_ID" "SEU_TOKEN_AUTH"
 * 
 * Ou configure as variáveis de ambiente:
 * GOOGLE_API_KEY=...
 * GOOGLE_PLACE_ID=...
 * AUTH_TOKEN=...
 */

const http = require('http');

const API_KEY = process.env.GOOGLE_API_KEY || process.argv[2];
const PLACE_ID = process.env.GOOGLE_PLACE_ID || process.argv[3];
const AUTH_TOKEN = process.env.AUTH_TOKEN || process.argv[4] || 'change-this-secret-token';
const PORT = process.env.PORT || 3000;

if (!API_KEY || !PLACE_ID) {
  console.error('\n❌ Erro: API_KEY e PLACE_ID são obrigatórios\n');
  console.log('Uso:');
  console.log('  node setup-api-keys.js "SUA_CHAVE_API" "SEU_PLACE_ID" "SEU_TOKEN_AUTH"');
  console.log('\nOu configure as variáveis de ambiente:');
  console.log('  GOOGLE_API_KEY=...');
  console.log('  GOOGLE_PLACE_ID=...');
  console.log('  AUTH_TOKEN=...\n');
  process.exit(1);
}

const postData = JSON.stringify({
  apiKey: API_KEY,
  placeId: PLACE_ID
});

const options = {
  hostname: 'localhost',
  port: PORT,
  path: '/api/config',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'x-auth-token': AUTH_TOKEN
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.success) {
        console.log('\n✅ Chaves API configuradas com sucesso!\n');
      } else {
        console.error('\n❌ Erro:', response.error, '\n');
        process.exit(1);
      }
    } catch (e) {
      console.error('\n❌ Erro ao processar resposta:', e.message, '\n');
      process.exit(1);
    }
  });
});

req.on('error', (e) => {
  console.error('\n❌ Erro ao conectar ao servidor:', e.message);
  console.log('\nCertifique-se de que o servidor está rodando:');
  console.log('  npm start\n');
  process.exit(1);
});

req.write(postData);
req.end();

