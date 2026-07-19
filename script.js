// Cursor-Reactive Animated Background
(function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Mouse position (defaults to center of screen)
    const mouse = { x: width / 2, y: height / 2 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    // Glowing orbs, each with its own parallax depth and idle drift
    const orbs = [
        { baseX: 0.18, baseY: 0.25, radius: 380, color: 'rgba(118, 75, 162, 0.30)', depth: 0.06, driftSpeed: 0.00035, driftRadius: 60, angle: 0 },
        { baseX: 0.82, baseY: 0.20, radius: 420, color: 'rgba(59, 130, 246, 0.24)', depth: 0.05, driftSpeed: 0.00028, driftRadius: 70, angle: 2 },
        { baseX: 0.75, baseY: 0.75, radius: 340, color: 'rgba(147, 51, 234, 0.22)', depth: 0.08, driftSpeed: 0.0004, driftRadius: 50, angle: 4 },
        { baseX: 0.20, baseY: 0.80, radius: 300, color: 'rgba(99, 102, 241, 0.22)', depth: 0.07, driftSpeed: 0.00032, driftRadius: 55, angle: 1 },
        { baseX: 0.50, baseY: 0.50, radius: 260, color: 'rgba(139, 92, 246, 0.18)', depth: 0.1, driftSpeed: 0.00045, driftRadius: 40, angle: 3 }
    ];

    orbs.forEach(orb => { orb.x = orb.baseX * width; orb.y = orb.baseY * height; });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;
        const mouseOffsetX = mouse.x - centerX;
        const mouseOffsetY = mouse.y - centerY;

        orbs.forEach(orb => {
            orb.angle += orb.driftSpeed * 16;
            const driftX = Math.cos(orb.angle) * orb.driftRadius;
            const driftY = Math.sin(orb.angle) * orb.driftRadius;

            const targetX = orb.baseX * width + mouseOffsetX * orb.depth + driftX;
            const targetY = orb.baseY * height + mouseOffsetY * orb.depth + driftY;

            // Smooth easing toward target position
            orb.x += (targetX - orb.x) * 0.04;
            orb.y += (targetY - orb.y) * 0.04;

            const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
            gradient.addColorStop(0, orb.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(orb.x - orb.radius, orb.y - orb.radius, orb.radius * 2, orb.radius * 2);
        });

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();

// Initialize Lucide Icons
lucide.createIcons();

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('hidden')) {
        icon.setAttribute('data-lucide', 'menu');
    } else {
        icon.setAttribute('data-lucide', 'x');
    }
    lucide.createIcons();
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-gray-900/95', 'backdrop-blur-lg', 'shadow-lg');
    } else {
        navbar.classList.remove('bg-gray-900/95', 'backdrop-blur-lg', 'shadow-lg');
    }
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate skill bars if this is the skills section
            const skillBars = entry.target.querySelectorAll('.skill-bar');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
            });

            // Reveal once, then stop watching for performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale').forEach(el => {
    observer.observe(el);
});

// Close mobile menu when clicking on a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
});

// Smooth scroll for anchor links
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

// Re-initialize icons after any dynamic content changes
window.addEventListener('load', () => {
    lucide.createIcons();
});

// Project screenshots carousels (infinite loop, supports multiple instances)
document.querySelectorAll('.project-carousel-wrapper').forEach((carousel) => {
    const track = carousel.querySelector('.project-carousel-track');
    const prevBtn = carousel.querySelector('.project-carousel-arrow.prev');
    const nextBtn = carousel.querySelector('.project-carousel-arrow.next');

    if (!track || !prevBtn || !nextBtn) return;

    const originalSlides = Array.from(track.children);
    if (originalSlides.length <= 1) return;

    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

    track.insertBefore(lastClone, originalSlides[0]);
    track.appendChild(firstClone);

    let currentIndex = 1;
    let isAnimating = false;

    const getStepWidth = () => {
        const currentSlide = track.children[currentIndex];
        const nextSlide = track.children[currentIndex + 1];
        if (!currentSlide) return 0;
        const currentRect = currentSlide.getBoundingClientRect();
        if (!nextSlide) return currentRect.width;
        const nextRect = nextSlide.getBoundingClientRect();
        return nextRect.left - currentRect.left;
    };

    const updatePosition = (withAnimation = true) => {
        const step = getStepWidth();
        track.style.transition = withAnimation ? 'transform 0.45s ease' : 'none';
        track.style.transform = `translateX(-${currentIndex * step}px)`;
    };

    const goTo = (direction) => {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex += direction;
        updatePosition(true);
    };

    nextBtn.addEventListener('click', () => goTo(1));
    prevBtn.addEventListener('click', () => goTo(-1));

    track.addEventListener('transitionend', () => {
        const total = track.children.length;

        if (currentIndex === total - 1) {
            currentIndex = 1;
            updatePosition(false);
        } else if (currentIndex === 0) {
            currentIndex = total - 2;
            updatePosition(false);
        }

        // Force reflow so transition can re-apply on next click after a no-transition jump.
        void track.offsetWidth;
        track.style.transition = 'transform 0.45s ease';
        isAnimating = false;
    });

    window.addEventListener('resize', () => {
        updatePosition(false);
    });

    updatePosition(false);
});

// Certificate preview modal
const certificateModal = document.getElementById('certificate-modal');
const certificateCloseBtn = document.getElementById('certificate-close-btn');
const certificateModalImage = document.getElementById('certificate-modal-image');
const certificateModalPdf = document.getElementById('certificate-modal-pdf');
const certificateOpenButtons = document.querySelectorAll('[data-certificate-image]');

if (certificateModal && certificateCloseBtn && certificateModalImage && certificateOpenButtons.length > 0) {
    certificateOpenButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const certificateSrc = button.getAttribute('data-certificate-image');
            const certificateAlt = button.getAttribute('data-certificate-alt') || 'Certificate preview';
            const isPdf = certificateSrc?.toLowerCase().endsWith('.pdf');

            if (isPdf && certificateModalPdf) {
                certificateModalImage.classList.add('hidden');
                certificateModalPdf.classList.remove('hidden');
                certificateModalPdf.src = certificateSrc;
                certificateModalPdf.title = certificateAlt;
            } else {
                if (certificateModalPdf) {
                    certificateModalPdf.classList.add('hidden');
                    certificateModalPdf.src = '';
                }
                certificateModalImage.classList.remove('hidden');
                if (certificateSrc) {
                    certificateModalImage.src = certificateSrc;
                }
                certificateModalImage.alt = certificateAlt;
            }

            certificateModal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        });
    });

    const closeCertificateModal = () => {
        certificateModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        if (certificateModalPdf) {
            certificateModalPdf.src = '';
        }
    };

    certificateCloseBtn.addEventListener('click', closeCertificateModal);

    certificateModal.addEventListener('click', (e) => {
        if (e.target === certificateModal) {
            closeCertificateModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !certificateModal.classList.contains('hidden')) {
            closeCertificateModal();
        }
    });
}