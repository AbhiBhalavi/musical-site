// Add interactive elements and animations
document.addEventListener('DOMContentLoaded', () => {
    // Parallax effect for floating shapes
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        shapes.forEach(shape => {
            const speed = parseFloat(shape.getAttribute('data-speed') || 2);
            const moveX = (x * speed) * 100;
            const moveY = (y * speed) * 100;
            shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // Add hover effect to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Random shape movement
    setInterval(() => {
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach(shape => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            shape.style.transform = `translate(${randomX}px, ${randomY}px)`;
        });
    }, 3000);
});

// Add to your existing script
function updateTime() {
    const timeElement = document.getElementById('live-time');
    if (!timeElement) return;
    
    const now = new Date();
    
    // Format the time in 12-hour format
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    hours = hours.toString().padStart(2, '0');
    
    // Update the display with 12-hour time
    timeElement.innerHTML = `<span>${hours}:${minutes}:${seconds} ${ampm}</span>`;
}

// Make sure DOM is loaded before starting the timer
document.addEventListener('DOMContentLoaded', () => {
    updateTime(); // Initial call
    setInterval(updateTime, 1000); // Update every second
});

function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const items = Array.from(document.querySelectorAll('.carousel-item'));
    let currentIndex = 0;
    const visibleCards = 7;
    let isAnimating = false;

    function updateCards() {
        items.forEach((item, index) => {
            const offset = index - currentIndex;
            const absOffset = Math.abs(offset);
            
            if (absOffset <= Math.floor(visibleCards / 2)) {
                item.classList.add('visible');
                const xPos = offset * 120;
                const zPos = -Math.abs(offset) * 50;
                const scale = 1 - (absOffset * 0.15);
                const rotation = offset * 5;
                
                item.style.transform = `
                    translate3d(${xPos}px, 0, ${zPos}px) 
                    rotateY(${rotation}deg) 
                    scale(${scale})
                `;
                item.style.zIndex = visibleCards - absOffset;
                
                if (index === currentIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            } else {
                item.classList.remove('visible', 'active');
                const farOffset = offset > 0 ? 1 : -1;
                item.style.transform = `
                    translate3d(${farOffset * 1000}px, 0, -1000px) 
                    rotateY(${offset * 50}deg)
                `;
            }
        });
    }

    function rotateCards(direction) {
        if (isAnimating) return; // Prevent rapid clicking
        isAnimating = true;
        
        currentIndex = (currentIndex + direction + items.length) % items.length;
        updateCards();
        
        // Reset animation lock after transition
        setTimeout(() => {
            isAnimating = false;
        }, 600); // Match transition duration
    }

    // Debounced wheel navigation
    let wheelTimeout;
    let lastWheelTime = Date.now();
    carousel.addEventListener('wheel', (e) => {
        e.preventDefault();
        const now = Date.now();
        if (now - lastWheelTime < 100) return; // Prevent rapid scrolling
        
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            rotateCards(e.deltaY > 0 ? 1 : -1);
            lastWheelTime = now;
        }, 50);
    });

    // Button navigation with debounce
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    prevBtn.addEventListener('click', () => !isAnimating && rotateCards(-1));
    nextBtn.addEventListener('click', () => !isAnimating && rotateCards(1));

    // Improved touch support
    let touchStartX = 0;
    let touchStartTime = 0;
    let isSwiping = false;

    carousel.addEventListener('touchstart', (e) => {
        if (isAnimating) return;
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
        isSwiping = true;
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        e.preventDefault();
    });

    carousel.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndTime = Date.now();
        
        const diff = touchStartX - touchEndX;
        const timeDiff = touchEndTime - touchStartTime;
        
        if (Math.abs(diff) > 50 && timeDiff < 300) {
            rotateCards(diff > 0 ? 1 : -1);
        }
        
        isSwiping = false;
    });

    // Auto rotation with pause on interaction
    let autoRotateInterval;
    
    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            if (!isAnimating) rotateCards(1);
        }, 3000);
    }

    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }

    carousel.addEventListener('mouseenter', stopAutoRotate);
    carousel.addEventListener('mouseleave', startAutoRotate);
    carousel.addEventListener('touchstart', stopAutoRotate);
    carousel.addEventListener('touchend', startAutoRotate);

    // Initial setup
    updateCards();
    startAutoRotate();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCarousel);

// Add smooth scrolling for navigation
document.querySelector('nav a[href=".animated-content"]').addEventListener('click', function(e) {
    e.preventDefault();
    const animatedContent = document.querySelector('.animated-content');
    animatedContent.scrollIntoView({ behavior: 'smooth' });
}); 