# 📋 Guia Completo: Integração de Avaliações do Google

**Para o time de Marketing - Dr. Rullian Pinheiro**

Este guia apresenta **duas opções** para integrar as avaliações do Google no site. Escolha a que melhor se adequa às necessidades.

---

## 🎯 OPÇÃO 1: Usando API do Google (Recomendado)

### ✅ Vantagens:
- Avaliações atualizadas automaticamente
- Design totalmente personalizado
- Controle total sobre a exibição
- Melhor para SEO

### ⚠️ Requisitos:
- Conta Google Cloud Platform
- Configuração de chave API
- Pequeno custo após cota gratuita ($200/mês grátis)

---

## 📝 PASSO A PASSO - OPÇÃO 1 (API)

### **ETAPA 1: Criar Projeto no Google Cloud**

1. Acesse: **https://console.cloud.google.com/**
2. Faça login com a conta Google da empresa
3. Clique em **"Selecionar um projeto"** (canto superior direito)
4. Clique em **"NOVO PROJETO"**
5. Preencha:
   - **Nome do projeto**: `Dr Rullian Pinheiro - Google Reviews`
   - **Organização**: (deixe padrão se não tiver)
6. Clique em **"CRIAR"**
7. Aguarde alguns segundos e selecione o projeto criado

---

### **ETAPA 2: Ativar a Places API**

1. No menu lateral esquerdo, vá em **"APIs e Serviços"** > **"Biblioteca"**
2. Na barra de pesquisa, digite: **"Places API"**
3. Clique em **"Places API (New)"** (a versão nova)
4. Clique no botão **"ATIVAR"**
5. Aguarde a confirmação de ativação

**⚠️ IMPORTANTE**: Se não encontrar "Places API (New)", ative também a **"Places API"** (versão legada) como backup.

---

### **ETAPA 3: Criar Chave de API**

1. No menu lateral, vá em **"APIs e Serviços"** > **"Credenciais"**
2. Clique em **"+ CRIAR CREDENCIAIS"** (topo da página)
3. Selecione **"Chave de API"**
4. Uma chave será gerada automaticamente
5. **COPIE A CHAVE** (você precisará dela depois)
   - Formato: `AIzaSyC...` (cerca de 39 caracteres)

---

### **ETAPA 4: Configurar Restrições de Segurança (OBRIGATÓRIO)**

⚠️ **NUNCA pule esta etapa!** Sem restrições, sua chave pode ser usada por qualquer pessoa.

1. Na página de **"Credenciais"**, clique na chave que você acabou de criar
2. Em **"Restrições de aplicativo"**, selecione **"Referenciadores HTTP"**
3. Clique em **"+ ADICIONAR UM ITEM"**
4. Adicione o domínio do site:
   ```
   https://www.drrullianpinheiro.com.br/*
   ```
   (Se tiver outros domínios, adicione também)
5. Em **"Restrições de API"**, selecione **"Restringir chave"**
6. Marque apenas:
   - ✅ **Places API (New)**
   - ✅ **Places API** (se ativou a versão legada)
7. Clique em **"SALVAR"**

---

### **ETAPA 5: Obter o Place ID**

O Place ID é o identificador único do consultório no Google.

#### **Método 1 - Via Google Maps (Mais Fácil):**

1. Acesse: **https://www.google.com/maps**
2. Procure por: **"R. Padre Anchieta, 2348, Bigorrilho, Curitiba"**
3. Clique no estabelecimento quando aparecer
4. Na barra de endereço do navegador, você verá algo como:
   ```
   https://www.google.com/maps/place/.../@-25.431822,-49.295651,17z/.../ChIJ...
   ```
5. Procure na URL por um código que começa com **"ChIJ"** seguido de letras e números
6. **COPIE TODO O CÓDIGO** (exemplo: `ChIJ1234567890abcdefghijklmnop`)

#### **Método 2 - Via Ferramenta do Google:**

1. Acesse: **https://developers.google.com/maps/documentation/places/web-service/place-id**
2. Role até a seção **"Find Place ID"**
3. Digite o endereço: **"R. Padre Anchieta, 2348, Bigorrilho, Curitiba - PR"**
4. Clique em **"Find"**
5. O Place ID aparecerá abaixo
6. **COPIE O PLACE ID**

#### **Método 3 - Via Google My Business:**

1. Acesse: **https://business.google.com/**
2. Faça login e selecione o perfil do consultório
3. Vá em **"Informações"** > **"Localização"**
4. O Place ID pode estar visível nas configurações avançadas

---

### **ETAPA 6: Enviar as Informações**

Após concluir todas as etapas, envie as seguintes informações para o desenvolvedor:

```
✅ Chave de API: AIzaSyC...
✅ Place ID: ChIJ...
✅ Confirmação de que as restrições foram configuradas
```

**⚠️ IMPORTANTE**: 
- Não compartilhe a chave de API publicamente
- Envie por email seguro ou mensagem privada
- A chave deve ser mantida em segredo

---

### **ETAPA 7: Configurar Faturamento (Opcional mas Recomendado)**

O Google oferece $200 de crédito mensal grátis, mas é necessário ter um método de pagamento cadastrado:

1. No menu lateral, vá em **"Faturamento"**
2. Clique em **"VINCULAR UMA CONTA DE FATURAMENTO"**
3. Preencha os dados de pagamento
4. **Não se preocupe**: Você só será cobrado após usar os $200 grátis
5. Para um site pequeno, dificilmente ultrapassará a cota gratuita

---

## 🎯 OPÇÃO 2: Usando Widget do Google (Mais Simples)

### ✅ Vantagens:
- Configuração muito mais simples
- Sem necessidade de API
- Gratuito
- Funciona imediatamente

### ⚠️ Desvantagens:
- Design menos personalizado
- Menos controle sobre a aparência
- Pode não combinar 100% com o design do site

---

## 📝 PASSO A PASSO - OPÇÃO 2 (Widget)

### **ETAPA 1: Acessar Google My Business**

1. Acesse: **https://business.google.com/**
2. Faça login com a conta que gerencia o perfil do consultório
3. Selecione o perfil do **Dr. Rullian Pinheiro**

---

### **ETAPA 2: Gerar Widget de Avaliações**

1. No menu lateral, procure por **"Avaliações"** ou **"Reviews"**
2. Role até encontrar a opção **"Obter mais avaliações"** ou **"Widget de avaliações"**
3. Clique em **"Criar widget"** ou **"Gerar código"**
4. Configure as opções:
   - **Tema**: Escolha o que mais combina (claro/escuro)
   - **Tamanho**: Pequeno/Médio/Grande
   - **Idioma**: Português (Brasil)
5. **COPIE O CÓDIGO HTML** gerado

---

### **ETAPA 3: Enviar o Código**

Envie o código HTML gerado para o desenvolvedor, que irá integrá-lo no site.

---

## 📊 Comparação das Opções

| Característica | Opção 1 (API) | Opção 2 (Widget) |
|----------------|---------------|------------------|
| **Facilidade** | ⭐⭐ Média | ⭐⭐⭐⭐⭐ Muito Fácil |
| **Customização** | ⭐⭐⭐⭐⭐ Total | ⭐⭐ Limitada |
| **Custo** | Grátis até $200/mês | Grátis |
| **Atualização** | Automática | Automática |
| **Tempo de Config** | 30-45 min | 5-10 min |
| **Recomendado para** | Sites profissionais | Solução rápida |

---

## ❓ Perguntas Frequentes

### **P: Qual opção devo escolher?**
**R**: Se você quer um design totalmente personalizado e tem tempo para configurar, escolha a **Opção 1 (API)**. Se precisa de algo rápido e simples, escolha a **Opção 2 (Widget)**.

### **P: A Opção 1 tem custo?**
**R**: O Google oferece $200 de crédito mensal grátis, o que é suficiente para a maioria dos sites. Você só paga se ultrapassar essa cota (improvável para um site pequeno).

### **P: Posso mudar de opção depois?**
**R**: Sim! Você pode começar com o Widget e depois migrar para a API, ou vice-versa.

### **P: E se eu não tiver acesso ao Google My Business?**
**R**: Você precisará solicitar acesso ao proprietário do perfil ou criar um novo perfil no Google My Business primeiro.

### **P: Quantas avaliações serão exibidas?**
**R**: 
- **Opção 1**: Configurável (padrão: 6 avaliações)
- **Opção 2**: Depende do widget escolhido (geralmente 5-10)

---

## ✅ Checklist Final

### Para Opção 1 (API):
- [ ] Projeto criado no Google Cloud
- [ ] Places API ativada
- [ ] Chave de API criada
- [ ] Restrições de segurança configuradas
- [ ] Place ID obtido
- [ ] Informações enviadas ao desenvolvedor
- [ ] Faturamento configurado (opcional)

### Para Opção 2 (Widget):
- [ ] Acesso ao Google My Business
- [ ] Widget gerado
- [ ] Código HTML copiado
- [ ] Código enviado ao desenvolvedor

---

## 📞 Suporte

Se tiver dúvidas durante o processo:

1. **Documentação Google Cloud**: https://cloud.google.com/docs
2. **Documentação Places API**: https://developers.google.com/maps/documentation/places
3. **Suporte Google My Business**: https://support.google.com/business

---

## 🎉 Próximos Passos

Após enviar as informações (chave API + Place ID ou código do Widget), o desenvolvedor irá:

1. Configurar a integração no site
2. Testar se está funcionando
3. Ajustar o design se necessário
4. Publicar as alterações

**Tempo estimado de implementação**: 1-2 horas após receber as informações.

---

**Documento criado em**: Janeiro 2025  
**Versão**: 1.0  
**Para**: Time de Marketing - Dr. Rullian Pinheiro


