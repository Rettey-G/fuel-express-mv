// Employee data for Fuel Express HR Management System
const baseEmployees = [
    {
        id: "FE0001",
        fullName: "Arjun Mehra",
        department: "Operations",
        position: "Fleet Manager",
        phone: "9876543210",
        email: "arjun.mehra@fuelexpress.com",
        hireDate: "2020-05-12",
        salary: 4500,
        emergencyContact: {
            name: "Priya Mehra",
            relation: "Wife",
            phone: "9876543200"
        },
        photo: "../img/employee-photos/arjun.jpg"
    },
    {
        id: "FE0002",
        fullName: "Neha Shah",
        department: "HR",
        position: "HR Executive",
        phone: "9876509876",
        email: "neha.shah@fuelexpress.com",
        hireDate: "2022-08-21",
        salary: 3800,
        emergencyContact: {
            name: "Rita Shah",
            relation: "Mother",
            phone: "9988776655"
        },
        photo: "../img/employee-photos/neha.jpg"
    },
    {
        id: "FE0003",
        fullName: "Rajiv Kumar",
        department: "Finance",
        position: "Finance Manager",
        phone: "8765432109",
        email: "rajiv.kumar@fuelexpress.com",
        hireDate: "2019-11-15",
        salary: 5200,
        emergencyContact: {
            name: "Anita Kumar",
            relation: "Wife",
            phone: "8765432100"
        },
        photo: "../img/employee-photos/rajiv.jpg"
    },
    {
        id: "FE0004",
        fullName: "Priya Sharma",
        department: "IT",
        position: "Systems Administrator",
        phone: "7654321098",
        email: "priya.sharma@fuelexpress.com",
        hireDate: "2021-03-10",
        salary: 4200,
        emergencyContact: {
            name: "Rahul Sharma",
            relation: "Brother",
            phone: "7654321000"
        },
        photo: "../img/employee-photos/priya.jpg"
    },
    {
        id: "FE0005",
        fullName: "Vikram Singh",
        department: "Operations",
        position: "Station Supervisor",
        phone: "6543210987",
        email: "vikram.singh@fuelexpress.com",
        hireDate: "2020-07-22",
        salary: 3900,
        emergencyContact: {
            name: "Meera Singh",
            relation: "Wife",
            phone: "6543210900"
        },
        photo: "../img/employee-photos/vikram.jpg"
    },
    {
        id: "FE0006",
        fullName: "Ananya Patel",
        department: "Marketing",
        position: "Marketing Specialist",
        phone: "5432109876",
        email: "ananya.patel@fuelexpress.com",
        hireDate: "2022-01-15",
        salary: 3600,
        emergencyContact: {
            name: "Rohan Patel",
            relation: "Husband",
            phone: "5432109800"
        },
        photo: "../img/employee-photos/ananya.jpg"
    }
    // Add more employees as needed to reach 150
];

// Employee data management
const EmployeeManager = {
    // Get all employees
    getAll: function() {
        try {
            const storedData = localStorage.getItem('permanentEmployees');
            if (storedData) {
                return JSON.parse(storedData);
            }
        } catch (error) {
            console.error('Error retrieving employee data:', error);
        }
        return [...baseEmployees];
    },
    
    // Save all employees
    saveAll: function(employeesData) {
        try {
            localStorage.setItem('permanentEmployees', JSON.stringify(employeesData));
            return true;
        } catch (error) {
            console.error('Error saving employee data:', error);
            return false;
        }
    },
    
    // Add a new employee
    add: function(employee) {
        const employees = this.getAll();
        employees.push(employee);
        this.logActivity(`Added new employee: ${employee.fullName} (${employee.id})`);
        return this.saveAll(employees);
    },
    
    // Update an existing employee
    update: function(updatedEmployee) {
        const employees = this.getAll();
        const index = employees.findIndex(emp => emp.id === updatedEmployee.id);
        if (index !== -1) {
            employees[index] = updatedEmployee;
            this.logActivity(`Updated employee: ${updatedEmployee.fullName} (${updatedEmployee.id})`);
            return this.saveAll(employees);
        }
        return false;
    },
    
    // Delete an employee
    delete: function(employeeId) {
        const employees = this.getAll();
        const employee = employees.find(emp => emp.id === employeeId);
        const filteredEmployees = employees.filter(emp => emp.id !== employeeId);
        if (filteredEmployees.length < employees.length && employee) {
            this.logActivity(`Deleted employee: ${employee.fullName} (${employee.id})`);
            return this.saveAll(filteredEmployees);
        }
        return false;
    },
    
    // Reset to base employees
    reset: function() {
        this.logActivity("Reset all employee data to default");
        return this.saveAll([...baseEmployees]);
    },
    
    // Log activity
    logActivity: function(description) {
        try {
            const now = new Date();
            const activity = {
                timestamp: now.toISOString(),
                description: description,
                date: now.toLocaleDateString(),
                time: now.toLocaleTimeString()
            };
            
            // Get existing activities
            let activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
            
            // Add new activity at the beginning
            activities.unshift(activity);
            
            // Keep only the most recent 50 activities
            if (activities.length > 50) {
                activities = activities.slice(0, 50);
            }
            
            // Save activities
            localStorage.setItem('recentActivities', JSON.stringify(activities));
            
            return true;
        } catch (error) {
            console.error('Error logging activity:', error);
            return false;
        }
    },
    
    // Get recent activities
    getActivities: function(limit = 10) {
        try {
            const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
            return activities.slice(0, limit);
        } catch (error) {
            console.error('Error retrieving activities:', error);
            return [];
        }
    }
};

// Initialize employees data
let employees = EmployeeManager.getAll();

// Export for use in other files
if (typeof window !== 'undefined') {
    window.EmployeeManager = EmployeeManager;
    window.employees = employees;
}

// Export the employees array for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { employees };
}