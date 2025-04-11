// User Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!authToken) {
        // Redirect to login page if not logged in
        window.location.href = '../index.html';
        return;
    }

    // DOM Elements
    const currentUserName = document.getElementById('current-user-name');
    const userFullname = document.getElementById('user-fullname');
    const userPosition = document.getElementById('user-position');
    const userId = document.getElementById('user-id');
    const userEmail = document.getElementById('user-email');
    const userPhone = document.getElementById('user-phone');
    const userAddress = document.getElementById('user-address');
    const userDob = document.getElementById('user-dob');
    
    // Mock user data (replace with actual API calls)
    const userData = {
        id: 'EMP-001',
        username: 'john_doe',
        fullname: 'John Doe',
        position: 'Software Developer',
        email: 'john.doe@example.com',
        phone: '+1 234 567 890',
        address: '123 Main St, City, Country',
        dob: '01/01/1990',
        role: 'user'
    };

    // Load user data
    loadUserData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize attendance chart
    initAttendanceChart();

    // Check if user is admin and show admin elements
    if (userData.role === 'admin') {
        document.body.classList.add('is-admin');
    }

    // Load user data
    function loadUserData() {
        // Set user data in the UI (replace with API call)
        currentUserName.textContent = userData.username;
        userFullname.textContent = userData.fullname;
        userPosition.textContent = userData.position;
        userId.textContent = 'Employee ID: ' + userData.id;
        userEmail.textContent = userData.email;
        userPhone.textContent = userData.phone;
        userAddress.textContent = userData.address;
        userDob.textContent = userData.dob;
    }

    // Setup event listeners
    function setupEventListeners() {
        // User profile dropdown
        const userProfileBtn = document.getElementById('user-profile-btn');
        const userDropdown = document.getElementById('user-dropdown');
        
        userProfileBtn.addEventListener('click', function() {
            userDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!userProfileBtn.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.remove('active');
            }
        });

        // Edit personal information
        const editPersonalInfoBtn = document.getElementById('edit-personal-info');
        const personalInfoForm = document.getElementById('personal-info-form');
        const savePersonalInfoBtn = document.getElementById('save-personal-info');
        const cancelPersonalInfoBtn = document.getElementById('cancel-personal-info');
        
        editPersonalInfoBtn.addEventListener('click', function() {
            // Populate form with current values
            document.getElementById('edit-email').value = userData.email;
            document.getElementById('edit-phone').value = userData.phone;
            document.getElementById('edit-address').value = userData.address;
            
            // Show form
            personalInfoForm.classList.remove('hidden');
        });
        
        savePersonalInfoBtn.addEventListener('click', function() {
            // Update user data (replace with API call)
            userData.email = document.getElementById('edit-email').value;
            userData.phone = document.getElementById('edit-phone').value;
            userData.address = document.getElementById('edit-address').value;
            
            // Update UI
            userEmail.textContent = userData.email;
            userPhone.textContent = userData.phone;
            userAddress.textContent = userData.address;
            
            // Hide form
            personalInfoForm.classList.add('hidden');
        });
        
        cancelPersonalInfoBtn.addEventListener('click', function() {
            personalInfoForm.classList.add('hidden');
        });

        // Change password modal
        const changePasswordBtn = document.getElementById('change-password-btn');
        const passwordModal = document.getElementById('password-modal');
        const closeModal = document.querySelector('.close-modal');
        const savePasswordBtn = document.getElementById('save-password');
        const cancelPasswordBtn = document.getElementById('cancel-password');
        
        changePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            passwordModal.classList.add('active');
        });
        
        function closePasswordModal() {
            passwordModal.classList.remove('active');
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
            document.getElementById('current-password-error').textContent = '';
            document.getElementById('new-password-error').textContent = '';
            document.getElementById('confirm-password-error').textContent = '';
        }
        
        closeModal.addEventListener('click', closePasswordModal);
        cancelPasswordBtn.addEventListener('click', closePasswordModal);
        
        savePasswordBtn.addEventListener('click', function() {
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Reset error messages
            document.getElementById('current-password-error').textContent = '';
            document.getElementById('new-password-error').textContent = '';
            document.getElementById('confirm-password-error').textContent = '';
            
            // Validate inputs
            let isValid = true;
            
            if (!currentPassword) {
                document.getElementById('current-password-error').textContent = 'Current password is required';
                isValid = false;
            }
            
            if (!newPassword) {
                document.getElementById('new-password-error').textContent = 'New password is required';
                isValid = false;
            } else if (newPassword.length < 6) {
                document.getElementById('new-password-error').textContent = 'Password must be at least 6 characters';
                isValid = false;
            }
            
            if (newPassword !== confirmPassword) {
                document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
                isValid = false;
            }
            
            if (isValid) {
                // Change password (replace with API call)
                alert('Password changed successfully');
                closePasswordModal();
            }
        });

        // Request leave button
        const requestLeaveBtn = document.getElementById('request-leave-btn');
        requestLeaveBtn.addEventListener('click', function() {
            window.location.href = 'leave.html';
        });

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear auth tokens
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            
            // Redirect to login page
            window.location.href = '../index.html';
        });
    }

    // Initialize attendance chart
    function initAttendanceChart() {
        const ctx = document.getElementById('attendance-chart-canvas').getContext('2d');
        
        // Sample data for the last 7 days
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = {
            labels: labels,
            datasets: [{
                label: 'Hours Worked',
                data: [8, 7.5, 8, 8.5, 7, 0, 0],
                backgroundColor: 'rgba(25, 118, 210, 0.2)',
                borderColor: 'rgba(25, 118, 210, 1)',
                borderWidth: 1
            }]
        };
        
        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        };
        
        new Chart(ctx, config);
    }
});
