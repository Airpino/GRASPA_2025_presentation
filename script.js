// GRASPA 2025 Presentation JavaScript
let currentSlide = 1;
const totalSlides = 4;

function showSlide(slideNumber) {
    // Hide all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show the requested slide
    const targetSlide = document.getElementById(`slide-${slideNumber}`);
    if (targetSlide) {
        targetSlide.classList.add('active');
        currentSlide = slideNumber;
        updateSlideCounter();
    }
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        showSlide(currentSlide - 1);
    }
}

function updateSlideCounter() {
    const currentSlideElement = document.getElementById('current-slide');
    const totalSlidesElement = document.getElementById('total-slides');
    
    if (currentSlideElement) {
        currentSlideElement.textContent = currentSlide;
    }
    if (totalSlidesElement) {
        totalSlidesElement.textContent = totalSlides;
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowRight':
        case ' ': // Spacebar
            event.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
            event.preventDefault();
            prevSlide();
            break;
        case 'Home':
            event.preventDefault();
            showSlide(1);
            break;
        case 'End':
            event.preventDefault();
            showSlide(totalSlides);
            break;
        case 'Escape':
            // Exit fullscreen if in fullscreen mode
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
        case 'f':
        case 'F':
            // Toggle fullscreen
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
            break;
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - next slide
            nextSlide();
        } else {
            // Swiped right - previous slide
            prevSlide();
        }
    }
}

// Initialize presentation
document.addEventListener('DOMContentLoaded', function() {
    showSlide(1);
    
    // Add keyboard shortcut help
    console.log('Keyboard shortcuts:');
    console.log('→ or Space: Next slide');
    console.log('←: Previous slide');
    console.log('Home: First slide');
    console.log('End: Last slide');
    console.log('F: Toggle fullscreen');
    console.log('Esc: Exit fullscreen');
});