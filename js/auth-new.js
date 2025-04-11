// Authentication Module for Fuel Express HR Management System

// Constants for localStorage keys
const AUTH_TOKEN_KEY = 'authToken';
const USERS_KEY = 'fuel_express_users';

// Initialize default users if none exist
function initializeUsers() {
    if (!localStorage.getItem(USERS_KEY)) {
        const defaultUsers = [
            {
                id: 'EMP-001',
                fullname: 'Admin User',
                email: 'admin@fuelexpress.com',
                username: 'admin',
                password: 'admin123', // In a real app, this would be hashed
                role: 'admin',
                position: 'System Administrator',
                phone: '+1 123 456 7890',
                address: '123 Admin St, Tech City',
                dob: '01/01/1985',
                createdAt: new Date().toISOString()
            },
            {
                id: 'EMP-002',
                fullname: 'John Doe',
                email: 'john@fuelexpress.com',
                username: 'john',
                password: 'john123',
                role: 'user',
                position: 'Software Developer',
                phone: '+1 234 567 8901',
                address: '456 User Ave, Code Town',
                dob: '05/15/1990',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }
}

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
}

// Get current user data
function getCurrentUser() {
    const token = isAuthenticated();
    if (!token) return null;
    
    // In a real app, you would decode the JWT token or make an API call
    // For this demo, we'll just use the username stored in the token
    const username = token;
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.find(user => user.username === username) || null;
}

// Protect page - redirect to login if not authenticated
function protectPage() {
    if (!isAuthenticated()) {
        // Get current path to determine redirect
        const currentPath = window.location.pathname;
        const isLoginPage = currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/');
        
        if (!isLoginPage) {
            window.location.href = currentPath.includes('/pages/') ? '../index.html' : 'index.html';
        }
        return false;
    }
    return true;
}

// Update UI with current user info
function updateUserUI() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update username in the header if element exists
    const currentUserNameEl = document.getElementById('current-user-name');
    if (currentUserNameEl) {
        currentUserNameEl.textContent = user.username;
    }
    
    // Show/hide admin elements based on user role
    if (user.role === 'admin') {
        document.body.classList.add('is-admin');
    } else {
        document.body.classList.remove('is-admin');
    }
    
    // Update user dashboard elements if they exist
    const userFullnameEl = document.getElementById('user-fullname');
    const userPositionEl = document.getElementById('user-position');
    const userIdEl = document.getElementById('user-id');
    const userEmailEl = document.getElementById('user-email');
    const userPhoneEl = document.getElementById('user-phone');
    const userAddressEl = document.getElementById('user-address');
    const userDobEl = document.getElementById('user-dob');
    
    if (userFullnameEl) userFullnameEl.textContent = user.fullname;
    if (userPositionEl) userPositionEl.textContent = user.position;
    if (userIdEl) userIdEl.textContent = 'Employee ID: ' + user.id;
    if (userEmailEl) userEmailEl.textContent = user.email;
    if (userPhoneEl) userPhoneEl.textContent = user.phone;
    if (userAddressEl) userAddressEl.textContent = user.address;
    if (userDobEl) userDobEl.textContent = user.dob;
}

// Login function
function login(username, password) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store auth token (in a real app, this would be a JWT)
        localStorage.setItem(AUTH_TOKEN_KEY, username);
        return { success: true, user };
    }
    
    return { success: false, message: 'Invalid username or password' };
}

// Logout function
function logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    
    // Redirect to login page
    const currentPath = window.location.pathname;
    window.location.href = currentPath.includes('/pages/') ? '../index.html' : 'index.html';
}

// Initialize the auth module
function initAuth() {
    initializeUsers();
    
    // Add logout event listener if the button exists
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Check if this is a protected page and update UI
    const isLoginPage = window.location.pathname.endsWith('index.html') || 
                        window.location.pathname === '/' || 
                        window.location.pathname.endsWith('/');
    
    if (!isLoginPage) {
        if (protectPage()) {
            updateUserUI();
        }
    }
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);
