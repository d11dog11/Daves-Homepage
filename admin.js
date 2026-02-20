// ===================================
// ADMIN LOGIC - MULTI-PAGE
// ===================================

const Admin = {
    // Default content for fallback
    defaults: {
        heroTitle: 'Your Path to <span class="gradient-text">Homeownership</span> Starts Here',
        heroSubtitle: 'Expert mortgage guidance with personalized service. Let\'s turn your dream home into reality with competitive rates and seamless financing solutions.',
        aboutTitle: 'Your Trusted Mortgage Partner',
        aboutPara1: 'With years of experience in the mortgage industry, I\'m dedicated to helping families achieve their homeownership dreams. At Mortgage 1 Inc., NMLS: 129386, I provide personalized service and expert guidance throughout your entire home financing journey.',
        aboutPara2: 'Whether you\'re a first-time homebuyer, looking to refinance, or seeking an investment property loan, I\'ll work tirelessly to find the best mortgage solution tailored to your unique financial situation and goals.',
        feature1Title: 'Professional Excellence',
        feature1Desc: 'Committed to providing exceptional service and expert mortgage advice',
        feature2Title: 'Personalized Approach',
        feature2Desc: 'Every client receives customized solutions for their specific needs',
        feature3Title: 'Fast & Efficient',
        feature3Desc: 'Streamlined process to get you from application to closing quickly',
        contactLabel: 'Let\'s Connect',
        contactTitle: 'Ready to Get Started?',
        contactDesc: 'Take the first step towards your homeownership goals. Fill out the form and I\'ll get back to you within 24 hours to discuss your mortgage options.',
        benefit1: 'Free consultation',
        benefit2: 'No obligation',
        benefit3: 'Quick response time',
        benefit4: 'Personalized service'
    },

    // State
    config: {
        password: localStorage.getItem('adminPassword') || '1234',
        photo: localStorage.getItem('heroImage') || ''
    },

    // Initialize
    init() {
        this.addEventListeners();
        this.checkLogin();
        this.loadContent();

        // Default to Security page on load
        this.switchPage('security');

        if (this.config.photo) {
            document.getElementById('photoPreview').src = this.config.photo;
        }
    },

    loadContent() {
        const fields = ['heroTitle', 'heroSubtitle', 'aboutTitle', 'aboutPara1', 'aboutPara2',
            'feature1Title', 'feature1Desc', 'feature2Title', 'feature2Desc',
            'feature3Title', 'feature3Desc', 'contactLabel', 'contactTitle',
            'contactDesc', 'benefit1', 'benefit2', 'benefit3', 'benefit4'];

        fields.forEach(field => {
            const saved = localStorage.getItem(field);
            const element = document.getElementById(field);
            if (element) {
                element.value = saved || this.defaults[field] || '';
            }
        });
    },

    addEventListeners() {
        // Login
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            sessionStorage.removeItem('isLoggedIn');
            window.location.reload();
        });

        // Page Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetPage = btn.getAttribute('data-page');
                this.switchPage(targetPage);
            });
        });

        // Save Content (Content Editor Page)
        document.getElementById('contentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveContent();
        });

        // Reset to Default
        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Reset all content to default? This cannot be undone.')) {
                this.resetToDefault();
            }
        });

        // Update Photo
        document.getElementById('photoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updatePhoto();
        });

        // Photo Preview
        document.getElementById('photoInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('photoPreview').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // Change Password (Security Page)
        document.getElementById('passwordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });
    },

    switchPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.admin-page').forEach(page => {
            page.classList.add('hidden');
        });

        // Remove active class from buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageId + 'Page');
        if (targetPage) {
            targetPage.classList.remove('hidden');
        }

        // Set active button
        const activeBtn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Update Title
        const titles = {
            'security': 'Security Settings',
            'content': 'Content Editor'
        };
        document.getElementById('pageTitle').textContent = titles[pageId] || 'Dashboard';
    },

    checkLogin() {
        if (sessionStorage.getItem('isLoggedIn') === 'true') {
            document.getElementById('loginOverlay').classList.add('hidden');
            document.getElementById('adminDashboard').classList.remove('hidden');
        }
    },

    handleLogin() {
        const input = document.getElementById('passwordInput').value;
        if (input === this.config.password) {
            sessionStorage.setItem('isLoggedIn', 'true');
            document.getElementById('loginOverlay').classList.add('hidden');
            document.getElementById('adminDashboard').classList.remove('hidden');
            document.getElementById('loginError').classList.add('hidden');
        } else {
            document.getElementById('loginError').classList.remove('hidden');
        }
    },

    async saveContent() {
        const fields = ['heroTitle', 'heroSubtitle', 'aboutTitle', 'aboutPara1', 'aboutPara2',
            'feature1Title', 'feature1Desc', 'feature2Title', 'feature2Desc',
            'feature3Title', 'feature3Desc', 'contactLabel', 'contactTitle',
            'contactDesc', 'benefit1', 'benefit2', 'benefit3', 'benefit4'];

        const data = {};
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                data[field] = element.value;
            }
        });

        try {
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showToast('All changes saved to server successfully!');
            } else {
                throw new Error('Server responded with error');
            }
        } catch (err) {
            console.error('Error saving content:', err);
            this.showToast('Failed to save content to server.');
        }
    },

    async resetToDefault() {
        try {
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.defaults)
            });

            if (response.ok) {
                const fields = ['heroTitle', 'heroSubtitle', 'aboutTitle', 'aboutPara1', 'aboutPara2',
                    'feature1Title', 'feature1Desc', 'feature2Title', 'feature2Desc',
                    'feature3Title', 'feature3Desc', 'contactLabel', 'contactTitle',
                    'contactDesc', 'benefit1', 'benefit2', 'benefit3', 'benefit4'];

                fields.forEach(field => {
                    const element = document.getElementById(field);
                    if (element) {
                        element.value = this.defaults[field] || '';
                    }
                });
                this.showToast('Content reset to default values on server');
            }
        } catch (err) {
            console.error('Error resetting content:', err);
        }
    },

    updatePhoto() {
        const file = document.getElementById('photoInput').files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result;
                try {
                    localStorage.setItem('heroImage', base64);
                    this.showToast('Profile photo updated!');
                } catch (err) {
                    alert('Image file is too large for local storage.');
                }
            };
            reader.readAsDataURL(file);
        }
    },

    changePassword() {
        const p1 = document.getElementById('newPassword').value;
        const p2 = document.getElementById('confirmPassword').value;

        if (p1 !== p2) {
            alert("Passwords do not match");
            return;
        }

        if (p1.length < 4) {
            alert("Password must be at least 4 characters");
            return;
        }

        localStorage.setItem('adminPassword', p1);
        this.config.password = p1;
        this.showToast('Password changed successfully');
        document.getElementById('passwordForm').reset();
    },

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Admin.init();
});
