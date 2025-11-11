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
        // Coletar todas as imagens dos carrosséis
        this.collectImages();
        
        this.closeBtn.addEventListener('click', () => this.close());
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        this.lightbox.addEventListener('click', (e) => {
          // Fechar apenas se clicar diretamente no fundo do lightbox
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

        // Event listener para imagens clicáveis
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
        
        // Animação de entrada
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
        
        // Pequeno delay para transição suave
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
        // Sempre mostrar botões se houver mais de uma imagem
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
        // Criar dots
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
        this.autoplayInterval = setInterval(() => {
          this.nextSlide();
        }, 5000);
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

    function initWhatsAppFloat() {
      const whatsappFloat = document.getElementById('whatsappFloat');
      if (!whatsappFloat) return;

      setInterval(() => {
        whatsappFloat.style.animation = 'none';
        setTimeout(() => {
          whatsappFloat.style.animation = 'pulse 2s ease-in-out';
        }, 10);
      }, 4000);

      let lastScroll = 0;
      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 300) {
          whatsappFloat.classList.add('visible');
        } else {
          whatsappFloat.classList.remove('visible');
        }
        
        lastScroll = currentScroll;
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initWhatsAppFloat);
    } else {
      initWhatsAppFloat();
    }

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

    function initScrollAnimations() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, observerOptions);

      document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
      });

      document.querySelectorAll('.card, .card-mais, .dif-item').forEach(el => {
        observer.observe(el);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
      initScrollAnimations();
    }

    document.addEventListener('keydown', (e) => {
      const activeCarousel = document.querySelector('.carousel-container:hover');
      if (activeCarousel && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
      }
    });