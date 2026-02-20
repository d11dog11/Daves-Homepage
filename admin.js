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
            sessionStorage.removeItem('authToken');
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

        // Toggle Password Visibility
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Stop form submission just in case
                const targetId = btn.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);

                // Toggle Icon
                if (type === 'text') {
                    // Show "Eye Off"
                    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
                    btn.style.color = 'var(--color-primary)';
                } else {
                    // Show "Eye"
                    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
                    btn.style.color = '';
                }
            });
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
        const passwordInput = document.getElementById('passwordInput').value;

        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passwordInput })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('authToken', data.token);
                    document.getElementById('loginOverlay').classList.add('hidden');
                    document.getElementById('adminDashboard').classList.remove('hidden');
                    document.getElementById('loginError').classList.add('hidden');
                } else {
                    document.getElementById('loginError').textContent = data.error || 'Login failed';
                    document.getElementById('loginError').classList.remove('hidden');
                }
            })
            .catch(err => {
                console.error('Login error:', err);
                document.getElementById('loginError').classList.remove('hidden');
            });
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

        const token = sessionStorage.getItem('authToken');

        try {
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showToast('All changes saved to server successfully!');
            } else {
                if (response.status === 401) {
                    alert('Session expired. Please login again.');
                    window.location.reload();
                } else {
                    throw new Error('Server responded with error');
                }
            }
        } catch (err) {
            console.error('Error saving content:', err);
            this.showToast('Failed to save content to server.');
        }
    },

    async resetToDefault() {
        const token = sessionStorage.getItem('authToken');
        try {
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
                    this.showToast('Profile photo updated (Local Only)!');
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

        if (p1.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }

        const token = sessionStorage.getItem('authToken');

        fetch('/api/password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ newPassword: p1 })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.showToast('Password changed successfully');
                    document.getElementById('passwordForm').reset();
                } else {
                    alert(data.error || 'Failed to change password');
                }
            })
            .catch(err => {
                console.error('Password change error:', err);
                alert('An error occurred');
            });
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
