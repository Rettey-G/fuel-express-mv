document.addEventListener('DOMContentLoaded', function() {
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
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        // Validate inputs
        let isValid = true;
        
        if (!username) {
            document.getElementById('login-username-error').textContent = 'Username is required';
            document.getElementById('login-username-error').style.display = 'block';
            isValid = false;
        }
        
        if (!password) {
            document.getElementById('login-password-error').textContent = 'Password is required';
            document.getElementById('login-password-error').style.display = 'block';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Attempt login
        const users = JSON.parse(localStorage.getItem('fuel_express_users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Store current user
            localStorage.setItem('fuel_express_current_user', JSON.stringify(user));
            
            // Show success message
            document.getElementById('login-success').textContent = 'Login successful! Redirecting...';
            document.getElementById('login-success').style.display = 'block';
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            document.getElementById('login-error').textContent = 'Invalid username or password';
            document.getElementById('login-error').style.display = 'block';
        }
    });
    
    // Signup form submission
    document.getElementById('signup-button').addEventListener('click', () => {
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
        
        const fullName = document.getElementById('signup-fullname').value;
        const email = document.getElementById('signup-email').value;
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;
        
        // Validate inputs
        let isValid = true;
        
        if (!fullName) {
            document.getElementById('signup-fullname-error').textContent = 'Full name is required';
            document.getElementById('signup-fullname-error').style.display = 'block';
            isValid = false;
        }
        
        if (!email) {
            document.getElementById('signup-email-error').textContent = 'Email is required';
            document.getElementById('signup-email-error').style.display = 'block';
            isValid = false;
        } else {
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById('signup-email-error').textContent = 'Please enter a valid email address';
                document.getElementById('signup-email-error').style.display = 'block';
                isValid = false;
            }
        }
        
        if (!username) {
            document.getElementById('signup-username-error').textContent = 'Username is required';
            document.getElementById('signup-username-error').style.display = 'block';
            isValid = false;
        }
        
        if (!password) {
            document.getElementById('signup-password-error').textContent = 'Password is required';
            document.getElementById('signup-password-error').style.display = 'block';
            isValid = false;
        }
        
        if (!confirmPassword) {
            document.getElementById('signup-confirm-error').textContent = 'Please confirm your password';
            document.getElementById('signup-confirm-error').style.display = 'block';
            isValid = false;
        } else if (password !== confirmPassword) {
            document.getElementById('signup-confirm-error').textContent = 'Passwords do not match';
            document.getElementById('signup-confirm-error').style.display = 'block';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Check if username or email already exists
        const users = JSON.parse(localStorage.getItem('fuel_express_users') || '[]');
        
        if (users.some(u => u.username === username)) {
            document.getElementById('signup-username-error').textContent = 'Username already exists';
            document.getElementById('signup-username-error').style.display = 'block';
            return;
        }
        
        if (users.some(u => u.email === email)) {
            document.getElementById('signup-email-error').textContent = 'Email already exists';
            document.getElementById('signup-email-error').style.display = 'block';
            return;
        }
        
        // Create new user
        const newUser = {
            fullName,
            email,
            username,
            password,
            role: 'user',
            createdAt: new Date().toISOString()
        };
        
        // Add to users array
        users.push(newUser);
        localStorage.setItem('fuel_express_users', JSON.stringify(users));
        
        // Show success message
        document.getElementById('signup-success').textContent = 'Account created successfully! You can now log in.';
        document.getElementById('signup-success').style.display = 'block';
        
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
        alert('Please contact system administrator to reset your password.');
    });
});