// ===================================
// LOAD DYNAMIC CONTENT (ADMIN CHANGES)
// ===================================

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch content from server
    try {
        const response = await fetch('/api/content');
        const data = await response.json();

        // Update basic text fields
        const contentFields = [
            'heroTitle', 'heroSubtitle', 'aboutTitle',
            'feature1Title', 'feature1Desc', 'feature2Title', 'feature2Desc',
            'feature3Title', 'feature3Desc', 'contactLabel', 'contactTitle',
            'contactDesc', 'benefit1', 'benefit2', 'benefit3', 'benefit4'
        ];

        contentFields.forEach(key => {
            const val = data[key];
            if (val) {
                const element = document.getElementById(key);
                if (element) {
                    element.innerHTML = val;
                }
            }
        });

        // Update About section (paragraphs)
        const aboutDiv = document.getElementById('aboutContent');
        if (aboutDiv && (data.aboutPara1 || data.aboutPara2)) {
            let html = '';
            if (data.aboutPara1) html += `<p>${data.aboutPara1}</p>`;
            if (data.aboutPara2) html += `<p>${data.aboutPara2}</p>`;
            aboutDiv.innerHTML = html;
        }

        // Update Photo
        if (data.heroImage) {
            const heroImg = document.getElementById('heroImage');
            if (heroImg) heroImg.src = data.heroImage;
        }
    } catch (err) {
        console.error('Error loading site content:', err);
    }
});

// ===================================
// SMOOTH SCROLLING
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(17, 24, 39, 0.95)';
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
    } else {
        navbar.style.background = 'rgba(17, 24, 39, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ===================================
// ACTIVE NAV LINK ON SCROLL
// ===================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===================================
// CONTACT FORM HANDLING
// ===================================

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', () => {
        // Disable button to prevent double-submit
        if (submitBtn) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Optional: re-enable after timeout just in case the browser cancels navigation
            setTimeout(() => {
                submitBtn.textContent = 'Request Contact →';
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}

// ===================================
// PHONE NUMBER FORMATTING
// ===================================

const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 0) {
        if (value.length <= 3) {
            value = `(${value}`;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }

    e.target.value = value;
});

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.service-card, .about-card, .feature-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// STATS COUNTER ANIMATION
// ===================================

const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = element.dataset.suffix
                ? target + element.dataset.suffix
                : target;
            clearInterval(timer);
        } else {
            element.textContent = element.dataset.suffix
                ? Math.floor(current) + element.dataset.suffix
                : Math.floor(current);
        }
    }, 16);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            const suffix = text.replace(/[\d\s]/g, '');
            entry.target.dataset.suffix = suffix;
            animateCounter(entry.target, number);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
});

// ===================================
// CONSOLE WELCOME MESSAGE
// ===================================

console.log('%c👋 Welcome to David Rinderknecht\'s Homepage',
    'font-size: 20px; font-weight: bold; color: #4285f4;');
console.log('%cMortgage 1 Inc. - Your Trusted Mortgage Partner',
    'font-size: 14px; color: #a855f7;');
console.log('%cInterested in the code? Let\'s connect!',
    'font-size: 12px; color: #888;');
