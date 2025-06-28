/**
 * 🔐 EcoLearn Authentication JavaScript
 * Green computing authentication system dengan carbon tracking
 */

// Import EcoLearn Shared Libraries
import { 
    initEcoLearn, 
    carbonTracker, 
    apiService, 
    authUtils, 
    config 
} from 'https://adbecolearn.github.io/ecolearn-shared/index.js';

// Initialize EcoLearn
const ecolearn = initEcoLearn({
    carbonTracking: true,
    performanceMonitoring: true,
    debugMode: config.isDevelopment()
});

// Authentication App Class
class AuthApp {
    constructor() {
        this.currentTab = 'login';
        this.forms = {
            login: null,
            register: null,
            forgot: null
        };
        this.validators = {};
        
        this.init();
    }

    /**
     * Initialize authentication app
     */
    init() {
        this.setupDOM();
        this.setupEventListeners();
        this.setupValidation();
        this.setupCarbonTracking();
        this.checkAuthStatus();
        
        carbonTracker.track('auth_app_init', {
            currentTab: this.currentTab,
            userAgent: navigator.userAgent
        });
        
        console.log('🔐 EcoLearn Authentication initialized');
    }

    /**
     * Setup DOM references
     */
    setupDOM() {
        // Forms
        this.forms.login = document.getElementById('loginForm');
        this.forms.register = document.getElementById('registerForm');
        this.forms.forgot = document.getElementById('forgotForm');
        
        // Tabs
        this.tabs = document.querySelectorAll('.auth-tab');
        this.tabContents = document.querySelectorAll('.auth-form');
        
        // Carbon tracker elements
        this.carbonIndicator = document.querySelector('.carbon-indicator');
        this.carbonText = document.querySelector('.carbon-text');
        this.pageCarbonFootprint = document.getElementById('pageCarbonFootprint');
        
        // Message container
        this.messageContainer = document.getElementById('message-container');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Tab switching
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Form submissions
        if (this.forms.login) {
            this.forms.login.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (this.forms.register) {
            this.forms.register.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        if (this.forms.forgot) {
            this.forms.forgot.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }

        // Password toggles
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => this.togglePassword(e));
        });

        // Password strength checking
        const registerPassword = document.getElementById('registerPassword');
        if (registerPassword) {
            registerPassword.addEventListener('input', (e) => this.checkPasswordStrength(e));
        }

        // Real-time validation
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearFieldError(e.target));
        });

        // Link buttons
        document.querySelectorAll('.link-button[data-tab]').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }

    /**
     * Setup form validation
     */
    setupValidation() {
        this.validators = {
            email: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Please enter a valid email address';
                }
                if (!value.toLowerCase().endsWith('@digitalbdg.ac.id')) {
                    return 'Please use your Akademi Digital Bandung email (@digitalbdg.ac.id)';
                }
                return null;
            },
            
            password: (value) => {
                if (value.length < 8) {
                    return 'Password must be at least 8 characters long';
                }
                if (!/(?=.*[a-z])/.test(value)) {
                    return 'Password must contain at least one lowercase letter';
                }
                if (!/(?=.*[A-Z])/.test(value)) {
                    return 'Password must contain at least one uppercase letter';
                }
                if (!/(?=.*\d)/.test(value)) {
                    return 'Password must contain at least one number';
                }
                return null;
            },
            
            studentId: (value) => {
                const studentIdRegex = /^ADB\d{3}$/;
                if (!studentIdRegex.test(value)) {
                    return 'Student ID must be in format ADB001 (ADB followed by 3 digits)';
                }
                return null;
            },
            
            name: (value) => {
                if (value.length < 2) {
                    return 'Name must be at least 2 characters long';
                }
                if (!/^[a-zA-Z\s]+$/.test(value)) {
                    return 'Name can only contain letters and spaces';
                }
                return null;
            }
        };
    }

    /**
     * Setup carbon tracking updates
     */
    setupCarbonTracking() {
        // Update carbon display every 2 seconds
        setInterval(() => {
            this.updateCarbonDisplay();
        }, 2000);
        
        // Initial update
        this.updateCarbonDisplay();
    }

    /**
     * Check if user is already authenticated
     */
    checkAuthStatus() {
        if (authUtils.isAuthenticated()) {
            const user = authUtils.getCurrentUser();
            const redirectUrl = authUtils.getRedirectUrl(user.role);
            
            this.showMessage('success', `Welcome back, ${user.firstName}! Redirecting...`);
            
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 2000);
        }
    }

    /**
     * Switch between tabs
     * @param {string} tabName Tab name to switch to
     */
    switchTab(tabName) {
        carbonTracker.track('auth_tab_switch', {
            from: this.currentTab,
            to: tabName
        });
        
        this.currentTab = tabName;
        
        // Update tab buttons
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Update tab contents
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-form`);
        });
        
        // Clear any existing messages
        this.clearMessages();
        
        // Focus first input in active form
        const activeForm = document.getElementById(`${tabName}-form`);
        const firstInput = activeForm?.querySelector('.form-input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    /**
     * Handle login form submission
     * @param {Event} e Form submit event
     */
    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }
        
        const submitButton = form.querySelector('.submit-button');
        this.setButtonLoading(submitButton, true);
        
        carbonTracker.track('auth_login_attempt', {
            email: data.email,
            rememberMe: data.remember === 'on'
        });
        
        try {
            const result = await authUtils.login(data.email, data.password);
            
            if (result.success) {
                this.showMessage('success', `Welcome back, ${result.user.firstName}!`);
                
                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = result.redirectUrl;
                }, 1500);
                
            } else {
                this.showMessage('error', result.message);
                this.setButtonLoading(submitButton, false);
            }
            
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('error', 'Network error. Please try again.');
            this.setButtonLoading(submitButton, false);
        }
    }

    /**
     * Handle register form submission
     * @param {Event} e Form submit event
     */
    async handleRegister(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }
        
        // Check password confirmation
        if (data.password !== data.confirmPassword) {
            this.showFieldError('confirmPassword', 'Passwords do not match');
            return;
        }
        
        const submitButton = form.querySelector('.submit-button');
        this.setButtonLoading(submitButton, true);
        
        carbonTracker.track('auth_register_attempt', {
            email: data.email,
            studentId: data.studentId,
            role: 'student'
        });
        
        try {
            const userData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                studentId: data.studentId,
                password: data.password,
                role: 'student'
            };
            
            const result = await authUtils.register(userData);
            
            if (result.success) {
                this.showMessage('success', result.message);
                
                // Switch to login tab after delay
                setTimeout(() => {
                    this.switchTab('login');
                    // Pre-fill email in login form
                    document.getElementById('loginEmail').value = data.email;
                }, 2000);
                
            } else {
                this.showMessage('error', result.message);
                this.setButtonLoading(submitButton, false);
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage('error', 'Network error. Please try again.');
            this.setButtonLoading(submitButton, false);
        }
    }

    /**
     * Handle forgot password form submission
     * @param {Event} e Form submit event
     */
    async handleForgotPassword(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }
        
        const submitButton = form.querySelector('.submit-button');
        this.setButtonLoading(submitButton, true);
        
        carbonTracker.track('auth_forgot_password_attempt', {
            email: data.email
        });
        
        try {
            const response = await apiService.post('/v1/auth/forgot-password', {
                email: data.email
            });
            
            if (response.success) {
                this.showMessage('success', 'Password reset instructions sent to your email.');
                
                // Switch to login tab after delay
                setTimeout(() => {
                    this.switchTab('login');
                }, 3000);
                
            } else {
                this.showMessage('error', response.message);
                this.setButtonLoading(submitButton, false);
            }
            
        } catch (error) {
            console.error('Forgot password error:', error);
            this.showMessage('error', 'Network error. Please try again.');
            this.setButtonLoading(submitButton, false);
        }
    }

    /**
     * Toggle password visibility
     * @param {Event} e Click event
     */
    togglePassword(e) {
        const button = e.currentTarget;
        const input = button.parentElement.querySelector('.form-input');
        const icon = button.querySelector('.password-icon');

        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = '🙈';
        } else {
            input.type = 'password';
            icon.textContent = '👁️';
        }

        carbonTracker.track('password_toggle', {
            visible: input.type === 'text'
        });
    }

    /**
     * Check password strength
     * @param {Event} e Input event
     */
    checkPasswordStrength(e) {
        const password = e.target.value;
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');

        let score = 0;
        let feedback = 'Too weak';

        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;

        // Character variety checks
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z\d]/.test(password)) score++;

        // Update strength display
        strengthBar.className = 'strength-fill';

        if (score <= 2) {
            strengthBar.classList.add('weak');
            feedback = 'Weak';
        } else if (score <= 4) {
            strengthBar.classList.add('fair');
            feedback = 'Fair';
        } else if (score <= 5) {
            strengthBar.classList.add('good');
            feedback = 'Good';
        } else {
            strengthBar.classList.add('strong');
            feedback = 'Strong';
        }

        strengthText.textContent = feedback;

        carbonTracker.track('password_strength_check', {
            score,
            feedback,
            length: password.length
        });
    }

    /**
     * Validate entire form
     * @param {HTMLFormElement} form Form to validate
     * @returns {boolean} Validation result
     */
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('.form-input[required]');

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Check checkboxes
        const checkboxes = form.querySelectorAll('input[type="checkbox"][required]');
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                this.showFieldError(checkbox.name, 'This field is required');
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validate individual field
     * @param {HTMLInputElement} field Field to validate
     * @returns {boolean} Validation result
     */
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let error = null;

        // Required field check
        if (field.hasAttribute('required') && !value) {
            error = 'This field is required';
        }

        // Type-specific validation
        if (value && !error) {
            if (fieldName.includes('email') || field.type === 'email') {
                error = this.validators.email(value);
            } else if (fieldName.includes('password') && fieldName !== 'confirmPassword') {
                error = this.validators.password(value);
            } else if (fieldName === 'studentId') {
                error = this.validators.studentId(value);
            } else if (fieldName.includes('Name')) {
                error = this.validators.name(value);
            }
        }

        if (error) {
            this.showFieldError(fieldName, error);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }

    /**
     * Show field error
     * @param {string} fieldName Field name
     * @param {string} message Error message
     */
    showFieldError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }

        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('error');
        }
    }

    /**
     * Clear field error
     * @param {HTMLInputElement} field Field element
     */
    clearFieldError(field) {
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}Error`);

        if (errorElement) {
            errorElement.classList.remove('show');
        }

        field.classList.remove('error');
    }

    /**
     * Set button loading state
     * @param {HTMLButtonElement} button Button element
     * @param {boolean} loading Loading state
     */
    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    /**
     * Show message to user
     * @param {string} type Message type (success, error, warning)
     * @param {string} message Message text
     */
    showMessage(type, message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️'
        };

        messageElement.innerHTML = `
            <span class="message-icon">${icons[type] || 'ℹ️'}</span>
            <span class="message-text">${message}</span>
            <button class="message-close" onclick="this.parentElement.remove()">×</button>
        `;

        this.messageContainer.appendChild(messageElement);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentElement) {
                messageElement.remove();
            }
        }, 5000);

        carbonTracker.track('message_shown', {
            type,
            message: message.substring(0, 50) // First 50 chars for privacy
        });
    }

    /**
     * Clear all messages
     */
    clearMessages() {
        this.messageContainer.innerHTML = '';
    }

    /**
     * Update carbon footprint display
     */
    updateCarbonDisplay() {
        const metrics = carbonTracker.getMetrics();
        const budget = carbonTracker.getCarbonBudget();

        // Update carbon text
        this.carbonText.textContent = `${metrics.totalCarbonGrams.toFixed(3)}g CO2`;
        this.pageCarbonFootprint.textContent = `${metrics.totalCarbonGrams.toFixed(3)}g CO2`;

        // Update carbon indicator color
        this.carbonIndicator.className = 'carbon-indicator';
        if (budget.status === 'warning') {
            this.carbonIndicator.classList.add('warning');
        } else if (budget.status === 'critical') {
            this.carbonIndicator.classList.add('critical');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthApp();
});

// Also initialize immediately for module loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AuthApp();
    });
} else {
    new AuthApp();
}
