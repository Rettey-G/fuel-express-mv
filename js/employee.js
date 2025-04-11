// Employee Management JavaScript

// DOM Elements
const employeeGrid = document.getElementById('employee-grid');
const employeeModal = document.getElementById('employee-modal');
const viewEmployeeModal = document.getElementById('view-employee-modal');
const confirmModal = document.getElementById('confirm-modal');
const employeeForm = document.getElementById('employee-form');
const modalTitle = document.getElementById('modal-title');
const addEmployeeBtn = document.getElementById('add-employee-btn');
const cancelBtn = document.getElementById('cancel-btn');
const closeBtn = document.querySelector('.close-btn');
const closeViewBtn = document.querySelector('.close-view-btn');
const closeViewButton = document.getElementById('close-view-btn');
const editFromViewBtn = document.getElementById('edit-from-view-btn');
const searchInput = document.getElementById('employee-search');
const searchBtn = document.getElementById('search-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

// Sample data initialization
document.addEventListener('DOMContentLoaded', function() {
    // Load sample data script
    if (!document.querySelector('script[src="../js/sample-data.js"]')) {
        const script = document.createElement('script');
        script.src = '../js/sample-data.js';
        document.body.appendChild(script);
    }
    
    // Initialize department and division management
    setupDepartmentDivisionManagement();
    
    // Setup event listeners
    setupEventListeners();
});

// Get employees data
let employeesData = [];

// Load data using the EmployeeManager
if (window.EmployeeManager) {
    employeesData = window.EmployeeManager.getAll();
} else {
    // Fallback if EmployeeManager is not available
    employeesData = JSON.parse(localStorage.getItem('employees')) || [];
}

// Current employee being edited or viewed
let currentEmployee = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderEmployeeGrid(employeesData);
    setupEventListeners();
});

// Save permanent employee data
function savePermanentEmployees() {
    // Save to permanent storage
    localStorage.setItem('permanentEmployeeData', 'true');
    localStorage.setItem('permanentEmployees', JSON.stringify(employeesData));
    console.log('Employee data saved permanently');
}

// Render the employee grid
function renderEmployeeGrid(employees) {
    employeeGrid.innerHTML = '';
    
    if (employees.length === 0) {
        employeeGrid.innerHTML = '<p class="no-results">No employees found. Try a different search or add a new employee.</p>';
        return;
    }
    
    employees.forEach(employee => {
        const card = createEmployeeCard(employee);
        employeeGrid.appendChild(card);
    });
}

// Create an employee card
function createEmployeeCard(employee) {
    const card = document.createElement('div');
    card.className = 'employee-card';
    
    // Use a default image if photo is not available
    const photoSrc = employee.photo || '../img/employee-photos/default.jpg';
    
    card.innerHTML = `
        <div class="employee-header-section">
            <span class="employee-id">${employee.id}</span>
            <span class="employee-department">${employee.department}</span>
        </div>
        <img src="${photoSrc}" alt="${employee.fullName}" class="employee-photo" onerror="this.src='../img/employee-photos/default.jpg'">
        <div class="employee-info">
            <h3 class="employee-name">${employee.fullName}</h3>
            <p class="employee-position">${employee.position}</p>
            <div class="employee-details">
                <p><i class="fas fa-phone"></i> ${employee.phone}</p>
                <p><i class="fas fa-envelope"></i> ${employee.email || 'N/A'}</p>
                <p><i class="fas fa-calendar"></i> Hired: ${formatDate(employee.hireDate)}</p>
            </div>
        </div>
        <div class="employee-actions-btns">
            <button class="action-btn view-btn" data-id="${employee.id}"><i class="fas fa-eye"></i> View</button>
            <button class="action-btn edit-btn" data-id="${employee.id}"><i class="fas fa-edit"></i> Edit</button>
            <button class="action-btn delete-btn" data-id="${employee.id}"><i class="fas fa-trash"></i> Delete</button>
        </div>
    `;
    
    return card;
}

// Setup event listeners
function setupEventListeners() {
    // Add employee button
    addEmployeeBtn.addEventListener('click', () => {
        showAddEmployeeModal();
    });
    
    // Cancel button in form
    cancelBtn.addEventListener('click', () => {
        employeeModal.style.display = 'none';
    });
    
    // Close button in modal
    closeBtn.addEventListener('click', () => {
        employeeModal.style.display = 'none';
    });
    
    // Close view modal
    closeViewBtn.addEventListener('click', () => {
        viewEmployeeModal.style.display = 'none';
    });
    
    closeViewButton.addEventListener('click', () => {
        viewEmployeeModal.style.display = 'none';
    });
    
    // Edit from view button
    editFromViewBtn.addEventListener('click', () => {
        viewEmployeeModal.style.display = 'none';
        showEditEmployeeModal(currentEmployee);
    });
    
    // Form submission
    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveEmployee();
    });
    
    // Search functionality
    searchBtn.addEventListener('click', () => {
        searchEmployees();
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchEmployees();
        }
    });
    
    // Cancel delete
    cancelDeleteBtn.addEventListener('click', () => {
        confirmModal.style.display = 'none';
    });
    
    // Confirm delete
    confirmDeleteBtn.addEventListener('click', () => {
        deleteEmployee(currentEmployee.id);
        confirmModal.style.display = 'none';
    });
    
    // Photo preview
    document.getElementById('photo').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('photo-preview');
                preview.innerHTML = `<img src="${e.target.result}" alt="Employee Photo">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Event delegation for card buttons
    employeeGrid.addEventListener('click', (e) => {
        const target = e.target.closest('.action-btn');
        if (!target) return;
        
        const employeeId = target.dataset.id;
        const employee = findEmployeeById(employeeId);
        
        if (target.classList.contains('view-btn')) {
            showEmployeeDetails(employee);
        } else if (target.classList.contains('edit-btn')) {
            showEditEmployeeModal(employee);
        } else if (target.classList.contains('delete-btn')) {
            showDeleteConfirmation(employee);
        }
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === employeeModal) {
            employeeModal.style.display = 'none';
        }
        if (e.target === viewEmployeeModal) {
            viewEmployeeModal.style.display = 'none';
        }
        if (e.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    });
    
    // Reset data button if it exists
    const resetDataBtn = document.getElementById('reset-data-btn');
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all employee data to default? This cannot be undone.')) {
                if (window.EmployeeManager) {
                    window.EmployeeManager.reset();
                    employeesData = window.EmployeeManager.getAll();
                    renderEmployeeGrid(employeesData);
                }
            }
        });
    }
}

// Show add employee modal
function showAddEmployeeModal() {
    // Reset form
    employeeForm.reset();
    document.getElementById('employee-id').value = generateEmployeeId();
    document.getElementById('photo-preview').innerHTML = '';
    
    // Set modal title
    modalTitle.textContent = 'Add New Employee';
    
    // Show modal
    employeeModal.style.display = 'block';
    
    // Set current employee to null (we're adding a new one)
    currentEmployee = null;
}

// Show edit employee modal
function showEditEmployeeModal(employee) {
    // Set form values
    document.getElementById('employee-id').value = employee.id;
    document.getElementById('full-name').value = employee.fullName;
    document.getElementById('department').value = employee.department;
    document.getElementById('position').value = employee.position;
    document.getElementById('phone').value = employee.phone;
    document.getElementById('email').value = employee.email || '';
    document.getElementById('hire-date').value = employee.hireDate;
    document.getElementById('salary').value = employee.salary;
    document.getElementById('emergency-name').value = employee.emergencyContact.name;
    document.getElementById('emergency-relation').value = employee.emergencyContact.relation;
    document.getElementById('emergency-phone').value = employee.emergencyContact.phone;
    
    // Show photo preview if available
    const photoPreview = document.getElementById('photo-preview');
    if (employee.photo) {
        photoPreview.innerHTML = `<img src="${employee.photo}" alt="Employee Photo">`;
    } else {
        photoPreview.innerHTML = '';
    }
    
    // Set modal title
    modalTitle.textContent = 'Edit Employee';
    
    // Show modal
    employeeModal.style.display = 'block';
    
    // Set current employee
    currentEmployee = employee;
}

// Show employee details
function showEmployeeDetails(employee) {
    const employeeDetails = document.getElementById('employee-details');
    
    // Use a default image if photo is not available
    const photoSrc = employee.photo || '../img/employee-photos/default.jpg';
    
    // Format the hire date
    const hireDate = formatDate(employee.hireDate);
    
    // Calculate years of service
    const yearsOfService = calculateYearsOfService(employee.hireDate);
    
    employeeDetails.innerHTML = `
        <div class="employee-detail-header">
            <img src="${photoSrc}" alt="${employee.fullName}" class="detail-photo" onerror="this.src='../img/employee-photos/default.jpg'">
            <div class="detail-name-section">
                <h3>${employee.fullName}</h3>
                <p class="detail-position">${employee.position}</p>
                <span class="detail-id">${employee.id}</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Personal Information</h4>
            <div class="detail-row">
                <span class="detail-label">Department:</span>
                <span>${employee.department}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span>${employee.phone}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span>${employee.email || 'N/A'}</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Employment Details</h4>
            <div class="detail-row">
                <span class="detail-label">Hire Date:</span>
                <span>${hireDate}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Years of Service:</span>
                <span>${yearsOfService}</span>
            </div>
            <div class="detail-row salary-info" id="salary-info-row">
                <span class="detail-label">Monthly Salary:</span>
                <span id="salary-display">Restricted</span>
            </div>
            <div class="detail-row bank-info" id="bank-info-row" style="display: none;">
                <span class="detail-label">Bank Accounts:</span>
                <div id="bank-accounts-display">Restricted</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Emergency Contact</h4>
            <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span>${employee.emergencyContact.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Relationship:</span>
                <span>${employee.emergencyContact.relation}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span>${employee.emergencyContact.phone}</span>
            </div>
        </div>
    `;
    
    // Check if user is admin or authorized to view salary information
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const isAdmin = currentUser.role === 'admin';
    const isHR = currentUser.role === 'hr';
    const isFinance = currentUser.department === 'Finance';
    
    // Display salary information only for authorized users
    if (isAdmin || isHR || isFinance) {
        const salaryDisplay = document.getElementById('salary-display');
        const bankInfoRow = document.getElementById('bank-info-row');
        const bankAccountsDisplay = document.getElementById('bank-accounts-display');
        
        // Handle both old and new salary formats
        if (employee.salary && typeof employee.salary === 'object') {
            salaryDisplay.innerHTML = `
                <div>USD: $${employee.salary.USD?.toLocaleString() || 'N/A'}</div>
                <div>MVR: ₨${employee.salary.MVR?.toLocaleString() || 'N/A'}</div>
            `;
        } else {
            salaryDisplay.textContent = `$${employee.salary?.toLocaleString() || 'N/A'}`;
        }
        
        // Display bank account information
        if (employee.bankAccounts) {
            bankInfoRow.style.display = 'flex';
            let bankAccountsHTML = '';
            
            if (employee.bankAccounts.USD) {
                bankAccountsHTML += `
                    <div class="bank-account">
                        <strong>USD Account:</strong><br>
                        ${employee.bankAccounts.USD.accountName}<br>
                        ${employee.bankAccounts.USD.accountNumber}<br>
                        ${employee.bankAccounts.USD.bankName}
                    </div>
                `;
            }
            
            if (employee.bankAccounts.MVR) {
                bankAccountsHTML += `
                    <div class="bank-account">
                        <strong>MVR Account:</strong><br>
                        ${employee.bankAccounts.MVR.accountName}<br>
                        ${employee.bankAccounts.MVR.accountNumber}<br>
                        ${employee.bankAccounts.MVR.bankName}
                    </div>
                `;
            }
            
            bankAccountsDisplay.innerHTML = bankAccountsHTML || 'No bank accounts found';
        }
    }
    
    // Show modal
    viewEmployeeModal.style.display = 'block';
    
    // Set current employee
    currentEmployee = employee;
}

// Show delete confirmation
function showDeleteConfirmation(employee) {
    currentEmployee = employee;
    confirmModal.style.display = 'block';
}

// Save employee (add or update)
function saveEmployee() {
    const employeeId = document.getElementById('employee-id').value;
    const fullName = document.getElementById('full-name').value;
    const department = document.getElementById('department').value;
    const position = document.getElementById('position').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const hireDate = document.getElementById('hire-date').value;
    const salary = parseInt(document.getElementById('salary').value);
    const emergencyName = document.getElementById('emergency-name').value;
    const emergencyRelation = document.getElementById('emergency-relation').value;
    const emergencyPhone = document.getElementById('emergency-phone').value;
    
    // Get photo if available
    const photoInput = document.getElementById('photo');
    let photoUrl = currentEmployee ? currentEmployee.photo : null;
    
    if (photoInput.files.length > 0) {
        // In a real application, you would upload the file to a server
        // For this demo, we'll use a data URL
        const reader = new FileReader();
        reader.onload = function(e) {
            photoUrl = e.target.result;
            completeEmployeeSave();
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        completeEmployeeSave();
    }
    
    function completeEmployeeSave() {
        const employee = {
            id: employeeId,
            fullName: fullName,
            department: department,
            position: position,
            phone: phone,
            email: email,
            hireDate: hireDate,
            salary: salary,
            emergencyContact: {
                name: emergencyName,
                relation: emergencyRelation,
                phone: emergencyPhone
            },
            photo: photoUrl
        };
        
        if (currentEmployee) {
            // Update existing employee
            if (window.EmployeeManager) {
                window.EmployeeManager.update(employee);
            } else {
                const index = employeesData.findIndex(emp => emp.id === employeeId);
                if (index !== -1) {
                    employeesData[index] = employee;
                }
            }
        } else {
            // Add new employee
            if (window.EmployeeManager) {
                window.EmployeeManager.add(employee);
            } else {
                employeesData.push(employee);
            }
        }
        
        // Reload the data
        if (window.EmployeeManager) {
            employeesData = window.EmployeeManager.getAll();
        } else {
            // Save to localStorage
            localStorage.setItem('employees', JSON.stringify(employeesData));
            // Also save to permanent storage
            savePermanentEmployees();
        }
        
        // Close modal
        employeeModal.style.display = 'none';
        
        // Refresh grid
        renderEmployeeGrid(employeesData);
    }
}

// Delete employee
function deleteEmployee(employeeId) {
    if (window.EmployeeManager) {
        window.EmployeeManager.delete(employeeId);
        employeesData = window.EmployeeManager.getAll();
    } else {
        // Filter out the employee with the given ID
        employeesData = employeesData.filter(emp => emp.id !== employeeId);
        
        // Save to localStorage
        localStorage.setItem('employees', JSON.stringify(employeesData));
        
        // Also save to permanent storage
        savePermanentEmployees();
    }
    
    // Refresh grid
    renderEmployeeGrid(employeesData);
}

// Search employees
function searchEmployees() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderEmployeeGrid(employeesData);
        return;
    }
    
    const filteredEmployees = employeesData.filter(emp => 
        emp.fullName.toLowerCase().includes(searchTerm) ||
        emp.id.toLowerCase().includes(searchTerm) ||
        emp.department.toLowerCase().includes(searchTerm) ||
        emp.position.toLowerCase().includes(searchTerm)
    );
    
    renderEmployeeGrid(filteredEmployees);
}

// Helper function to find employee by ID
function findEmployeeById(id) {
    return employeesData.find(emp => emp.id === id);
}

// Helper function to generate a new employee ID
function generateEmployeeId() {
    // Find the highest ID number
    let maxId = 0;
    employeesData.forEach(emp => {
        const idNumber = parseInt(emp.id.replace('FE', ''));
        if (idNumber > maxId) {
            maxId = idNumber;
        }
    });
    
    // Generate new ID with leading zeros
    const newIdNumber = maxId + 1;
    return `FE${newIdNumber.toString().padStart(4, '0')}`;
}

// Helper function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper function to calculate years of service
function calculateYearsOfService(hireDate) {
    if (!hireDate) return 0;
    
    const hire = new Date(hireDate);
    const today = new Date();
    
    // Setup department and division management
    setupDepartmentDivisionManagement();
    
    
    let years = today.getFullYear() - hire.getFullYear();
    
    // Adjust if the hire date hasn't occurred yet this year
    if (
        today.getMonth() < hire.getMonth() ||
        (today.getMonth() === hire.getMonth() && today.getDate() < hire.getDate())
    ) {
        years--;
    }
    
    return `${years} year${years !== 1 ? 's' : ''}`;
}