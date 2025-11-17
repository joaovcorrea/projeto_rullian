/**
 * Backend Server para Gerenciar Chaves API do Google Reviews
 * 
 * Este servidor armazena de forma segura as chaves API do Google
 * e fornece um endpoint para o frontend buscar essas informações.
 * 
 * IMPORTANTE: As chaves API são informações sigilosas e nunca devem
 * ser expostas diretamente no código frontend.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servir arquivos estáticos

// Caminho para o arquivo de configuração (não versionado no git)
const CONFIG_FILE = path.join(__dirname, 'config', 'api-keys.json');

// Garantir que o diretório config existe
async function ensureConfigDir() {
  const configDir = path.dirname(CONFIG_FILE);
  try {
    await fs.mkdir(configDir, { recursive: true });
  } catch (error) {
    console.error('Erro ao criar diretório config:', error);
  }
}

// Carregar configurações
async function loadConfig() {
  try {
    await ensureConfigDir();
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, retornar estrutura padrão
    return {
      googleApiKey: '',
      googlePlaceId: '',
      lastUpdated: null
    };
  }
}

// Salvar configurações
async function saveConfig(config) {
  try {
    await ensureConfigDir();
    config.lastUpdated = new Date().toISOString();
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    return false;
  }
}

// Endpoint para obter as chaves API (apenas para uso interno)
app.get('/api/config', async (req, res) => {
  try {
    const config = await loadConfig();
    
    // Retornar apenas as chaves necessárias
    res.json({
      success: true,
      apiKey: config.googleApiKey || '',
      placeId: config.googlePlaceId || ''
    });
  } catch (error) {
    console.error('Erro ao carregar configuração:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao carregar configuração'
    });
  }
});

// Endpoint para atualizar as chaves API (protegido por autenticação simples)
app.post('/api/config', async (req, res) => {
  try {
    // Autenticação simples via header (você pode melhorar isso)
    const authToken = req.headers['x-auth-token'];
    const expectedToken = process.env.AUTH_TOKEN || 'change-this-secret-token';
    
    if (authToken !== expectedToken) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado'
      });
    }
    
    const { apiKey, placeId } = req.body;
    
    if (!apiKey || !placeId) {
      return res.status(400).json({
        success: false,
        error: 'apiKey e placeId são obrigatórios'
      });
    }
    
    const config = await loadConfig();
    config.googleApiKey = apiKey;
    config.googlePlaceId = placeId;
    
    const saved = await saveConfig(config);
    
    if (saved) {
      res.json({
        success: true,
        message: 'Configuração salva com sucesso'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erro ao salvar configuração'
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar configuração'
    });
  }
});

// Endpoint de status
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor está rodando',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📁 Configurações serão salvas em: ${CONFIG_FILE}`);
  console.log(`\n⚠️  IMPORTANTE:`);
  console.log(`   - Configure a variável de ambiente AUTH_TOKEN para proteger o endpoint`);
  console.log(`   - O arquivo ${CONFIG_FILE} não deve ser versionado no git`);
  console.log(`   - Adicione 'config/' ao seu .gitignore\n`);
});

