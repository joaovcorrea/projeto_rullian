/**
 * google-reviews.js (client)
 * Agora este arquivo consome o endpoint seguro '/api/reviews' que roda no servidor.
 * Remova quaisquer chaves deste arquivo — a chave fica no servidor (variáveis de ambiente).
 */

class GoogleReviewsClient {
  constructor() {
    this.maxReviews = 6;
    this.reviewsContainer = document.querySelector('.cards-avaliacoes');
    this.init();
  }

  async init() {
    try {
      await this.fetchReviews();
    } catch (error) {
      console.error('Erro ao buscar avaliações (client):', error);
      this.showErrorMessage('Não foi possível carregar as avaliações do Google.');
    }
  }

  async fetchReviews() {
    const url = '/api/reviews';
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();

      if (data.reviews && data.reviews.length > 0) {
        this.displayReviews(data.reviews, data.rating, data.userRatingCount);
      } else {
        this.showErrorMessage('Nenhuma avaliação encontrada.');
      }
    } catch (err) {
      console.error('Erro ao buscar reviews do servidor:', err);
      this.showErrorMessage('Erro ao carregar avaliações.');
    }
  }

  displayReviews(reviews, averageRating, totalRatings) {
    if (!this.reviewsContainer) return;

    this.reviewsContainer.innerHTML = '';
    const reviewsToShow = reviews.slice(0, this.maxReviews);

    reviewsToShow.forEach(review => {
      const card = this.createReviewCard(review);
      this.reviewsContainer.appendChild(card);
    });

    this.updateSchemaRating(averageRating, totalRatings);
    this.addReviewsBadge(averageRating, totalRatings);
  }

  createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'card-avaliacao';

    const authorName = review.author_name || 'Avaliador do Google';
    const authorPhoto = review.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=722F37&color=fff&size=128`;
    const reviewText = review.text || 'Avaliação sem texto.';
    const rating = review.rating || 5;
    const stars = this.generateStars(rating);
    const dateText = review.time ? this.formatDate(review.time) : '';

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

    for (let i = 0; i < fullStars; i++) stars += '★';
    if (hasHalfStar && fullStars < 5) stars += '½';
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) stars += '☆';

    return stars;
  }

  formatDate(dateString) {
    try {
      const date = new Date(dateString * 1000 || dateString);
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
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    if (!scripts || scripts.length === 0) return;
    try {
      // Atualiza o primeiro schema que contenha aggregateRating
      scripts.forEach(s => {
        try {
          const schema = JSON.parse(s.textContent);
          if (schema.aggregateRating) {
            schema.aggregateRating.ratingValue = rating.toString();
            schema.aggregateRating.reviewCount = (count || 0).toString();
            s.textContent = JSON.stringify(schema, null, 2);
          }
        } catch (e) { /* ignore */ }
      });
    } catch (e) {}
  }

  addReviewsBadge(rating, count) {
    const section = document.querySelector('.avaliacoes');
    if (!section) return;
    let badge = document.querySelector('.google-reviews-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'google-reviews-badge';
      const subtitle = document.querySelector('.subtitulo-avaliacoes');
      if (subtitle) subtitle.insertAdjacentElement('afterend', badge);
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
        <p style="font-size: 0.9em; margin-top: 10px;">As avaliações estáticas continuarão sendo exibidas.</p>
      </div>
    `;
  }
}

// Inicializar cliente de reviews sem expor chaves
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new GoogleReviewsClient();
  });
} else {
  new GoogleReviewsClient();
}


