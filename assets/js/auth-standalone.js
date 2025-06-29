/**
 * 🔐 EcoLearn Authentication - Standalone Version
 * Testing version without shared library dependencies
 */

console.log('🚀 Standalone auth script loaded');

// Simple API service
const API_BASE_URL = 'https://asia-southeast2-ecolearn-464318.cloudfunctions.net/domyid';

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    };

    console.log(`🌐 API Request: ${config.method} ${endpoint}`);
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        console.log(`✅ API Response:`, data);
        return data;
    } catch (error) {
        console.error(`❌ API Error:`, error);
        throw error;
    }
}

// Simple auth functions
async function login(email, password) {
    return await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

// Auth App Class
class StandaloneAuthApp {
    constructor() {
        this.currentTab = 'login';
        this.forms = {};
        
        console.log('🔧 Initializing standalone auth app');
        this.init();
    }

    init() {
        this.setupDOM();
        this.setupEventListeners();
        console.log('✅ Standalone auth app initialized');
    }

    setupDOM() {
        // Forms
        this.forms.login = document.getElementById('loginForm');
        this.forms.register = document.getElementById('registerForm');
        this.forms.forgot = document.getElementById('forgotForm');
        
        console.log('🔍 DOM Setup:', {
            loginForm: !!this.forms.login,
            registerForm: !!this.forms.register,
            forgotForm: !!this.forms.forgot
        });
    }

    setupEventListeners() {
        // Form submissions
        if (this.forms.login) {
            this.forms.login.addEventListener('submit', (e) => {
                console.log('🔐 Login form submitted!');
                this.handleLogin(e);
            });
            console.log('✅ Login form event listener attached');
        } else {
            console.error('❌ Login form not found!');
        }

        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                console.log(`🔄 Switching to tab: ${tabName}`);
                this.switchTab(tabName);
            });
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        console.log('🚀 handleLogin called');
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('📝 Login data:', { 
            email: data.email, 
            hasPassword: !!data.password,
            formData: data
        });

        // Get submit button
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Logging in...';
        }

        try {
            console.log('🔄 Attempting login...');
            const response = await login(data.email, data.password);
            
            console.log('📨 Login response:', response);
            
            if (response.success) {
                console.log('✅ Login successful!');
                
                // Store auth data
                if (response.data && response.data.token) {
                    localStorage.setItem('ecolearn_token', response.data.token);
                    localStorage.setItem('ecolearn_user', JSON.stringify(response.data.user));
                    console.log('💾 Auth data stored');
                }
                
                // Show success message
                this.showMessage('success', 'Login successful! Redirecting...');
                
                // Redirect based on role
                setTimeout(() => {
                    const role = response.data.user.role;
                    let redirectUrl = '/ecolearn-student/';
                    
                    if (role === 'educator') redirectUrl = '/ecolearn-educator/';
                    if (role === 'admin') redirectUrl = '/ecolearn-admin/';
                    
                    console.log(`🔗 Redirecting to: ${redirectUrl}`);
                    window.location.href = redirectUrl;
                }, 1500);
                
            } else {
                console.log('❌ Login failed:', response.message);
                this.showMessage('error', response.message || 'Login failed');
            }
            
        } catch (error) {
            console.error('💥 Login error:', error);
            this.showMessage('error', 'Network error. Please try again.');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Sign In';
            }
        }
    }

    switchTab(tabName) {
        console.log(`🔄 Switching to tab: ${tabName}`);
        
        // Update current tab
        this.currentTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Update form containers
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', form.id === `${tabName}Tab`);
        });
    }

    showMessage(type, message) {
        console.log(`📢 Message (${type}): ${message}`);
        
        // Create or update message element
        let messageEl = document.querySelector('.auth-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'auth-message';
            document.querySelector('.auth-container').prepend(messageEl);
        }
        
        messageEl.className = `auth-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM loaded, initializing auth app');
        window.standaloneAuth = new StandaloneAuthApp();
    });
} else {
    console.log('📄 DOM already loaded, initializing auth app');
    window.standaloneAuth = new StandaloneAuthApp();
}

console.log('📦 Standalone auth script setup complete');
