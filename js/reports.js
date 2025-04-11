// Reports Module JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initCharts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Function to initialize all charts
    function initCharts() {
        // Employee Chart
        const employeeCtx = document.getElementById('employee-chart').getContext('2d');
        const employeeChart = new Chart(employeeCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Total Employees',
                    data: [138, 142, 145, 148, 150, 150],
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    tension: 0.3,
                    fill: true
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
                        min: 130
                    }
                }
            }
        });
        
        // Attendance Chart
        const attendanceCtx = document.getElementById('attendance-chart').getContext('2d');
        const attendanceChart = new Chart(attendanceCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [{
                    label: 'Present',
                    data: [140, 142, 138, 145, 135],
                    backgroundColor: '#4caf50'
                }, {
                    label: 'Absent',
                    data: [10, 8, 12, 5, 15],
                    backgroundColor: '#f44336'
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
                        beginAtZero: true,
                        stacked: false
                    },
                    x: {
                        stacked: false
                    }
                }
            }
        });
        
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
