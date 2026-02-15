// ===================================
// LOAD DYNAMIC CONTENT (ADMIN CHANGES)
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Load all saved content
    const contentFields = {
        'heroTitle': 'heroTitle',
        'heroSubtitle': 'heroSubtitle',
        'aboutTitle': 'aboutTitle',
        'feature1Title': 'feature1Title',
        'feature1Desc': 'feature1Desc',
        'feature2Title': 'feature2Title',
        'feature2Desc': 'feature2Desc',
        'feature3Title': 'feature3Title',
        'feature3Desc': 'feature3Desc',
        'contactLabel': 'contactLabel',
        'contactTitle': 'contactTitle',
        'contactDesc': 'contactDesc',
        'benefit1': 'benefit1',
        'benefit2': 'benefit2',
        'benefit3': 'benefit3',
        'benefit4': 'benefit4'
    };

    // Update text content
    Object.keys(contentFields).forEach(key => {
        const saved = localStorage.getItem(key);
        if (saved) {
            const element = document.getElementById(key);
            if (element) {
                element.innerHTML = saved;
            }
        }
    });

    // Update About section (paragraphs)
    const aboutPara1 = localStorage.getItem('aboutPara1');
    const aboutPara2 = localStorage.getItem('aboutPara2');
    const aboutDiv = document.getElementById('aboutContent');

    if (aboutDiv && (aboutPara1 || aboutPara2)) {
        let html = '';
        if (aboutPara1) html += `<p>${aboutPara1}</p>`;
        if (aboutPara2) html += `<p>${aboutPara2}</p>`;
        aboutDiv.innerHTML = html;
    }

    // Update Photo
    const savedPhoto = localStorage.getItem('heroImage');
    if (savedPhoto) {
        const heroImg = document.getElementById('heroImage');
        if (heroImg) heroImg.src = savedPhoto;
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

// Contact form handling removed to allow native form submission
// See index.html for form action configuration
console.log('✅ Form submission handler: Native browser submission enabled');
console.log('Form will POST to FormSubmit.co when submitted');

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
