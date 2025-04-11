// Payroll Module JavaScript

document.addEventListener('DOMContentLoaded', function() {
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
    // Check if employees data is available
    if (typeof employees === 'undefined') {
        console.error('Employee data not found. Make sure employees.js is loaded correctly.');
        return;
    }
    
    // Process and display payroll data
    processPayroll();
}

// Process payroll data based on selected month and year
function processPayroll() {
    const month = parseInt(document.getElementById('payroll-month').value);
    const year = parseInt(document.getElementById('payroll-year').value);
    const departmentFilter = document.getElementById('department-filter').value;
    
    // Filter employees by department if needed
    let filteredEmployees = employees;
    if (departmentFilter !== 'all') {
        filteredEmployees = employees.filter(emp => emp.department === departmentFilter);
    }
    
    // Calculate payroll for each employee
    const payrollData = filteredEmployees.map(employee => {
        // Calculate allowances (40% of basic salary)
        const allowances = employee.salary * 0.4;
        
        // Calculate deductions (15% of basic salary)
        const deductions = employee.salary * 0.15;
        
        // Calculate net salary
        const netSalary = employee.salary + allowances - deductions;
        
        return {
            id: employee.id,
            name: employee.name,
            department: employee.department,
            designation: employee.position,
            basicSalary: employee.salary,
            allowances: allowances,
            deductions: deductions,
            netSalary: netSalary,
            // Additional details for payslip
            pan: 'ABCDE1234F', // Placeholder
            bankAccount: '123456789012', // Placeholder
            hra: employee.salary * 0.2,
            conveyance: employee.salary * 0.1,
            specialAllowance: employee.salary * 0.1,
            pf: employee.salary * 0.08,
            incomeTax: employee.salary * 0.05,
            professionalTax: 200,
            otherDeductions: employee.salary * 0.02
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
            <td>₹${employee.basicSalary.toFixed(2)}</td>
            <td>₹${employee.allowances.toFixed(2)}</td>
            <td>₹${employee.deductions.toFixed(2)}</td>
            <td>₹${employee.netSalary.toFixed(2)}</td>
            <td class="action-buttons">
                <button class="action-btn view-btn" onclick="viewPayslip(${employee.id})">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn edit-btn" onclick="editPayroll(${employee.id})">
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
    const totalSalary = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0);
    const averageSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;
    const highestSalary = payrollData.length > 0 ? 
        Math.max(...payrollData.map(emp => emp.netSalary)) : 0;
    
    document.getElementById('total-employees').textContent = totalEmployees;
    document.getElementById('total-salary').textContent = `₹${totalSalary.toFixed(2)}`;
    document.getElementById('average-salary').textContent = `₹${averageSalary.toFixed(2)}`;
    document.getElementById('highest-salary').textContent = `₹${highestSalary.toFixed(2)}`;
}

// Filter payroll by department
function filterPayrollByDepartment() {
    processPayroll();
}

// View employee payslip
function viewPayslip(employeeId) {
    // Find employee in the payroll data
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (!employee) {
        alert('Employee not found!');
        return;
    }
    
    // Calculate payroll details
    const basicSalary = employee.salary;
    const hra = basicSalary * 0.2;
    const conveyance = basicSalary * 0.1;
    const specialAllowance = basicSalary * 0.1;
    const totalEarnings = basicSalary + hra + conveyance + specialAllowance;
    
    const pf = basicSalary * 0.08;
    const incomeTax = basicSalary * 0.05;
    const professionalTax = 200;
    const otherDeductions = basicSalary * 0.02;
    const totalDeductions = pf + incomeTax + professionalTax + otherDeductions;
    
    const netSalary = totalEarnings - totalDeductions;
    
    // Update payslip modal with employee details
    document.getElementById('payslip-emp-id').textContent = employee.id;
    document.getElementById('payslip-name').textContent = employee.name;
    document.getElementById('payslip-department').textContent = employee.department;
    document.getElementById('payslip-designation').textContent = employee.position;
    document.getElementById('payslip-account').textContent = '123456789012'; // Placeholder
    document.getElementById('payslip-pan').textContent = 'ABCDE1234F'; // Placeholder
    
       // Update salary details
       document.getElementById('payslip-basic').textContent = `₹${basicSalary.toFixed(2)}`;
       document.getElementById('payslip-hra').textContent = `₹${hra.toFixed(2)}`;
       document.getElementById('payslip-conveyance').textContent = `₹${conveyance.toFixed(2)}`;
       document.getElementById('payslip-special').textContent = `₹${specialAllowance.toFixed(2)}`;
       document.getElementById('payslip-total-earnings').textContent = `₹${totalEarnings.toFixed(2)}`;
       
       document.getElementById('payslip-pf').textContent = `₹${pf.toFixed(2)}`;
       document.getElementById('payslip-tax').textContent = `₹${incomeTax.toFixed(2)}`;
       document.getElementById('payslip-prof-tax').textContent = `₹${professionalTax.toFixed(2)}`;
       document.getElementById('payslip-other-deductions').textContent = `₹${otherDeductions.toFixed(2)}`;
       document.getElementById('payslip-total-deductions').textContent = `₹${totalDeductions.toFixed(2)}`;
       
       // Update net salary
       document.getElementById('payslip-net-salary').textContent = `₹${netSalary.toFixed(2)}`;
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