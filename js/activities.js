// Activities Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize activities
    initializeActivities();
    
    // Load recent activities
    loadRecentActivities();
});

// Initialize activities data
function initializeActivities() {
    // Check if activities already exist in localStorage
    if (!localStorage.getItem('recentActivities')) {
        // Create sample activities if none exist
        const sampleActivities = [
            {
                type: 'login',
                user: 'Admin',
                timestamp: new Date().toISOString(),
                details: 'Admin logged into the system'
            }
        ];
        
        // Save to localStorage
        localStorage.setItem('recentActivities', JSON.stringify(sampleActivities));
    }
}

// Load recent activities into the sidebar
function loadRecentActivities() {
    const activitiesContainer = document.getElementById('recent-activities');
    if (!activitiesContainer) return;
    
    // Get activities from localStorage or EmployeeManager
    let activities = [];
    
    if (typeof EmployeeManager !== 'undefined' && typeof EmployeeManager.getActivities === 'function') {
        activities = EmployeeManager.getActivities(5);
    } else {
        try {
            activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
            activities = activities.slice(0, 5); // Get only the 5 most recent
        } catch (error) {
            console.error('Error loading activities:', error);
            activities = [];
        }
    }
    
    // Create the activities HTML
    let activitiesHTML = '<h3>Recent Activities</h3><ul class="activity-list">';
    
    if (activities.length === 0) {
        activitiesHTML += '<li class="activity-item">No recent activities</li>';
    } else {
        activities.forEach(activity => {
            const date = new Date(activity.timestamp);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            
            activitiesHTML += `
                <li class="activity-item">
                    <div class="activity-icon ${activity.type}">
                        <i class="fas ${getActivityIcon(activity.type)}"></i>
                    </div>
                    <div class="activity-content">
                        <p class="activity-text">${activity.details}</p>
                        <p class="activity-time">${formattedDate}</p>
                    </div>
                </li>
            `;
        });
    }
    
    activitiesHTML += '</ul>';
    activitiesContainer.innerHTML = activitiesHTML;
}

// Helper function to get icon for activity type
function getActivityIcon(type) {
    switch (type) {
        case 'login':
            return 'fa-sign-in-alt';
        case 'logout':
            return 'fa-sign-out-alt';
        case 'employee':
            return 'fa-user';
        case 'payroll':
            return 'fa-money-bill-wave';
        case 'leave':
            return 'fa-calendar-minus';
        case 'attendance':
            return 'fa-calendar-check';
        default:
            return 'fa-info-circle';
    }
}

// Add a new activity
function addActivity(type, details, user = 'System') {
    try {
        // Get existing activities
        const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
        
        // Add new activity at the beginning
        activities.unshift({
            type,
            user,
            timestamp: new Date().toISOString(),
            details
        });
        
        // Keep only the most recent 50 activities
        const trimmedActivities = activities.slice(0, 50);
        
        // Save back to localStorage
        localStorage.setItem('recentActivities', JSON.stringify(trimmedActivities));
        
        // Refresh the display if on the appropriate page
        if (document.getElementById('recent-activities')) {
            loadRecentActivities();
        }
    } catch (error) {
        console.error('Error adding activity:', error);
    }
}

// Make functions available globally
window.ActivityManager = {
    addActivity,
    loadRecentActivities
};
