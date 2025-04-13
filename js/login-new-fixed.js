// Function to initialize default users
function initializeUsers() {
    // Check if users already exist
    const existingUsers = localStorage.getItem('fuel_express_users');
    if (existingUsers) return;
    
    // Create default users
    const defaultUsers = [
        {
            empNo: 'FEM101',
            id: 'A123456',
            fullName: 'John Doe',
            email: 'john.doe@fuelexpress.com',
            username: 'john',
            password: 'password123',
            role: 'user',
            department: 'Operations',
            position: 'Manager',
            gender: 'Male',
            nationality: 'Maldivian',
            workSite: 'Office',
            salary: {
                MVR: 30800,
                USD: 2000
            },
            bankAccounts: {
                MVR: {
                    accountName: 'John Doe',
                    accountNumber: 'MVR1234567',
                    bankName: 'Bank of Maldives'
                },
                USD: {
                    accountName: 'John Doe',
                    accountNumber: 'USD1234567',
                    bankName: 'International Bank'
                }
            }
        },
        {
            empNo: 'FEM102',
            id: 'A789012',
            fullName: 'Jane Smith',
            email: 'jane.smith@fuelexpress.com',
            username: 'jane',
            password: 'password123',
            role: 'hr',
            department: 'HR',
            position: 'HR Manager',
            gender: 'Female',
            nationality: 'Maldivian',
            workSite: 'Office',
            salary: {
                MVR: 38500,
                USD: 2500
            },
            bankAccounts: {
                MVR: {
                    accountName: 'Jane Smith',
                    accountNumber: 'MVR7890123',
                    bankName: 'Bank of Maldives'
                },
                USD: {
                    accountName: 'Jane Smith',
                    accountNumber: 'USD7890123',
                    bankName: 'International Bank'
                }
            }
        },
        {
            empNo: 'FEM103',
            id: 'A345678',
            fullName: 'Bob Johnson',
            email: 'bob.johnson@fuelexpress.com',
            username: 'bob',
            password: 'password123',
            role: 'user',
            department: 'Finance',
            position: 'Accountant',
            gender: 'Male',
            nationality: 'Maldivian',
            workSite: 'Office',
            salary: {
                MVR: 23100,
                USD: 1500
            },
            bankAccounts: {
                MVR: {
                    accountName: 'Bob Johnson',
                    accountNumber: 'MVR3456789',
                    bankName: 'Bank of Maldives'
                },
                USD: {
                    accountName: 'Bob Johnson',
                    accountNumber: 'USD3456789',
                    bankName: 'International Bank'
                }
            }
        }
    ];
    
    // Save default users to localStorage
    localStorage.setItem('fuel_express_users', JSON.stringify(defaultUsers));
    console.log('Default users initialized');
    
    // Clear any existing employee data to ensure consistency
    localStorage.removeItem('permanentEmployees');
}

document.addEventListener('DOMContentLoaded', function() {
    // Clear any existing login issues
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Initialize users
    initializeUsers();
    
    // Tab switching
    const loginTabs = document.querySelectorAll('.login-tab');
    loginTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and forms
            loginTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.login-form').forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            tab.classList.add('active');
            const formId = tab.dataset.tab + '-form';
            document.getElementById(formId).classList.add('active');
        });
    });
    
    // Login form submission
    document.getElementById('login-button').addEventListener('click', () => {
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        // Validate inputs
        let isValid = true;
        
        if (!username) {
            document.getElementById('login-username-error').textContent = 'Username is required';
            isValid = false;
        }
        
        if (!password) {
            document.getElementById('login-password-error').textContent = 'Password is required';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Special case for admin login
        if (username === 'admin' && password === 'admin123') {
            // Store admin auth token
            localStorage.setItem('authToken', 'admin');
            
            // Create admin user with complete data structure
            const adminUser = {
                empNo: 'FEM000',
                id: 'A000000',
                fullName: 'Admin User',
                email: 'admin@fuelexpress.com',
                username: 'admin',
                role: 'admin',
                department: 'Management',
                position: 'System Administrator',
                gender: 'Male',
                nationality: 'Maldivian',
                dateOfBirth: '01-Jan-80',
                mobile: '7777777',
                workSite: 'Office',
                joinedDate: '01-Jan-20',
                salary: {
                    MVR: 100000,
                    USD: 6500
                },
                bankAccounts: {
                    MVR: {
                        accountName: 'Admin User',
                        accountNumber: 'MVR0000000',
                        bankName: 'Bank of Maldives'
                    },
                    USD: {
                        accountName: 'Admin User',
                        accountNumber: 'USD0000000',
                        bankName: 'International Bank'
                    }
                },
                emergencyContact: {
                    name: 'Emergency Contact',
                    relation: 'Relative',
                    phone: '7777778'
                }
            };
            
            // Store admin user data
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
            
            // Show success message
            document.getElementById('login-success').textContent = 'Admin login successful! Redirecting...';
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            return;
        }
        
        // Attempt login for other users
        const users = JSON.parse(localStorage.getItem('fuel_express_users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Store auth token
            localStorage.setItem('authToken', username);
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Show success message
            document.getElementById('login-success').textContent = 'Login successful! Redirecting...';
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            document.getElementById('login-error').textContent = 'Invalid username or password';
        }
    });
    
    // Signup form submission
    document.getElementById('signup-button').addEventListener('click', () => {
        // Reset error messages
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        
        const fullName = document.getElementById('signup-fullname').value;
        const email = document.getElementById('signup-email').value;
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;
        
        // Validate inputs
        let isValid = true;
        
        if (!fullName) {
            document.getElementById('signup-fullname-error').textContent = 'Full name is required';
            isValid = false;
        }
        
        if (!email) {
            document.getElementById('signup-email-error').textContent = 'Email is required';
            isValid = false;
        } else {
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById('signup-email-error').textContent = 'Please enter a valid email address';
                isValid = false;
            }
        }
        
        if (!username) {
            document.getElementById('signup-username-error').textContent = 'Username is required';
            isValid = false;
        }
        
        if (!password) {
            document.getElementById('signup-password-error').textContent = 'Password is required';
            isValid = false;
        }
        
        if (!confirmPassword) {
            document.getElementById('signup-confirm-error').textContent = 'Please confirm your password';
            isValid = false;
        } else if (password !== confirmPassword) {
            document.getElementById('signup-confirm-error').textContent = 'Passwords do not match';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('fuel_express_users') || '[]');
        
        // Check if username already exists
        if (users.some(u => u.username === username)) {
            document.getElementById('signup-username-error').textContent = 'Username already exists';
            return;
        }
        
        // Add new user
        const newUser = {
            empNo: `FEM${(104 + users.length).toString()}`,
            id: `A${Math.floor(100000 + Math.random() * 900000)}`,
            fullName: fullName,
            email: email,
            username: username,
            password: password,
            role: 'user',
            department: 'General',
            position: 'Employee',
            gender: 'Other',
            nationality: 'Maldivian',
            workSite: 'Office',
            salary: {
                MVR: 15400,
                USD: 1000
            },
            bankAccounts: {
                MVR: {
                    accountName: fullName,
                    accountNumber: `MVR${Math.floor(1000000 + Math.random() * 9000000)}`,
                    bankName: 'Bank of Maldives'
                },
                USD: {
                    accountName: fullName,
                    accountNumber: `USD${Math.floor(1000000 + Math.random() * 9000000)}`,
                    bankName: 'International Bank'
                }
            }
        };
        
        users.push(newUser);
        localStorage.setItem('fuel_express_users', JSON.stringify(users));
        
        // Show success message
        document.getElementById('signup-success').textContent = 'Account created successfully! You can now log in.';
        
        // Clear form
        document.getElementById('signup-fullname').value = '';
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-username').value = '';
        document.getElementById('signup-password').value = '';
        document.getElementById('signup-confirm').value = '';
        
        // Switch to login tab after a delay
        setTimeout(() => {
            document.querySelector('.login-tab[data-tab="login"]').click();
        }, 2000);
    });
    
    // Forgot password link
    document.getElementById('forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Please contact your administrator to reset your password.');
    });
});
