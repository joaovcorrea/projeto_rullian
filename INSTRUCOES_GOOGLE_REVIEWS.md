# 📋 Instruções para Integrar Avaliações Reais do Google

## 🎯 Objetivo
Integrar as avaliações reais do Google My Business do Dr. Rullian Pinheiro no site.

## 📝 Passo a Passo

### 1. Obter a Chave de API do Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Faça login com sua conta Google
3. Crie um novo projeto ou selecione um existente
4. No menu lateral, vá em **"APIs e Serviços"** > **"Biblioteca"**
5. Procure por **"Places API"** e clique
6. Clique em **"Ativar"**
7. Vá em **"APIs e Serviços"** > **"Credenciais"**
8. Clique em **"Criar credenciais"** > **"Chave de API"**
9. Copie a chave gerada

### 2. Obter o Place ID

O Place ID é um identificador único do estabelecimento no Google.

**Opção A - Via Google Maps:**
1. Acesse [Google Maps](https://www.google.com/maps)
2. Procure pelo endereço: "R. Padre Anchieta, 2348, Bigorrilho, Curitiba"
3. Clique no estabelecimento
4. Role até o final da página de informações
5. O Place ID estará visível (formato: ChIJ...)

**Opção B - Via Ferramenta do Google:**
1. Acesse: https://developers.google.com/maps/documentation/places/web-service/place-id
2. Use a ferramenta "Find Place ID"
3. Digite o endereço e encontre o Place ID

**Opção C - Via URL do Google Maps:**
1. Abra o Google Maps no navegador
2. Procure pelo estabelecimento
3. Na URL, você verá algo como: `.../place/ChIJ...`
4. O código após `/place/` é o Place ID

### 3. Configurar o Código

1. Abra o arquivo `google-reviews.js`
2. Localize as linhas:
   ```javascript
   this.apiKey = 'YOUR_API_KEY';
   this.placeId = 'YOUR_PLACE_ID';
   ```
3. Substitua `YOUR_API_KEY` pela chave de API obtida
4. Substitua `YOUR_PLACE_ID` pelo Place ID obtido

### 4. Ativar o Script

No arquivo `google-reviews.js`, localize as linhas no final:

```javascript
// new GoogleReviews(); // Descomente após configurar a API
```

E descomente (remova as `//`):

```javascript
new GoogleReviews(); // Agora ativado
```

Faça isso nas duas ocorrências (dentro do `if` e do `else`).

### 5. Restrições de Segurança (IMPORTANTE)

Para proteger sua chave de API:

1. No Google Cloud Console, vá em **"APIs e Serviços"** > **"Credenciais"**
2. Clique na chave de API criada
3. Em **"Restrições de aplicativo"**, selecione **"Referenciadores HTTP"**
4. Adicione o domínio do site (ex: `https://www.drrullianpinheiro.com.br/*`)
5. Em **"Restrições de API"**, selecione **"Restringir chave"**
6. Selecione apenas **"Places API"**
7. Salve as alterações

## ⚠️ Limitações e Custos

### Cota Gratuita
- Google oferece $200 de crédito mensal gratuito
- Isso equivale a aproximadamente 40.000 requisições/mês
- Para um site pequeno, isso é mais que suficiente

### Custos Adicionais
- Após a cota gratuita: $0.017 por requisição
- Avaliações são atualizadas automaticamente quando a página carrega
- Recomendação: Implementar cache para reduzir requisições

## 🔄 Alternativa: Cache Local

Para evitar muitas requisições à API, você pode:

1. Criar um script backend (PHP/Node.js) que busca as avaliações
2. Salvar em cache por algumas horas
3. O frontend busca do seu servidor, não diretamente do Google

## 🧪 Testar

1. Abra o site no navegador
2. Abra o Console do Desenvolvedor (F12)
3. Verifique se há erros
4. As avaliações devem aparecer automaticamente substituindo as estáticas

## 🐛 Solução de Problemas

### Erro: "API key not valid"
- Verifique se a chave está correta
- Verifique se a Places API está ativada
- Verifique as restrições de domínio

### Erro: "Place ID not found"
- Verifique se o Place ID está correto
- Certifique-se de que o estabelecimento tem um perfil no Google My Business

### Avaliações não aparecem
- Verifique o Console do navegador para erros
- Verifique se o estabelecimento tem avaliações públicas
- Algumas avaliações podem estar marcadas como privadas

## 📞 Suporte

Se precisar de ajuda:
- Documentação oficial: https://developers.google.com/maps/documentation/places/web-service
- Google Cloud Support: https://cloud.google.com/support

## ✅ Checklist Final

- [ ] Chave de API criada e configurada
- [ ] Places API ativada
- [ ] Place ID obtido e configurado
- [ ] Script descomentado e ativado
- [ ] Restrições de segurança configuradas
- [ ] Testado no navegador
- [ ] Avaliações aparecendo corretamente


