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
                    
                    // Generate and download report
                    downloadReport(reportTitle, 'PDF');
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
                    downloadReport(reportType, reportFormat);
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
            
            // Function to download report
            function downloadReport(reportTitle, format) {
                try {
                    // Show loading notification
                    const notification = document.createElement('div');
                    notification.className = 'download-notification';
                    notification.innerHTML = `
                        <div style="position: fixed; bottom: 20px; right: 20px; background-color: #2196F3; color: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 9999;">
                            <div style="display: flex; align-items: center;">
                                <i class="fas fa-spinner fa-spin" style="margin-right: 10px;"></i>
                                <span>Preparing ${reportTitle} report for download...</span>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(notification);
                    
                    // Simulate processing time
                    setTimeout(() => {
                        // Remove loading notification
                        document.body.removeChild(notification);
                        
                        // Create sample data based on report type
                        let data;
                        let filename;
                        
                        switch(reportTitle) {
                            case 'Employee Summary':
                                data = generateEmployeeReportData();
                                filename = 'employee_summary';
                                break;
                            case 'Attendance Overview':
                                data = generateAttendanceReportData();
                                filename = 'attendance_overview';
                                break;
                            case 'Department Distribution':
                                data = generateDepartmentReportData();
                                filename = 'department_distribution';
                                break;
                            case 'Payroll Summary':
                                data = generatePayrollReportData();
                                filename = 'payroll_summary';
                                break;
                            case 'Leave Analysis':
                                data = generateLeaveReportData();
                                filename = 'leave_analysis';
                                break;
                            case 'Master Staff List':
                                data = generateMasterStaffListData();
                                filename = 'master_staff_list';
                                break;
                            case 'Leave Balance Report':
                                data = generateLeaveBalanceReportData();
                                filename = 'leave_balance_report';
                                break;
                            case 'Attendance Department-wise':
                                data = generateAttendanceDepartmentWiseData();
                                filename = 'attendance_department_wise';
                                break;
                            case 'Leave Taken Report':
                                data = generateLeaveTakenReportData();
                                filename = 'leave_taken_report';
                                break;
                            case 'Comprehensive Report':
                            default:
                                data = generateComprehensiveReportData();
                                filename = 'comprehensive_report';
                                break;
                        }
                        
                        // Format date for filename
                        const date = new Date();
                        const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                        filename = `${filename}_${dateStr}`;
                        
                        // Create and download file based on format
                        switch(format.toUpperCase()) {
                            case 'CSV':
                                downloadCSV(data, `${filename}.csv`);
                                break;
                            case 'EXCEL':
                                downloadExcel(data, `${filename}.xlsx`);
                                break;
                            case 'PDF':
                            default:
                                downloadPDF(data, `${filename}.pdf`);
                                break;
                        }
                        
                        // Show success notification
                        const successNotification = document.createElement('div');
                        successNotification.className = 'success-notification';
                        successNotification.innerHTML = `
                            <div style="position: fixed; bottom: 20px; right: 20px; background-color: #4CAF50; color: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 9999;">
                                <div style="display: flex; align-items: center;">
                                    <i class="fas fa-check-circle" style="margin-right: 10px;"></i>
                                    <span>${reportTitle} report downloaded successfully!</span>
                                </div>
                            </div>
                        `;
                        document.body.appendChild(successNotification);
                        
                        // Remove success notification after 3 seconds
                        setTimeout(() => {
                            document.body.removeChild(successNotification);
                        }, 3000);
                        
                    }, 1500); // Simulate processing time
                } catch (error) {
                    console.error('Error downloading report:', error);
                    alert('An error occurred while downloading the report. Please try again.');
                }
            }
            
            // Function to download CSV
            function downloadCSV(data, filename) {
                // Convert data to CSV format
                let csvContent = '';
                
                // Add headers
                csvContent += Object.keys(data[0]).join(',') + '\n';
                
                // Add rows
                data.forEach(row => {
                    csvContent += Object.values(row).join(',') + '\n';
                });
                
                // Create blob and download
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            
            // Function to download Excel (simplified as CSV for demo)
            function downloadExcel(data, filename) {
                // In a real implementation, you would use a library like SheetJS
                // For this demo, we'll just use CSV with an .xlsx extension
                downloadCSV(data, filename);
            }
            
            // Function to download PDF (simplified for demo)
            function downloadPDF(data, filename) {
                // In a real implementation, you would use a library like jsPDF
                // For this demo, we'll create a simple HTML representation and print it
                
                // Create a hidden iframe for printing
                const printFrame = document.createElement('iframe');
                printFrame.style.position = 'fixed';
                printFrame.style.right = '0';
                printFrame.style.bottom = '0';
                printFrame.style.width = '0';
                printFrame.style.height = '0';
                printFrame.style.border = '0';
                
                document.body.appendChild(printFrame);
                
                // Generate HTML content
                const reportTitle = filename.split('_')[0].replace(/_/g, ' ');
                const dateStr = new Date().toLocaleDateString();
                
                let htmlContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${reportTitle} Report</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            h1 { color: #1976d2; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                            th { background-color: #f2f2f2; }
                            .header { display: flex; justify-content: space-between; align-items: center; }
                            .date { color: #666; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>${reportTitle} Report</h1>
                            <div class="date">Generated on: ${dateStr}</div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                `;
                
                // Add table headers
                const headers = Object.keys(data[0]);
                headers.forEach(header => {
                    htmlContent += `<th>${header}</th>`;
                });
                
                htmlContent += `
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                // Add table rows
                data.forEach(row => {
                    htmlContent += '<tr>';
                    Object.values(row).forEach(value => {
                        htmlContent += `<td>${value}</td>`;
                    });
                    htmlContent += '</tr>';
                });
                
                htmlContent += `
                            </tbody>
                        </table>
                        <div style="margin-top: 30px; text-align: center; color: #666;">
                            &copy; 2025 Fuel Express Pvt. Ltd. All Rights Reserved.
                        </div>
                    </body>
                    </html>
                `;
                
                // Write content to iframe and print
                const frameDoc = printFrame.contentWindow.document;
                frameDoc.open();
                frameDoc.write(htmlContent);
                frameDoc.close();
                
                // Wait for content to load, then print
                printFrame.onload = function() {
                    printFrame.contentWindow.focus();
                    printFrame.contentWindow.print();
                    
                    // Remove iframe after printing
                    setTimeout(() => {
                        document.body.removeChild(printFrame);
                    }, 1000);
                };
            }
            
            // Generate sample data for reports
            function generateEmployeeReportData() {
                return [
                    { 'Employee ID': 'EMP001', 'Name': 'John Smith', 'Department': 'IT', 'Position': 'Developer', 'Status': 'Active', 'Hire Date': '2023-01-15' },
                    { 'Employee ID': 'EMP002', 'Name': 'Jane Doe', 'Department': 'HR', 'Position': 'Manager', 'Status': 'Active', 'Hire Date': '2022-05-20' },
                    { 'Employee ID': 'EMP003', 'Name': 'Robert Johnson', 'Department': 'Finance', 'Position': 'Accountant', 'Status': 'Active', 'Hire Date': '2023-03-10' },
                    { 'Employee ID': 'EMP004', 'Name': 'Sarah Williams', 'Department': 'Sales', 'Position': 'Representative', 'Status': 'Active', 'Hire Date': '2022-11-05' },
                    { 'Employee ID': 'EMP005', 'Name': 'Michael Brown', 'Department': 'Operations', 'Position': 'Supervisor', 'Status': 'Active', 'Hire Date': '2023-02-18' }
                ];
            }
            
            function generateAttendanceReportData() {
                return [
                    { 'Date': '2025-04-01', 'Present': 145, 'Absent': 5, 'Late': 3, 'Attendance Rate': '96.7%' },
                    { 'Date': '2025-04-02', 'Present': 142, 'Absent': 8, 'Late': 5, 'Attendance Rate': '94.7%' },
                    { 'Date': '2025-04-03', 'Present': 147, 'Absent': 3, 'Late': 2, 'Attendance Rate': '98.0%' },
                    { 'Date': '2025-04-04', 'Present': 140, 'Absent': 10, 'Late': 4, 'Attendance Rate': '93.3%' },
                    { 'Date': '2025-04-05', 'Present': 138, 'Absent': 12, 'Late': 6, 'Attendance Rate': '92.0%' }
                ];
            }
            
            function generateDepartmentReportData() {
                return [
                    { 'Department': 'IT', 'Employees': 42, 'Percentage': '28%', 'Avg Salary': '$4,200' },
                    { 'Department': 'Operations', 'Employees': 38, 'Percentage': '25%', 'Avg Salary': '$3,800' },
                    { 'Department': 'Sales', 'Employees': 35, 'Percentage': '23%', 'Avg Salary': '$3,500' },
                    { 'Department': 'Finance', 'Employees': 20, 'Percentage': '13%', 'Avg Salary': '$4,500' },
                    { 'Department': 'HR', 'Employees': 15, 'Percentage': '10%', 'Avg Salary': '$3,900' }
                ];
            }
            
            function generatePayrollReportData() {
                return [
                    { 'Month': 'January', 'Total Payroll': '$465,000', 'Avg Salary': '$3,100', 'Bonuses': '$12,500', 'Deductions': '$45,000' },
                    { 'Month': 'February', 'Total Payroll': '$470,000', 'Avg Salary': '$3,133', 'Bonuses': '$13,000', 'Deductions': '$45,500' },
                    { 'Month': 'March', 'Total Payroll': '$475,000', 'Avg Salary': '$3,167', 'Bonuses': '$13,500', 'Deductions': '$46,000' },
                    { 'Month': 'April', 'Total Payroll': '$480,000', 'Avg Salary': '$3,200', 'Bonuses': '$14,000', 'Deductions': '$46,500' },
                    { 'Month': 'May', 'Total Payroll': '$485,000', 'Avg Salary': '$3,233', 'Bonuses': '$14,500', 'Deductions': '$47,000' },
                    { 'Month': 'June', 'Total Payroll': '$487,500', 'Avg Salary': '$3,250', 'Bonuses': '$15,000', 'Deductions': '$47,500' }
                ];
            }
            
            function generateLeaveReportData() {
                return [
                    { 'Leave Type': 'Annual Leave', 'Days Taken': 120, 'Employees': 45, 'Avg Days/Employee': 2.7 },
                    { 'Leave Type': 'Sick Leave', 'Days Taken': 45, 'Employees': 30, 'Avg Days/Employee': 1.5 },
                    { 'Leave Type': 'Personal Leave', 'Days Taken': 30, 'Employees': 20, 'Avg Days/Employee': 1.5 },
                    { 'Leave Type': 'Maternity Leave', 'Days Taken': 60, 'Employees': 2, 'Avg Days/Employee': 30.0 },
                    { 'Leave Type': 'Other Leave', 'Days Taken': 15, 'Employees': 10, 'Avg Days/Employee': 1.5 }
                ];
            }
            
            function generateComprehensiveReportData() {
                return [
                    ...generateEmployeeReportData(),
                    ...generateAttendanceReportData(),
                    ...generateDepartmentReportData(),
                    ...generatePayrollReportData(),
                    ...generateLeaveReportData()
                ];
            }
            
            // Generate Master Staff List report data
            function generateMasterStaffListData() {
                return [
                    { 'Staff ID': 'EMP001', 'Full Name': 'John Smith', 'Department': 'IT', 'Position': 'Senior Developer', 'Join Date': '2022-05-15', 'Contact Number': '+960 771-2345', 'Email': 'john.smith@fuelexpress.mv', 'Status': 'Active' },
                    { 'Staff ID': 'EMP002', 'Full Name': 'Jane Doe', 'Department': 'HR', 'Position': 'HR Manager', 'Join Date': '2021-08-10', 'Contact Number': '+960 772-3456', 'Email': 'jane.doe@fuelexpress.mv', 'Status': 'Active' },
                    { 'Staff ID': 'EMP003', 'Full Name': 'Ahmed Hassan', 'Department': 'Operations', 'Position': 'Station Manager', 'Join Date': '2022-01-20', 'Contact Number': '+960 773-4567', 'Email': 'ahmed.hassan@fuelexpress.mv', 'Status': 'Active' },
                    { 'Staff ID': 'EMP004', 'Full Name': 'Fathimath Ali', 'Department': 'Finance', 'Position': 'Accountant', 'Join Date': '2023-03-05', 'Contact Number': '+960 774-5678', 'Email': 'fathimath.ali@fuelexpress.mv', 'Status': 'Active' },
                    { 'Staff ID': 'EMP005', 'Full Name': 'Ibrahim Naseer', 'Department': 'Sales', 'Position': 'Sales Executive', 'Join Date': '2022-11-12', 'Contact Number': '+960 775-6789', 'Email': 'ibrahim.naseer@fuelexpress.mv', 'Status': 'Active' },
                    { 'Staff ID': 'EMP006', 'Full Name': 'Mariyam Waheed', 'Department': 'IT', 'Position': 'System Administrator', 'Join Date': '2023-01-15', 'Contact Number': '+960 776-7890', 'Email': 'mariyam.waheed@fuelexpress.mv', 'Status': 'Active' },
                    { 'Staff ID': 'EMP007', 'Full Name': 'Hussein Ahmed', 'Department': 'Operations', 'Position': 'Fuel Attendant', 'Join Date': '2023-02-28', 'Contact Number': '+960 777-8901', 'Email': 'hussein.ahmed@fuelexpress.mv', 'Status': 'Active' },
                    { 'Staff ID': 'EMP008', 'Full Name': 'Aishath Latheef', 'Department': 'Admin', 'Position': 'Administrative Assistant', 'Join Date': '2022-07-10', 'Contact Number': '+960 778-9012', 'Email': 'aishath.latheef@fuelexpress.mv', 'Status': 'Active' },
                    { 'Staff ID': 'EMP009', 'Full Name': 'Mohamed Rasheed', 'Department': 'Maintenance', 'Position': 'Maintenance Supervisor', 'Join Date': '2021-12-05', 'Contact Number': '+960 779-0123', 'Email': 'mohamed.rasheed@fuelexpress.mv', 'Status': 'Active' },
                    { 'Staff ID': 'EMP010', 'Full Name': 'Aminath Shafia', 'Department': 'Customer Service', 'Position': 'Customer Service Representative', 'Join Date': '2023-04-01', 'Contact Number': '+960 770-1234', 'Email': 'aminath.shafia@fuelexpress.mv', 'Status': 'Active' }
                ];
            }
            
            // Generate Leave Balance Report data
            function generateLeaveBalanceReportData() {
                return [
                    { 'Staff ID': 'EMP001', 'Name': 'John Smith', 'Department': 'IT', 'Annual Leave Balance': 18, 'Sick Leave Balance': 12, 'Personal Leave Balance': 3, 'Total Leave Balance': 33 },
                    { 'Staff ID': 'EMP002', 'Name': 'Jane Doe', 'Department': 'HR', 'Annual Leave Balance': 15, 'Sick Leave Balance': 10, 'Personal Leave Balance': 2, 'Total Leave Balance': 27 },
                    { 'Staff ID': 'EMP003', 'Name': 'Ahmed Hassan', 'Department': 'Operations', 'Annual Leave Balance': 20, 'Sick Leave Balance': 12, 'Personal Leave Balance': 3, 'Total Leave Balance': 35 },
                    { 'Staff ID': 'EMP004', 'Name': 'Fathimath Ali', 'Department': 'Finance', 'Annual Leave Balance': 22, 'Sick Leave Balance': 12, 'Personal Leave Balance': 3, 'Total Leave Balance': 37 },
                    { 'Staff ID': 'EMP005', 'Name': 'Ibrahim Naseer', 'Department': 'Sales', 'Annual Leave Balance': 12, 'Sick Leave Balance': 8, 'Personal Leave Balance': 1, 'Total Leave Balance': 21 },
                    { 'Staff ID': 'EMP006', 'Name': 'Mariyam Waheed', 'Department': 'IT', 'Annual Leave Balance': 24, 'Sick Leave Balance': 12, 'Personal Leave Balance': 3, 'Total Leave Balance': 39 },
                    { 'Staff ID': 'EMP007', 'Name': 'Hussein Ahmed', 'Department': 'Operations', 'Annual Leave Balance': 23, 'Sick Leave Balance': 12, 'Personal Leave Balance': 3, 'Total Leave Balance': 38 },
                    { 'Staff ID': 'EMP008', 'Name': 'Aishath Latheef', 'Department': 'Admin', 'Annual Leave Balance': 18, 'Sick Leave Balance': 10, 'Personal Leave Balance': 2, 'Total Leave Balance': 30 },
                    { 'Staff ID': 'EMP009', 'Name': 'Mohamed Rasheed', 'Department': 'Maintenance', 'Annual Leave Balance': 16, 'Sick Leave Balance': 9, 'Personal Leave Balance': 2, 'Total Leave Balance': 27 },
                    { 'Staff ID': 'EMP010', 'Name': 'Aminath Shafia', 'Department': 'Customer Service', 'Annual Leave Balance': 25, 'Sick Leave Balance': 12, 'Personal Leave Balance': 3, 'Total Leave Balance': 40 }
                ];
            }
            
            // Generate Attendance Department-wise Report data
            function generateAttendanceDepartmentWiseData() {
                return [
                    { 'Department': 'IT', 'Date': '2025-04-01', 'Total Staff': 15, 'Present': 14, 'Absent': 1, 'Late': 2, 'Attendance %': '93.3%', 'Department Head': 'Yoosuf Naseem', 'HR Signature': 'Jane Doe' },
                    { 'Department': 'Operations', 'Date': '2025-04-01', 'Total Staff': 25, 'Present': 23, 'Absent': 2, 'Late': 3, 'Attendance %': '92.0%', 'Department Head': 'Ali Waheed', 'HR Signature': 'Jane Doe' },
                    { 'Department': 'Finance', 'Date': '2025-04-01', 'Total Staff': 10, 'Present': 10, 'Absent': 0, 'Late': 1, 'Attendance %': '100.0%', 'Department Head': 'Hawwa Zahir', 'HR Signature': 'Jane Doe' },
                    { 'Department': 'Sales', 'Date': '2025-04-01', 'Total Staff': 18, 'Present': 16, 'Absent': 2, 'Late': 1, 'Attendance %': '88.9%', 'Department Head': 'Ibrahim Rasheed', 'HR Signature': 'Jane Doe' },
                    { 'Department': 'HR', 'Date': '2025-04-01', 'Total Staff': 8, 'Present': 8, 'Absent': 0, 'Late': 0, 'Attendance %': '100.0%', 'Department Head': 'Jane Doe', 'HR Signature': 'Jane Doe' },
                    { 'Department': 'Admin', 'Date': '2025-04-01', 'Total Staff': 5, 'Present': 5, 'Absent': 0, 'Late': 1, 'Attendance %': '100.0%', 'Department Head': 'Fathimath Naseem', 'HR Signature': 'Jane Doe' },
                    { 'Department': 'Maintenance', 'Date': '2025-04-01', 'Total Staff': 12, 'Present': 11, 'Absent': 1, 'Late': 2, 'Attendance %': '91.7%', 'Department Head': 'Mohamed Rasheed', 'HR Signature': 'Jane Doe' },
                    { 'Department': 'Customer Service', 'Date': '2025-04-01', 'Total Staff': 10, 'Present': 9, 'Absent': 1, 'Late': 0, 'Attendance %': '90.0%', 'Department Head': 'Aminath Shafia', 'HR Signature': 'Jane Doe' },
                    { 'Department': 'IT', 'Date': '2025-04-02', 'Total Staff': 15, 'Present': 15, 'Absent': 0, 'Late': 1, 'Attendance %': '100.0%', 'Department Head': 'Yoosuf Naseem', 'HR Signature': 'Jane Doe' },
                    { 'Department': 'Operations', 'Date': '2025-04-02', 'Total Staff': 25, 'Present': 22, 'Absent': 3, 'Late': 2, 'Attendance %': '88.0%', 'Department Head': 'Ali Waheed', 'HR Signature': 'Jane Doe' }
                ];
            }
            
            // Generate Leave Taken Report data
            function generateLeaveTakenReportData() {
                return [
                    { 'Staff ID': 'EMP001', 'Name': 'John Smith', 'Department': 'IT', 'Leave Type': 'Annual Leave', 'Start Date': '2025-03-10', 'End Date': '2025-03-15', 'Duration (Days)': 6, 'Status': 'Approved', 'Approved By': 'Yoosuf Naseem' },
                    { 'Staff ID': 'EMP002', 'Name': 'Jane Doe', 'Department': 'HR', 'Leave Type': 'Sick Leave', 'Start Date': '2025-03-22', 'End Date': '2025-03-23', 'Duration (Days)': 2, 'Status': 'Approved', 'Approved By': 'Ahmed Rasheed' },
                    { 'Staff ID': 'EMP003', 'Name': 'Ahmed Hassan', 'Department': 'Operations', 'Leave Type': 'Personal Leave', 'Start Date': '2025-04-05', 'End Date': '2025-04-05', 'Duration (Days)': 1, 'Status': 'Approved', 'Approved By': 'Ali Waheed' },
                    { 'Staff ID': 'EMP004', 'Name': 'Fathimath Ali', 'Department': 'Finance', 'Leave Type': 'Annual Leave', 'Start Date': '2025-04-10', 'End Date': '2025-04-14', 'Duration (Days)': 5, 'Status': 'Pending', 'Approved By': '-' },
                    { 'Staff ID': 'EMP005', 'Name': 'Ibrahim Naseer', 'Department': 'Sales', 'Leave Type': 'Sick Leave', 'Start Date': '2025-03-18', 'End Date': '2025-03-19', 'Duration (Days)': 2, 'Status': 'Approved', 'Approved By': 'Ibrahim Rasheed' },
                    { 'Staff ID': 'EMP006', 'Name': 'Mariyam Waheed', 'Department': 'IT', 'Leave Type': 'Annual Leave', 'Start Date': '2025-05-01', 'End Date': '2025-05-07', 'Duration (Days)': 7, 'Status': 'Pending', 'Approved By': '-' },
                    { 'Staff ID': 'EMP007', 'Name': 'Hussein Ahmed', 'Department': 'Operations', 'Leave Type': 'Sick Leave', 'Start Date': '2025-03-25', 'End Date': '2025-03-26', 'Duration (Days)': 2, 'Status': 'Approved', 'Approved By': 'Ali Waheed' },
                    { 'Staff ID': 'EMP008', 'Name': 'Aishath Latheef', 'Department': 'Admin', 'Leave Type': 'Personal Leave', 'Start Date': '2025-04-02', 'End Date': '2025-04-02', 'Duration (Days)': 1, 'Status': 'Approved', 'Approved By': 'Fathimath Naseem' },
                    { 'Staff ID': 'EMP009', 'Name': 'Mohamed Rasheed', 'Department': 'Maintenance', 'Leave Type': 'Annual Leave', 'Start Date': '2025-04-15', 'End Date': '2025-04-20', 'Duration (Days)': 6, 'Status': 'Approved', 'Approved By': 'Ahmed Rasheed' },
                    { 'Staff ID': 'EMP010', 'Name': 'Aminath Shafia', 'Department': 'Customer Service', 'Leave Type': 'Sick Leave', 'Start Date': '2025-03-30', 'End Date': '2025-03-31', 'Duration (Days)': 2, 'Status': 'Approved', 'Approved By': 'Ahmed Rasheed' }
                ];
            }
            
            console.log('Report actions set up');
        } catch (error) {
            console.error('Error setting up report actions:', error);
        }
    }
});
