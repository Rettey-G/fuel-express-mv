// Sample data generator
function generateSampleData() {
    // Generate departments
    const departments = [
        { id: 1, name: 'Human Resources', head: 'Sarah Johnson' },
        { id: 2, name: 'Finance', head: 'Michael Chen' },
        { id: 3, name: 'Operations', head: 'David Rodriguez' },
        { id: 4, name: 'Marketing', head: 'Emily Wong' },
        { id: 5, name: 'IT', head: 'Robert Smith' },
        { id: 6, name: 'Sales', head: 'Jessica Brown' },
        { id: 7, name: 'Customer Service', head: 'Thomas Wilson' },
        { id: 8, name: 'Research & Development', head: 'Sophia Martinez' }
    ];
    
    // Generate divisions
    const divisions = [
        { id: 1, name: 'Corporate', departmentId: 1 },
        { id: 2, name: 'Retail', departmentId: 3 },
        { id: 3, name: 'Distribution', departmentId: 3 },
        { id: 4, name: 'Digital Marketing', departmentId: 4 },
        { id: 5, name: 'Traditional Marketing', departmentId: 4 },
        { id: 6, name: 'Software Development', departmentId: 5 },
        { id: 7, name: 'IT Support', departmentId: 5 },
        { id: 8, name: 'Accounting', departmentId: 2 },
        { id: 9, name: 'Payroll', departmentId: 2 },
        { id: 10, name: 'Recruitment', departmentId: 1 },
        { id: 11, name: 'Training', departmentId: 1 },
        { id: 12, name: 'Domestic Sales', departmentId: 6 },
        { id: 13, name: 'International Sales', departmentId: 6 },
        { id: 14, name: 'Call Center', departmentId: 7 },
        { id: 15, name: 'Product Development', departmentId: 8 }
    ];
    
    // Generate positions
    const positions = [
        'Manager', 'Assistant Manager', 'Supervisor', 'Team Lead', 
        'Senior Specialist', 'Specialist', 'Junior Specialist', 'Coordinator',
        'Assistant', 'Intern', 'Director', 'Vice President', 'Analyst',
        'Developer', 'Engineer', 'Technician', 'Administrator', 'Representative'
    ];
    
    // Generate employees
    const employees = [];
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Jennifer', 'William', 'Linda', 'James', 'Patricia', 'Richard', 'Barbara', 'Joseph', 'Elizabeth', 'Thomas', 'Susan', 'Charles', 'Jessica', 'Christopher', 'Karen', 'Daniel', 'Nancy', 'Matthew', 'Lisa', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Donna', 'Andrew', 'Michelle', 'Joshua', 'Dorothy', 'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Melissa', 'George', 'Deborah', 'Timothy', 'Stephanie'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins'];
    
    for (let i = 1; i <= 150; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const departmentId = Math.floor(Math.random() * departments.length) + 1;
        
        // Get divisions for this department
        const deptDivisions = divisions.filter(div => div.departmentId === departmentId);
        const divisionId = deptDivisions.length > 0 
            ? deptDivisions[Math.floor(Math.random() * deptDivisions.length)].id 
            : null;
            
        const position = positions[Math.floor(Math.random() * positions.length)];
        
        // Generate a random date in the past 5 years
        const hireDate = new Date();
        hireDate.setFullYear(hireDate.getFullYear() - Math.floor(Math.random() * 5));
        hireDate.setMonth(Math.floor(Math.random() * 12));
        hireDate.setDate(Math.floor(Math.random() * 28) + 1);
        
        // Generate salary between 30,000 and 120,000
        const salary = Math.floor(Math.random() * 90000) + 30000;
        
        // Generate employee ID with leading zeros
        const employeeId = 'EMP' + String(i).padStart(4, '0');
        
        // Generate email
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@fuelexpress.com`;
        
        // Generate phone
        const phone = `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
        
        // Generate address
        const address = `${Math.floor(Math.random() * 9000) + 1000} ${['Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm', 'Washington', 'Lincoln', 'Park', 'Lake'][Math.floor(Math.random() * 10)]} ${['St', 'Ave', 'Blvd', 'Rd', 'Ln', 'Dr', 'Way', 'Pl', 'Ct', 'Terrace'][Math.floor(Math.random() * 10)]}, ${['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'][Math.floor(Math.random() * 10)]}`;
        
        employees.push({
            id: employeeId,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            email,
            phone,
            address,
            departmentId,
            department: departments.find(d => d.id === departmentId).name,
            divisionId,
            division: divisionId ? divisions.find(d => d.id === divisionId).name : 'N/A',
            position,
            hireDate: hireDate.toISOString().split('T')[0],
            salary,
            status: Math.random() > 0.1 ? 'Active' : 'Inactive'
        });
    }
    
    // Save to localStorage
    localStorage.setItem('fuel_express_departments', JSON.stringify(departments));
    localStorage.setItem('fuel_express_divisions', JSON.stringify(divisions));
    localStorage.setItem('fuel_express_employees', JSON.stringify(employees));
    
    return {
        departments,
        divisions,
        employees
    };
}

// Generate sample leave requests
function generateSampleLeaveRequests() {
    const employees = JSON.parse(localStorage.getItem('fuel_express_employees') || '[]');
    const leaveTypes = ['Annual Leave', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 'Paternity Leave', 'Bereavement Leave', 'Unpaid Leave'];
    const leaveStatuses = ['Pending', 'Approved by Department Head', 'Approved by HR', 'Rejected', 'Cancelled'];
    
    const leaveRequests = [];
    
    // Generate 50 leave requests
    for (let i = 1; i <= 50; i++) {
        const employee = employees[Math.floor(Math.random() * employees.length)];
        const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
        
        // Generate start date (within next 3 months)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 90));
        
        // Generate end date (1-14 days after start date)
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 14) + 1);
        
        // Generate request date (1-30 days before start date)
        const requestDate = new Date(startDate);
        requestDate.setDate(requestDate.getDate() - Math.floor(Math.random() * 30) - 1);
        
        // Calculate days
        const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        // Generate status
        const status = leaveStatuses[Math.floor(Math.random() * leaveStatuses.length)];
        
        // Generate approvers
        const departmentHead = employee.department === 'Human Resources' ? 'Sarah Johnson' : 
                              employee.department === 'Finance' ? 'Michael Chen' :
                              employee.department === 'Operations' ? 'David Rodriguez' :
                              employee.department === 'Marketing' ? 'Emily Wong' :
                              employee.department === 'IT' ? 'Robert Smith' :
                              employee.department === 'Sales' ? 'Jessica Brown' :
                              employee.department === 'Customer Service' ? 'Thomas Wilson' : 'Sophia Martinez';
        
        const hrApprover = 'Sarah Johnson';
        
        leaveRequests.push({
            id: 'LR' + String(i).padStart(4, '0'),
            employeeId: employee.id,
            employeeName: employee.fullName,
            department: employee.department,
            leaveType,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            days,
            reason: `${leaveType} request for personal reasons.`,
            status,
            requestDate: requestDate.toISOString().split('T')[0],
            departmentHead,
            departmentApprovalDate: status === 'Pending' ? null : new Date(requestDate.getTime() + Math.random() * (startDate - requestDate)).toISOString().split('T')[0],
            hrApprover,
            hrApprovalDate: (status === 'Approved by HR' || status === 'Rejected') ? new Date(requestDate.getTime() + Math.random() * (startDate - requestDate)).toISOString().split('T')[0] : null,
            attachments: Math.random() > 0.7 ? ['medical_certificate.pdf'] : []
        });
    }
    
    // Save to localStorage
    localStorage.setItem('fuel_express_leave_requests', JSON.stringify(leaveRequests));
    
    return leaveRequests;
}

// Generate sample recruitment data
function generateSampleRecruitmentData() {
    const jobTitles = ['Software Developer', 'Marketing Specialist', 'HR Coordinator', 'Financial Analyst', 'Operations Manager', 'Customer Service Representative', 'Sales Executive', 'IT Support Technician', 'Research Scientist', 'Administrative Assistant'];
    const departments = JSON.parse(localStorage.getItem('fuel_express_departments') || '[]');
    const statuses = ['Open', 'Interviewing', 'Filled', 'Cancelled'];
    const applicationStatuses = ['Applied', 'Screening', 'Department Interview', 'HR Interview', 'Offer Extended', 'Hired', 'Rejected'];
    
    // Generate jobs
    const jobs = [];
    for (let i = 1; i <= 15; i++) {
        const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
        const department = departments[Math.floor(Math.random() * departments.length)];
        
        // Generate posting date (within last 3 months)
        const postingDate = new Date();
        postingDate.setDate(postingDate.getDate() - Math.floor(Math.random() * 90));
        
        // Generate closing date (2 weeks to 2 months after posting)
        const closingDate = new Date(postingDate);
        closingDate.setDate(closingDate.getDate() + 14 + Math.floor(Math.random() * 46));
        
        jobs.push({
            id: 'JOB' + String(i).padStart(3, '0'),
            title,
            department: department.name,
            departmentHead: department.head,
            location: ['New York', 'Los Angeles', 'Chicago', 'Remote', 'Houston', 'Phoenix'][Math.floor(Math.random() * 6)],
            type: ['Full-time', 'Part-time', 'Contract', 'Temporary'][Math.floor(Math.random() * 4)],
            description: `We are looking for a ${title} to join our ${department.name} team.`,
            requirements: 'Bachelor\'s degree and 2+ years of experience required.',
            postingDate: postingDate.toISOString().split('T')[0],
            closingDate: closingDate.toISOString().split('T')[0],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            vacancies: Math.floor(Math.random() * 3) + 1
        });
    }
    
    // Generate applications
    const applications = [];
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Jennifer', 'William', 'Linda'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
    
    for (let i = 1; i <= 80; i++) {
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        // Generate application date
        const applicationDate = new Date(job.postingDate);
        const closingDate = new Date(job.closingDate);
        applicationDate.setDate(applicationDate.getDate() + Math.floor(Math.random() * (closingDate - applicationDate) / (1000 * 60 * 60 * 24)));
        
        // Generate status
        const status = applicationStatuses[Math.floor(Math.random() * applicationStatuses.length)];
        
        applications.push({
            id: 'APP' + String(i).padStart(4, '0'),
            jobId: job.id,
            jobTitle: job.title,
            department: job.department,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
            phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            applicationDate: applicationDate.toISOString().split('T')[0],
            status,
            resume: 'resume.pdf',
            coverLetter: Math.random() > 0.5 ? 'cover_letter.pdf' : null,
            departmentInterviewDate: status === 'Department Interview' || status === 'HR Interview' || status === 'Offer Extended' || status === 'Hired' ? new Date(applicationDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
            departmentInterviewNotes: status === 'Department Interview' || status === 'HR Interview' || status === 'Offer Extended' || status === 'Hired' ? 'Candidate has relevant experience and skills.' : null,
            hrInterviewDate: status === 'HR Interview' || status === 'Offer Extended' || status === 'Hired' ? new Date(applicationDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
            hrInterviewNotes: status === 'HR Interview' || status === 'Offer Extended' || status === 'Hired' ? 'Candidate is a good cultural fit.' : null,
            offerDate: status === 'Offer Extended' || status === 'Hired' ? new Date(applicationDate.getTime() + Math.random() * 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
            offerDetails: status === 'Offer Extended' || status === 'Hired' ? 'Offer includes competitive salary and benefits package.' : null,
            hireDate: status === 'Hired' ? new Date(applicationDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null
        });
    }
    
    // Save to localStorage
    localStorage.setItem('fuel_express_jobs', JSON.stringify(jobs));
    localStorage.setItem('fuel_express_applications', JSON.stringify(applications));
    
    return { jobs, applications };
}

// Initialize sample data if not already present
function initializeSampleData() {
    if (!localStorage.getItem('fuel_express_employees')) {
        console.log('Generating sample employee data...');
        generateSampleData();
    }
    
    if (!localStorage.getItem('fuel_express_leave_requests')) {
        console.log('Generating sample leave requests...');
        generateSampleLeaveRequests();
    }
    
    if (!localStorage.getItem('fuel_express_jobs')) {
        console.log('Generating sample recruitment data...');
        generateSampleRecruitmentData();
    }
}

// Call initialization when script loads
initializeSampleData();
