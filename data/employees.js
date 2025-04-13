// Employee data for Fuel Express HR Management System
const baseEmployees = [

    {
        empNo: "FEM001",
        id: "A132309",
        fullName: "Ahmed Shiaz",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "22-Oct-99",
        mobile: "9991960",
        department: "Admin",
        position: "Managing Director",
        workSite: "Office",
        joinedDate: "21-Mar-11",
        salary: {
            MVR: 92400,
            USD: 6000
        },
        bankAccounts: {
            MVR: {
                accountName: "Ahmed Shiaz",
                accountNumber: "MVR9991960",
                bankName: "Bank of Maldives"
            },
            USD: {
                accountName: "Ahmed Shiaz",
                accountNumber: "USD9991960",
                bankName: "International Bank"
            }
        },
        emergencyContact: {
            name: "Aishath Faiza",
            relation: "Wife",
            phone: "7622824"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM002",
        id: "A312547",
        fullName: "Ibrahim Jaleel",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "27-Feb-90",
        mobile: "9931077",
        department: "Operations",
        position: "Chief Operating Officer",
        workSite: "Office",
        joinedDate: "01-Jan-20",
        salary: {
            MVR: 77000,
            USD: 5000
        },
        bankAccounts: {
            MVR: {
                accountName: "Ibrahim Jaleel",
                accountNumber: "MVR9931077",
                bankName: "Bank of Maldives"
            },
            USD: {
                accountName: "Ibrahim Jaleel",
                accountNumber: "USD9931077",
                bankName: "International Bank"
            }
        },
        emergencyContact: {
            name: "Aminath Faiza",
            relation: "Wife",
            phone: "7622935"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM003",
        id: "A158962",
        fullName: "Aishath Fazaa Fazeel",
        gender: "Female",
        nationality: "Maldivian",
        dateOfBirth: "09-Dec-99",
        mobile: "7622824",
        department: "Finance",
        position: "Accountant",
        workSite: "Office",
        joinedDate: "04-Mar-21",
        salary: {
            MVR: 46200,
            USD: 3000
        },
        bankAccounts: {
            MVR: {
                accountName: "Aishath Fazaa Fazeel",
                accountNumber: "MVR7622824",
                bankName: "Bank of Maldives"
            },
            USD: {
                accountName: "Aishath Fazaa Fazeel",
                accountNumber: "USD7622824",
                bankName: "International Bank"
            }
        },
        emergencyContact: {
            name: "Ahmed Shiaz",
            relation: "Husband",
            phone: "9991960"
        },
        photo: "../img/employee-photos/default-female.jpg"
    }
];

// Employee data management
const EmployeeManager = {
    // Get all employees
    getAll() {
        const storedEmployees = localStorage.getItem('employees');
        return storedEmployees ? JSON.parse(storedEmployees) : baseEmployees;
    },

    // Save all employees
    saveAll(employeesData) {
        localStorage.setItem('employees', JSON.stringify(employeesData));
        this.logActivity('Updated employee records');
        return employeesData;
    },

    // Add a new employee
    add(employee) {
        const employees = this.getAll();
        employees.push(employee);
        this.saveAll(employees);
        return employee;
    },

    // Update an existing employee
    update(updatedEmployee) {
        const employees = this.getAll();
        const index = employees.findIndex(emp => emp.id === updatedEmployee.id);
        if (index !== -1) {
            employees[index] = updatedEmployee;
            this.saveAll(employees);
            return updatedEmployee;
        }
        return null;
    },

    // Delete an employee
    delete(employeeId) {
        const employees = this.getAll();
        const index = employees.findIndex(emp => emp.id === employeeId);
        if (index !== -1) {
            const deleted = employees.splice(index, 1)[0];
            this.saveAll(employees);
            return deleted;
        }
        return null;
    },

    // Reset to base employees
    reset() {
        this.saveAll(baseEmployees);
        return baseEmployees;
    },

    // Log activity
    logActivity(description) {
        const now = new Date();
        const timestamp = now.toISOString();
        const activities = this.getActivities();
        
        activities.unshift({
            id: timestamp,
            timestamp,
            description,
            user: localStorage.getItem('currentUser') || 'System'
        });
        
        // Keep only the last 100 activities
        const trimmedActivities = activities.slice(0, 100);
        localStorage.setItem('employeeActivities', JSON.stringify(trimmedActivities));
    },

    // Get recent activities
    getActivities(limit = 10) {
        const storedActivities = localStorage.getItem('employeeActivities');
        const activities = storedActivities ? JSON.parse(storedActivities) : [,

    {
        empNo: "FEM005",
        id: "A060935",
        fullName: "Ahmed Hussain",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "22-May-70",
        mobile: "7962250",
        department: "Operations",
        position: "Captain",
        workSite: "Express 3",
        joinedDate: "10-Aug-21",
        salary: {
            MVR: 38500,
            USD: 2500
        },
        bankAccounts: {
            MVR: {
                accountName: "Ahmed Hussain",
                accountNumber: "MVR7962250",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Mariyam Hussain",
            relation: "Wife",
            phone: "7962251"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM007",
        id: "A133967",
        fullName: "Ahmed Hasnain",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "22-May-70",
        mobile: "7646454",
        department: "Operations",
        position: "Captain",
        workSite: "Express 1",
        joinedDate: "28-Jul-21",
        salary: {
            MVR: 38500,
            USD: 2500
        },
        bankAccounts: {
            MVR: {
                accountName: "Ahmed Hasnain",
                accountNumber: "MVR7646454",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Fathimath Hasnain",
            relation: "Wife",
            phone: "7646455"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM008",
        id: "EL0110781",
        fullName: "Mohamed Hamvi Uddin",
        gender: "Male",
        nationality: "Bangladeshi",
        dateOfBirth: "07-Jan-81",
        mobile: "7706226",
        department: "Operations",
        position: "Driver",
        workSite: "Bowser",
        joinedDate: "11-Jan-21",
        salary: {
            MVR: 15400,
            USD: 1000
        },
        bankAccounts: {
            MVR: {
                accountName: "Mohamed Hamvi Uddin",
                accountNumber: "MVR7706226",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Rafiq Uddin",
            relation: "Brother",
            phone: "7706227"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM009",
        id: "EO0458449",
        fullName: "Abdul Kalam Azad",
        gender: "Male",
        nationality: "Bangladeshi",
        dateOfBirth: "15-Jul-85",
        mobile: "9141139",
        department: "Operations",
        position: "Driver",
        workSite: "Bowser",
        joinedDate: "18-Oct-22",
        salary: {
            MVR: 15400,
            USD: 1000
        },
        bankAccounts: {
            MVR: {
                accountName: "Abdul Kalam Azad",
                accountNumber: "MVR9141139",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Mohammed Rafiq",
            relation: "Friend",
            phone: "7706227"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM010",
        id: "L9299054",
        fullName: "John Timothy",
        gender: "Male",
        nationality: "Indian",
        dateOfBirth: "20-Apr-74",
        mobile: "9651444",
        department: "Operations",
        position: "Driver",
        workSite: "Bowser",
        joinedDate: "16-May-22",
        salary: {
            MVR: 15400,
            USD: 1000
        },
        bankAccounts: {
            MVR: {
                accountName: "John Timothy",
                accountNumber: "MVR9651444",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Mary Timothy",
            relation: "Wife",
            phone: "9651445"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM012",
        id: "BL6097967",
        fullName: "Md Rubel",
        gender: "Male",
        nationality: "Bangladeshi",
        dateOfBirth: "03-Jan-84",
        mobile: "9193552",
        department: "Operations",
        position: "Crew",
        workSite: "Express 1",
        joinedDate: "27-Oct-21",
        salary: {
            MVR: 12320,
            USD: 800
        },
        bankAccounts: {
            MVR: {
                accountName: "Md Rubel",
                accountNumber: "MVR9193552",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Abdul Rahman",
            relation: "Friend",
            phone: "7706227"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM014",
        id: "BID402989",
        fullName: "Haris Ali Salail",
        gender: "Male",
        nationality: "Bangladeshi",
        dateOfBirth: "23-Jul-72",
        mobile: "7988367",
        department: "Operations",
        position: "Driver",
        workSite: "Bowser",
        joinedDate: "18-Oct-22",
        salary: {
            MVR: 15400,
            USD: 1000
        },
        bankAccounts: {
            MVR: {
                accountName: "Haris Ali Salail",
                accountNumber: "MVR7988367",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Fatima Ali",
            relation: "Wife",
            phone: "7988368"
        },
        photo: "../img/employee-photos/default-male.jpg"
    }
,

    {
        empNo: "FEM015",
        id: "A282699",
        fullName: "Aishath Zaina Zubair",
        gender: "Female",
        nationality: "Maldivian",
        dateOfBirth: "02-Dec-01",
        mobile: "9558600",
        department: "Admin",
        position: "Admin Executive",
        workSite: "Office",
        joinedDate: "28-Feb-23",
        salary: {
            MVR: 23100,
            USD: 1500
        },
        bankAccounts: {
            MVR: {
                accountName: "Aishath Zaina Zubair",
                accountNumber: "MVR9558600",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Zubair Ahmed",
            relation: "Father",
            phone: "9558601"
        },
        photo: "../img/employee-photos/default-female.jpg"
    },
    {
        empNo: "FEM016",
        id: "A316572",
        fullName: "Aishath Shifna",
        gender: "Female",
        nationality: "Maldivian",
        dateOfBirth: "16-Nov-91",
        mobile: "9151511",
        department: "Admin",
        position: "Legal Officer",
        workSite: "Office",
        joinedDate: "06-Mar-23",
        salary: {
            MVR: 30800,
            USD: 2000
        },
        bankAccounts: {
            MVR: {
                accountName: "Aishath Shifna",
                accountNumber: "MVR9151511",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Ibrahim Shifan",
            relation: "Husband",
            phone: "9151512"
        },
        photo: "../img/employee-photos/default-female.jpg"
    },
    {
        empNo: "FEM017",
        id: "N10034127",
        fullName: "Ajith Shankanna",
        gender: "Female",
        nationality: "Sri Lankan",
        dateOfBirth: "03-Jul-74",
        mobile: "9908211",
        department: "Engineering",
        position: "Mechanic",
        workSite: "Express 10",
        joinedDate: "20-Feb-23",
        salary: {
            MVR: 23100,
            USD: 1500
        },
        bankAccounts: {
            MVR: {
                accountName: "Ajith Shankanna",
                accountNumber: "MVR9908211",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Priya Shankanna",
            relation: "Sister",
            phone: "9908212"
        },
        photo: "../img/employee-photos/default-female.jpg"
    },
    {
        empNo: "FEM020",
        id: "A124297",
        fullName: "Mohamed Nazeeh",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "28-Dec-83",
        mobile: "9762222",
        department: "Operations",
        position: "Captain",
        workSite: "Express 7",
        joinedDate: "05-Jan-23",
        salary: {
            MVR: 38500,
            USD: 2500
        },
        bankAccounts: {
            MVR: {
                accountName: "Mohamed Nazeeh",
                accountNumber: "MVR9762222",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Fathimath Nazeeh",
            relation: "Wife",
            phone: "9762223"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM023",
        id: "N9906817",
        fullName: "Samanthe",
        gender: "Female",
        nationality: "Sri Lankan",
        dateOfBirth: "30-Apr-76",
        mobile: "7866521",
        department: "Engineering",
        position: "Chief Engineer",
        workSite: "Express 10",
        joinedDate: "14-Sep-23",
        salary: {
            MVR: 46200,
            USD: 3000
        },
        bankAccounts: {
            MVR: {
                accountName: "Samanthe",
                accountNumber: "MVR7866521",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Rajiv Kumar",
            relation: "Husband",
            phone: "7866522"
        },
        photo: "../img/employee-photos/default-female.jpg"
    },
    {
        empNo: "FEM027",
        id: "N2769966",
        fullName: "Mohamed Fazmy Mohamed Faleel",
        gender: "Male",
        nationality: "Sri Lankan",
        dateOfBirth: "06-Jan-85",
        mobile: "7206696",
        department: "Sales & Marketing",
        position: "Sales Manager",
        workSite: "Office",
        joinedDate: "03-Jan-24",
        salary: {
            MVR: 30800,
            USD: 2000
        },
        bankAccounts: {
            MVR: {
                accountName: "Mohamed Fazmy Mohamed Faleel",
                accountNumber: "MVR7206696",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Fathimath Fazmy",
            relation: "Wife",
            phone: "7206697"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM028",
        id: "A146198",
        fullName: "Mohamed Mihaan",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "10-Dec-83",
        mobile: "9703322",
        department: "Operations",
        position: "Chief Officer",
        workSite: "Express 10",
        joinedDate: "17-Jan-24",
        salary: {
            MVR: 38500,
            USD: 2500
        },
        bankAccounts: {
            MVR: {
                accountName: "Mohamed Mihaan",
                accountNumber: "MVR9703322",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Aishath Mihaan",
            relation: "Wife",
            phone: "9703323"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM029",
        id: "A049728",
        fullName: "Ismail Ali Manik",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "15-Oct-52",
        mobile: "9656157",
        department: "Operations",
        position: "Chief Engineer",
        workSite: "Express 10",
        joinedDate: "17-Jan-24",
        salary: {
            MVR: 46200,
            USD: 3000
        },
        bankAccounts: {
            MVR: {
                accountName: "Ismail Ali Manik",
                accountNumber: "MVR9656157",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Mariyam Manik",
            relation: "Wife",
            phone: "9656158"
        },
        photo: "../img/employee-photos/default-male.jpg"
    }
,

    {
        empNo: "FEM032",
        id: "A02231101",
        fullName: "Jamal Hossain",
        gender: "Male",
        nationality: "Bangladeshi",
        dateOfBirth: "17-May-93",
        mobile: "9976583",
        department: "Operations",
        position: "Crew",
        workSite: "Express 7",
        joinedDate: "10-Feb-24",
        salary: {
            MVR: 12320,
            USD: 800
        },
        bankAccounts: {
            MVR: {
                accountName: "Jamal Hossain",
                accountNumber: "MVR9976583",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Mohammed Uddin",
            relation: "Friend",
            phone: "7706227"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM035",
        id: "N8486954",
        fullName: "Sumith Upul Kumara",
        gender: "Male",
        nationality: "Sri Lankan",
        dateOfBirth: "08-Mar-69",
        mobile: "9908611",
        department: "Engineering",
        position: "Engineer Manager",
        workSite: "Office",
        joinedDate: "26-Feb-24",
        salary: {
            MVR: 38500,
            USD: 2500
        },
        bankAccounts: {
            MVR: {
                accountName: "Sumith Upul Kumara",
                accountNumber: "MVR9908611",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Priya Kumara",
            relation: "Wife",
            phone: "9908612"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM036",
        id: "A123222",
        fullName: "Ahmed Fathiu",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "20-Jan-83",
        mobile: "9976583",
        department: "Operations",
        position: "Operation Manger",
        workSite: "Office",
        joinedDate: "26-Feb-24",
        salary: {
            MVR: 38500,
            USD: 2500
        },
        bankAccounts: {
            MVR: {
                accountName: "Ahmed Fathiu",
                accountNumber: "MVR9976583",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Fathimath Fathiu",
            relation: "Wife",
            phone: "9976584"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM037",
        id: "Z447265",
        fullName: "Rakesh Murlidhar Patil",
        gender: "Male",
        nationality: "Indian",
        dateOfBirth: "09-Jan-97",
        mobile: "7644726",
        department: "Operations",
        position: "Crew",
        workSite: "Express 3",
        joinedDate: "29-Feb-24",
        salary: {
            MVR: 12320,
            USD: 800
        },
        bankAccounts: {
            MVR: {
                accountName: "Rakesh Murlidhar Patil",
                accountNumber: "MVR7644726",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Murlidhar Patil",
            relation: "Father",
            phone: "7644727"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM038",
        id: "V2491887",
        fullName: "Shubham Patil",
        gender: "Male",
        nationality: "Indian",
        dateOfBirth: "26-Mar-01",
        mobile: "7644728",
        department: "Operations",
        position: "Crew",
        workSite: "Express 5",
        joinedDate: "29-Feb-24",
        salary: {
            MVR: 12320,
            USD: 800
        },
        bankAccounts: {
            MVR: {
                accountName: "Shubham Patil",
                accountNumber: "MVR7644728",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Rakesh Patil",
            relation: "Brother",
            phone: "7644726"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM040",
        id: "EJ0721539",
        fullName: "Sohel Mahmud",
        gender: "Male",
        nationality: "Bangladeshi",
        dateOfBirth: "02-Aug-91",
        mobile: "9127801",
        department: "Admin",
        position: "Cleaner",
        workSite: "Office",
        joinedDate: "04-May-24",
        salary: {
            MVR: 7700,
            USD: 500
        },
        bankAccounts: {
            MVR: {
                accountName: "Sohel Mahmud",
                accountNumber: "MVR9127801",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Abdul Kalam",
            relation: "Friend",
            phone: "9141139"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM041",
        id: "A289433",
        fullName: "Ahmed Siwaam",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "14-Mar-91",
        mobile: "7625982",
        department: "Operations",
        position: "Operation Executive",
        workSite: "Office",
        joinedDate: "12-May-24",
        salary: {
            MVR: 23100,
            USD: 1500
        },
        bankAccounts: {
            MVR: {
                accountName: "Ahmed Siwaam",
                accountNumber: "MVR7625982",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Fathimath Siwaam",
            relation: "Wife",
            phone: "7625983"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM043",
        id: "A025851",
        fullName: "Ahmed Siyam",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "18/03/1983",
        mobile: "7209421",
        department: "Operations",
        position: "Second Engineer",
        workSite: "Express 10",
        joinedDate: "15-May-24",
        salary: {
            MVR: 30800,
            USD: 2000
        },
        bankAccounts: {
            MVR: {
                accountName: "Ahmed Siyam",
                accountNumber: "MVR7209421",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Aishath Siyam",
            relation: "Wife",
            phone: "7209422"
        },
        photo: "../img/employee-photos/default-male.jpg"
    }
,

    {
        empNo: "FEM053",
        id: "V9902021",
        fullName: "Yashvendra Yadav",
        gender: "Male",
        nationality: "Indian",
        dateOfBirth: "25-Dec-97",
        mobile: "7644729",
        department: "Operations",
        position: "Oiler",
        workSite: "Express 10",
        joinedDate: "06-Nov-24",
        salary: {
            MVR: 12320,
            USD: 800
        },
        bankAccounts: {
            MVR: {
                accountName: "Yashvendra Yadav",
                accountNumber: "MVR7644729",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Rakesh Patil",
            relation: "Friend",
            phone: "7644726"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM055",
        id: "A071009",
        fullName: "Ahmed Mabrook",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "24-May-59",
        mobile: "9627270",
        department: "Operations",
        position: "Deck crew (AB)",
        workSite: "Express 10",
        joinedDate: "25-Jun-24",
        salary: {
            MVR: 15400,
            USD: 1000
        },
        bankAccounts: {
            MVR: {
                accountName: "Ahmed Mabrook",
                accountNumber: "MVR9627270",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Fathimath Mabrook",
            relation: "Wife",
            phone: "9627271"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM056",
        id: "A207211",
        fullName: "Ahmed Saudhoon",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "03-Aug-89",
        mobile: "9670656",
        department: "Admin",
        position: "Office Manager",
        workSite: "Office",
        joinedDate: "01-Aug-24",
        salary: {
            MVR: 23100,
            USD: 1500
        },
        bankAccounts: {
            MVR: {
                accountName: "Ahmed Saudhoon",
                accountNumber: "MVR9670656",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Aishath Saudhoon",
            relation: "Wife",
            phone: "9670657"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM057",
        id: "A120606",
        fullName: "Ismail Aboobakuru",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "26-Aug-72",
        mobile: "7736279",
        department: "Operations",
        position: "Deck crew (AB)",
        workSite: "Express 10",
        joinedDate: "01-Aug-24",
        salary: {
            MVR: 15400,
            USD: 1000
        },
        bankAccounts: {
            MVR: {
                accountName: "Ismail Aboobakuru",
                accountNumber: "MVR7736279",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Mariyam Aboobakuru",
            relation: "Wife",
            phone: "7736280"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM058",
        id: "N12101901",
        fullName: "Nawodi Tharika Gangabada Arachchige",
        gender: "Female",
        nationality: "Sri Lankan",
        dateOfBirth: "19-Nov-98",
        mobile: "9110824",
        department: "Finance",
        position: "Accounts Assistant",
        workSite: "Office",
        joinedDate: "17-Aug-24",
        salary: {
            MVR: 15400,
            USD: 1000
        },
        bankAccounts: {
            MVR: {
                accountName: "Nawodi Tharika Gangabada Arachchige",
                accountNumber: "MVR9110824",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Samanthe",
            relation: "Friend",
            phone: "7866521"
        },
        photo: "../img/employee-photos/default-female.jpg"
    },
    {
        empNo: "FEM062",
        id: "I1876542",
        fullName: "Sanjay Patil",
        gender: "Male",
        nationality: "Indian",
        dateOfBirth: "01-Nov-02",
        mobile: "8287665",
        department: "Operations",
        position: "Oiler",
        workSite: "Express 10",
        joinedDate: "22-Aug-24",
        salary: {
            MVR: 12320,
            USD: 800
        },
        bankAccounts: {
            MVR: {
                accountName: "Sanjay Patil",
                accountNumber: "MVR8287665",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Rakesh Patil",
            relation: "Brother",
            phone: "7644726"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM063",
        id: "N8302146",
        fullName: "Mohamed Sajeel Abdul Raseed",
        gender: "Male",
        nationality: "Sri Lankan",
        dateOfBirth: "06-Nov-90",
        mobile: "9900844",
        department: "Finance",
        position: "Chief Financial Officer",
        workSite: "Office",
        joinedDate: "26-Aug-24",
        salary: {
            MVR: 61600,
            USD: 4000
        },
        bankAccounts: {
            MVR: {
                accountName: "Mohamed Sajeel Abdul Raseed",
                accountNumber: "MVR9900844",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Fathimath Sajeel",
            relation: "Wife",
            phone: "9900845"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM064",
        id: "V2858821",
        fullName: "Christo Joseph",
        gender: "Male",
        nationality: "Indian",
        dateOfBirth: "01-Jan-85",
        mobile: "7644730",
        department: "Operations",
        position: "Oiler",
        workSite: "Express 10",
        joinedDate: "05-Sep-24",
        salary: {
            MVR: 12320,
            USD: 800
        },
        bankAccounts: {
            MVR: {
                accountName: "Christo Joseph",
                accountNumber: "MVR7644730",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Rakesh Patil",
            relation: "Friend",
            phone: "7644726"
        },
        photo: "../img/employee-photos/default-male.jpg"
    }
,

    {
        empNo: "FEM066",
        id: "S1377632",
        fullName: "Sudhir Kumar",
        gender: "Male",
        nationality: "Indian",
        dateOfBirth: "11-Sep-00",
        mobile: "7644731",
        department: "Operations",
        position: "Deck crew (AB)",
        workSite: "Express 10",
        joinedDate: "18-Sep-24",
        salary: {
            MVR: 15400,
            USD: 1000
        },
        bankAccounts: {
            MVR: {
                accountName: "Sudhir Kumar",
                accountNumber: "MVR7644731",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Rakesh Patil",
            relation: "Friend",
            phone: "7644726"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM070",
        id: "A295682",
        fullName: "Aerar Adnan",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "22-Apr-92",
        mobile: "9846646",
        department: "Human Resources",
        position: "HR Assistant Manager",
        workSite: "Office",
        joinedDate: "19-Oct-24",
        salary: {
            MVR: 23100,
            USD: 1500
        },
        bankAccounts: {
            MVR: {
                accountName: "Aerar Adnan",
                accountNumber: "MVR9846646",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Fathimath Adnan",
            relation: "Wife",
            phone: "9846647"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM072",
        id: "A240323",
        fullName: "Abdulla Ahmed",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "07-Mar-91",
        mobile: "7978870",
        department: "Operations",
        position: "Boat Captain",
        workSite: "Office",
        joinedDate: "07-Nov-24",
        salary: {
            MVR: 23100,
            USD: 1500
        },
        bankAccounts: {
            MVR: {
                accountName: "Abdulla Ahmed",
                accountNumber: "MVR7978870",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Aishath Ahmed",
            relation: "Wife",
            phone: "7978871"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM074",
        id: "A231365",
        fullName: "Hussain Shaafiu",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "23-Jan-94",
        mobile: "7743803",
        department: "Operations",
        position: "Boat Crew",
        workSite: "Express 7",
        joinedDate: "14-Nov-24",
        salary: {
            MVR: 15400,
            USD: 1000
        },
        bankAccounts: {
            MVR: {
                accountName: "Hussain Shaafiu",
                accountNumber: "MVR7743803",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Fathimath Shaafiu",
            relation: "Wife",
            phone: "7743804"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM077",
        id: "N11502120",
        fullName: "Sachini Meduka Jayashantha",
        gender: "Female",
        nationality: "Sri Lankan",
        dateOfBirth: "11-Jun-96",
        mobile: "9329246",
        department: "Human Resources",
        position: "HR & Admin Assistant",
        workSite: "Office",
        joinedDate: "28-Dec-24",
        salary: {
            MVR: 15400,
            USD: 1000
        },
        bankAccounts: {
            MVR: {
                accountName: "Sachini Meduka Jayashantha",
                accountNumber: "MVR9329246",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Samanthe",
            relation: "Friend",
            phone: "7866521"
        },
        photo: "../img/employee-photos/default-female.jpg"
    },
    {
        empNo: "FEM080",
        id: "A035651",
        fullName: "Moosa Muneer",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "08-Aug-64",
        mobile: "7792227",
        department: "Operations",
        position: "Site Manager",
        workSite: "Thilafushi",
        joinedDate: "22-Jan-25",
        salary: {
            MVR: 30800,
            USD: 2000
        },
        bankAccounts: {
            MVR: {
                accountName: "Moosa Muneer",
                accountNumber: "MVR7792227",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Mariyam Muneer",
            relation: "Wife",
            phone: "7792228"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM081",
        id: "A231534",
        fullName: "Fauzaan Fahmy",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "17-Dec-99",
        mobile: "9499690",
        department: "Operations",
        position: "Boat crew",
        workSite: "Express 6",
        joinedDate: "23-Jan-25",
        salary: {
            MVR: 15400,
            USD: 1000
        },
        bankAccounts: {
            MVR: {
                accountName: "Fauzaan Fahmy",
                accountNumber: "MVR9499690",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Ahmed Fahmy",
            relation: "Father",
            phone: "9997189"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM082",
        id: "A268856",
        fullName: "Hassan Fathuhy",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "13-Jun-92",
        mobile: "7664343",
        department: "Operations",
        position: "Boat Crew",
        workSite: "Express 6",
        joinedDate: "31-Jan-25",
        salary: {
            MVR: 15400,
            USD: 1000
        },
        bankAccounts: {
            MVR: {
                accountName: "Hassan Fathuhy",
                accountNumber: "MVR7664343",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Aishath Fathuhy",
            relation: "Wife",
            phone: "7664344"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM083",
        id: "A229190",
        fullName: "Hussain Shareef",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "14-Nov-98",
        mobile: "9173663",
        department: "Operations",
        position: "Boat Captain",
        workSite: "Express 7",
        joinedDate: "10-Feb-25",
        salary: {
            MVR: 23100,
            USD: 1500
        },
        bankAccounts: {
            MVR: {
                accountName: "Hussain Shareef",
                accountNumber: "MVR9173663",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Fathimath Shareef",
            relation: "Wife",
            phone: "9173664"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM084",
        id: "R7743797",
        fullName: "Rahul Kumar",
        gender: "Male",
        nationality: "Indian",
        dateOfBirth: "19-Dec-96",
        mobile: "7644732",
        department: "Operations",
        position: "Oiler",
        workSite: "Express 10",
        joinedDate: "05-Mar-25",
        salary: {
            MVR: 12320,
            USD: 800
        },
        bankAccounts: {
            MVR: {
                accountName: "Rahul Kumar",
                accountNumber: "MVR7644732",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Rakesh Patil",
            relation: "Friend",
            phone: "7644726"
        },
        photo: "../img/employee-photos/default-male.jpg"
    },
    {
        empNo: "FEM085",
        id: "A042283",
        fullName: "Hussain Ali",
        gender: "Male",
        nationality: "Maldivian",
        dateOfBirth: "28-May-74",
        mobile: "9947013",
        department: "Operations",
        position: "Second Officer",
        workSite: "Express 10",
        joinedDate: "12-Mar-25",
        salary: {
            MVR: 30800,
            USD: 2000
        },
        bankAccounts: {
            MVR: {
                accountName: "Hussain Ali",
                accountNumber: "MVR9947013",
                bankName: "Bank of Maldives"
            }
        },
        emergencyContact: {
            name: "Aishath Ali",
            relation: "Wife",
            phone: "9947014"
        },
        photo: "../img/employee-photos/default-male.jpg"
    }

];

// Employee data management
const EmployeeManager = {
    // Get all employees
    getAll() {
        const storedEmployees = localStorage.getItem('employees');
        return storedEmployees ? JSON.parse(storedEmployees) : baseEmployees;
    },

    // Save all employees
    saveAll(employeesData) {
        localStorage.setItem('employees', JSON.stringify(employeesData));
        this.logActivity('Updated employee records');
        return employeesData;
    },

    // Add a new employee
    add(employee) {
        const employees = this.getAll();
        employees.push(employee);
        this.saveAll(employees);
        return employee;
    },

    // Update an existing employee
    update(updatedEmployee) {
        const employees = this.getAll();
        const index = employees.findIndex(emp => emp.id === updatedEmployee.id);
        if (index !== -1) {
            employees[index] = updatedEmployee;
            this.saveAll(employees);
            return updatedEmployee;
        }
        return null;
    },

    // Delete an employee
    delete(employeeId) {
        const employees = this.getAll();
        const index = employees.findIndex(emp => emp.id === employeeId);
        if (index !== -1) {
            const deleted = employees.splice(index, 1)[0];
            this.saveAll(employees);
            return deleted;
        }
        return null;
    },

    // Reset to base employees
    reset() {
        this.saveAll(baseEmployees);
        return baseEmployees;
    },

    // Log activity
    logActivity(description) {
        const now = new Date();
        const timestamp = now.toISOString();
        const activities = this.getActivities();
        
        activities.unshift({
            id: timestamp,
            timestamp,
            description,
            user: localStorage.getItem('currentUser') || 'System'
        });
        
        // Keep only the last 100 activities
        const trimmedActivities = activities.slice(0, 100);
        localStorage.setItem('employeeActivities', JSON.stringify(trimmedActivities));
    },

    // Get recent activities
    getActivities(limit = 10) {
        const storedActivities = localStorage.getItem('employeeActivities');
        const activities = storedActivities ? JSON.parse(storedActivities) : [];
        return activities.slice(0, limit);
    }
};

// Initialize employees data
let employees = EmployeeManager.getAll();

// Export functionality
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { employees, EmployeeManager };
}
