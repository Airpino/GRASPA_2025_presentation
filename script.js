// Presentation functionality
class Presentation {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.slideCounter = document.getElementById('slide-counter');
        this.progress = document.getElementById('progress');
        
        this.init();
    }
    
    init() {
        this.updateSlideDisplay();
        this.bindEvents();
        this.updateProgress();
    }
    
    bindEvents() {
        // Button events
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        });
        
        // Touch events for mobile
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Horizontal swipe threshold
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            startX = 0;
            startY = 0;
        });
        
        // Handle browser navigation
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.slide !== undefined) {
                this.goToSlide(e.state.slide);
            }
        });
    }
    
    updateSlideDisplay() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        this.slideCounter.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
        
        // Update button states
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        
        // Update URL without page reload
        const url = new URL(window.location);
        url.searchParams.set('slide', this.currentSlide + 1);
        history.replaceState({ slide: this.currentSlide }, '', url);
    }
    
    updateProgress() {
        const progressPercent = ((this.currentSlide + 1) / this.totalSlides) * 100;
        this.progress.style.width = `${progressPercent}%`;
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateSlideDisplay();
            this.updateProgress();
            this.animateSlideTransition();
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlideDisplay();
            this.updateProgress();
            this.animateSlideTransition();
        }
    }
    
    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.totalSlides) {
            this.currentSlide = slideIndex;
            this.updateSlideDisplay();
            this.updateProgress();
            this.animateSlideTransition();
        }
    }
    
    animateSlideTransition() {
        const activeSlide = this.slides[this.currentSlide];
        activeSlide.style.animation = 'none';
        activeSlide.offsetHeight; // Trigger reflow
        activeSlide.style.animation = 'slideIn 0.5s ease-in-out';
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new Presentation();
    
    // Check URL for initial slide
    const urlParams = new URLSearchParams(window.location.search);
    const slideParam = urlParams.get('slide');
    if (slideParam) {
        const slideIndex = parseInt(slideParam) - 1;
        if (slideIndex >= 0 && slideIndex < presentation.totalSlides) {
            presentation.goToSlide(slideIndex);
        }
    }
    
    // Add some helpful console messages
    console.log('🎤 GRASPA 2025 Presentation loaded!');
    console.log('📋 Controls:');
    console.log('  • Arrow keys or Space: Navigate slides');
    console.log('  • Home/End: Go to first/last slide');
    console.log('  • Escape: Toggle fullscreen');
    console.log('  • Swipe on mobile devices');
});

// Add some utility functions
window.presentationUtils = {
    // Function to print all slides
    printSlides: () => {
        window.print();
    },
    
    // Function to get current slide info
    getCurrentSlideInfo: () => {
        const activeSlide = document.querySelector('.slide.active');
        const slideId = activeSlide ? activeSlide.id : null;
        const slideNumber = document.getElementById('slide-counter').textContent;
        return { slideId, slideNumber };
    },
    
    // Function to export slide URLs
    getSlideUrls: () => {
        const baseUrl = window.location.origin + window.location.pathname;
        const slides = document.querySelectorAll('.slide');
        return Array.from(slides).map((slide, index) => {
            return `${baseUrl}?slide=${index + 1}`;
        });
    }
};