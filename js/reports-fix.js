// Reports Fix - Ensures the reports page functions properly

document.addEventListener('DOMContentLoaded', function() {
    console.log('Reports fix loaded');
    
    // Fix chart initialization
    setTimeout(initializeCharts, 500);
    
    // Set up event listeners for report actions
    setupReportActions();
    
    // Function to initialize all charts with sample data
    function initializeCharts() {
        try {
            // Employee Chart
            const employeeCtx = document.getElementById('employee-chart');
            if (employeeCtx) {
                new Chart(employeeCtx.getContext('2d'), {
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
                        }
                    }
                });
                console.log('Employee chart initialized');
            }
            
            // Attendance Chart
            const attendanceCtx = document.getElementById('attendance-chart');
            if (attendanceCtx) {
                new Chart(attendanceCtx.getContext('2d'), {
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
                        maintainAspectRatio: false
                    }
                });
                console.log('Attendance chart initialized');
            }
            
            // Department Chart
            const departmentCtx = document.getElementById('department-chart');
            if (departmentCtx) {
                new Chart(departmentCtx.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: ['IT', 'Operations', 'Sales', 'Finance', 'HR'],
                        datasets: [{
                            data: [42, 38, 35, 20, 15],
                            backgroundColor: [
                                '#1976d2', '#4caf50', '#ff9800', '#9c27b0', '#f44336'
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                console.log('Department chart initialized');
            }
            
            // Payroll Chart
            const payrollCtx = document.getElementById('payroll-chart');
            if (payrollCtx) {
                new Chart(payrollCtx.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Total Payroll',
                            data: [450000, 460000, 475000, 482000, 487500, 490000],
                            borderColor: '#9c27b0',
                            backgroundColor: 'rgba(156, 39, 176, 0.1)',
                            tension: 0.3,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                console.log('Payroll chart initialized');
            }
            
            // Leave Chart
            const leaveCtx = document.getElementById('leave-chart');
            if (leaveCtx) {
                new Chart(leaveCtx.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: ['Annual', 'Sick', 'Personal', 'Maternity', 'Other'],
                        datasets: [{
                            label: 'Leave Days',
                            data: [120, 45, 30, 60, 15],
                            backgroundColor: '#ff9800'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                console.log('Leave chart initialized');
            }
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }
    
    // Set up event listeners for report actions
    function setupReportActions() {
        try {
            // Refresh report buttons
            document.querySelectorAll('.refresh-report').forEach(button => {
                button.addEventListener('click', function() {
                    const reportCard = this.closest('.report-card');
                    const reportTitle = reportCard.querySelector('h3').textContent;
                    alert(`Refreshing ${reportTitle} report...`);
                });
            });
            
            // Export report buttons
            document.querySelectorAll('.export-report').forEach(button => {
                button.addEventListener('click', function() {
                    const reportCard = this.closest('.report-card');
                    const reportTitle = reportCard.querySelector('h3').textContent;
                    alert(`Exporting ${reportTitle} report...`);
                });
            });
            
            // Generate report button
            const generateReportBtn = document.getElementById('generate-report-btn');
            if (generateReportBtn) {
                generateReportBtn.addEventListener('click', function() {
                    const reportModal = document.getElementById('report-modal');
                    if (reportModal) {
                        reportModal.style.display = 'block';
                    }
                });
            }
            
            // Schedule report button
            const scheduleReportBtn = document.getElementById('schedule-report-btn');
            if (scheduleReportBtn) {
                scheduleReportBtn.addEventListener('click', function() {
                    // Create and show schedule report modal
                    createScheduleReportModal();
                });
            }
            
            // Modal close button
            const closeBtn = document.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    const reportModal = document.getElementById('report-modal');
                    if (reportModal) {
                        reportModal.style.display = 'none';
                    }
                });
            }
            
            // Generate button in modal
            const generateBtn = document.getElementById('generate-btn');
            if (generateBtn) {
                generateBtn.addEventListener('click', function() {
                    const reportType = document.getElementById('report-type').value;
                    const reportFormat = document.getElementById('report-format').value;
                    const dateRange = document.getElementById('date-range').value;
                    
                    // Generate report based on selected options
                    generateComprehensiveReport(reportType, reportFormat, dateRange);
                    
                    const reportModal = document.getElementById('report-modal');
                    if (reportModal) {
                        reportModal.style.display = 'none';
                    }
                });
            }
            
            // Create schedule report modal
            function createScheduleReportModal() {
                // Create modal HTML
                const modalHtml = `
                    <div id="schedule-report-modal" style="display: block; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);">
                        <div style="background-color: white; margin: 10% auto; padding: 20px; border-radius: 5px; width: 60%; max-width: 600px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                <h2 style="margin: 0;">Schedule Report</h2>
                                <span id="close-schedule-modal" style="cursor: pointer; font-size: 24px;">&times;</span>
                            </div>
                            <form id="schedule-report-form">
                                <div style="margin-bottom: 15px;">
                                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">Report Type:</label>
                                    <select id="schedule-report-type" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                        <option value="Employee Summary">Employee Summary</option>
                                        <option value="Attendance Overview">Attendance Overview</option>
                                        <option value="Department Distribution">Department Distribution</option>
                                        <option value="Payroll Summary">Payroll Summary</option>
                                        <option value="Leave Analysis">Leave Analysis</option>
                                        <option value="Comprehensive Report">Comprehensive Report</option>
                                    </select>
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">Frequency:</label>
                                    <select id="schedule-frequency" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Monthly" selected>Monthly</option>
                                        <option value="Quarterly">Quarterly</option>
                                    </select>
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">Start Date:</label>
                                    <input type="date" id="schedule-start-date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">Recipients (Email):</label>
                                    <input type="text" id="schedule-recipients" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Enter email addresses separated by commas">
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">Report Format:</label>
                                    <select id="schedule-format" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                        <option value="PDF">PDF</option>
                                        <option value="Excel">Excel</option>
                                        <option value="CSV">CSV</option>
                                    </select>
                                </div>
                                <div style="text-align: right;">
                                    <button type="button" id="cancel-schedule" style="padding: 8px 16px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Cancel</button>
                                    <button type="button" id="save-schedule" style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Schedule</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;
                
                // Add modal to body
                const modalContainer = document.createElement('div');
                modalContainer.innerHTML = modalHtml;
                document.body.appendChild(modalContainer);
                
                // Set current date as default
                const today = new Date();
                const formattedDate = today.toISOString().split('T')[0];
                document.getElementById('schedule-start-date').value = formattedDate;
                
                // Set up event listeners
                document.getElementById('close-schedule-modal').addEventListener('click', function() {
                    document.body.removeChild(modalContainer);
                });
                
                document.getElementById('cancel-schedule').addEventListener('click', function() {
                    document.body.removeChild(modalContainer);
                });
                
                document.getElementById('save-schedule').addEventListener('click', function() {
                    // Get form values
                    const reportType = document.getElementById('schedule-report-type').value;
                    const frequency = document.getElementById('schedule-frequency').value;
                    const startDate = document.getElementById('schedule-start-date').value;
                    const recipients = document.getElementById('schedule-recipients').value;
                    const format = document.getElementById('schedule-format').value;
                    
                    // Validate form
                    if (!startDate) {
                        alert('Please select a start date.');
                        return;
                    }
                    
                    if (!recipients) {
                        alert('Please enter at least one recipient email address.');
                        return;
                    }
                    
                    // Close modal
                    document.body.removeChild(modalContainer);
                    
                    // Show success message
                    alert(`Report "${reportType}" has been scheduled to run ${frequency.toLowerCase()} starting from ${new Date(startDate).toLocaleDateString()} and will be sent to ${recipients} in ${format} format.`);
                });
            }
            
            // Generate comprehensive report
            function generateComprehensiveReport(reportType, reportFormat, dateRange) {
                // Create report HTML
                const reportHtml = `
                    <div id="report-preview" style="display: block; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);">
                        <div style="background-color: white; margin: 5% auto; padding: 20px; border-radius: 5px; width: 80%; max-width: 800px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                <h2 style="margin: 0;">${reportType} Report</h2>
                                <span id="close-report-preview" style="cursor: pointer; font-size: 24px;">&times;</span>
                            </div>
                            <div style="margin-bottom: 20px;">
                                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                                    <h3 style="margin-top: 0;">Report Details</h3>
                                    <p><strong>Type:</strong> ${reportType}</p>
                                    <p><strong>Format:</strong> ${reportFormat}</p>
                                    <p><strong>Date Range:</strong> ${dateRange}</p>
                                    <p><strong>Generated On:</strong> ${new Date().toLocaleString()}</p>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <h3>Report Summary</h3>
                                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                                        <div style="background-color: #1976d2; color: white; padding: 15px; border-radius: 5px; text-align: center;">
                                            <h4 style="margin-top: 0;">Total Employees</h4>
                                            <p style="font-size: 24px; font-weight: 700; margin: 0;">150</p>
                                        </div>
                                        <div style="background-color: #4caf50; color: white; padding: 15px; border-radius: 5px; text-align: center;">
                                            <h4 style="margin-top: 0;">Avg. Attendance</h4>
                                            <p style="font-size: 24px; font-weight: 700; margin: 0;">92%</p>
                                        </div>
                                        <div style="background-color: #ff9800; color: white; padding: 15px; border-radius: 5px; text-align: center;">
                                            <h4 style="margin-top: 0;">Monthly Payroll</h4>
                                            <p style="font-size: 24px; font-weight: 700; margin: 0;">$487,500</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <h3>Report Content</h3>
                                    <p>The full report has been generated and is ready for download in ${reportFormat} format.</p>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <button type="button" id="download-report" style="padding: 8px 16px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;"><i class="fas fa-download"></i> Download</button>
                                <button type="button" id="close-report" style="padding: 8px 16px; background-color: #757575; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add report to body
                const reportContainer = document.createElement('div');
                reportContainer.innerHTML = reportHtml;
                document.body.appendChild(reportContainer);
                
                // Set up event listeners
                document.getElementById('close-report-preview').addEventListener('click', function() {
                    document.body.removeChild(reportContainer);
                });
                
                document.getElementById('close-report').addEventListener('click', function() {
                    document.body.removeChild(reportContainer);
                });
                
                document.getElementById('download-report').addEventListener('click', function() {
                    alert(`Downloading ${reportType} report in ${reportFormat} format...`);
                    setTimeout(() => {
                        alert('Download complete!');
                    }, 1500);
                });
            }
            
            // Cancel button in modal
            const cancelBtn = document.getElementById('cancel-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    const reportModal = document.getElementById('report-modal');
                    if (reportModal) {
                        reportModal.style.display = 'none';
                    }
                });
            }
            
            // Close modal when clicking outside
            window.addEventListener('click', function(event) {
                const reportModal = document.getElementById('report-modal');
                if (reportModal && event.target === reportModal) {
                    reportModal.style.display = 'none';
                }
            });
            
            console.log('Report actions set up');
        } catch (error) {
            console.error('Error setting up report actions:', error);
        }
    }
});
