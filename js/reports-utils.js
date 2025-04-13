// Reports Utilities for Fuel Express HR Management System

// Show notification message
function showNotification(message, type = 'success') {
    // Check if notification container exists
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        // Create notification container
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Set background color based on type
    switch(type) {
        case 'error':
            notification.style.background = '#f44336';
            break;
        case 'warning':
            notification.style.background = '#ff9800';
            break;
        case 'info':
            notification.style.background = '#2196f3';
            break;
        default:
            notification.style.background = '#4CAF50';
    }
    
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.marginTop = '10px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.justifyContent = 'space-between';
    
    // Add message and close button
    notification.innerHTML = `
        <span>${message}</span>
        <button style="background: transparent; border: none; color: white; cursor: pointer; margin-left: 10px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Add event listener to close button
    notification.querySelector('button').addEventListener('click', function() {
        notificationContainer.removeChild(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        if (notification.parentNode) {
            notificationContainer.removeChild(notification);
        }
    }, 5000);
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
    const symbol = currency === 'MVR' ? '₨' : '$';
    return `${symbol}${formatNumber(amount.toFixed(2))}`;
}

// Get month name from month number (1-12)
function getMonthName(monthNumber) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNumber - 1] || '';
}

// Get short month name from month number (1-12)
function getShortMonthName(monthNumber) {
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return monthNames[monthNumber - 1] || '';
}

// Export data to CSV
function exportToCSV(data, filename) {
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Add headers if data is an array of objects
    if (data.length > 0 && typeof data[0] === 'object') {
        const headers = Object.keys(data[0]);
        csvContent += headers.join(',') + '\n';
        
        // Add data rows
        data.forEach(item => {
            const row = headers.map(header => {
                const value = item[header] || '';
                // Wrap in quotes if contains comma
                return typeof value === 'string' && value.includes(',') ? 
                    `"${value}"` : value;
            }).join(',');
            csvContent += row + '\n';
        });
    } else {
        // Simple array
        csvContent += data.join('\n');
    }
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
}

// Generate random data for charts when real data is not available
function generateRandomData(count, min, max) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return data;
}

// Calculate date difference in days
function dateDiffInDays(date1, date2) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// Parse custom date format (DD-MMM-YY)
function parseCustomDate(dateString) {
    if (!dateString) return new Date();
    
    const months = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    const parts = dateString.split('-');
    if (parts.length !== 3) return new Date();
    
    const day = parseInt(parts[0]);
    const month = months[parts[1]] || 0;
    let year = parseInt(parts[2]);
    
    // Handle 2-digit year
    if (year < 100) {
        year += year < 50 ? 2000 : 1900;
    }
    
    return new Date(year, month, day);
}
