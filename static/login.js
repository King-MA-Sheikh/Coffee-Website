document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginFormWrapper = document.getElementById('loginFormWrapper');
    const registerFormWrapper = document.getElementById('registerFormWrapper');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleButtons = document.querySelectorAll('.toggle-form');
    
    // Check if user is already logged in
    checkSession();
    
    // Toggle between login and register forms
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            
            if (target === 'register') {
                loginFormWrapper.classList.remove('active');
                registerFormWrapper.classList.add('active');
            } else {
                registerFormWrapper.classList.remove('active');
                loginFormWrapper.classList.add('active');
            }
            
            // Reset forms
            resetForms();
        });
    });
    
    // Password toggle functionality
    setupPasswordToggle('loginPasswordToggle', 'loginPassword');
    setupPasswordToggle('registerPasswordToggle', 'registerPassword');
    setupPasswordToggle('confirmPasswordToggle', 'confirmPassword');
    
    // Password strength indicator
    const registerPassword = document.getElementById('registerPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (registerPassword && strengthBar && strengthText) {
        registerPassword.addEventListener('input', function() {
            const password = this.value;
            updatePasswordStrength(password);
        });
    }
    
    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // Real-time validation
    setupRealTimeValidation();
    
    console.log('Login application initialized successfully');
});

function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    
    if (toggle && input) {
        toggle.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
}

function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    let feedback = '';
    
    if (password.length > 0) {
        // Length check
        if (password.length >= 8) strength += 25;
        else if (password.length >= 6) strength += 15;
        
        // Lowercase and uppercase check
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        else if (/[a-z]/.test(password) || /[A-Z]/.test(password)) strength += 15;
        
        // Number check
        if (/\d/.test(password)) strength += 25;
        
        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        
        // Cap at 100%
        strength = Math.min(strength, 100);
        
        // Update strength bar
        strengthBar.style.width = `${strength}%`;
        
        // Update feedback text and color
        if (strength < 40) {
            feedback = 'Weak';
            strengthBar.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8e8e)';
        } else if (strength < 70) {
            feedback = 'Medium';
            strengthBar.style.background = 'linear-gradient(135deg, #ffd166, #ffde8a)';
        } else {
            feedback = 'Strong';
            strengthBar.style.background = 'linear-gradient(135deg, #4ecdc4, #6de0d8)';
        }
    } else {
        strengthBar.style.width = '0%';
        feedback = '';
    }
    
    strengthText.textContent = feedback;
}

function setupRealTimeValidation() {
    // Username validation
    const usernameInput = document.getElementById('registerUsername');
    if (usernameInput) {
        usernameInput.addEventListener('input', function() {
            validateUsername(this.value);
        });
    }
    
    // Email validation
    const emailInput = document.getElementById('registerEmail');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            validateEmail(this.value);
        });
    }
    
    // Confirm password validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch();
        });
    }
}

function validateUsername(username) {
    const isValid = username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
    updateValidationIcon('registerUsername', isValid);
    return isValid;
}

function validateEmail(email) {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    updateValidationIcon('registerEmail', isValid);
    return isValid;
}

function validatePasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const isValid = password === confirmPassword && password.length > 0;
    updateValidationIcon('confirmPassword', isValid);
    return isValid;
}

function updateValidationIcon(inputId, isValid) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const inputGroup = input.closest('.input-group-3d');
    const existingIcon = inputGroup.querySelector('.validation-icon');
    
    if (existingIcon) {
        existingIcon.remove();
    }
    
    if (inputGroup && inputId !== 'registerPassword') {
        const validationIcon = document.createElement('div');
        validationIcon.className = 'validation-icon';
        validationIcon.innerHTML = isValid ? 
            '<i class="fas fa-check" style="color: #4ecdc4;"></i>' : 
            '<i class="fas fa-times" style="color: #ff6b6b;"></i>';
        validationIcon.style.position = 'absolute';
        validationIcon.style.right = '45px';
        validationIcon.style.top = '50%';
        validationIcon.style.transform = 'translateY(-50%)';
        validationIcon.style.transition = 'all 0.3s ease';
        
        inputGroup.appendChild(validationIcon);
        
        // Add animation
        validationIcon.style.animation = 'bounceIn 0.5s ease';
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');
    
    console.log('Login attempt:', { username });
    
    // Simple validation
    if (!username || !password) {
        showMessage('login', 'Please fill in all fields', 'error');
        return;
    }
    
    // Show loading state
    const loginBtn = document.getElementById('loginBtn');
    const originalText = loginBtn.querySelector('.btn-text').textContent;
    setButtonLoading(loginBtn, true, 'Signing In...');
    
    // Add action to form data
    formData.append('action', 'login');
    
    // Determine correct path based on current URL
    const basePath = window.location.pathname.includes('templates') ? '..' : '.';
    const authUrl = `${basePath}/auth.php`;
    
    console.log('Auth URL:', authUrl);
    
    // Send AJAX request to auth.php
    fetch(authUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Login response status:', response.status);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }
        return response.text().then(text => {
            console.log('Raw login response:', text);
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('Login JSON parse error:', e);
                throw new Error('Invalid JSON response from server.');
            }
        });
    })
    .then(data => {
        console.log('Parsed login data:', data);
        if (data.success) {
            showMessage('login', data.message, 'success');
            
            // Clear any existing localStorage data
            localStorage.removeItem('coffeeCart');
            
            // Redirect based on user type
            setTimeout(() => {
                if (data.is_admin && data.user_type === 'admin') {
                    // Redirect admin to dashboard.php
                    window.location.href = `${basePath}/dashboard.php`;
                } else if (data.user_type === 'customer') {
                    // Redirect regular users to customer-dashboard.php
                    window.location.href = `${basePath}/customer-dashboard.php`;
                } else {
                    // Fallback redirect
                    window.location.href = `${basePath}/customer-dashboard.php`;
                }
            }, 1500);
        } else {
            showMessage('login', data.message, 'error');
            shakeForm(loginForm);
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        showMessage('login', 'Login failed: ' + error.message, 'error');
    })
    .finally(() => {
        // Reset button state
        setButtonLoading(loginBtn, false, originalText);
    });
}

function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(registerForm);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = document.getElementById('termsCheckbox').checked;
    
    console.log('Registration data:', { username, email });
    
    // Manual validation instead of HTML5 validation
    if (!username || !email || !password || !confirmPassword) {
        showMessage('register', 'Please fill in all fields', 'error');
        return;
    }
    
    if (!terms) {
        showMessage('register', 'Please agree to the terms and conditions', 'error');
        return;
    }
    
    if (username.length < 3) {
        showMessage('register', 'Username must be at least 3 characters long', 'error');
        return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showMessage('register', 'Username can only contain letters, numbers, and underscores', 'error');
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage('register', 'Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('register', 'Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('register', 'Passwords do not match', 'error');
        return;
    }
    
    // Show loading state
    const registerBtn = document.getElementById('registerBtn');
    const originalText = registerBtn.querySelector('.btn-text').textContent;
    setButtonLoading(registerBtn, true, 'Creating Account...');
    
    // Add action to form data
    formData.append('action', 'register');
    
    // Determine correct path based on current URL
    const basePath = window.location.pathname.includes('templates') ? '..' : '.';
    const authUrl = `${basePath}/auth.php`;
    
    console.log('Auth URL:', authUrl);
    
    // Send AJAX request to auth.php
    fetch(authUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Registration response status:', response.status);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }
        return response.text().then(text => {
            console.log('Raw registration response:', text);
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('JSON parse error:', e);
                throw new Error('Invalid JSON response from server.');
            }
        });
    })
    .then(data => {
        console.log('Parsed registration data:', data);
        if (data.success) {
            showMessage('register', data.message, 'success');
            // Switch to login form after success
            setTimeout(() => {
                document.getElementById('registerFormWrapper').classList.remove('active');
                document.getElementById('loginFormWrapper').classList.add('active');
                resetForms();
            }, 2000);
        } else {
            showMessage('register', data.message, 'error');
            shakeForm(registerForm);
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        showMessage('register', 'Registration failed: ' + error.message, 'error');
    })
    .finally(() => {
        // Reset button state
        setButtonLoading(registerBtn, false, originalText);
    });
}

function checkSession() {
    const basePath = window.location.pathname.includes('templates') ? '..' : '.';
    
    fetch(`${basePath}/auth.php?action=check_session`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('User is logged in:', data.user);
            
            // Show welcome message but don't auto-redirect
            if (window.location.pathname.includes('login.html')) {
                showMessage('login', `Welcome back ${data.user.username}! You are already logged in.`, 'success');
                
                // Add a logout button option
                const loginFooter = document.querySelector('#loginFormWrapper .form-footer');
                if (loginFooter && !document.getElementById('logoutOption')) {
                    const logoutOption = document.createElement('div');
                    logoutOption.id = 'logoutOption';
                    logoutOption.style.marginTop = '15px';
                    logoutOption.style.padding = '10px';
                    logoutOption.style.background = 'rgba(78, 205, 196, 0.1)';
                    logoutOption.style.borderRadius = '8px';
                    logoutOption.style.textAlign = 'center';
                    logoutOption.innerHTML = `
                        <p style="margin-bottom: 10px; color: var(--success-color);">Continue as ${data.user.username}?</p>
                        <button onclick="redirectToDashboard()" class="btn-3d" style="padding: 8px 16px; margin-right: 10px;">
                            <i class="fas fa-arrow-right"></i> Continue to Dashboard
                        </button>
                        <button onclick="handleLogout()" class="btn-3d" style="padding: 8px 16px; background: var(--error-color);">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    `;
                    loginFooter.appendChild(logoutOption);
                }
            }
        } else {
            console.log('User is not logged in');
        }
    })
    .catch(error => {
        console.error('Session check error:', error);
    });
}

// Add this new function for manual redirect
function redirectToDashboard() {
    const basePath = window.location.pathname.includes('templates') ? '..' : '.';
    
    fetch(`${basePath}/auth.php?action=check_session`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('login', 'Redirecting to dashboard...', 'success');
            setTimeout(() => {
                if (data.user.is_admin) {
                    window.location.href = `${basePath}/dashboard.php`;
                } else {
                    window.location.href = `${basePath}/customer-dashboard.php`;
                }
            }, 1000);
        }
    });
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        const basePath = window.location.pathname.includes('templates') ? '..' : '.';
        
        // Show loading
        showMessage('login', 'Logging out...', 'info');
        
        fetch(`${basePath}/auth.php?action=logout`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('login', 'Logged out successfully!', 'success');
                // Remove logout option if it exists
                const logoutOption = document.getElementById('logoutOption');
                if (logoutOption) {
                    logoutOption.remove();
                }
                // Clear any stored cart data
                localStorage.removeItem('coffeeCart');
                // Reload page after logout to reset state
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                showMessage('login', 'Logout failed', 'error');
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
            showMessage('login', 'Logout failed: ' + error.message, 'error');
        });
    }
}

function showMessage(formType, message, type) {
    const errorElement = document.getElementById(`${formType}ErrorMessage`);
    const successElement = document.getElementById(`${formType}SuccessMessage`);
    const errorText = document.getElementById(`${formType}ErrorText`);
    const successText = document.getElementById(`${formType}SuccessText`);
    
    if (!errorElement || !successElement || !errorText || !successText) {
        console.error('Message elements not found for:', formType);
        return;
    }
    
    if (type === 'error') {
        errorText.textContent = message;
        errorElement.style.display = 'flex';
        successElement.style.display = 'none';
        
        // Log error for debugging
        console.error(`Form ${formType} error:`, message);
    } else {
        successText.textContent = message;
        successElement.style.display = 'flex';
        errorElement.style.display = 'none';
        
        // Log success for debugging
        console.log(`Form ${formType} success:`, message);
    }
    
    // Auto-hide messages after 5 seconds
    setTimeout(() => {
        if (errorElement) errorElement.style.display = 'none';
        if (successElement) successElement.style.display = 'none';
    }, 5000);
}

function shakeForm(form) {
    if (!form) return;
    
    form.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        form.style.animation = '';
    }, 500);
}

function resetForms() {
    // Reset all forms
    document.querySelectorAll('form').forEach(form => {
        if (form) form.reset();
    });
    
    // Hide all messages
    document.querySelectorAll('.error-message, .success-message').forEach(el => {
        if (el) el.style.display = 'none';
    });
    
    // Reset password strength
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    if (strengthBar) strengthBar.style.width = '0%';
    if (strengthText) strengthText.textContent = '';
    
    // Remove validation icons
    document.querySelectorAll('.validation-icon').forEach(icon => {
        if (icon) icon.remove();
    });
    
    // Reset checkbox
    const termsCheckbox = document.getElementById('termsCheckbox');
    if (termsCheckbox) {
        termsCheckbox.checked = false;
    }
    
    console.log('Forms reset successfully');
}

function setButtonLoading(button, isLoading, text = null) {
    if (isLoading) {
        button.classList.add('btn-loading');
        button.disabled = true;
        if (text) {
            button.querySelector('.btn-text').textContent = text;
        }
    } else {
        button.classList.remove('btn-loading');
        button.disabled = false;
        if (text) {
            button.querySelector('.btn-text').textContent = text;
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes bounceIn {
        0% { transform: translateY(-50%) scale(0.3); opacity: 0; }
        50% { transform: translateY(-50%) scale(1.05); }
        70% { transform: translateY(-50%) scale(0.9); }
        100% { transform: translateY(-50%) scale(1); opacity: 1; }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    /* Loading animation for buttons */
    .btn-loading {
        position: relative;
        color: transparent !important;
    }
    
    .btn-loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        left: 50%;
        margin-left: -10px;
        margin-top: -10px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    /* Style for the logout option buttons */
    .btn-3d {
        transition: all 0.3s ease;
    }
    
    .btn-3d:hover {
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);

// Global error handler for uncaught errors
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Export functions for global access
window.auth = {
    handleLogin,
    handleRegister,
    handleLogout,
    checkSession,
    showMessage,
    resetForms,
    redirectToDashboard
};