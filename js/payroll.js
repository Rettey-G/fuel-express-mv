// Payroll Module JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authorized to access payroll information
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const isAdmin = currentUser.role === 'admin';
    const isHR = currentUser.role === 'hr';
    const isFinance = currentUser.department === 'Finance';
    
    // If not authorized, redirect to dashboard
    if (!isAdmin && !isHR && !isFinance) {
        alert('You do not have permission to access payroll information.');
        window.location.href = '../dashboard.html';
        return;
    }
    
    // Set current month and year in the selectors
    const currentDate = new Date();
    document.getElementById('payroll-month').value = currentDate.getMonth() + 1;
    
    // Update year selector to include more years
    updateYearSelector();
    document.getElementById('payroll-year').value = currentDate.getFullYear();

    // Initialize payroll data
    initializePayroll();

    // Event listeners
    document.getElementById('process-payroll').addEventListener('click', processPayroll);
    document.getElementById('generate-all-payslips').addEventListener('click', generateAllPayslips);
    document.getElementById('export-payroll').addEventListener('click', exportPayrollData);
    document.getElementById('department-filter').addEventListener('change', filterPayrollByDepartment);
    
    // Modal close button
    document.querySelector('.close').addEventListener('click', closePayslipModal);
    
    // Print and download buttons
    document.getElementById('print-payslip').addEventListener('click', printPayslip);
    document.getElementById('download-payslip').addEventListener('click', downloadPayslipPDF);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('payslip-modal');
        if (event.target === modal) {
            closePayslipModal();
        }
    });
});

// Initialize payroll with employee data
function initializePayroll() {
    let employeeData = [];
    
    try {
        // Get employees from EmployeeManager
        if (typeof EmployeeManager !== 'undefined') {
            employeeData = EmployeeManager.getAll();
            console.log('Successfully loaded employees from EmployeeManager:', employeeData.length);
        } else if (typeof baseEmployees !== 'undefined') {
            employeeData = baseEmployees;
            console.log('Successfully loaded employees from baseEmployees:', employeeData.length);
        } else {
            console.error('Employee data not found. Make sure employees.js is properly linked.');
            return;
        }

        // Normalize salary data format
        employeeData = employeeData.map(emp => {
            // Handle different salary formats
            if (emp.salary && typeof emp.salary === 'object') {
                return emp; // Already in correct format {MVR: x, USD: y}
            } else if (emp.salary && typeof emp.salary === 'number') {
                return {
                    ...emp,
                    salary: {
                        USD: emp.salary,
                        MVR: emp.salary * 15.4 // Convert USD to MVR
                    }
                };
            }
            return emp;
        });

        // Filter out employees without salary data
        employeeData = employeeData.filter(emp => emp && emp.salary);
        
        // Store employees in a global variable for use in this module
        window.payrollEmployees = employeeData;
        
        // Populate department filter
        populateDepartmentFilter(employeeData);
        
        // Process and display payroll data
        processPayroll();
        
    } catch (error) {
        console.error('Error initializing payroll:', error);
        alert('Error loading employee data. Please try again.');
    }
}

// Populate department filter with unique departments from employee data
function populateDepartmentFilter(employeeData) {
    const departmentFilter = document.getElementById('department-filter');
    const departments = new Set(['all']);
    
    // Extract unique departments
    employeeData.forEach(emp => {
        if (emp.department) {
            departments.add(emp.department);
        }
    });
    
    // Clear existing options
    departmentFilter.innerHTML = '';
    
    // Add options
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept === 'all' ? 'all' : dept;
        option.textContent = dept === 'all' ? 'All Departments' : dept;
        departmentFilter.appendChild(option);
    });
}

// Update year selector to include more years
function updateYearSelector() {
    const yearSelector = document.getElementById('payroll-year');
    const currentYear = new Date().getFullYear();
    
    // Clear existing options
    yearSelector.innerHTML = '';
    
    // Add options for current year and previous 5 years
    for (let year = currentYear; year >= currentYear - 5; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelector.appendChild(option);
    }
}

// Process payroll data based on selected month and year
function processPayroll() {
    const month = parseInt(document.getElementById('payroll-month').value);
    const year = parseInt(document.getElementById('payroll-year').value);
    const departmentFilter = document.getElementById('department-filter').value;
    
    // Use payrollEmployees instead of employees
    const employeeData = window.payrollEmployees || [];
    
    // Filter employees by department if needed
    let filteredEmployees = employeeData;
    if (departmentFilter !== 'all') {
        filteredEmployees = employeeData.filter(emp => emp.department === departmentFilter);
    }
    
    // Show processing indicator
    document.getElementById('process-payroll').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Calculate payroll for each employee
    const payrollData = filteredEmployees.map(employee => {
        // Handle both old and new salary formats
        const basicSalaryUSD = employee.salary?.USD || (typeof employee.salary === 'number' ? employee.salary : 0);
        const basicSalaryMVR = employee.salary?.MVR || (basicSalaryUSD * 15.4) || 0;
        
        // Calculate allowances (40% of basic salary)
        const allowancesUSD = basicSalaryUSD * 0.4;
        const allowancesMVR = basicSalaryMVR * 0.4;
        
        // Calculate deductions (15% of basic salary)
        const deductionsUSD = basicSalaryUSD * 0.15;
        const deductionsMVR = basicSalaryMVR * 0.15;
        
        // Calculate net salary
        const netSalaryUSD = basicSalaryUSD + allowancesUSD - deductionsUSD;
        const netSalaryMVR = basicSalaryMVR + allowancesMVR - deductionsMVR;
        
        // Get bank account details
        const usdAccount = employee.bankAccounts?.USD?.accountNumber || 'N/A';
        const mvrAccount = employee.bankAccounts?.MVR?.accountNumber || 'N/A';
        const usdBankName = employee.bankAccounts?.USD?.bankName || 'N/A';
        const mvrBankName = employee.bankAccounts?.MVR?.bankName || 'N/A';
        
        // Get attendance data if available
        const attendanceData = getAttendanceData(employee.empNo || employee.id, month, year);
        
        return {
            id: employee.empNo || employee.id,
            name: employee.fullName || employee.name,
            department: employee.department || 'General',
            designation: employee.position || 'Employee',
            gender: employee.gender || 'Not Specified',
            joinDate: employee.joinedDate || 'N/A',
            workSite: employee.workSite || 'Office',
            // Salary in both currencies
            basicSalary: {
                USD: basicSalaryUSD,
                MVR: basicSalaryMVR
            },
            allowances: {
                USD: allowancesUSD,
                MVR: allowancesMVR
            },
            deductions: {
                USD: deductionsUSD,
                MVR: deductionsMVR
            },
            netSalary: {
                USD: netSalaryUSD,
                MVR: netSalaryMVR
            },
            // Attendance data
            attendance: attendanceData,
            // Bank account details
            bankAccounts: {
                USD: {
                    accountNumber: usdAccount,
                    bankName: usdBankName
                },
                MVR: {
                    accountNumber: mvrAccount,
                    bankName: mvrBankName
                }
            },
            // Additional details for payslip
            employeeId: employee.empNo || employee.id, // For payslip
            hra: {
                USD: basicSalaryUSD * 0.2,
                MVR: basicSalaryMVR * 0.2
            },
            conveyance: {
                USD: basicSalaryUSD * 0.1,
                MVR: basicSalaryMVR * 0.1
            },
            specialAllowance: {
                USD: basicSalaryUSD * 0.1,
                MVR: basicSalaryMVR * 0.1
            },
            pf: {
                USD: basicSalaryUSD * 0.08,
                MVR: basicSalaryMVR * 0.08
            },
            incomeTax: {
                USD: basicSalaryUSD * 0.05,
                MVR: basicSalaryMVR * 0.05
            },
            professionalTax: {
                USD: 13,
                MVR: 200
            },
            otherDeductions: {
                USD: basicSalaryUSD * 0.02,
                MVR: basicSalaryMVR * 0.02
            }
        };
    });
    
    // Update payroll table
    updatePayrollTable(payrollData);
    
    // Update summary statistics
    updatePayrollSummary(payrollData);
    
    // Save processed payroll data for the current month/year
    saveProcessedPayroll(payrollData, month, year);
    
    // Reset processing button
    document.getElementById('process-payroll').innerHTML = '<i class="fas fa-cogs"></i> Process Payroll';
    
    // Show success message
    showNotification('Payroll processed successfully for ' + getMonthName(month) + ' ' + year);
}

// Update the payroll table with calculated data
function updatePayrollTable(payrollData) {
    const tableBody = document.getElementById('payroll-data');
    tableBody.innerHTML = '';
    
    if (payrollData.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="8" class="empty-table">No payroll data available for the selected criteria</td>`;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    payrollData.forEach(employee => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.department}</td>
            <td>
                <div class="currency-row">USD: $${employee.basicSalary.USD.toFixed(2)}</div>
                <div class="currency-row">MVR: ₨${employee.basicSalary.MVR.toFixed(2)}</div>
            </td>
            <td>
                <div class="currency-row">USD: $${employee.allowances.USD.toFixed(2)}</div>
                <div class="currency-row">MVR: ₨${employee.allowances.MVR.toFixed(2)}</div>
            </td>
            <td>
                <div class="currency-row">USD: $${employee.deductions.USD.toFixed(2)}</div>
                <div class="currency-row">MVR: ₨${employee.deductions.MVR.toFixed(2)}</div>
            </td>
            <td>
                <div class="currency-row">USD: $${employee.netSalary.USD.toFixed(2)}</div>
                <div class="currency-row">MVR: ₨${employee.netSalary.MVR.toFixed(2)}</div>
            </td>
            <td class="action-buttons">
                <button class="action-btn view-btn" onclick="viewPayslip('${employee.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn edit-btn" onclick="editPayroll('${employee.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn print-btn" onclick="printSinglePayslip('${employee.id}')">
                    <i class="fas fa-print"></i> Print
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Update summary statistics
function updatePayrollSummary(payrollData) {
    const totalEmployees = payrollData.length;
    
    // Calculate USD totals
    const totalSalaryUSD = payrollData.reduce((sum, emp) => sum + emp.netSalary.USD, 0);
    const averageSalaryUSD = totalEmployees > 0 ? totalSalaryUSD / totalEmployees : 0;
    const highestSalaryUSD = payrollData.length > 0 ? 
        Math.max(...payrollData.map(emp => emp.netSalary.USD)) : 0;
    
    // Calculate MVR totals
    const totalSalaryMVR = payrollData.reduce((sum, emp) => sum + emp.netSalary.MVR, 0);
    const averageSalaryMVR = totalEmployees > 0 ? totalSalaryMVR / totalEmployees : 0;
    const highestSalaryMVR = payrollData.length > 0 ? 
        Math.max(...payrollData.map(emp => emp.netSalary.MVR)) : 0;
    
    document.getElementById('total-employees').textContent = totalEmployees;
    
    // Update salary displays to show both currencies
    document.getElementById('total-salary').innerHTML = `
        <div class="currency-row">USD: $${totalSalaryUSD.toFixed(2)}</div>
        <div class="currency-row">MVR: ₨${totalSalaryMVR.toFixed(2)}</div>
    `;
    
    document.getElementById('average-salary').innerHTML = `
        <div class="currency-row">USD: $${averageSalaryUSD.toFixed(2)}</div>
        <div class="currency-row">MVR: ₨${averageSalaryMVR.toFixed(2)}</div>
    `;
    
    document.getElementById('highest-salary').innerHTML = `
        <div class="currency-row">USD: $${highestSalaryUSD.toFixed(2)}</div>
        <div class="currency-row">MVR: ₨${highestSalaryMVR.toFixed(2)}</div>
    `;
}

// Filter payroll by department
function filterPayrollByDepartment() {
    processPayroll();
}

// View employee payslip
function viewPayslip(employeeId) {
    // Get the current payroll data
    const month = parseInt(document.getElementById('payroll-month').value);
    const year = parseInt(document.getElementById('payroll-year').value);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Find employee in the payroll data
    const employeeData = window.payrollEmployees || [];
    const employee = employeeData.find(emp => (emp.id === employeeId || emp.empNo === employeeId));
    
    if (!employee) {
        alert('Employee not found!');
        return;
    }
    
    // Handle both old and new salary formats
    const basicSalaryUSD = employee.salary?.USD || employee.salary || 0;
    const basicSalaryMVR = employee.salary?.MVR || (basicSalaryUSD * 15.4) || 0;
    
    // Calculate payroll details in USD
    const hraUSD = basicSalaryUSD * 0.2;
    const conveyanceUSD = basicSalaryUSD * 0.1;
    const specialAllowanceUSD = basicSalaryUSD * 0.1;
    const totalEarningsUSD = basicSalaryUSD + hraUSD + conveyanceUSD + specialAllowanceUSD;
    
    const pfUSD = basicSalaryUSD * 0.08;
    const incomeTaxUSD = basicSalaryUSD * 0.05;
    const professionalTaxUSD = 13; // Equivalent to 200 MVR
    const otherDeductionsUSD = basicSalaryUSD * 0.02;
    const totalDeductionsUSD = pfUSD + incomeTaxUSD + professionalTaxUSD + otherDeductionsUSD;
    
    const netSalaryUSD = totalEarningsUSD - totalDeductionsUSD;
    
    // Calculate payroll details in MVR
    const hraMVR = basicSalaryMVR * 0.2;
    const conveyanceMVR = basicSalaryMVR * 0.1;
    const specialAllowanceMVR = basicSalaryMVR * 0.1;
    const totalEarningsMVR = basicSalaryMVR + hraMVR + conveyanceMVR + specialAllowanceMVR;
    
    const pfMVR = basicSalaryMVR * 0.08;
    const incomeTaxMVR = basicSalaryMVR * 0.05;
    const professionalTaxMVR = 200;
    const otherDeductionsMVR = basicSalaryMVR * 0.02;
    const totalDeductionsMVR = pfMVR + incomeTaxMVR + professionalTaxMVR + otherDeductionsMVR;
    
    const netSalaryMVR = totalEarningsMVR - totalDeductionsMVR;
    
    // Update payslip modal with employee details
    document.getElementById('payslip-emp-id').textContent = employee.id || employee.empNo;
    document.getElementById('payslip-name').textContent = employee.fullName || employee.name;
    document.getElementById('payslip-department').textContent = employee.department;
    document.getElementById('payslip-designation').textContent = employee.position;
    
    // Display bank account details for both currencies
    const usdAccount = employee.bankAccounts?.USD?.accountNumber || 'N/A';
    const mvrAccount = employee.bankAccounts?.MVR?.accountNumber || 'N/A';
    document.getElementById('payslip-account').innerHTML = `
        <div class="currency-row">USD Account: ${usdAccount}</div>
        <div class="currency-row">MVR Account: ${mvrAccount}</div>
    `;
    document.getElementById('payslip-pan').textContent = 'ABCDE1234F'; // Placeholder
    
    // Update salary details with both currencies
    document.getElementById('payslip-basic').innerHTML = `
        <div class="currency-row">USD: $${basicSalaryUSD.toFixed(2)}</div>
        <div class="currency-row">MVR: ₨${basicSalaryMVR.toFixed(2)}</div>
    `;
    
    document.getElementById('payslip-hra').innerHTML = `
        <div class="currency-row">USD: $${hraUSD.toFixed(2)}</div>
        <div class="currency-row">MVR: ₨${hraMVR.toFixed(2)}</div>
    `;
    
    document.getElementById('payslip-conveyance').innerHTML = `
        <div class="currency-row">USD: $${conveyanceUSD.toFixed(2)}</div>
        <div class="currency-row">MVR: ₨${conveyanceMVR.toFixed(2)}</div>
    `;
    
    document.getElementById('payslip-special').innerHTML = `
        <div class="currency-row">USD: $${specialAllowanceUSD.toFixed(2)}</div>
        <div class="currency-row">MVR: ₨${specialAllowanceMVR.toFixed(2)}</div>
    `;
    
    document.getElementById('payslip-total-earnings').innerHTML = `
        <div class="currency-row">USD: $${totalEarningsUSD.toFixed(2)}</div>
        <div class="currency-row">MVR: ₨${totalEarningsMVR.toFixed(2)}</div>
    `;
    
    document.getElementById('payslip-pf').innerHTML = `
        <div class="currency-row">USD: $${pfUSD.toFixed(2)}</div>
        <div class="currency-row">MVR: ₨${pfMVR.toFixed(2)}</div>
    `;
    
    document.getElementById('payslip-tax').innerHTML = `
        <div class="currency-row">USD: $${incomeTaxUSD.toFixed(2)}</div>
        <div class="currency-row">MVR: ₨${incomeTaxMVR.toFixed(2)}</div>
    `;
    
    document.getElementById('payslip-prof-tax').innerHTML = `
        <div class="currency-row">USD: $${professionalTaxUSD.toFixed(2)}</div>
        <div class="currency-row">MVR: ₨${professionalTaxMVR.toFixed(2)}</div>
    `;
    
    document.getElementById('payslip-other-deductions').innerHTML = `
        <div class="currency-row">USD: $${otherDeductionsUSD.toFixed(2)}</div>
        <div class="currency-row">MVR: ₨${otherDeductionsMVR.toFixed(2)}</div>
    `;
    
    document.getElementById('payslip-total-deductions').innerHTML = `
        <div class="currency-row">USD: $${totalDeductionsUSD.toFixed(2)}</div>
        <div class="currency-row">MVR: ₨${totalDeductionsMVR.toFixed(2)}</div>
    `;
    
    // Update net salary with both currencies
    document.getElementById('payslip-net-salary').innerHTML = `
        <div class="currency-row">USD: $${netSalaryUSD.toFixed(2)}</div>
        <div class="currency-row">MVR: ₨${netSalaryMVR.toFixed(2)}</div>
        <div class="currency-row">USD Amount in Words: ${numberToWords(netSalaryUSD)} US Dollars</div>
        <div class="currency-row">MVR Amount in Words: ${numberToWords(netSalaryMVR)} Maldivian Rufiyaa</div>
    `;
    
    // Update month and year
    document.getElementById('payslip-month-year').textContent = `${monthNames[month-1]} ${year}`;
    
    // Show the modal
    document.getElementById('payslip-modal').style.display = 'block';
}

// Close payslip modal
function closePayslipModal() {
    const modal = document.getElementById('payslip-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Reattach event listeners for close button
    setTimeout(() => {
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }, 100);
}

// Print payslip
function printPayslip() {
    const payslipContent = document.getElementById('payslip-content');
    if (!payslipContent) {
        alert('No payslip content to print');
        return;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Employee Payslip</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .payslip-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                    .company-info { text-align: left; }
                    .payslip-logo { height: 60px; }
                    .payslip-title { text-align: right; }
                    .employee-details { margin-bottom: 20px; border: 1px solid #ddd; padding: 10px; }
                    .detail-row { display: flex; margin-bottom: 10px; }
                    .detail-group { flex: 1; }
                    .salary-details { display: flex; margin-bottom: 20px; }
                    .salary-section { flex: 1; border: 1px solid #ddd; padding: 10px; }
                    .salary-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
                    .total { font-weight: bold; border-top: 1px solid #ddd; padding-top: 5px; }
                    .net-salary { border: 1px solid #ddd; padding: 10px; font-weight: bold; font-size: 1.2em; }
                    .net-salary-row { display: flex; justify-content: space-between; }
                </style>
            </head>
            <body>
                ${payslipContent.innerHTML}
                <script>
                    window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }
                </script>
            </body>
        </html>
    `);
}

// Download payslip as PDF
function downloadPayslipPDF() {
    alert('PDF download functionality would be implemented here with a library like jsPDF');
    // In a real implementation, you would use a library like jsPDF to generate the PDF
}

// Generate all payslips
function generateAllPayslips() {
    const month = parseInt(document.getElementById('payroll-month').value);
    const year = parseInt(document.getElementById('payroll-year').value);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Get processed payroll data
    let payrollData = [];
    if (typeof getProcessedPayroll === 'function') {
        payrollData = getProcessedPayroll(month, year) || [];
    } else {
        // Fallback to current payroll data
        payrollData = window.payrollEmployees || [];
    }
    
    if (!payrollData.length) {
        alert('No payroll data available. Please process payroll first.');
        return;
    }
    
    // Create a container for all payslips
    const allPayslipsContainer = document.createElement('div');
    allPayslipsContainer.id = 'all-payslips-container';
    allPayslipsContainer.style.display = 'none';
    document.body.appendChild(allPayslipsContainer);
    
    // Generate HTML for all payslips
    let allPayslipsHTML = '';
    payrollData.forEach(employee => {
        // Generate payslip HTML for each employee
        const payslipHTML = generatePayslipHTML(employee, month, year);
        allPayslipsHTML += `<div class="payslip-page">${payslipHTML}</div>`;
    });
    
    allPayslipsContainer.innerHTML = allPayslipsHTML;
    
    // Print all payslips
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>All Payslips - ${monthNames[month-1]} ${year}</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .payslip-page { page-break-after: always; margin: 20px; }
                    .payslip-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                    .company-info { text-align: left; }
                    .payslip-logo { height: 60px; }
                    .payslip-title { text-align: right; }
                    .employee-details { margin-bottom: 20px; border: 1px solid #ddd; padding: 10px; }
                    .detail-row { display: flex; margin-bottom: 10px; }
                    .detail-group { flex: 1; }
                    .salary-details { display: flex; margin-bottom: 20px; }
                    .salary-section { flex: 1; border: 1px solid #ddd; padding: 10px; }
                    .salary-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
                    .total { font-weight: bold; border-top: 1px solid #ddd; padding-top: 5px; }
                    .net-salary { border: 1px solid #ddd; padding: 10px; font-weight: bold; font-size: 1.2em; }
                    .net-salary-row { display: flex; justify-content: space-between; }
                </style>
            </head>
            <body>
                ${allPayslipsHTML}
                <script>
                    window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }
                </script>
            </body>
        </html>
    `);
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(allPayslipsContainer);
    }, 1000);
    
    // Show success message
    if (typeof showNotification === 'function') {
        showNotification('All payslips generated successfully');
    } else {
        alert('All payslips generated successfully');
    }
}

// Export payroll data to CSV/Excel
function exportPayrollData() {
    const month = parseInt(document.getElementById('payroll-month').value);
    const year = parseInt(document.getElementById('payroll-year').value);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Get processed payroll data
    let payrollData = [];
    if (typeof getProcessedPayroll === 'function') {
        payrollData = getProcessedPayroll(month, year) || [];
    } else {
        // Fallback to calculating from employee data
        const employeeData = window.payrollEmployees || [];
        payrollData = employeeData.map(employee => {
            // Handle both old and new salary formats
            const basicSalaryUSD = employee.salary?.USD || employee.salary || 0;
            const basicSalaryMVR = employee.salary?.MVR || (basicSalaryUSD * 15.4) || 0;
            
            // Calculate allowances (40% of basic salary)
            const allowancesUSD = basicSalaryUSD * 0.4;
            const allowancesMVR = basicSalaryMVR * 0.4;
            
            // Calculate deductions (15% of basic salary)
            const deductionsUSD = basicSalaryUSD * 0.15;
            const deductionsMVR = basicSalaryMVR * 0.15;
            
            // Calculate net salary
            const netSalaryUSD = basicSalaryUSD + allowancesUSD - deductionsUSD;
            const netSalaryMVR = basicSalaryMVR + allowancesMVR - deductionsMVR;
            
            return {
                ...employee,
                basicSalaryUSD,
                basicSalaryMVR,
                allowancesUSD,
                allowancesMVR,
                deductionsUSD,
                deductionsMVR,
                netSalaryUSD,
                netSalaryMVR
            };
        });
    }
    
    if (!payrollData.length) {
        alert('No payroll data available to export. Please process payroll first.');
        return;
    }
    
    // Filter by department if needed
    const departmentFilter = document.getElementById('department-filter').value;
    if (departmentFilter !== 'all') {
        payrollData = payrollData.filter(emp => emp.department === departmentFilter);
    }
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Employee ID,Name,Department,Position,Basic Salary (USD),Basic Salary (MVR),Allowances (USD),Allowances (MVR),Deductions (USD),Deductions (MVR),Net Salary (USD),Net Salary (MVR)\n";
    
    payrollData.forEach(employee => {
        // Get salary values, with fallbacks
        const basicSalaryUSD = employee.basicSalaryUSD || employee.salary?.USD || employee.salary || 0;
        const basicSalaryMVR = employee.basicSalaryMVR || employee.salary?.MVR || (basicSalaryUSD * 15.4) || 0;
        const allowancesUSD = employee.allowancesUSD || (basicSalaryUSD * 0.4) || 0;
        const allowancesMVR = employee.allowancesMVR || (basicSalaryMVR * 0.4) || 0;
        const deductionsUSD = employee.deductionsUSD || (basicSalaryUSD * 0.15) || 0;
        const deductionsMVR = employee.deductionsMVR || (basicSalaryMVR * 0.15) || 0;
        const netSalaryUSD = employee.netSalaryUSD || (basicSalaryUSD + allowancesUSD - deductionsUSD) || 0;
        const netSalaryMVR = employee.netSalaryMVR || (basicSalaryMVR + allowancesMVR - deductionsMVR) || 0;
        
        csvContent += `${employee.id || employee.empNo},${employee.fullName || employee.name},${employee.department || ''},${employee.position || employee.designation || ''},${basicSalaryUSD.toFixed(2)},${basicSalaryMVR.toFixed(2)},${allowancesUSD.toFixed(2)},${allowancesMVR.toFixed(2)},${deductionsUSD.toFixed(2)},${deductionsMVR.toFixed(2)},${netSalaryUSD.toFixed(2)},${netSalaryMVR.toFixed(2)}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent.replace('data:text/csv;charset=utf-8,', '')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Payroll_${monthNames[month-1]}_${year}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    if (typeof showNotification === 'function') {
        showNotification('Payroll data exported successfully');
    } else {
        alert('Payroll data exported successfully');
    }
}

// Edit payroll entry
function editPayroll(employeeId) {
    console.log('Editing payroll for employee:', employeeId);
    
    // Find employee in the data
    const employeeData = window.payrollEmployees || [];
    const employee = employeeData.find(emp => (emp.id === employeeId || emp.empNo === employeeId));
    
    if (!employee) {
        alert('Employee not found!');
        return;
    }
    
    // Create edit form modal
    const modalHtml = `
        <div id="edit-payroll-modal" style="display: block; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);">
            <div style="background-color: white; margin: 10% auto; padding: 20px; border-radius: 5px; width: 60%; max-width: 600px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0;">Edit Payroll for ${employee.fullName || employee.name}</h2>
                    <span id="close-edit-modal" style="cursor: pointer; font-size: 24px;">&times;</span>
                </div>
                <form id="edit-payroll-form">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Basic Salary (USD):</label>
                        <input type="number" id="edit-salary-usd" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="${employee.salary?.USD || employee.salary || 0}">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Basic Salary (MVR):</label>
                        <input type="number" id="edit-salary-mvr" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="${employee.salary?.MVR || (employee.salary * 15.4) || 0}">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Allowance Rate (%):</label>
                        <input type="number" id="edit-allowance-rate" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="40">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Deduction Rate (%):</label>
                        <input type="number" id="edit-deduction-rate" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="15">
                    </div>
                    <div style="text-align: right;">
                        <button type="button" id="cancel-edit" style="padding: 8px 16px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Cancel</button>
                        <button type="button" id="save-edit" style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal to body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    // Set up event listeners
    document.getElementById('close-edit-modal').addEventListener('click', function() {
        document.body.removeChild(modalContainer);
    });
    
    document.getElementById('cancel-edit').addEventListener('click', function() {
        document.body.removeChild(modalContainer);
    });
    
    document.getElementById('save-edit').addEventListener('click', function() {
        // Get values from form
        const salaryUSD = parseFloat(document.getElementById('edit-salary-usd').value) || 0;
        const salaryMVR = parseFloat(document.getElementById('edit-salary-mvr').value) || 0;
        
        // Update employee data
        if (!employee.salary) {
            employee.salary = {};
        } else if (typeof employee.salary === 'number') {
            employee.salary = {
                USD: employee.salary,
                MVR: employee.salary * 15.4
            };
        }
        
        employee.salary.USD = salaryUSD;
        employee.salary.MVR = salaryMVR;
        
        // Save updated employee data
        if (typeof EmployeeManager !== 'undefined' && typeof EmployeeManager.update === 'function') {
            EmployeeManager.update(employee);
        }
        
        // Close modal
        document.body.removeChild(modalContainer);
        
        // Refresh payroll data
        if (typeof processPayroll === 'function') {
            processPayroll();
        }
        
        // Show success message
        if (typeof showNotification === 'function') {
            showNotification('Payroll data updated successfully');
        } else {
            alert('Payroll data updated successfully');
        }
    });
}

// Generate payslip HTML helper function
function generatePayslipHTML(employee, month, year) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[month - 1];
    
    // Handle both old and new salary formats
    const basicSalaryUSD = employee.basicSalaryUSD || employee.salary?.USD || employee.salary || 0;
    const basicSalaryMVR = employee.basicSalaryMVR || employee.salary?.MVR || (basicSalaryUSD * 15.4) || 0;
    
    // Calculate allowances (40% of basic salary)
    const allowancesUSD = employee.allowancesUSD || basicSalaryUSD * 0.4 || 0;
    const allowancesMVR = employee.allowancesMVR || basicSalaryMVR * 0.4 || 0;
    
    // Calculate deductions (15% of basic salary)
    const deductionsUSD = employee.deductionsUSD || basicSalaryUSD * 0.15 || 0;
    const deductionsMVR = employee.deductionsMVR || basicSalaryMVR * 0.15 || 0;
    
    // Calculate net salary
    const netSalaryUSD = employee.netSalaryUSD || (basicSalaryUSD + allowancesUSD - deductionsUSD) || 0;
    const netSalaryMVR = employee.netSalaryMVR || (basicSalaryMVR + allowancesMVR - deductionsMVR) || 0;
    
    return `
        <div class="payslip-header">
            <div class="company-info">
                <img src="../img/logo.png" alt="Fuel Express Logo" class="payslip-logo">
                <h2>Fuel Express Pvt. Ltd.</h2>
                <p>123 Fuel Street, Energy City</p>
                <p>Phone: +1 234 567 8900 | Email: hr@fuelexpress.com</p>
            </div>
            <div class="payslip-title">
                <h3>PAYSLIP</h3>
                <p>For the month of ${monthName} ${year}</p>
            </div>
        </div>
        
        <div class="employee-details">
            <div class="detail-row">
                <div class="detail-group">
                    <label>Employee ID:</label>
                    <span>${employee.id || employee.empNo || ''}</span>
                </div>
                <div class="detail-group">
                    <label>Name:</label>
                    <span>${employee.fullName || employee.name || ''}</span>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-group">
                    <label>Department:</label>
                    <span>${employee.department || ''}</span>
                </div>
                <div class="detail-group">
                    <label>Designation:</label>
                    <span>${employee.designation || employee.position || ''}</span>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-group">
                    <label>Bank Account:</label>
                    <span>${employee.bankAccount || ''}</span>
                </div>
                <div class="detail-group">
                    <label>PAN:</label>
                    <span>${employee.pan || ''}</span>
                </div>
            </div>
        </div>
        
        <div class="salary-details">
            <div class="salary-section">
                <h4>Earnings</h4>
                <div class="salary-row">
                    <span>Basic Salary</span>
                    <span>$${basicSalaryUSD.toFixed(2)}</span>
                </div>
                <div class="salary-row">
                    <span>HRA</span>
                    <span>$${(basicSalaryUSD * 0.15).toFixed(2)}</span>
                </div>
                <div class="salary-row">
                    <span>Conveyance</span>
                    <span>$${(basicSalaryUSD * 0.1).toFixed(2)}</span>
                </div>
                <div class="salary-row">
                    <span>Special Allowance</span>
                    <span>$${(basicSalaryUSD * 0.15).toFixed(2)}</span>
                </div>
                <div class="salary-row total">
                    <span>Total Earnings</span>
                    <span>$${(basicSalaryUSD + allowancesUSD).toFixed(2)}</span>
                </div>
            </div>
            
            <div class="salary-section">
                <h4>Deductions</h4>
                <div class="salary-row">
                    <span>Income Tax</span>
                    <span>$${(basicSalaryUSD * 0.1).toFixed(2)}</span>
                </div>
                <div class="salary-row">
                    <span>Provident Fund</span>
                    <span>$${(basicSalaryUSD * 0.05).toFixed(2)}</span>
                </div>
                <div class="salary-row">
                    <span>Professional Tax</span>
                    <span>$${(basicSalaryUSD * 0.01).toFixed(2)}</span>
                </div>
                <div class="salary-row">
                    <span>Health Insurance</span>
                    <span>$${(basicSalaryUSD * 0.02).toFixed(2)}</span>
                </div>
                <div class="salary-row total">
                    <span>Total Deductions</span>
                    <span>$${deductionsUSD.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        <div class="net-salary">
            <div class="net-salary-row">
                <span>Net Salary</span>
                <span>$${netSalaryUSD.toFixed(2)}</span>
            </div>
        </div>
    `;
}

// Convert number to words for payslip
function numberToWords(amount) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    function convertLessThanOneThousand(num) {
        if (num === 0) {
            return '';
        }
        if (num < 20) {
            return ones[num];
        }
        if (num < 100) {
            return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
        }
        return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' and ' + convertLessThanOneThousand(num % 100) : '');
    }
    
    // Round to 2 decimal places and split into rupees and paise
    const roundedAmount = Math.round(amount * 100) / 100;
    const rupees = Math.floor(roundedAmount);
    const paise = Math.round((roundedAmount - rupees) * 100);
    
    let result = '';
    
    if (rupees === 0) {
        result = 'Zero';
    } else {
        const billion = Math.floor(rupees / 1000000000);
        const million = Math.floor((rupees % 1000000000) / 1000000);
        const thousand = Math.floor((rupees % 1000000) / 1000);
        const remainder = rupees % 1000;
        
        if (billion) {
            result += convertLessThanOneThousand(billion) + ' Billion ';
        }
        
        if (million) {
            result += convertLessThanOneThousand(million) + ' Million ';
        }
        
        if (thousand) {
            result += convertLessThanOneThousand(thousand) + ' Thousand ';
        }
        
        if (remainder) {
            result += convertLessThanOneThousand(remainder);
        }
    }
    
    // Add paise if any
    if (paise > 0) {
        result += ' and ' + convertLessThanOneThousand(paise) + ' Paise';
    }
    
    return result;
}