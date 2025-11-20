# 📊 O que é o Meta Pixel (Facebook Pixel)?

## 🎯 O que é?

O **Meta Pixel** (anteriormente Facebook Pixel) é um código de rastreamento do Facebook/Meta que permite monitorar o comportamento dos visitantes do site e medir a eficácia das campanhas publicitárias.

---

## 🔍 Para que serve?

### 1. **Rastrear Conversões**
- Mede quando alguém clica em um anúncio do Facebook/Instagram e realiza uma ação no site
- Exemplos: agendamento de consulta, clique no WhatsApp, visualização de página

### 2. **Criar Públicos Personalizados**
- Identifica visitantes do site que podem ser alvo de campanhas futuras
- Permite criar "públicos personalizados" no Facebook Ads Manager
- Exemplo: mostrar anúncios apenas para quem visitou a página de serviços

### 3. **Otimizar Anúncios**
- O Facebook usa os dados para mostrar anúncios para pessoas mais propensas a converter
- Melhora o desempenho das campanhas publicitárias
- Reduz custos por conversão

### 4. **Medir Eficácia de Campanhas**
- Mostra quantas pessoas visitaram o site após ver um anúncio
- Calcula o ROI (Retorno sobre Investimento) das campanhas
- Ajuda a entender quais anúncios funcionam melhor

---

## 📈 Eventos que podem ser rastreados:

- **PageView**: Visualização de página (já configurado)
- **Lead**: Quando alguém preenche um formulário
- **Contact**: Quando alguém clica no WhatsApp
- **ViewContent**: Visualização de conteúdo específico
- **Search**: Busca no site
- E muitos outros...

---

## 🔒 Privacidade e LGPD

⚠️ **IMPORTANTE**: O Meta Pixel coleta dados dos visitantes. É necessário:

1. **Aviso de Cookies/Privacidade**: Informar aos visitantes sobre o uso do pixel
2. **Política de Privacidade**: Atualizar a política mencionando o uso do Meta Pixel
3. **LGPD**: Garantir conformidade com a Lei Geral de Proteção de Dados

---

## ✅ O que foi implementado:

### **Otimizações de Performance:**
- ✅ Carregamento assíncrono (não bloqueia a página)
- ✅ No mobile: carrega apenas após interação do usuário
- ✅ Preconnect para Facebook (acelera conexão)
- ✅ Não impacta a pontuação do PageSpeed

### **Funcionalidades:**
- ✅ Rastreamento de PageView (visualização de página)
- ✅ Funciona mesmo com JavaScript desabilitado (noscript)
- ✅ ID do Pixel: `843909488574498`

---

## 🎯 Próximos Passos (Opcional):

Se o marketing quiser rastrear eventos específicos, podemos adicionar:

### **Exemplo: Rastrear clique no WhatsApp**
```javascript
// Quando alguém clicar no botão do WhatsApp
fbq('track', 'Contact', {
  content_name: 'WhatsApp Click',
  content_category: 'Contact'
});
```

### **Exemplo: Rastrear clique em "Agendar Consulta"**
```javascript
fbq('track', 'Lead', {
  content_name: 'Agendar Consulta',
  content_category: 'Conversion'
});
```

---

## 📊 Como ver os dados:

1. Acesse: **https://business.facebook.com/**
2. Vá em **"Eventos"** ou **"Gerenciador de Eventos"**
3. Selecione o Pixel: **843909488574498**
4. Veja os dados de visitantes, conversões, etc.

---

## ⚠️ Observações:

- O pixel está **ativado e funcionando**
- Não bloqueia o carregamento da página
- No mobile, carrega de forma otimizada para não impactar performance
- Os dados começam a aparecer no Facebook Ads Manager em algumas horas

---

## 📞 Dúvidas?

Se o marketing precisar de eventos adicionais ou tiver dúvidas sobre o funcionamento, é só avisar que podemos adicionar mais rastreamentos específicos.

---

**Status**: ✅ **Implementado e Otimizado**  
**Data**: Janeiro 2025  
**ID do Pixel**: 843909488574498

