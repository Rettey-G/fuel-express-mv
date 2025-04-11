// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const userList = document.getElementById('user-list');
    const userSearch = document.getElementById('user-search');
    const addUserBtn = document.getElementById('add-user-btn');
    const removeUserBtn = document.getElementById('remove-user-btn');
    const resetPasswordBtn = document.getElementById('reset-password-btn');
    const addUserForm = document.getElementById('add-user-form');
    const resetPasswordForm = document.getElementById('reset-password-form');
    
    // Mock user data (replace with actual API calls)
    let users = [
        { username: 'john_doe', email: 'john@example.com', role: 'user' },
        { username: 'jane_smith', email: 'jane@example.com', role: 'admin' },
        // Add more users as needed
    ];

    // Initialize
    loadUsers();
    setupEventListeners();

    // Load users into the list
    function loadUsers(searchTerm = '') {
        userList.innerHTML = '';
        const filteredUsers = users.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredUsers.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'user-item';
            userElement.innerHTML = `
                <i class="fas ${user.role === 'admin' ? 'fa-user-shield' : 'fa-user'}"></i>
                <div>
                    <div>${user.username}</div>
                    <small>${user.email}</small>
                </div>
            `;
            userElement.addEventListener('click', () => selectUser(userElement, user));
            userList.appendChild(userElement);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Search functionality
        userSearch.addEventListener('input', (e) => {
            loadUsers(e.target.value);
        });

        // Add user
        addUserBtn.addEventListener('click', () => {
            addUserForm.classList.remove('hidden');
            resetPasswordForm.classList.add('hidden');
        });

        document.getElementById('submit-new-user').addEventListener('click', addNewUser);
        document.getElementById('cancel-add-user').addEventListener('click', () => {
            addUserForm.classList.add('hidden');
        });

        // Remove user
        removeUserBtn.addEventListener('click', removeSelectedUser);

        // Reset password
        resetPasswordBtn.addEventListener('click', () => {
            const selectedUser = document.querySelector('.user-item.selected');
            if (!selectedUser) {
                alert('Please select a user first');
                return;
            }
            document.getElementById('reset-user').value = selectedUser.querySelector('div').textContent.trim();
            resetPasswordForm.classList.remove('hidden');
            addUserForm.classList.add('hidden');
        });

        document.getElementById('submit-reset-password').addEventListener('click', resetUserPassword);
        document.getElementById('cancel-reset-password').addEventListener('click', () => {
            resetPasswordForm.classList.add('hidden');
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', logout);
    }

    // Select user
    function selectUser(element, user) {
        document.querySelectorAll('.user-item').forEach(item => {
            item.classList.remove('selected');
        });
        element.classList.add('selected');
    }

    // Add new user
    function addNewUser() {
        const username = document.getElementById('new-username').value;
        const email = document.getElementById('new-email').value;
        const role = document.getElementById('new-role').value;

        if (!username || !email) {
            alert('Please fill in all fields');
            return;
        }

        // Add user to the list (replace with API call)
        users.push({ username, email, role });
        loadUsers();
        addUserForm.classList.add('hidden');

        // Clear form
        document.getElementById('new-username').value = '';
        document.getElementById('new-email').value = '';
        document.getElementById('new-role').value = 'user';
    }

    // Remove selected user
    function removeSelectedUser() {
        const selectedUser = document.querySelector('.user-item.selected');
        if (!selectedUser) {
            alert('Please select a user to remove');
            return;
        }

        if (confirm('Are you sure you want to remove this user?')) {
            const username = selectedUser.querySelector('div').textContent.trim();
            users = users.filter(user => user.username !== username);
            loadUsers();
        }
    }

    // Reset user password
    function resetUserPassword() {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        // Reset password (replace with API call)
        alert('Password has been reset successfully');
        resetPasswordForm.classList.add('hidden');

        // Clear form
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    }

    // Logout function
    function logout() {
        // Clear any auth tokens or session data
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        
        // Redirect to login page
        window.location.href = '../index.html';
    }
});
