// Slide Navigation Controller
class SlideController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = document.querySelectorAll('.slide').length;
        this.slides = document.querySelectorAll('.slide');
        this.isAnimating = false;

        this.init();
    }

    init() {
        // Update total pages display
        document.getElementById('totalPages').textContent = this.totalSlides;

        // Create dot indicators
        this.createDots();

        // Bind navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.prevSlide());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Touch/swipe support
        this.initTouchSupport();

        // Mouse wheel support
        this.initWheelSupport();

        // Click on slide to advance (optional)
        document.getElementById('slidesContainer').addEventListener('click', (e) => {
            // Only advance if clicking on empty space, not interactive elements
            if (e.target.closest('button, a, input')) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX > rect.width / 2) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        });

        // Update initial state
        this.updateUI();
    }

    createDots() {
        const dotsContainer = document.getElementById('slideDots');
        for (let i = 1; i <= this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 1 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
        }
    }

    initTouchSupport() {
        let touchStartX = 0;
        let touchStartY = 0;

        const container = document.getElementById('slidesContainer');

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Horizontal swipe detection (minimum 50px)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }, { passive: true });
    }

    initWheelSupport() {
        let wheelTimeout = null;

        document.addEventListener('wheel', (e) => {
            if (wheelTimeout) return;

            wheelTimeout = setTimeout(() => {
                wheelTimeout = null;
            }, 500);

            if (e.deltaY > 0) {
                this.nextSlide();
            } else if (e.deltaY < 0) {
                this.prevSlide();
            }
        }, { passive: true });
    }

    nextSlide() {
        if (this.isAnimating || this.currentSlide >= this.totalSlides) return;
        this.goToSlide(this.currentSlide + 1);
    }

    prevSlide() {
        if (this.isAnimating || this.currentSlide <= 1) return;
        this.goToSlide(this.currentSlide - 1);
    }

    goToSlide(n) {
        if (this.isAnimating || n < 1 || n > this.totalSlides || n === this.currentSlide) return;

        this.isAnimating = true;

        // Remove active class from current slide
        this.slides[this.currentSlide - 1].classList.remove('active');
        this.slides[this.currentSlide - 1].classList.add(n > this.currentSlide ? 'exit-left' : 'exit-right');

        // Update current slide
        this.currentSlide = n;

        // Add active class to new slide
        this.slides[this.currentSlide - 1].classList.add('active');

        // Update UI
        this.updateUI();

        // Clean up animation classes
        setTimeout(() => {
            this.slides.forEach(slide => {
                slide.classList.remove('exit-left', 'exit-right');
            });
            this.isAnimating = false;
        }, 400);
    }

    updateUI() {
        // Update page indicator
        document.getElementById('currentPage').textContent = this.currentSlide;

        // Update progress bar
        const progress = ((this.currentSlide - 1) / (this.totalSlides - 1)) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;

        // Update dots
        const dots = document.querySelectorAll('.slide-dots .dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide - 1);
        });

        // Update navigation buttons
        document.getElementById('prevBtn').disabled = this.currentSlide === 1;
        document.getElementById('nextBtn').disabled = this.currentSlide === this.totalSlides;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new SlideController();
});
