// Payroll Utilities for Fuel Express HR Management System

// Get attendance data for an employee for a specific month and year
function getAttendanceData(employeeId, month, year) {
    try {
        // Try to get attendance data from localStorage
        const attendanceKey = `attendance_${month}_${year}`;
        const attendanceData = JSON.parse(localStorage.getItem(attendanceKey)) || [];
        
        // Find employee's attendance
        const employeeAttendance = attendanceData.find(att => att.employeeId === employeeId || att.empNo === employeeId);
        
        if (!employeeAttendance) {
            // Return default attendance data
            return {
                present: 22,
                absent: 0,
                leave: 0,
                holiday: 8,
                workingDays: getDaysInMonth(month, year) - getWeekendDaysInMonth(month, year)
            };
        }
        
        return {
            present: employeeAttendance.present || 22,
            absent: employeeAttendance.absent || 0,
            leave: employeeAttendance.leave || 0,
            holiday: employeeAttendance.holiday || 8,
            workingDays: getDaysInMonth(month, year) - getWeekendDaysInMonth(month, year)
        };
    } catch (error) {
        console.error('Error getting attendance data:', error);
        // Return fallback data
        return {
            present: 22,
            absent: 0,
            leave: 0,
            holiday: 8,
            workingDays: 30
        };
    }
}

// Save processed payroll data for a specific month and year
function saveProcessedPayroll(payrollData, month, year) {
    const payrollKey = `payroll_${month}_${year}`;
    localStorage.setItem(payrollKey, JSON.stringify(payrollData));
    console.log(`Saved payroll data for ${getMonthName(month)} ${year}`);
    
    // Store current payroll data for other functions to use
    window.currentPayrollData = payrollData;
}

// Get processed payroll data for a specific month and year
function getProcessedPayroll(month, year) {
    const payrollKey = `payroll_${month}_${year}`;
    return JSON.parse(localStorage.getItem(payrollKey)) || window.currentPayrollData || [];
}

// Print a single employee's payslip
function printSinglePayslip(employeeId) {
    viewPayslip(employeeId);
    setTimeout(() => {
        printPayslip();
    }, 500);
}

// Get month name from month number (1-12)
function getMonthName(monthNumber) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNumber - 1] || '';
}

// Get number of days in a month
function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

// Get number of weekend days in a month
function getWeekendDaysInMonth(month, year) {
    const daysInMonth = getDaysInMonth(month, year);
    let weekendDays = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        
        // 0 is Sunday, 6 is Saturday
        if (dayOfWeek === 0 || dayOfWeek === 5) {
            weekendDays++;
        }
    }
    
    return weekendDays;
}

// Show notification message
function showNotification(message) {
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
    notification.style.background = '#4CAF50';
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

// Calculate years employed
function calculateYearsEmployed(startDate, endDate) {
    const years = endDate.getFullYear() - startDate.getFullYear();
    const months = endDate.getMonth() - startDate.getMonth();
    const days = endDate.getDate() - startDate.getDate();
    
    if (months < 0 || (months === 0 && days < 0)) {
        return years - 1;
    }
    
    return years;
}
