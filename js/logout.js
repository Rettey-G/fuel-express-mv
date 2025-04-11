// Logout functionality
document.addEventListener('DOMContentLoaded', function() {
    // Find all logout buttons
    const logoutButtons = document.querySelectorAll('#logout-btn');
    
    // Add click event to all logout buttons
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Log activity
            if (typeof logActivity === 'function') {
                const currentUser = localStorage.getItem('currentUser') || 'user';
                logActivity(currentUser, 'logout', 'User logged out');
            }
            
            // Clear authentication data
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            
            // Redirect to login page
            window.location.href = '../index.html';
        });
    });
});
