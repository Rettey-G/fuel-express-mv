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
    // Load employees from data/employees.js
    let employeeData = [];
    
    // Try to get employees from EmployeeManager in data/employees.js
    if (typeof EmployeeManager !== 'undefined' && typeof EmployeeManager.getAll === 'function') {
        employeeData = EmployeeManager.getAll();
        console.log('Loaded employees from EmployeeManager:', employeeData.length);
    } else {
        // Fallback to sample data if available
        if (typeof employees !== 'undefined') {
            employeeData = employees;
            console.log('Loaded employees from global variable:', employeeData.length);
        } else {
            console.error('Employee data not found. Make sure data/employees.js is loaded correctly.');
            return;
        }
    }
    
    // Store employees in a global variable for use in this module
    window.payrollEmployees = employeeData;
    
    // Process and display payroll data
    processPayroll();
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
    
    // Calculate payroll for each employee
    const payrollData = filteredEmployees.map(employee => {
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
        
        // Get bank account details
        const usdAccount = employee.bankAccounts?.USD?.accountNumber || 'N/A';
        const mvrAccount = employee.bankAccounts?.MVR?.accountNumber || 'N/A';
        const usdBankName = employee.bankAccounts?.USD?.bankName || 'N/A';
        const mvrBankName = employee.bankAccounts?.MVR?.bankName || 'N/A';
        
        return {
            id: employee.id,
            name: employee.fullName || employee.name,
            department: employee.department,
            designation: employee.position,
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
            pan: 'ABCDE1234F', // Placeholder
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
}

// Update the payroll table with calculated data
function updatePayrollTable(payrollData) {
    const tableBody = document.getElementById('payroll-data');
    tableBody.innerHTML = '';
    
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
    // Using the existing month and year values from the page
    
    // Find employee in the payroll data
    const employeeData = window.payrollEmployees || [];
    const employee = employeeData.find(emp => emp.id === employeeId);
    
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
    document.getElementById('payslip-emp-id').textContent = employee.id;
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
       document.getElementById('payslip-amount-words').textContent = numberToWords(netSalary) + ' Rupees Only';
       
       // Update month and year
       const month = document.getElementById('payroll-month').value;
       const year = document.getElementById('payroll-year').value;
       const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
       document.getElementById('payslip-month-year').textContent = `${monthNames[month-1]} ${year}`;
       
       // Show the modal
       document.getElementById('payslip-modal').style.display = 'block';
   }
   
   // Close payslip modal
   function closePayslipModal() {
       document.getElementById('payslip-modal').style.display = 'none';
   }
   
   // Print payslip
   function printPayslip() {
       window.print();
   }
   
   // Download payslip as PDF
   function downloadPayslipPDF() {
       alert('PDF download functionality would be implemented here with a library like jsPDF');
       // In a real implementation, you would use a library like jsPDF to generate the PDF
   }
   
   // Generate all payslips
   function generateAllPayslips() {
       alert('Generating all payslips for the selected month and year');
       // This would typically batch process all payslips
   }
   
   // Export payroll data to CSV/Excel
   function exportPayrollData() {
       const month = parseInt(document.getElementById('payroll-month').value);
       const year = parseInt(document.getElementById('payroll-year').value);
       const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
       
       alert(`Exporting payroll data for ${monthNames[month-1]} ${year}`);
       // In a real implementation, you would generate a CSV or Excel file
   }
   
   // Edit payroll entry
   function editPayroll(employeeId) {
       alert(`Edit payroll for employee ID: ${employeeId}`);
       // This would open a form to edit the payroll details
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