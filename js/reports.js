// Reports Module JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Global variables to store report data
    let employeeData = [];
    let attendanceData = {};
    let leaveData = {};
    let payrollData = {};
    let departmentStats = {};
    
    // Check if user is authorized
    checkUserAuthorization();
    
    // Load all data needed for reports
    loadReportData();
    
    // Initialize charts
    setTimeout(() => {
        initCharts();
    }, 1000);
    
    // Set up event listeners
    setupEventListeners();
    
    // Check user authorization
    function checkUserAuthorization() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
        const isAdmin = currentUser.role === 'admin';
        const isHR = currentUser.role === 'hr';
        const isManager = currentUser.position && currentUser.position.toLowerCase().includes('manager');
        
        // If not authorized, redirect to dashboard
        if (!isAdmin && !isHR && !isManager) {
            showNotification('You do not have permission to access reports.', 'error');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
            return false;
        }
        
        return true;
    }
    
    // Load all data needed for reports
    function loadReportData() {
        // Show loading indicators
        document.querySelectorAll('.report-content').forEach(container => {
            container.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Loading data...</div>';
        });
        
        // Load employee data
        loadEmployeeData();
        
        // Load attendance data
        loadAttendanceData();
        
        // Load leave data
        loadLeaveData();
        
        // Load payroll data
        loadPayrollData();
    }
    
    // Function to initialize all charts
    function initCharts() {
        // Employee Chart
        initEmployeeChart();
        
        // Attendance Chart
        initAttendanceChart();
        
        // Department Chart
        initDepartmentChart();
        
        // Payroll Chart
        initPayrollChart();
        
        // Leave Chart
        initLeaveChart();
        
        // Update summary statistics
        updateSummaryStats();
    }
    // Load employee data
    function loadEmployeeData() {
        try {
            // Try to get employees from localStorage or EmployeeManager
            if (typeof EmployeeManager !== 'undefined' && typeof EmployeeManager.getAll === 'function') {
                employeeData = EmployeeManager.getAll();
            } else if (localStorage.getItem('employees')) {
                employeeData = JSON.parse(localStorage.getItem('employees'));
            } else if (typeof baseEmployees !== 'undefined') {
                employeeData = baseEmployees;
            } else if (typeof employees !== 'undefined') {
                employeeData = employees;
            } else {
                console.error('Employee data not found');
                employeeData = [];
            }
            
            // Calculate department statistics
            calculateDepartmentStats();
            
            // Update employee summary
            updateEmployeeSummary();
            
        } catch (error) {
            console.error('Error loading employee data:', error);
            showNotification('Error loading employee data', 'error');
        }
    }
    
    // Calculate department statistics
    function calculateDepartmentStats() {
        // Initialize department stats
        departmentStats = {};
        
        // Count employees by department
        employeeData.forEach(emp => {
            const dept = emp.department || 'Other';
            if (!departmentStats[dept]) {
                departmentStats[dept] = {
                    count: 0,
                    totalSalary: 0
                };
            }
            departmentStats[dept].count++;
            
            // Add salary data if available
            if (emp.salary) {
                if (typeof emp.salary === 'number') {
                    departmentStats[dept].totalSalary += emp.salary;
                } else if (emp.salary.USD) {
                    departmentStats[dept].totalSalary += emp.salary.USD;
                }
            }
        });
        
        // Calculate percentages
        const totalEmployees = employeeData.length;
        Object.keys(departmentStats).forEach(dept => {
            departmentStats[dept].percentage = (departmentStats[dept].count / totalEmployees) * 100;
            departmentStats[dept].avgSalary = departmentStats[dept].count > 0 ? 
                departmentStats[dept].totalSalary / departmentStats[dept].count : 0;
        });
    }
        
        // Department Chart
        const departmentCtx = document.getElementById('department-chart').getContext('2d');
        const departmentChart = new Chart(departmentCtx, {
            type: 'doughnut',
            data: {
                labels: ['IT', 'Operations', 'Sales', 'Finance', 'HR'],
                datasets: [{
                    data: [42, 38, 35, 20, 15],
                    backgroundColor: [
                        '#1976d2',
                        '#2196f3',
                        '#64b5f6',
                        '#90caf9',
                        '#bbdefb'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
        
        // Payroll Chart
        const payrollCtx = document.getElementById('payroll-chart').getContext('2d');
        const payrollChart = new Chart(payrollCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Monthly Payroll ($)',
                    data: [465000, 470000, 475000, 480000, 485000, 487500],
                    backgroundColor: '#ff9800'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 450000
                    }
                }
            }
        });
        
        // Leave Chart
        const leaveCtx = document.getElementById('leave-chart').getContext('2d');
        const leaveChart = new Chart(leaveCtx, {
            type: 'pie',
            data: {
                labels: ['Sick Leave', 'Vacation', 'Personal', 'Maternity/Paternity'],
                datasets: [{
                    data: [65, 48, 35, 12],
                    backgroundColor: [
                        '#f44336',
                        '#4caf50',
                        '#ff9800',
                        '#9c27b0'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
        
        // Recruitment Chart
        const recruitmentCtx = document.getElementById('recruitment-chart').getContext('2d');
        const recruitmentChart = new Chart(recruitmentCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Applications',
                    data: [28, 35, 42, 38, 45, 45],
                    borderColor: '#9c27b0',
                    backgroundColor: 'rgba(156, 39, 176, 0.1)',
                    tension: 0.3,
                    fill: true
                }, {
                    label: 'Hires',
                    data: [3, 4, 5, 3, 4, 0],
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Generate Report Button
        const generateReportBtn = document.getElementById('generate-report-btn');
        const reportModal = document.getElementById('report-modal');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancel-btn');
        const generateBtn = document.getElementById('generate-btn');
        const dateRange = document.getElementById('date-range');
        const dateInputs = document.querySelector('.date-inputs');
        
        // Open modal
        generateReportBtn.addEventListener('click', function() {
            reportModal.classList.add('active');
        });
        
        // Close modal
        closeBtn.addEventListener('click', function() {
            reportModal.classList.remove('active');
        });
        
        cancelBtn.addEventListener('click', function() {
            reportModal.classList.remove('active');
        });
        
        // Show/hide date inputs based on selection
        dateRange.addEventListener('change', function() {
            if (this.value === 'custom') {
                dateInputs.classList.remove('hidden');
            } else {
                dateInputs.classList.add('hidden');
            }
        });
        
        // Generate report
        generateBtn.addEventListener('click', function() {
            const reportType = document.getElementById('report-type').value;
            const format = document.getElementById('report-format').value;
            
            // Show loading message
            alert(`Generating ${reportType} report in ${format.toUpperCase()} format...`);
            
            // Close modal
            reportModal.classList.remove('active');
        });
        
        // Refresh report buttons
        document.querySelectorAll('.refresh-report').forEach(button => {
            button.addEventListener('click', function() {
                const card = this.closest('.report-card');
                const header = card.querySelector('h3').textContent;
                
                // Show loading message
                alert(`Refreshing ${header} report...`);
            });
        });
        
        // Export report buttons
        document.querySelectorAll('.export-report').forEach(button => {
            button.addEventListener('click', function() {
                const card = this.closest('.report-card');
                const header = card.querySelector('h3').textContent;
                
                // Show loading message
                alert(`Exporting ${header} report as PDF...`);
            });
        });
        
        // Schedule Report Button
        const scheduleReportBtn = document.getElementById('schedule-report-btn');
        scheduleReportBtn.addEventListener('click', function() {
            alert('Report scheduling feature will be available in the next update.');
        });
    }
});
