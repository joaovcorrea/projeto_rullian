# Backend - Gerenciamento de Chaves API

Este backend foi criado para gerenciar de forma segura as chaves API do Google Reviews, evitando expor informações sensíveis no código frontend.

## 🚀 Instalação

1. Instale as dependências:
```bash
npm install
```

## ⚙️ Configuração

### 1. Configurar Token de Autenticação

Crie um arquivo `.env` na raiz do projeto (ou configure variável de ambiente):

```bash
AUTH_TOKEN=seu-token-secreto-aqui
```

**IMPORTANTE**: Use um token forte e único. Exemplo:
```bash
AUTH_TOKEN=dr-rullian-2024-secret-key-change-this
```

### 2. Iniciar o Servidor

```bash
npm start
```

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## 📝 Como Usar

### Configurar as Chaves API

Faça uma requisição POST para `/api/config` com o token de autenticação:

```bash
curl -X POST http://localhost:3000/api/config \
  -H "Content-Type: application/json" \
  -H "x-auth-token: seu-token-secreto-aqui" \
  -d '{
    "apiKey": "SUA_CHAVE_API_GOOGLE",
    "placeId": "SEU_PLACE_ID_GOOGLE"
  }'
```

### Obter as Chaves API (Frontend)

O frontend pode buscar as chaves através do endpoint GET:

```javascript
fetch('/api/config')
  .then(res => res.json())
  .then(data => {
    console.log(data.apiKey);
    console.log(data.placeId);
  });
```

## 🔒 Segurança

1. **Nunca commite o arquivo `config/api-keys.json` no git**
   - O arquivo já está no `.gitignore`
   
2. **Use HTTPS em produção**
   - Configure um proxy reverso (nginx, Apache) com SSL
   
3. **Proteja o token de autenticação**
   - Use variáveis de ambiente
   - Não exponha o token no código

4. **Restrinja acesso ao servidor**
   - Configure firewall
   - Use CORS adequadamente

## 📁 Estrutura de Arquivos

```
projeto_rullian/
├── server.js              # Servidor Express
├── package.json           # Dependências
├── config/               # Diretório criado automaticamente
│   └── api-keys.json     # Chaves API (não versionado)
├── .gitignore            # Arquivos ignorados
└── README_BACKEND.md     # Esta documentação
```

## 🌐 Deploy em Produção

### Opções de Deploy:

1. **Heroku**
   ```bash
   heroku create
   heroku config:set AUTH_TOKEN=seu-token
   git push heroku main
   ```

2. **Vercel / Netlify Functions**
   - Adapte o código para serverless

3. **VPS (DigitalOcean, AWS, etc)**
   - Use PM2 para gerenciar o processo
   ```bash
   npm install -g pm2
   pm2 start server.js --name "api-server"
   ```

## 🔧 Variáveis de Ambiente

- `PORT`: Porta do servidor (padrão: 3000)
- `AUTH_TOKEN`: Token para autenticar requisições POST

## 📞 Suporte

Em caso de dúvidas sobre a implementação, consulte a documentação do Express.js e Google Places API.

