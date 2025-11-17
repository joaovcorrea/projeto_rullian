/**
 * Google Reviews Integration
 * 
 * Para usar esta funcionalidade, você precisa:
 * 1. Obter uma chave de API do Google Cloud Platform
 * 2. Habilitar a Google Places API
 * 3. Obter o Place ID do estabelecimento no Google My Business
 * 
 * Instruções:
 * 1. Acesse: https://console.cloud.google.com/
 * 2. Crie um projeto ou selecione um existente
 * 3. Ative a "Places API"
 * 4. Crie uma chave de API em "Credenciais"
 * 5. Substitua 'YOUR_API_KEY' abaixo pela sua chave
 * 6. Substitua 'YOUR_PLACE_ID' pelo Place ID do estabelecimento
 * 
 * Para encontrar o Place ID:
 * - Acesse: https://developers.google.com/maps/documentation/places/web-service/place-id
 * - Ou use: https://www.google.com/maps e procure pelo endereço
 */

class GoogleReviews {
  constructor() {
    // As chaves serão carregadas do backend
    this.apiKey = '';
    this.placeId = '';
    this.maxReviews = 6; // Número máximo de avaliações para exibir
    
    this.reviewsContainer = document.querySelector('.cards-avaliacoes');
    this.loadConfigFromBackend().then(() => this.init());
  }
  
  async loadConfigFromBackend() {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      
      if (data.success) {
        this.apiKey = data.apiKey || '';
        this.placeId = data.placeId || '';
        
        if (!this.apiKey || !this.placeId) {
          console.warn('Google Reviews: Chaves API não configuradas no backend');
        }
      } else {
        console.warn('Google Reviews: Erro ao carregar configuração do backend');
      }
    } catch (error) {
      console.warn('Google Reviews: Não foi possível conectar ao backend. Usando valores padrão.', error);
      // Fallback: tentar usar valores padrão se o backend não estiver disponível
      this.apiKey = '';
      this.placeId = '';
    }
  }

  async init() {
    if (!this.apiKey || this.apiKey === '') {
      console.warn('Google Reviews: Chave de API não configurada');
      this.showErrorMessage('Avaliações do Google não configuradas. Configure a chave de API no backend.');
      return;
    }

    if (!this.placeId || this.placeId === '') {
      console.warn('Google Reviews: Place ID não configurado');
      this.showErrorMessage('Place ID não configurado. Configure o Place ID no backend.');
      return;
    }

    try {
      await this.fetchReviews();
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      this.showErrorMessage('Não foi possível carregar as avaliações do Google.');
    }
  }

  async fetchReviews() {
    // Usando Google Places API (New)
    const url = `https://places.googleapis.com/v1/places/${this.placeId}?fields=id,displayName,rating,userRatingCount,reviews&key=${this.apiKey}`;
    
    // Alternativa: Google Places API (Legacy) - descomente se a nova API não funcionar
    // const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.placeId}&fields=name,rating,user_ratings_total,reviews&key=${this.apiKey}&language=pt-BR`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Para a nova API
      if (data.reviews && data.reviews.length > 0) {
        this.displayReviews(data.reviews, data.rating, data.userRatingCount);
      }
      // Para a API legada (descomente se necessário)
      // else if (data.result && data.result.reviews) {
      //   this.displayReviews(data.result.reviews, data.result.rating, data.result.user_ratings_total);
      // }
      else {
        this.showErrorMessage('Nenhuma avaliação encontrada.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      
      // Tentar API legada como fallback
      await this.fetchReviewsLegacy();
    }
  }

  async fetchReviewsLegacy() {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.placeId}&fields=name,rating,user_ratings_total,reviews&key=${this.apiKey}&language=pt-BR`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK' && data.result && data.result.reviews) {
        this.displayReviews(data.result.reviews, data.result.rating, data.result.user_ratings_total);
      } else {
        this.showErrorMessage('Não foi possível carregar as avaliações.');
      }
    } catch (error) {
      console.error('Erro na API legada:', error);
      this.showErrorMessage('Erro ao conectar com o Google.');
    }
  }

  displayReviews(reviews, averageRating, totalRatings) {
    if (!this.reviewsContainer) return;

    // Limpar avaliações estáticas
    this.reviewsContainer.innerHTML = '';

    // Limitar número de avaliações
    const reviewsToShow = reviews.slice(0, this.maxReviews);

    reviewsToShow.forEach(review => {
      const reviewCard = this.createReviewCard(review);
      this.reviewsContainer.appendChild(reviewCard);
    });

    // Atualizar rating no Schema.org
    this.updateSchemaRating(averageRating, totalRatings);

    // Adicionar indicador de avaliações reais
    this.addReviewsBadge(averageRating, totalRatings);
  }

  createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'card-avaliacao';

    // Nome do autor (pode estar truncado por privacidade)
    const authorName = review.authorAttribution?.displayName || 
                       review.author_name || 
                       'Avaliador do Google';
    
    // Foto do autor (pode não estar disponível)
    const authorPhoto = review.profilePhotoUrl || 
                        review.profile_photo_url || 
                        'https://ui-avatars.com/api/?name=' + encodeURIComponent(authorName) + '&background=722F37&color=fff&size=128';

    // Texto da avaliação
    const reviewText = review.text?.text || 
                       review.text || 
                       review.comment || 
                       'Avaliação sem texto.';

    // Rating
    const rating = review.rating || review.rating || 5;
    const stars = this.generateStars(rating);

    // Data (formato pode variar)
    const reviewTime = review.publishTime || review.time || null;
    const dateText = reviewTime ? this.formatDate(reviewTime) : '';

    card.innerHTML = `
      <div class="perfil-paciente">
        <img src="${authorPhoto}" alt="Foto de ${authorName}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=722F37&color=fff&size=128'">
        <div>
          <h4>${this.escapeHtml(authorName)}</h4>
          <div class="estrelas">${stars}</div>
          ${dateText ? `<span class="review-date">${dateText}</span>` : ''}
        </div>
      </div>
      <p>${this.escapeHtml(reviewText)}</p>
    `;

    return card;
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
      stars += '★';
    }
    
    if (hasHalfStar && fullStars < 5) {
      stars += '½';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars += '☆';
    }

    return stars;
  }

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Hoje';
      if (diffDays === 1) return 'Ontem';
      if (diffDays < 30) return `Há ${diffDays} dias`;
      if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `Há ${months} ${months === 1 ? 'mês' : 'meses'}`;
      }
      
      return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
    } catch (e) {
      return '';
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  updateSchemaRating(rating, count) {
    const schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (schemaScript) {
      try {
        const schema = JSON.parse(schemaScript.textContent);
        if (schema.aggregateRating) {
          schema.aggregateRating.ratingValue = rating.toString();
          schema.aggregateRating.reviewCount = count.toString();
          schemaScript.textContent = JSON.stringify(schema, null, 2);
        }
      } catch (e) {
        console.warn('Não foi possível atualizar o Schema.org');
      }
    }
  }

  addReviewsBadge(rating, count) {
    const section = document.querySelector('.avaliacoes');
    if (!section) return;

    // Verificar se o badge já existe
    let badge = document.querySelector('.google-reviews-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'google-reviews-badge';
      const subtitle = document.querySelector('.subtitulo-avaliacoes');
      if (subtitle) {
        subtitle.insertAdjacentElement('afterend', badge);
      }
    }

    badge.innerHTML = `
      <div class="reviews-badge-content">
        <span class="google-logo">⭐</span>
        <span class="rating-text">
          <strong>${rating.toFixed(1)}</strong> de 5 estrelas
          <span class="review-count">(${count} avaliações)</span>
        </span>
      </div>
    `;
  }

  showErrorMessage(message) {
    if (!this.reviewsContainer) return;
    
    this.reviewsContainer.innerHTML = `
      <div class="reviews-error" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
        <p>${message}</p>
        <p style="font-size: 0.9em; margin-top: 10px;">
          As avaliações estáticas continuarão sendo exibidas.
        </p>
      </div>
    `;
  }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // new GoogleReviews(); // Descomente após configurar a API
  });
} else {
  // new GoogleReviews(); // Descomente após configurar a API
}


