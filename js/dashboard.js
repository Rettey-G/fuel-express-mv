// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!authToken) {
        // Redirect to login page if not logged in
        window.location.href = 'index.html';
        return;
    }

    // DOM Elements
    const currentUserName = document.getElementById('current-user-name');
    const userProfileBtn = document.getElementById('user-profile-btn');
    const userDropdown = document.getElementById('user-dropdown');
    const logoutBtn = document.getElementById('logout-btn');
    const changePasswordBtn = document.getElementById('change-password-btn');
    
    // Mock user data (replace with actual API calls)
    const userData = {
        username: 'john_doe',
        fullname: 'John Doe',
        role: 'user' // 'user' or 'admin'
    };

    // Initialize
    initDashboard();
    setupEventListeners();

    // Check if user is admin and show admin elements
    if (userData.role === 'admin') {
        document.body.classList.add('is-admin');
    }

    function initDashboard() {
        // Set user name in the header
        if (currentUserName) {
            currentUserName.textContent = userData.username;
        }

        // Fetch and display dashboard data (replace with actual API calls)
        document.getElementById('employee-count').textContent = '150';
        document.getElementById('attendance-today').textContent = '85';
        document.getElementById('pending-leaves').textContent = '2';
    }

    function setupEventListeners() {
        // User profile dropdown toggle
        if (userProfileBtn && userDropdown) {
            userProfileBtn.addEventListener('click', function() {
                userDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function(event) {
                if (!userProfileBtn.contains(event.target) && !userDropdown.contains(event.target)) {
                    userDropdown.classList.remove('active');
                }
            });
        }

        // Logout functionality
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }

        // Change password functionality
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Redirect to user dashboard with password change modal open
                window.location.href = 'pages/user-dashboard.html?action=changePassword';
            });
        }
    }

    // Logout function
    function logout() {
        // Clear auth tokens
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        
        // Redirect to login page
        window.location.href = 'index.html';
    }
});
