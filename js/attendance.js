// Attendance Management JavaScript

// DOM Elements
const weekSelector = document.getElementById('week-selector');
const loadWeekBtn = document.getElementById('load-week-btn');
const employeeSelect = document.getElementById('employee-select');
const timesheetWrapper = document.getElementById('timesheet-wrapper');
const saveTimesheetBtn = document.getElementById('save-timesheet-btn');
const printTimesheetBtn = document.getElementById('print-timesheet-btn');

// Attendance data storage
let attendanceData = {};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set default week to current week
    setDefaultWeek();
    
    // Load employees into dropdown
    loadEmployeeOptions();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial timesheet
    loadTimesheet();
});

// Set default week to current week
function setDefaultWeek() {
    const now = new Date();
    const year = now.getFullYear();
    const weekNum = getWeekNumber(now);
    const weekValue = `${year}-W${weekNum.toString().padStart(2, '0')}`;
    weekSelector.value = weekValue;
}

// Get week number from date
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Load employees into dropdown
function loadEmployeeOptions() {
    // Get employees from the employees.js file
    let employeesData = [];
    
    if (window.EmployeeManager) {
        employeesData = window.EmployeeManager.getAll();
    } else if (window.employees) {
        employeesData = window.employees;
    }
    
    // Sort employees by empNo
    employeesData.sort((a, b) => (a.empNo || '').localeCompare(b.empNo || ''));
    
    // Add options to select
    employeesData.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.empNo || employee.id; // Use empNo as the value
        option.textContent = `${employee.empNo || 'N/A'} - ${employee.fullName}`;
        employeeSelect.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Load week button
    loadWeekBtn.addEventListener('click', loadTimesheet);
    
    // Employee select change
    employeeSelect.addEventListener('change', loadTimesheet);
    
    // Save timesheet button
    saveTimesheetBtn.addEventListener('click', saveTimesheet);
    
    // Print timesheet button
    printTimesheetBtn.addEventListener('click', () => {
        window.print();
    });
}

// Load timesheet based on selected week and employee
function loadTimesheet() {
    const weekValue = weekSelector.value;
    const employeeId = employeeSelect.value;
    
    if (!weekValue) {
        alert('Please select a week');
        return;
    }
    
    // Clear timesheet wrapper
    timesheetWrapper.innerHTML = '';
    
    if (employeeId) {
        // Load single employee timesheet
        loadSingleEmployeeTimesheet(employeeId, weekValue);
    } else {
        // Load all employees summary
        loadAllEmployeesSummary(weekValue);
    }
}

// Load timesheet for a single employee
function loadSingleEmployeeTimesheet(employeeId, weekValue) {
    // Get employee data
    let employee = null;
    
    if (window.EmployeeManager) {
        const employees = window.EmployeeManager.getAll();
        employee = employees.find(emp => emp.id === employeeId);
    } else if (window.employees) {
        employee = window.employees.find(emp => emp.id === employeeId);
    }
    
    if (!employee) {
        timesheetWrapper.innerHTML = '<p class="error">Employee not found</p>';
        return;
    }
    
    // Get dates for the selected week
    const dates = getWeekDates(weekValue);
    
    // Get stored attendance data for this employee and week
    const storageKey = `attendance_${employeeId}_${weekValue}`;
    let employeeAttendance = JSON.parse(localStorage.getItem(storageKey)) || createEmptyAttendance(dates);
    
    // Create timesheet HTML
    const timesheetHtml = `
        <div class="employee-timesheet">
            <div class="timesheet-title">
                <i class="fas fa-user-clock"></i> Timesheet for ${employee.fullName} (${employee.empNo || 'N/A'})
            </div>
            <form id="timesheet-form">
                <table class="timesheet">
                    <thead>
                        <tr>
                            <th colspan="9">Weekly timesheet</th>
                        </tr>
                        <tr>
                            <td colspan="3">EMPLOYEE: ${employee.fullName} (${employee.empNo || 'N/A'})</td>
                            <td colspan="3">WEEK FROM: ${formatDate(dates[0])}</td>
                        </tr>
                        <tr>
                            <td colspan="3">SUPERVISOR: </td>
                            <td colspan="3">WORKSITE: ${employee.workSite || 'Office'}</td>
                        </tr>
                        <tr>
                            <th>DATE</th>
                            <th>Start time</th>
                            <th>Finish time</th>
                            <th>Regular hrs</th>
                            <th>Overtime</th>
                            <th>Sick</th>
                            <th>Vacation</th>
                            <th>Holiday</th>
                            <th>TOTAL HOURS</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dates.map((date, index) => `
                            <tr>
                                <td class="date-column">${formatDayDate(date)}</td>
                                <td><input type="time" name="start_${index}" value="${employeeAttendance.days[index].startTime || ''}" data-day="${index}"></td>
                                <td><input type="time" name="end_${index}" value="${employeeAttendance.days[index].endTime || ''}" data-day="${index}"></td>
                                <td><input type="number" name="regular_${index}" value="${employeeAttendance.days[index].regularHours}" readonly></td>
                                <td><input type="number" name="overtime_${index}" value="${employeeAttendance.days[index].overtime}" readonly></td>
                                <td><input type="checkbox" name="sick_${index}" ${employeeAttendance.days[index].sick ? 'checked' : ''} data-day="${index}"></td>
                                <td><input type="checkbox" name="vacation_${index}" ${employeeAttendance.days[index].vacation ? 'checked' : ''} data-day="${index}"></td>
                                <td><input type="checkbox" name="holiday_${index}" ${employeeAttendance.days[index].holiday ? 'checked' : ''} data-day="${index}"></td>
                                <td class="total-column"><input type="number" name="total_${index}" value="${employeeAttendance.days[index].totalHours}" readonly></td>
                            </tr>
                        `).join('')}
                        <tr class="total-row">
                            <td>TOTAL H</td>
                            <td>---</td>
                            <td>---</td>
                            <td>${employeeAttendance.totals.regularHours.toFixed(2)}</td>
                            <td>${employeeAttendance.totals.overtime.toFixed(2)}</td>
                            <td>${employeeAttendance.totals.sick.toFixed(2)}</td>
                            <td>${employeeAttendance.totals.vacation.toFixed(2)}</td>
                            <td>${employeeAttendance.totals.holiday.toFixed(2)}</td>
                            <td>${employeeAttendance.totals.totalHours.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>HOURLY RATE</td>
                            <td>---</td>
                            <td>---</td>
                            <td>$${(employee.salary?.MVR ? employee.salary.MVR / 160 : 0).toFixed(2)}</td>
                            <td>$${(employee.salary?.MVR ? (employee.salary.MVR / 160) * 1.5 : 0).toFixed(2)}</td>
                            <td>$${(employee.salary?.MVR ? employee.salary.MVR / 160 : 0).toFixed(2)}</td>
                            <td>$${(employee.salary?.MVR ? employee.salary.MVR / 160 : 0).toFixed(2)}</td>
                            <td>$${(employee.salary?.MVR ? employee.salary.MVR / 160 : 0).toFixed(2)}</td>
                            <td>---</td>
                        </tr>
                        <tr>
                            <td>TOTAL PAY</td>
                            <td>---</td>
                            <td>---</td>
                            <td>$${((employee.salary / 160) * employeeAttendance.totals.regularHours).toFixed(2)}</td>
                            <td>$${((employee.salary / 160) * 1.5 * employeeAttendance.totals.overtime).toFixed(2)}</td>
                            <td>$${((employee.salary / 160) * employeeAttendance.totals.sick).toFixed(2)}</td>
                            <td>$${((employee.salary / 160) * employeeAttendance.totals.vacation).toFixed(2)}</td>
                            <td>$${((employee.salary / 160) * employeeAttendance.totals.holiday).toFixed(2)}</td>
                            <td>$${employeeAttendance.totals.totalPay.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="3" class="signature-row">EMPLOYEE SIGNATURE</td>
                            <td colspan="2" class="signature-row">DATE</td>
                            <td colspan="2" class="signature-row">${employeeAttendance.totals.totalHours.toFixed(2)}<br>TOTAL HOURS</td>
                            <td colspan="2" class="signature-row">$${employeeAttendance.totals.totalPay.toFixed(2)}<br>TOTAL PAY</td>
                        </tr>
                        <tr>
                            <td colspan="3" class="signature-row">SUPERVISOR SIGNATURE</td>
                            <td colspan="2" class="signature-row">DATE</td>
                            <td colspan="4"></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    `;
    
    timesheetWrapper.innerHTML = timesheetHtml;
    
    // Add event listeners to inputs
    addTimesheetInputListeners(employeeId, weekValue);
    
    // Update summary
    updateAttendanceSummary(employeeAttendance);
}

// Add event listeners to timesheet inputs
function addTimesheetInputListeners(employeeId, weekValue) {
    const timeInputs = document.querySelectorAll('input[type="time"]');
    const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');
    
    // Time inputs
    timeInputs.forEach(input => {
        input.addEventListener('change', () => {
            calculateHours(employeeId, weekValue);
        });
    });
    
    // Checkbox inputs
    checkboxInputs.forEach(input => {
        input.addEventListener('change', () => {
            calculateHours(employeeId, weekValue);
        });
    });
}

// Calculate hours based on inputs
function calculateHours(employeeId, weekValue) {
    const storageKey = `attendance_${employeeId}_${weekValue}`;
    let employeeAttendance = JSON.parse(localStorage.getItem(storageKey)) || createEmptyAttendance(getWeekDates(weekValue));
    
    // Get employee data for hourly rate
    let employee = null;
    if (window.EmployeeManager) {
        const employees = window.EmployeeManager.getAll();
        employee = employees.find(emp => emp.id === employeeId);
    } else if (window.employees) {
        employee = window.employees.find(emp => emp.id === employeeId);
    }
    
    const hourlyRate = employee ? employee.salary / 160 : 0;
    
    // Process each day
    for (let i = 0; i < 7; i++) {
        const startTimeInput = document.querySelector(`input[name="start_${i}"]`);
        const endTimeInput = document.querySelector(`input[name="end_${i}"]`);
        const regularHoursInput = document.querySelector(`input[name="regular_${i}"]`);
        const overtimeInput = document.querySelector(`input[name="overtime_${i}"]`);
        const sickInput = document.querySelector(`input[name="sick_${i}"]`);
        const vacationInput = document.querySelector(`input[name="vacation_${i}"]`);
        const holidayInput = document.querySelector(`input[name="holiday_${i}"]`);
        const totalHoursInput = document.querySelector(`input[name="total_${i}"]`);
        
        // Get values
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const isSick = sickInput.checked;
        const isVacation = vacationInput.checked;
        const isHoliday = holidayInput.checked;
        
        // Calculate hours
        let regularHours = 0;
        let overtime = 0;
        let totalHours = 0;
        
        if (startTime && endTime) {
            // Calculate total hours worked
            const start = new Date(`2000-01-01T${startTime}`);
            const end = new Date(`2000-01-01T${endTime}`);
            
            // Handle overnight shifts
            let hours = (end - start) / 3600000;
            if (hours < 0) {
                hours += 24;
            }
            
            // Regular hours (max 8) and overtime
            regularHours = Math.min(8, hours);
            overtime = Math.max(0, hours - 8);
            totalHours = hours;
        }
        
        // If sick, vacation, or holiday is checked, set 8 hours for that category
        if (isSick) {
            regularHours = 0;
            overtime = 0;
            totalHours = 8;
        }
        
        if (isVacation) {
            regularHours = 0;
            overtime = 0;
            totalHours = 8;
        }
        
        if (isHoliday) {
            regularHours = 0;
            overtime = 0;
            totalHours = 8;
        }
        
        // Update inputs
        regularHoursInput.value = regularHours.toFixed(2);
        overtimeInput.value = overtime.toFixed(2);
        totalHoursInput.value = totalHours.toFixed(2);
        
        // Update attendance data
        employeeAttendance.days[i] = {
            startTime: startTime,
            endTime: endTime,
            regularHours: parseFloat(regularHours.toFixed(2)),
            overtime: parseFloat(overtime.toFixed(2)),
            sick: isSick,
            vacation: isVacation,
            holiday: isHoliday,
            totalHours: parseFloat(totalHours.toFixed(2))
        };
    }
    
    // Calculate totals
    const totals = {
        regularHours: 0,
        overtime: 0,
        sick: 0,
        vacation: 0,
        holiday: 0,
        totalHours: 0,
        totalPay: 0
    };
    
    employeeAttendance.days.forEach(day => {
        totals.regularHours += day.regularHours;
        totals.overtime += day.overtime;
        totals.sick += day.sick ? 8 : 0;
        totals.vacation += day.vacation ? 8 : 0;
        totals.holiday += day.holiday ? 8 : 0;
        totals.totalHours += day.totalHours;
    });
    
    // Calculate total pay
    totals.totalPay = (totals.regularHours * hourlyRate) + 
                      (totals.overtime * hourlyRate * 1.5) + 
                      (totals.sick * hourlyRate) + 
                      (totals.vacation * hourlyRate) + 
                      (totals.holiday * hourlyRate);
    
    employeeAttendance.totals = totals;
    
    // Update the totals row in the table
    const totalRowCells = document.querySelectorAll('.total-row td');
    if (totalRowCells.length >= 9) {
        totalRowCells[3].textContent = totals.regularHours.toFixed(2);
        totalRowCells[4].textContent = totals.overtime.toFixed(2);
        totalRowCells[5].textContent = totals.sick.toFixed(2);
        totalRowCells[6].textContent = totals.vacation.toFixed(2);
        totalRowCells[7].textContent = totals.holiday.toFixed(2);
        totalRowCells[8].textContent = totals.totalHours.toFixed(2);
    }
    
    // Update the total pay row
    const totalPayCells = document.querySelectorAll('tr:nth-child(11) td');
    if (totalPayCells.length >= 9) {
        totalPayCells[3].textContent = `$${(hourlyRate * totals.regularHours).toFixed(2)}`;
        totalPayCells[4].textContent = `$${(hourlyRate * 1.5 * totals.overtime).toFixed(2)}`;
        totalPayCells[5].textContent = `$${(hourlyRate * totals.sick).toFixed(2)}`;
        totalPayCells[6].textContent = `$${(hourlyRate * totals.vacation).toFixed(2)}`;
        totalPayCells[7].textContent = `$${(hourlyRate * totals.holiday).toFixed(2)}`;
        totalPayCells[8].textContent = `$${totals.totalPay.toFixed(2)}`;
    }
    
    // Update the signature row
    const signatureRowCells = document.querySelectorAll('tr:nth-child(12) td');
    if (signatureRowCells.length >= 4) {
        signatureRowCells[2].innerHTML = `${totals.totalHours.toFixed(2)}<br>TOTAL HOURS`;
        signatureRowCells[3].innerHTML = `$${totals.totalPay.toFixed(2)}<br>TOTAL PAY`;
    }
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(employeeAttendance));
    
    // Update summary
    updateAttendanceSummary(employeeAttendance);
    
    // Log activity
    if (window.EmployeeManager) {
        window.EmployeeManager.logActivity(`Updated timesheet for ${employee.fullName} (${employee.empNo || 'N/A'}) for week ${weekValue}`);
    }
}
// Load summary for all employees
function loadAllEmployeesSummary(weekValue) {
    // Get all employees
    let employeesData = [];
    
    if (window.EmployeeManager) {
        employeesData = window.EmployeeManager.getAll();
    } else if (window.employees) {
        employeesData = window.employees;
    }
    
    // Create summary HTML
    let summaryHtml = `
        <h3>Attendance Summary for Week ${weekValue}</h3>
        <table class="timesheet">
            <thead>
                <tr>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Department</th>
                    <th>Worksite</th>
                    <th>Regular Hours</th>
                    <th>Overtime</th>
                    <th>Sick Leave</th>
                    <th>Vacation</th>
                    <th>Holiday</th>
                    <th>Total Hours</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Track totals across all employees
    const companyTotals = {
        regularHours: 0,
        overtime: 0,
        sick: 0,
        vacation: 0,
        holiday: 0,
        totalHours: 0,
        presentCount: 0,
        absentCount: 0
    };
    
    // Add row for each employee
    employeesData.forEach(employee => {
        const storageKey = `attendance_${employee.empNo || employee.id}_${weekValue}`;
        let employeeAttendance = JSON.parse(localStorage.getItem(storageKey)) || createEmptyAttendance(getWeekDates(weekValue));
        
        // Calculate present days (days with hours > 0)
        const presentDays = employeeAttendance.days.filter(day => day.totalHours > 0).length;
        const absentDays = 7 - presentDays;
        
        // Add to company totals
        companyTotals.regularHours += employeeAttendance.totals.regularHours;
        companyTotals.overtime += employeeAttendance.totals.overtime;
        companyTotals.sick += employeeAttendance.totals.sick;
        companyTotals.vacation += employeeAttendance.totals.vacation;
        companyTotals.holiday += employeeAttendance.totals.holiday;
        companyTotals.totalHours += employeeAttendance.totals.totalHours;
        companyTotals.presentCount += presentDays;
        companyTotals.absentCount += absentDays;
        
        summaryHtml += `
            <tr>
                <td>${employee.empNo || 'N/A'}</td>
                <td>${employee.fullName}</td>
                <td>${employee.department}</td>
                <td>${employee.workSite || 'Office'}</td>
                <td>${employeeAttendance.totals.regularHours.toFixed(2)}</td>
                <td>${employeeAttendance.totals.overtime.toFixed(2)}</td>
                <td>${employeeAttendance.totals.sick.toFixed(2)}</td>
                <td>${employeeAttendance.totals.vacation.toFixed(2)}</td>
                <td>${employeeAttendance.totals.holiday.toFixed(2)}</td>
                <td>${employeeAttendance.totals.totalHours.toFixed(2)}</td>
                <td>
                    <button class="btn small-btn view-timesheet-btn" data-id="${employee.empNo || employee.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
    });
    
    // Add company totals row
    summaryHtml += `
            <tr class="total-row">
                <td colspan="3">COMPANY TOTALS</td>
                <td>${companyTotals.regularHours.toFixed(2)}</td>
                <td>${companyTotals.overtime.toFixed(2)}</td>
                <td>${companyTotals.sick.toFixed(2)}</td>
                <td>${companyTotals.vacation.toFixed(2)}</td>
                <td>${companyTotals.holiday.toFixed(2)}</td>
                <td>${companyTotals.totalHours.toFixed(2)}</td>
                <td></td>
            </tr>
        </tbody>
    </table>
    `;
    
    timesheetWrapper.innerHTML = summaryHtml;
    
    // Add event listeners to view buttons
    const viewButtons = document.querySelectorAll('.view-timesheet-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const employeeId = button.dataset.id;
            employeeSelect.value = employeeId;
            loadSingleEmployeeTimesheet(employeeId, weekValue);
        });
    });
    
    // Update summary cards
    document.getElementById('present-count').textContent = companyTotals.presentCount;
    document.getElementById('absent-count').textContent = companyTotals.absentCount;
    document.getElementById('overtime-hours').textContent = `${companyTotals.overtime.toFixed(2)} hrs`;
    document.getElementById('sick-count').textContent = `${companyTotals.sick.toFixed(2)} hrs`;
}

// Save timesheet data
function saveTimesheet() {
    const weekValue = weekSelector.value;
    const employeeId = employeeSelect.value;
    
    if (!weekValue) {
        alert('Please select a week');
        return;
    }
    
    if (!employeeId) {
        alert('Please select an employee');
        return;
    }
    
    // Calculate hours to ensure everything is up to date
    calculateHours(employeeId, weekValue);
    
    // Show success message
    alert('Timesheet saved successfully!');
    
    // Log activity
    if (window.EmployeeManager) {
        // Get employee name
        const employees = window.EmployeeManager.getAll();
        const employee = employees.find(emp => emp.id === employeeId);
        if (employee) {
            window.EmployeeManager.logActivity(`Saved timesheet for ${employee.fullName} (${employeeId}) for week ${weekValue}`);
        }
    }
}

// Update attendance summary cards
function updateAttendanceSummary(employeeAttendance) {
    // Calculate present days (days with hours > 0)
    const presentDays = employeeAttendance.days.filter(day => day.totalHours > 0).length;
    const absentDays = 7 - presentDays;
    
    // Update summary cards
    document.getElementById('present-count').textContent = presentDays;
    document.getElementById('absent-count').textContent = absentDays;
    document.getElementById('overtime-hours').textContent = `${employeeAttendance.totals.overtime.toFixed(2)} hrs`;
    document.getElementById('sick-count').textContent = employeeAttendance.days.filter(day => day.sick).length;
}

// Helper function to get dates for a week
function getWeekDates(weekString) {
    // Parse the week string (format: YYYY-Www)
    const year = parseInt(weekString.substring(0, 4));
    const weekNum = parseInt(weekString.substring(6, 8));
    
    // Find the first day of the year
    const firstDayOfYear = new Date(year, 0, 1);
    
    // Find the first day of the week (Monday)
    const firstDayOfWeek = new Date(firstDayOfYear);
    firstDayOfWeek.setDate(firstDayOfYear.getDate() + (1 - firstDayOfYear.getDay()) + (weekNum - 1) * 7);
    
    // Generate array of dates for the week
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(firstDayOfWeek);
        date.setDate(firstDayOfWeek.getDate() + i);
        dates.push(date);
    }
    
    return dates;
}

// Helper function to create empty attendance data
function createEmptyAttendance(dates) {
    const days = dates.map(() => ({
        startTime: '',
        endTime: '',
        regularHours: 0,
        overtime: 0,
        sick: false,
        vacation: false,
        holiday: false,
        totalHours: 0
    }));
    
    return {
        days: days,
        totals: {
            regularHours: 0,
            overtime: 0,
            sick: 0,
            vacation: 0,
            holiday: 0,
            totalHours: 0,
            totalPay: 0
        }
    };
}

// Helper function to format date as "Day, Month Date, Year"
function formatDayDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Helper function to format date as "Month Date, Year"
function formatDate(date) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}