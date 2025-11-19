// ===== LIGHTBOX =====
class Lightbox {
  constructor() {
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.getElementById('lightboxImg');
    this.closeBtn = document.getElementById('closeBtn');
    this.prevBtn = document.getElementById('lightboxPrev');
    this.nextBtn = document.getElementById('lightboxNext');
    this.counter = document.getElementById('lightboxCounter');
    this.images = [];
    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.collectImages();
    this.closeBtn.addEventListener('click', () => this.close());
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());
    
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'ArrowLeft') {
        this.prev();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG' && e.target.closest('.carousel-slide')) {
        const imgSrc = e.target.src;
        const index = this.images.findIndex(img => img === imgSrc);
        if (index !== -1) {
          this.open(index);
        }
      }
    });

    this.setupTouchEvents();
  }

  collectImages() {
    const carouselSlides = document.querySelectorAll('.carousel-slide img');
    carouselSlides.forEach(img => {
      const imgSrc = img.src || img.getAttribute('data-src');
      if (imgSrc && !this.images.includes(imgSrc)) {
        this.images.push(imgSrc);
      }
    });
    
    if (this.images.length === 0) {
      setTimeout(() => this.collectImages(), 500);
    }
  }

  open(index) {
    if (index < 0 || index >= this.images.length) return;
    this.currentIndex = index;
    this.lightboxImg.src = this.images[index];
    this.lightboxImg.alt = `Imagem ${index + 1} de ${this.images.length}`;
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.updateCounter();
    this.updateButtons();
    
    this.lightboxImg.classList.remove('loaded');
    setTimeout(() => {
      this.lightboxImg.classList.add('loaded');
    }, 50);
  }

  close() {
    this.lightbox.classList.remove('active');
    this.lightboxImg.classList.remove('loaded');
    document.body.style.overflow = '';
  }

  prev() {
    const newIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.currentIndex = newIndex;
    this.lightboxImg.classList.remove('loaded');
    
    setTimeout(() => {
      this.lightboxImg.src = this.images[newIndex];
      this.lightboxImg.alt = `Imagem ${newIndex + 1} de ${this.images.length}`;
      this.updateCounter();
      this.updateButtons();
      setTimeout(() => {
        this.lightboxImg.classList.add('loaded');
      }, 50);
    }, 150);
  }

  next() {
    const newIndex = (this.currentIndex + 1) % this.images.length;
    this.currentIndex = newIndex;
    this.lightboxImg.classList.remove('loaded');
    
    setTimeout(() => {
      this.lightboxImg.src = this.images[newIndex];
      this.lightboxImg.alt = `Imagem ${newIndex + 1} de ${this.images.length}`;
      this.updateCounter();
      this.updateButtons();
      setTimeout(() => {
        this.lightboxImg.classList.add('loaded');
      }, 50);
    }, 150);
  }

  updateCounter() {
    if (this.counter && this.images.length > 1) {
      this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
      this.counter.style.display = 'block';
    } else {
      this.counter.style.display = 'none';
    }
  }

  updateButtons() {
    if (this.images.length > 1) {
      this.prevBtn.style.display = 'flex';
      this.nextBtn.style.display = 'flex';
    } else {
      this.prevBtn.style.display = 'none';
      this.nextBtn.style.display = 'none';
    }
  }

  setupTouchEvents() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    this.lightboxImg.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    this.lightboxImg.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    });

    this.lightboxImg.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - currentX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    });
  }
}

let lightboxInstance;
function initLightbox() {
  lightboxInstance = new Lightbox();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLightbox);
} else {
  initLightbox();
}

// ===== CAROUSEL =====
class Carousel {
  constructor(container) {
    this.container = container;
    this.wrapper = container.querySelector('.carousel-wrapper');
    this.slides = container.querySelectorAll('.carousel-slide');
    this.prevBtn = container.querySelector('.carousel-prev');
    this.nextBtn = container.querySelector('.carousel-next');
    this.dotsContainer = container.querySelector('.carousel-dots');
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.isTransitioning = false;
    this.autoplayInterval = null;
    this.init();
  }

  init() {
    this.createDots();
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    this.setupTouchEvents();
    
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    this.startAutoplay();
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());
    this.updateCarousel();
  }

  createDots() {
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
  }

  updateCarousel() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const offset = -this.currentIndex * 100;
    this.wrapper.style.transform = `translateX(${offset}%)`;

    const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });

    this.prevBtn.classList.toggle('disabled', this.currentIndex === 0);
    this.nextBtn.classList.toggle('disabled', this.currentIndex === this.totalSlides - 1);

    setTimeout(() => {
      this.isTransitioning = false;
    }, 300);
  }

  nextSlide() {
    if (this.isTransitioning) return;
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateCarousel();
  }

  prevSlide() {
    if (this.isTransitioning) return;
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentIndex) return;
    this.currentIndex = index;
    this.updateCarousel();
  }

  setupTouchEvents() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    this.wrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.stopAutoplay();
    });

    this.wrapper.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    });

    this.wrapper.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - currentX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
      this.startAutoplay();
    });
  }

  startAutoplay() {
    this.stopAutoplay();
    // Desabilitar autoplay no mobile para melhor performance
    const isMobile = window.innerWidth <= 768;
    if (!isMobile && this.totalSlides > 1) {
      this.autoplayInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    }
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

function initCarousels() {
  const carousels = document.querySelectorAll('.carousel-container');
  carousels.forEach(container => {
    new Carousel(container);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousels);
} else {
  initCarousels();
}

// ===== WHATSAPP FLOAT =====
function initWhatsAppFloat() {
  const whatsappFloat = document.getElementById('whatsappFloat');
  if (!whatsappFloat) return;

  const isMobile = window.innerWidth <= 768;
  
  // No mobile, apenas adicionar classe visible sem animação periódica
  whatsappFloat.classList.add('visible');
  
  // Apenas no desktop, manter animação periódica
  if (!isMobile) {
    setInterval(() => {
      whatsappFloat.style.animation = 'none';
      setTimeout(() => {
        whatsappFloat.style.animation = 'pulse 2s ease-in-out';
      }, 10);
    }, 4000);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWhatsAppFloat);
} else {
  initWhatsAppFloat();
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const isMobile = window.innerWidth <= 768;
  
  // No mobile, adicionar classe imediatamente sem observer para melhor performance
  if (isMobile) {
    requestAnimationFrame(() => {
      document.querySelectorAll('section, .card, .card-mais, .dif-item, .video-card').forEach(el => {
        el.classList.add('animate-in');
      });
    });
    return;
  }
  
  // Desktop: usar IntersectionObserver otimizado
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Desconectar após animar para melhor performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  requestAnimationFrame(() => {
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });

    document.querySelectorAll('.card, .card-mais, .dif-item, .video-card').forEach(el => {
      observer.observe(el);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  const activeCarousel = document.querySelector('.carousel-container:hover');
  if (activeCarousel && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    e.preventDefault();
  }
});

// ===== SCROLL TO TOP =====
window.addEventListener('load', () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 10);
});

// ===== INSTAGRAM EMBEDS HANDLER =====
(function() {
  'use strict';
  
  let scriptLoaded = false;
  let processingInterval = null;
  
  // Função para configurar iframes criados pelo Instagram
  function configureInstagramIframes() {
    document.querySelectorAll('.instagram-media iframe, .video-wrapper iframe, .card-video iframe, .video-doutor iframe, .video-consultorio iframe').forEach(iframe => {
      if (iframe.src && iframe.src.includes('instagram.com')) {
        // Adicionar atributos necessários para reprodução
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; camera; microphone');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('webkitallowfullscreen', 'true');
        iframe.setAttribute('mozallowfullscreen', 'true');
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('playsinline', 'true');
        
        // Garantir visibilidade
        iframe.style.display = 'block';
        iframe.style.visibility = 'visible';
        iframe.style.opacity = '1';
        iframe.style.width = '100%';
        iframe.style.pointerEvents = 'auto';
        iframe.style.touchAction = 'manipulation';
      }
    });
  }
  
  // Função para processar embeds usando script oficial do Instagram
  function processEmbeds() {
    if (window.instgrm && window.instgrm.Embeds) {
      try {
        window.instgrm.Embeds.process();
        // Configurar iframes após processamento
        setTimeout(configureInstagramIframes, 500);
        setTimeout(configureInstagramIframes, 1500);
      } catch (e) {
        console.log('Erro ao processar embeds:', e);
      }
    }
  }
  
  // Função para carregar script oficial do Instagram
  function loadInstagramScript() {
    if (scriptLoaded || window.instgrm) {
      processEmbeds();
      return;
    }
    
    scriptLoaded = true;
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = function() {
      setTimeout(processEmbeds, 300);
    };
    script.onerror = function() {
      scriptLoaded = false;
      setTimeout(loadInstagramScript, 2000);
    };
    document.body.appendChild(script);
  }
  
  // Carregar script do Instagram (funciona tanto no mobile quanto desktop)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(loadInstagramScript, 200);
    });
  } else {
    setTimeout(loadInstagramScript, 200);
  }
  
  window.addEventListener('load', function() {
    setTimeout(function() {
      if (!window.instgrm) {
        loadInstagramScript();
      } else {
        processEmbeds();
      }
    }, 800);
  });
  
  // Detectar mobile para otimizações
  const isMobile = window.innerWidth <= 768;
  
  // Observer para processar quando elementos ficarem visíveis
  if ('IntersectionObserver' in window) {
    const rootMargin = isMobile ? '50px' : '100px';
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          setTimeout(processEmbeds, isMobile ? 300 : 200);
        }
      });
    }, { threshold: 0.1, rootMargin: rootMargin });
    
    setTimeout(function() {
      document.querySelectorAll('.instagram-media').forEach(function(el) {
        observer.observe(el);
      });
    }, isMobile ? 1500 : 1000);
  }
  
  // Processar periodicamente para garantir que todos sejam processados
  // No mobile, reduzir frequência para melhor performance
  const intervalTime = isMobile ? 4000 : 2000;
  const maxTime = isMobile ? 20000 : 30000;
  
  processingInterval = setInterval(function() {
    const unprocessed = Array.from(document.querySelectorAll('.instagram-media')).filter(function(el) {
      return !el.querySelector('iframe');
    });
    if (unprocessed.length > 0 && window.instgrm) {
      processEmbeds();
    } else if (unprocessed.length === 0) {
      clearInterval(processingInterval);
    }
  }, intervalTime);
  
  setTimeout(function() {
    if (processingInterval) clearInterval(processingInterval);
  }, maxTime);
  
  // Monitorar quando novos iframes são adicionados pelo Instagram
  // No mobile, desabilitar MutationObserver para melhor performance
  if (!isMobile && 'MutationObserver' in window) {
    const iframeObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.tagName === 'IFRAME' || (node.querySelector && node.querySelector('iframe'))) {
            const iframe = node.tagName === 'IFRAME' ? node : node.querySelector('iframe');
            if (iframe && iframe.src && iframe.src.includes('instagram.com')) {
              setTimeout(configureInstagramIframes, 100);
            }
          }
        });
      });
    });
    
    // Observar containers de vídeo
    setTimeout(function() {
      document.querySelectorAll('.video-wrapper.instagram-embed, .card-video, .instagram-media, .video-doutor, .video-consultorio').forEach(function(container) {
        iframeObserver.observe(container, {
          childList: true,
          subtree: false // Otimização: não observar subtree no mobile
        });
      });
    }, 1000);
  }
  
  // Processar quando a página ficar visível
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      setTimeout(processEmbeds, 500);
      setTimeout(configureInstagramIframes, 1000);
    }
  });
})();
