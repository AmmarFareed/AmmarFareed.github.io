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
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
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

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate form submission
    const formData = new FormData(contactForm);
    console.log('Form submitted:', Object.fromEntries(formData));
    
    // Show success toast
    toastMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
    toast.classList.remove('translate-y-24', 'opacity-0');
    
    // Reset form
    contactForm.reset();
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0');
    }, 3000);
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

// Add parallax effect to hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.absolute.inset-0.overflow-hidden');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
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