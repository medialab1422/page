class Carousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Carousel container not found: ${containerId}`);
            return;
        }
        this.slides = Array.from(this.container.querySelectorAll('.carousel-slide'));
        this.currentIndex = 0;

        if (this.slides.length === 0) {
            console.warn(`No slides found for carousel: ${containerId}`);
            return;
        }

        this.initControls();
        this.showSlide(this.currentIndex);
        this.startAutoPlay();
    }

    initControls() {
        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-nav prev';
        prevButton.innerHTML = '&#10094;'; // Left arrow
        prevButton.addEventListener('click', () => this.prevSlide());
        this.container.appendChild(prevButton);

        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-nav next';
        nextButton.innerHTML = '&#10095;'; // Right arrow
        nextButton.addEventListener('click', () => this.nextSlide());
        this.container.appendChild(nextButton);
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(this.currentIndex);
        this.resetAutoPlay();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentIndex);
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Carousel('research-carousel');
    new Carousel('members-carousel');
});