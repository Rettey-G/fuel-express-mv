document.addEventListener('DOMContentLoaded', function() {
    // Initialize users
    initializeUsers();
    
    // Check if user is already logged in
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Tab switching
    const loginTabs = document.querySelectorAll('.login-tab');
    loginTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and forms
            loginTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.login-form').forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            tab.classList.add('active');
            const formId = tab.dataset.tab + '-form';
            document.getElementById(formId).classList.add('active');
        });
    });
    
    // Login form submission
    document.getElementById('login-button').addEventListener('click', () => {
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        // Validate inputs
        let isValid = true;
        
        if (!username) {
            document.getElementById('login-username-error').textContent = 'Username is required';
            isValid = false;
        }
        
        if (!password) {
            document.getElementById('login-password-error').textContent = 'Password is required';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Attempt login using the auth.js login function
        const result = login(username, password);
        
        if (result.success) {
            // Show success message
            document.getElementById('login-success').textContent = 'Login successful! Redirecting...';
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            document.getElementById('login-error').textContent = result.message || 'Invalid username or password';
        }
    });
    
    // Signup form submission
    document.getElementById('signup-button').addEventListener('click', () => {
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        
        const fullName = document.getElementById('signup-fullname').value;
        const email = document.getElementById('signup-email').value;
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;
        
        // Validate inputs
        let isValid = true;
        
        if (!fullName) {
            document.getElementById('signup-fullname-error').textContent = 'Full name is required';
            isValid = false;
        }
        
        if (!email) {
            document.getElementById('signup-email-error').textContent = 'Email is required';
            isValid = false;
        } else {
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById('signup-email-error').textContent = 'Please enter a valid email address';
                isValid = false;
            }
        }
        
        if (!username) {
            document.getElementById('signup-username-error').textContent = 'Username is required';
            isValid = false;
        }
        
        if (!password) {
            document.getElementById('signup-password-error').textContent = 'Password is required';
            isValid = false;
        }
        
        if (!confirmPassword) {
            document.getElementById('signup-confirm-error').textContent = 'Please confirm your password';
            isValid = false;
        } else if (password !== confirmPassword) {
            document.getElementById('signup-confirm-error').textContent = 'Passwords do not match';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Check if username or email already exists
        const users = JSON.parse(localStorage.getItem('fuel_express_users') || '[]');
        
        if (users.some(u => u.username === username)) {
            document.getElementById('signup-username-error').textContent = 'Username already exists';
            return;
        }
        
        if (users.some(u => u.email === email)) {
            document.getElementById('signup-email-error').textContent = 'Email already exists';
            return;
        }
        
        // Create new user
        const newUser = {
            id: 'EMP-' + (100 + users.length),
            fullname: fullName,
            email: email,
            username: username,
            password: password,
            role: 'user',
            position: 'New Employee',
            phone: '',
            address: '',
            dob: '',
            createdAt: new Date().toISOString()
        };
        
        // Add to users array
        users.push(newUser);
        localStorage.setItem('fuel_express_users', JSON.stringify(users));
        
        // Show success message
        document.getElementById('signup-success').textContent = 'Account created successfully! You can now log in.';
        
        // Clear form
        document.getElementById('signup-fullname').value = '';
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-username').value = '';
        document.getElementById('signup-password').value = '';
        document.getElementById('signup-confirm').value = '';
        
        // Switch to login tab after a delay
        setTimeout(() => {
            document.querySelector('.login-tab[data-tab="login"]').click();
        }, 2000);
    });
    
    // Forgot password link
    document.getElementById('forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Please contact your administrator to reset your password.');
    });
});
