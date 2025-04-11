// Leave Management JavaScript

// DOM Elements
const employeeSelect = document.getElementById('employee-select');
const leaveEmployeeSelect = document.getElementById('leave-employee');
const requestLeaveBtn = document.getElementById('request-leave-btn');
const manageHolidaysBtn = document.getElementById('manage-holidays-btn');
const leaveRequestModal = document.getElementById('leave-request-modal');
const holidaysModal = document.getElementById('holidays-modal');
const leaveRequestForm = document.getElementById('leave-request-form');
const addHolidayForm = document.getElementById('add-holiday-form');
const leaveTypeSelect = document.getElementById('leave-type');
const sickLeaveFields = document.getElementById('sick-leave-fields');
const annualLeaveFields = document.getElementById('annual-leave-fields');
const leaveRequestsTable = document.getElementById('leave-requests-table');
const holidaysTable = document.getElementById('holidays-table');
const holidaysManagementTable = document.getElementById('holidays-management-table');
const cancelRequestBtn = document.getElementById('cancel-request');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const currentMonthElement = document.getElementById('current-month');
const leaveCalendar = document.getElementById('leave-calendar');

// Close buttons for modals
const closeButtons = document.querySelectorAll('.close-btn');

// Current date and selected month/year for calendar
let currentDate = new Date();
let selectedMonth = currentDate.getMonth();
let selectedYear = currentDate.getFullYear();

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load employees into dropdowns
    loadEmployeeOptions();
    
    // Load default public holidays
    loadDefaultHolidays();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load leave data for the selected employee or all employees
    loadLeaveData();
    
    // Generate calendar
    generateCalendar(selectedMonth, selectedYear);
    
    // Update leave balance display
    updateLeaveBalanceDisplay();
});

// Load employees into dropdowns
function loadEmployeeOptions() {
    // Get employees from the employees.js file
    let employeesData = [];
    
    if (window.EmployeeManager) {
        employeesData = window.EmployeeManager.getAll();
    } else if (window.employees) {
        employeesData = window.employees;
    }
    
    // Sort employees by ID
    employeesData.sort((a, b) => a.id.localeCompare(b.id));
    
    // Add options to main select
    employeesData.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.id;
        option.textContent = `${employee.id} - ${employee.fullName}`;
        employeeSelect.appendChild(option);
        
        // Also add to the leave request form select
        const leaveOption = document.createElement('option');
        leaveOption.value = employee.id;
        leaveOption.textContent = `${employee.id} - ${employee.fullName}`;
        leaveEmployeeSelect.appendChild(leaveOption);
    });
}

// Load default public holidays
function loadDefaultHolidays() {
    const defaultHolidays = [
        { date: '2023-01-01', name: "New Year's Day", type: "Public Holiday" },
        { date: '2023-01-02', name: "New Year Holiday", type: "Government Holiday" },
        { date: '2023-02-06', name: "Majlis Presidential Address", type: "Government Holiday" },
        { date: '2023-03-01', name: "Ramadan Start", type: "Public Holiday" },
        { date: '2023-03-30', name: "Eid-ul-Fithr", type: "Public Holiday" },
        { date: '2023-03-31', name: "Eid-ul-Fithr Holiday", type: "Public Holiday" },
        { date: '2023-04-01', name: "Eid-ul-Fithr Holiday", type: "Public Holiday" },
        { date: '2023-05-01', name: "Labor Day / May Day", type: "Public Holiday" },
        { date: '2023-06-06', name: "Hajj Day", type: "Public Holiday" },
        { date: '2023-06-07', name: "Eid-ul Al'haa", type: "Public Holiday" },
        { date: '2023-06-27', name: "Muharram/Islamic New Year", type: "Public Holiday" },
        { date: '2023-07-26', name: "Independence Day", type: "Public Holiday" },
        { date: '2023-08-24', name: "National Day", type: "Public Holiday" },
        { date: '2023-09-05', name: "Milad un Nabi (Mawlid)", type: "Public Holiday" },
        { date: '2023-09-24', name: "The Day Maldives Embraced Islam", type: "Public Holiday" },
        { date: '2023-11-03', name: "Victory Day", type: "Public Holiday" },
        { date: '2023-11-11', name: "Republic Day", type: "Public Holiday" }
    ];
    
    // Check if holidays are already stored
    let holidays = JSON.parse(localStorage.getItem('publicHolidays')) || [];
    
    if (holidays.length === 0) {
        // Store default holidays
        localStorage.setItem('publicHolidays', JSON.stringify(defaultHolidays));
        holidays = defaultHolidays;
    }
    
    // Display holidays in the table
    displayHolidays(holidays);
}

/// Display holidays in the table
function displayHolidays(holidays) {
    // Sort holidays by date
    holidays.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Clear existing rows
    holidaysTable.innerHTML = '';
    holidaysManagementTable.innerHTML = '';
    
    // Add rows for each holiday
    holidays.forEach(holiday => {
        const date = new Date(holiday.date);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        
        // Add to main holidays table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${dayOfWeek}</td>
            <td>${holiday.name}</td>
            <td>${holiday.type}</td>
        `;
        holidaysTable.appendChild(row);
        
        // Add to management table with delete button
        const managementRow = document.createElement('tr');
        managementRow.innerHTML = `
            <td>${formattedDate}</td>
            <td>${holiday.name}</td>
            <td>${holiday.type}</td>
            <td>
                <button class="btn small-btn delete-holiday-btn" data-date="${holiday.date}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        holidaysManagementTable.appendChild(managementRow);
    });
    
    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-holiday-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dateToDelete = button.dataset.date;
            deleteHoliday(dateToDelete);
        });
    });
}

// Delete a holiday
function deleteHoliday(dateToDelete) {
    // Get current holidays
    let holidays = JSON.parse(localStorage.getItem('publicHolidays')) || [];
    
    // Filter out the holiday to delete
    holidays = holidays.filter(holiday => holiday.date !== dateToDelete);
    
    // Save updated holidays
    localStorage.setItem('publicHolidays', JSON.stringify(holidays));
    
    // Refresh display
    displayHolidays(holidays);
    
    // Refresh calendar
    generateCalendar(selectedMonth, selectedYear);
    
    // Log activity
    if (window.EmployeeManager) {
        window.EmployeeManager.logActivity(`Deleted holiday on ${new Date(dateToDelete).toLocaleDateString()}`);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Employee select change
    employeeSelect.addEventListener('change', () => {
        loadLeaveData();
        updateLeaveBalanceDisplay();
    });
    
    // Request leave button
    requestLeaveBtn.addEventListener('click', () => {
        leaveRequestModal.style.display = 'block';
    });
    
    // Manage holidays button
    manageHolidaysBtn.addEventListener('click', () => {
        holidaysModal.style.display = 'block';
    });
    
    // Close buttons for modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            leaveRequestModal.style.display = 'none';
            holidaysModal.style.display = 'none';
        });
    });
    
    // Cancel request button
    cancelRequestBtn.addEventListener('click', () => {
        leaveRequestModal.style.display = 'none';
    });
    
    // Leave type change
    leaveTypeSelect.addEventListener('change', () => {
        // Show/hide conditional fields based on leave type
        if (leaveTypeSelect.value === 'sick') {
            sickLeaveFields.style.display = 'block';
            annualLeaveFields.style.display = 'none';
        } else if (leaveTypeSelect.value === 'annual') {
            sickLeaveFields.style.display = 'none';
            annualLeaveFields.style.display = 'block';
        } else {
            sickLeaveFields.style.display = 'none';
            annualLeaveFields.style.display = 'none';
        }
    });
    
    // Leave request form submit
    leaveRequestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitLeaveRequest();
    });
    
    // Add holiday form submit
    addHolidayForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addHoliday();
    });
    
    // Calendar navigation
    prevMonthBtn.addEventListener('click', () => {
        selectedMonth--;
        if (selectedMonth < 0) {
            selectedMonth = 11;
            selectedYear--;
        }
        generateCalendar(selectedMonth, selectedYear);
    });
    
    nextMonthBtn.addEventListener('click', () => {
        selectedMonth++;
        if (selectedMonth > 11) {
            selectedMonth = 0;
            selectedYear++;
        }
        generateCalendar(selectedMonth, selectedYear);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === leaveRequestModal) {
            leaveRequestModal.style.display = 'none';
        }
        if (e.target === holidaysModal) {
            holidaysModal.style.display = 'none';
        }
    });
}

// Submit leave request
function submitLeaveRequest() {
    const employeeId = document.getElementById('leave-employee').value;
    const leaveType = document.getElementById('leave-type').value;
    const startDate = document.getElementById('leave-start').value;
    const endDate = document.getElementById('leave-end').value;
    const reason = document.getElementById('leave-reason').value;
    
    // Additional fields based on leave type
    let additionalData = {};
    
    if (leaveType === 'sick') {
        const medicalDocument = document.getElementById('medical-document').files[0];
        additionalData.hasDocument = !!medicalDocument;
        additionalData.documentName = medicalDocument ? medicalDocument.name : '';
    } else if (leaveType === 'annual') {
        additionalData.ticketFrom = document.getElementById('ticket-from').value;
        additionalData.ticketTo = document.getElementById('ticket-to').value;
        additionalData.requestTicket = document.getElementById('request-ticket').checked;
    }
    
    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
        alert('Start date cannot be after end date');
        return;
    }
    
    // Get employee data
    let employee = null;
    if (window.EmployeeManager) {
        const employees = window.EmployeeManager.getAll();
        employee = employees.find(emp => emp.id === employeeId);
    } else if (window.employees) {
        employee = window.employees.find(emp => emp.id === employeeId);
    }
    
    if (!employee) {
        alert('Employee not found');
        return;
    }
    
    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end days
    
    // Check leave balance
    const leaveBalance = getLeaveBalance(employeeId);
    
    if (leaveType === 'annual' && diffDays > leaveBalance.annual.remaining) {
        alert('Not enough annual leave days remaining');
        return;
    } else if (leaveType === 'sick' && diffDays > leaveBalance.sick.remaining) {
        alert('Not enough sick leave days remaining');
        return;
    } else if (leaveType === 'emergency' && diffDays > leaveBalance.emergency.remaining) {
        alert('Not enough emergency leave days remaining');
        return;
    } else if (leaveType === 'family' && diffDays > leaveBalance.family.remaining) {
        alert('Not enough family care leave days remaining');
        return;
    }
    
    // Create leave request object
    const leaveRequest = {
        id: Date.now().toString(),
        employeeId: employeeId,
        employeeName: employee.fullName,
        leaveType: leaveType,
        startDate: startDate,
        endDate: endDate,
        days: diffDays,
        reason: reason,
        status: 'pending',
        additionalData: additionalData,
        createdAt: new Date().toISOString()
    };
    
    // Save leave request
    let leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    leaveRequests.push(leaveRequest);
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
    
    // Update leave balance
    updateLeaveUsage(employeeId, leaveType, diffDays);
    
    // Close modal
    leaveRequestModal.style.display = 'none';
    
    // Reset form
    leaveRequestForm.reset();
    sickLeaveFields.style.display = 'none';
    annualLeaveFields.style.display = 'none';
    
    // Refresh leave data display
    loadLeaveData();
    updateLeaveBalanceDisplay();
    generateCalendar(selectedMonth, selectedYear);
    
    // Log activity
    if (window.EmployeeManager) {
        window.EmployeeManager.logActivity(`${employee.fullName} requested ${diffDays} days of ${leaveType} leave`);
    }
    
    // Show success message
    alert('Leave request submitted successfully');
}

// Add a new holiday
function addHoliday() {
    const date = document.getElementById('holiday-date').value;
    const name = document.getElementById('holiday-name').value;
    const type = document.getElementById('holiday-type').value;
    
    // Create holiday object
    const holiday = {
        date: date,
        name: name,
        type: type
    };
    
    // Save holiday
    let holidays = JSON.parse(localStorage.getItem('publicHolidays')) || [];
    
    // Check if a holiday already exists on this date
    const existingHoliday = holidays.find(h => h.date === date);
    if (existingHoliday) {
        if (!confirm(`A holiday already exists on this date (${existingHoliday.name}). Do you want to replace it?`)) {
            return;
        }
        // Remove existing holiday
        holidays = holidays.filter(h => h.date !== date);
    }
    
    holidays.push(holiday);
    localStorage.setItem('publicHolidays', JSON.stringify(holidays));
    
    // Reset form
    addHolidayForm.reset();
    
    // Refresh display
    displayHolidays(holidays);
    
    // Refresh calendar
    generateCalendar(selectedMonth, selectedYear);
    
    // Log activity
    if (window.EmployeeManager) {
        window.EmployeeManager.logActivity(`Added holiday: ${name} on ${new Date(date).toLocaleDateString()}`);
    }
    
    // Show success message
    alert('Holiday added successfully');
}

// Generate calendar for a specific month and year
function generateCalendar(month, year) {
    // Update current month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    let startingDay = firstDay.getDay();
    
    // Clear calendar
    leaveCalendar.innerHTML = '';
    
    // Add day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-header';
        dayHeader.textContent = day;
        leaveCalendar.appendChild(dayHeader);
    });
    
    // Get holidays
    const holidays = JSON.parse(localStorage.getItem('publicHolidays')) || [];
    
    // Get leave requests
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    
    // Get selected employee ID
    const selectedEmployeeId = employeeSelect.value;
    
    // Add blank spaces for days before start of month
    for (let i = 0; i < startingDay; i++) {
        const blankDay = document.createElement('div');
        blankDay.className = 'calendar-day empty';
        leaveCalendar.appendChild(blankDay);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dateString = currentDate.toISOString().split('T')[0];
        
        const calendarDay = document.createElement('div');
        calendarDay.className = 'calendar-day';
        
        // Check if weekend
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            calendarDay.classList.add('weekend');
        }
        
        // Check if today
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            calendarDay.classList.add('today');
        }
        
        // Check if holiday
        const isHoliday = holidays.find(h => h.date === dateString);
        if (isHoliday) {
            calendarDay.classList.add('holiday');
        }
        
        // Add date number
        const dateElement = document.createElement('div');
        dateElement.className = 'calendar-date';
        dateElement.textContent = day;
        calendarDay.appendChild(dateElement);
        
        // Add holiday indicator if applicable
        if (isHoliday) {
            const holidayElement = document.createElement('div');
            holidayElement.className = 'leave-event';
            holidayElement.innerHTML = `<span class="leave-indicator holiday-indicator"></span>${isHoliday.name}`;
            calendarDay.appendChild(holidayElement);
        }
        
        // Add leave indicators for this employee or all employees
        leaveRequests.forEach(request => {
            if (selectedEmployeeId && request.employeeId !== selectedEmployeeId) {
                return; // Skip if filtering by employee and this isn't the selected employee
            }
            
            const startDate = new Date(request.startDate);
            const endDate = new Date(request.endDate);
            
            // Check if this day falls within the leave period
            if (currentDate >= startDate && currentDate <= endDate && request.status === 'approved') {
                calendarDay.classList.add('has-leave');
                
                const leaveElement = document.createElement('div');
                leaveElement.className = 'leave-event';
                
                // Different colors for different leave types
                const leaveTypeClass = `leave-${request.leaveType}`;
                
                leaveElement.innerHTML = `<span class="leave-indicator ${leaveTypeClass}"></span>${selectedEmployeeId ? request.leaveType : request.employeeName}`;
                calendarDay.appendChild(leaveElement);
            }
        });
        
        leaveCalendar.appendChild(calendarDay);
    }
}

// Load leave data for the selected employee or all employees
function loadLeaveData() {
    const employeeId = employeeSelect.value;
    
    // Get leave requests
    let leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    
    // Filter by employee if selected
    if (employeeId) {
        leaveRequests = leaveRequests.filter(request => request.employeeId === employeeId);
    }
    
    // Sort by date (newest first)
    leaveRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Clear existing rows
    leaveRequestsTable.innerHTML = '';
    
    // Add rows for each leave request
    if (leaveRequests.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="7" class="text-center">No leave requests found</td>`;
        leaveRequestsTable.appendChild(emptyRow);
    } else {
        leaveRequests.forEach(request => {
            const row = document.createElement('tr');
            
            // Format dates
            const startDate = new Date(request.startDate).toLocaleDateString();
            const endDate = new Date(request.endDate).toLocaleDateString();
            
            // Capitalize leave type
            const leaveType = request.leaveType.charAt(0).toUpperCase() + request.leaveType.slice(1);
            
            row.innerHTML = `
                <td>${request.employeeName}</td>
                <td>${leaveType}</td>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td>${request.days}</td>
                <td class="status-${request.status}">${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</td>
                <td>
                    ${request.status === 'pending' ? `
                        <button class="btn small-btn approve-btn" data-id="${request.id}">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="btn small-btn reject-btn" data-id="${request.id}">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : `
                        <button class="btn small-btn view-btn" data-id="${request.id}">
                            <i class="fas fa-eye"></i> View
                        </button>
                    `}
                </td>
            `;
            
            leaveRequestsTable.appendChild(row);
        });
        
        // Add event listeners to buttons
        const approveButtons = document.querySelectorAll('.approve-btn');
        const rejectButtons = document.querySelectorAll('.reject-btn');
        const viewButtons = document.querySelectorAll('.view-btn');
        
        approveButtons.forEach(button => {
            button.addEventListener('click', () => {
                const requestId = button.dataset.id;
                updateLeaveRequestStatus(requestId, 'approved');
            });
        });
        
        rejectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const requestId = button.dataset.id;
                updateLeaveRequestStatus(requestId, 'rejected');
            });
        });
        
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const requestId = button.dataset.id;
                viewLeaveRequest(requestId);
            });
        });
    }
    
    // Refresh calendar
    generateCalendar(selectedMonth, selectedYear);
}

// Update leave request status
function updateLeaveRequestStatus(requestId, status) {
    // Get leave requests
    let leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    
    // Find the request
    const requestIndex = leaveRequests.findIndex(request => request.id === requestId);
    
    if (requestIndex === -1) {
        alert('Leave request not found');
        return;
    }
    
    const request = leaveRequests[requestIndex];
    
    // Update status
    request.status = status;
    leaveRequests[requestIndex] = request;
    
    // Save updated requests
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
    
    // Refresh leave data display
    loadLeaveData();
    
    // Log activity
    if (window.EmployeeManager) {
        window.EmployeeManager.logActivity(`${status === 'approved' ? 'Approved' : 'Rejected'} leave request for ${request.employeeName}`);
    }
    
    // Show success message
    alert(`Leave request ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
}

// View leave request details
function viewLeaveRequest(requestId) {
    // Get leave requests
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    
    // Find the request
    const request = leaveRequests.find(req => req.id === requestId);
    
    if (!request) {
        alert('Leave request not found');
        return;
    }
    
    // Format dates
    const startDate = new Date(request.startDate).toLocaleDateString();
    const endDate = new Date(request.endDate).toLocaleDateString();
    const createdAt = new Date(request.createdAt).toLocaleString();
    
    // Build additional details based on leave type
    let additionalDetails = '';
    
    if (request.leaveType === 'sick' && request.additionalData) {
        additionalDetails = `
            <p><strong>Medical Document:</strong> ${request.additionalData.hasDocument ? 'Yes' : 'No'}</p>
            ${request.additionalData.documentName ? `<p><strong>Document Name:</strong> ${request.additionalData.documentName}</p>` : ''}
        `;
    } else if (request.leaveType === 'annual' && request.additionalData) {
        additionalDetails = `
            <p><strong>Ticket From:</strong> ${request.additionalData.ticketFrom || 'N/A'}</p>
            <p><strong>Ticket To:</strong> ${request.additionalData.ticketTo || 'N/A'}</p>
            <p><strong>Requested Company Ticket:</strong> ${request.additionalData.requestTicket ? 'Yes' : 'No'}</p>
        `;
    }
    
    // Show details in an alert (in a real app, this would be a modal)
    alert(`
Leave Request Details:
------------------------
Employee: ${request.employeeName}
Leave Type: ${request.leaveType.charAt(0).toUpperCase() + request.leaveType.slice(1)}
Start Date: ${startDate}
End Date: ${endDate}
Days: ${request.days}
Status: ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
Reason: ${request.reason}
${request.additionalData ? `Additional Details: ${JSON.stringify(request.additionalData, null, 2)}` : ''}
Created: ${createdAt}
    `);
}

// Get leave balance for an employee
function getLeaveBalance(employeeId) {
    // Get employee data
    let employee = null;
    if (window.EmployeeManager) {
        const employees = window.EmployeeManager.getAll();
        employee = employees.find(emp => emp.id === employeeId);
    } else if (window.employees) {
        employee = window.employees.find(emp => emp.id === employeeId);
    }
    
    if (!employee) {
        return {
            annual: { total: 30, used: 0, remaining: 30 },
            sick: { total: 30, used: 0, remaining: 30 },
            emergency: { total: 10, used: 0, remaining: 10 },
            family: { total: 30, used: 0, remaining: 30 }
        };
    }
    
    // Calculate annual leave based on hire date
    const hireDate = new Date(employee.hireDate);
    const today = new Date();
    const yearsEmployed = Math.floor((today - hireDate) / (365.25 * 24 * 60 * 60 * 1000));
    
    // 30 days per year of employment
    const annualLeaveTotal = Math.min(30, yearsEmployed * 30);
    
    // Get leave usage from localStorage
    const leaveUsage = JSON.parse(localStorage.getItem(`leaveUsage_${employeeId}`)) || {
        annual: 0,
        sick: 0,
        emergency: 0,
        family: 0
    };
    
    return {
        annual: {
            total: annualLeaveTotal,
            used: leaveUsage.annual || 0,
            remaining: annualLeaveTotal - (leaveUsage.annual || 0)
        },
        sick: {
            total: 30,
            used: leaveUsage.sick || 0,
            remaining: 30 - (leaveUsage.sick || 0)
        },
        emergency: {
            total: 10,
            used: leaveUsage.emergency || 0,
            remaining: 10 - (leaveUsage.emergency || 0)
        },
        family: {
            total: 30,
            used: leaveUsage.family || 0,
            remaining: 30 - (leaveUsage.family || 0)
        }
    };
}

// Update leave usage for an employee
function updateLeaveUsage(employeeId, leaveType, days) {
    // Get current usage
    const leaveUsage = JSON.parse(localStorage.getItem(`leaveUsage_${employeeId}`)) || {
        annual: 0,
        sick: 0,
        emergency: 0,
        family: 0
    };
    
    // Update usage
    leaveUsage[leaveType] = (leaveUsage[leaveType] || 0) + days;
    
    // Save updated usage
    localStorage.setItem(`leaveUsage_${employeeId}`, JSON.stringify(leaveUsage));
}

// Update leave balance display
function updateLeaveBalanceDisplay() {
    const employeeId = employeeSelect.value;
    
    if (!employeeId) {
        // If no employee selected, show default values
        document.getElementById('annual-leave-total').textContent = '30';
        document.getElementById('annual-leave-used').textContent = '0';
        document.getElementById('annual-leave-remaining').textContent = '30';
        document.getElementById('annual-leave-progress').style.width = '0%';
        
        document.getElementById('sick-leave-total').textContent = '30';
        document.getElementById('sick-leave-used').textContent = '0';
        document.getElementById('sick-leave-remaining').textContent = '30';
        document.getElementById('sick-leave-progress').style.width = '0%';
        
        document.getElementById('emergency-leave-total').textContent = '10';
        document.getElementById('emergency-leave-used').textContent = '0';
        document.getElementById('emergency-leave-remaining').textContent = '10';
        document.getElementById('emergency-leave-progress').style.width = '0%';
        
        document.getElementById('family-leave-total').textContent = '30';
        document.getElementById('family-leave-used').textContent = '0';
        document.getElementById('family-leave-remaining').textContent = '30';
        document.getElementById('family-leave-progress').style.width = '0%';
        
        return;
    }
    
    // Get leave balance
    const balance = getLeaveBalance(employeeId);
    
    // Update annual leave
    document.getElementById('annual-leave-total').textContent = balance.annual.total;
    document.getElementById('annual-leave-used').textContent = balance.annual.used;
    document.getElementById('annual-leave-remaining').textContent = balance.annual.remaining;
    document.getElementById('annual-leave-progress').style.width = balance.annual.total > 0 ? 
        `${(balance.annual.used / balance.annual.total) * 100}%` : '0%';
    
    // Update sick leave
    document.getElementById('sick-leave-total').textContent = balance.sick.total;
    document.getElementById('sick-leave-used').textContent = balance.sick.used;
    document.getElementById('sick-leave-remaining').textContent = balance.sick.remaining;
    document.getElementById('sick-leave-progress').style.width = 
        `${(balance.sick.used / balance.sick.total) * 100}%`;
    
    // Update emergency leave
    document.getElementById('emergency-leave-total').textContent = balance.emergency.total;
    document.getElementById('emergency-leave-used').textContent = balance.emergency.used;
    document.getElementById('emergency-leave-remaining').textContent = balance.emergency.remaining;
    document.getElementById('emergency-leave-progress').style.width = 
        `${(balance.emergency.used / balance.emergency.total) * 100}%`;
    
    // Update family leave
    document.getElementById('family-leave-total').textContent = balance.family.total;
    document.getElementById('family-leave-used').textContent = balance.family.used;
    document.getElementById('family-leave-remaining').textContent = balance.family.remaining;
    document.getElementById('family-leave-progress').style.width = 
        `${(balance.family.used / balance.family.total) * 100}%`;
}