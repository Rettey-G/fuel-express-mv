// Recruitment Utilities for Fuel Express HR Management System

// Show notification message
function showNotification(message, type = 'success') {
    // Check if notification container exists
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        // Create notification container
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Set background color based on type
    switch(type) {
        case 'error':
            notification.style.background = '#f44336';
            break;
        case 'warning':
            notification.style.background = '#ff9800';
            break;
        case 'info':
            notification.style.background = '#2196f3';
            break;
        default:
            notification.style.background = '#4CAF50';
    }
    
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.marginTop = '10px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.justifyContent = 'space-between';
    
    // Add message and close button
    notification.innerHTML = `
        <span>${message}</span>
        <button style="background: transparent; border: none; color: white; cursor: pointer; margin-left: 10px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Add event listener to close button
    notification.querySelector('button').addEventListener('click', function() {
        notificationContainer.removeChild(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        if (notification.parentNode) {
            notificationContainer.removeChild(notification);
        }
    }, 5000);
}

// Generate a unique ID
function generateUniqueId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

// Format date to display format
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Calculate days remaining from today to a target date
function daysRemaining(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Save job data to localStorage
function saveJobs(jobs) {
    localStorage.setItem('recruitmentJobs', JSON.stringify(jobs));
}

// Load job data from localStorage
function loadJobs() {
    const jobs = localStorage.getItem('recruitmentJobs');
    return jobs ? JSON.parse(jobs) : [];
}

// Save candidate data to localStorage
function saveCandidates(candidates) {
    localStorage.setItem('recruitmentCandidates', JSON.stringify(candidates));
}

// Load candidate data from localStorage
function loadCandidates() {
    const candidates = localStorage.getItem('recruitmentCandidates');
    return candidates ? JSON.parse(candidates) : [];
}

// Save interview data to localStorage
function saveInterviews(interviews) {
    localStorage.setItem('recruitmentInterviews', JSON.stringify(interviews));
}

// Load interview data from localStorage
function loadInterviews() {
    const interviews = localStorage.getItem('recruitmentInterviews');
    return interviews ? JSON.parse(interviews) : [];
}

// Save offer data to localStorage
function saveOffers(offers) {
    localStorage.setItem('recruitmentOffers', JSON.stringify(offers));
}

// Load offer data from localStorage
function loadOffers() {
    const offers = localStorage.getItem('recruitmentOffers');
    return offers ? JSON.parse(offers) : [];
}

// Get status color
function getStatusColor(status) {
    switch(status.toLowerCase()) {
        case 'open':
        case 'active':
        case 'approved':
        case 'accepted':
            return '#4caf50'; // Green
        case 'pending':
        case 'in progress':
        case 'review':
            return '#ff9800'; // Orange
        case 'closed':
        case 'rejected':
        case 'declined':
            return '#f44336'; // Red
        case 'on hold':
            return '#2196f3'; // Blue
        default:
            return '#757575'; // Gray
    }
}

// Initialize sample recruitment data if none exists
function initializeSampleData() {
    // Check if data already exists
    if (!localStorage.getItem('recruitmentJobs')) {
        // Sample jobs
        const sampleJobs = [
            {
                id: 'job_001',
                title: 'Senior HR Manager',
                department: 'Human Resources',
                location: 'Male, Maldives',
                type: 'Full-time',
                status: 'Open',
                postedDate: '2025-03-15',
                closingDate: '2025-05-15',
                description: 'We are looking for an experienced HR Manager to oversee all HR operations.',
                requirements: [
                    'Bachelor\'s degree in Human Resources or related field',
                    'Minimum 5 years of experience in HR management',
                    'Strong knowledge of labor laws and regulations',
                    'Excellent communication and leadership skills'
                ],
                salary: {
                    min: 4500,
                    max: 6000,
                    currency: 'USD'
                },
                applications: 12
            },
            {
                id: 'job_002',
                title: 'Fuel Station Manager',
                department: 'Operations',
                location: 'Hulhumale, Maldives',
                type: 'Full-time',
                status: 'Open',
                postedDate: '2025-03-20',
                closingDate: '2025-04-20',
                description: 'Responsible for overseeing daily operations of a fuel station.',
                requirements: [
                    'Bachelor\'s degree in Business or related field',
                    'Minimum 3 years of experience in retail or operations management',
                    'Strong leadership and customer service skills',
                    'Knowledge of inventory management and financial reporting'
                ],
                salary: {
                    min: 3500,
                    max: 4500,
                    currency: 'USD'
                },
                applications: 8
            },
            {
                id: 'job_003',
                title: 'Financial Analyst',
                department: 'Finance',
                location: 'Male, Maldives',
                type: 'Full-time',
                status: 'Open',
                postedDate: '2025-03-25',
                closingDate: '2025-04-25',
                description: 'Analyze financial data and prepare reports for management.',
                requirements: [
                    'Bachelor\'s degree in Finance, Accounting, or related field',
                    'Minimum 2 years of experience in financial analysis',
                    'Proficiency in Excel and financial modeling',
                    'Strong analytical and problem-solving skills'
                ],
                salary: {
                    min: 3000,
                    max: 4000,
                    currency: 'USD'
                },
                applications: 5
            }
        ];
        saveJobs(sampleJobs);
        
        // Sample candidates
        const sampleCandidates = [
            {
                id: 'cand_001',
                name: 'Ahmed Hassan',
                email: 'ahmed.hassan@example.com',
                phone: '+960 999-8877',
                jobId: 'job_001',
                jobTitle: 'Senior HR Manager',
                appliedDate: '2025-03-18',
                status: 'Shortlisted',
                resume: 'resume_ahmed_hassan.pdf',
                education: 'Master\'s in Human Resource Management',
                experience: '7 years in HR leadership roles',
                skills: ['HR Strategy', 'Employee Relations', 'Talent Acquisition', 'Performance Management'],
                notes: 'Strong candidate with excellent communication skills.'
            },
            {
                id: 'cand_002',
                name: 'Fathimath Ali',
                email: 'fathimath.ali@example.com',
                phone: '+960 777-6655',
                jobId: 'job_001',
                jobTitle: 'Senior HR Manager',
                appliedDate: '2025-03-20',
                status: 'In Review',
                resume: 'resume_fathimath_ali.pdf',
                education: 'Bachelor\'s in Business Administration',
                experience: '5 years in HR management',
                skills: ['Recruitment', 'Training', 'Policy Development', 'HRIS'],
                notes: 'Good experience but lacks some leadership skills.'
            },
            {
                id: 'cand_003',
                name: 'Ibrahim Naseer',
                email: 'ibrahim.naseer@example.com',
                phone: '+960 888-5544',
                jobId: 'job_002',
                jobTitle: 'Fuel Station Manager',
                appliedDate: '2025-03-22',
                status: 'Shortlisted',
                resume: 'resume_ibrahim_naseer.pdf',
                education: 'Bachelor\'s in Business Management',
                experience: '4 years as Assistant Manager at Shell',
                skills: ['Operations Management', 'Customer Service', 'Inventory Control', 'Staff Training'],
                notes: 'Excellent operational experience in the fuel industry.'
            }
        ];
        saveCandidates(sampleCandidates);
        
        // Sample interviews
        const sampleInterviews = [
            {
                id: 'int_001',
                candidateId: 'cand_001',
                candidateName: 'Ahmed Hassan',
                jobTitle: 'Senior HR Manager',
                date: '2025-04-15T10:00:00',
                duration: 60, // minutes
                type: 'In-person',
                location: 'Head Office, Male',
                interviewers: ['Mohamed Waheed', 'Aishath Latheef'],
                status: 'Scheduled',
                notes: 'First round interview focusing on experience and leadership skills.'
            },
            {
                id: 'int_002',
                candidateId: 'cand_003',
                candidateName: 'Ibrahim Naseer',
                jobTitle: 'Fuel Station Manager',
                date: '2025-04-14T14:30:00',
                duration: 45, // minutes
                type: 'In-person',
                location: 'Head Office, Male',
                interviewers: ['Ali Rasheed', 'Hussain Ahmed'],
                status: 'Scheduled',
                notes: 'Focus on operational experience and problem-solving scenarios.'
            }
        ];
        saveInterviews(sampleInterviews);
        
        // Sample offers
        const sampleOffers = [
            {
                id: 'offer_001',
                candidateId: 'cand_001',
                candidateName: 'Ahmed Hassan',
                jobTitle: 'Senior HR Manager',
                offerDate: '2025-04-20',
                status: 'Pending',
                salary: 5500,
                currency: 'USD',
                startDate: '2025-05-15',
                benefits: [
                    'Health insurance',
                    '30 days annual leave',
                    'Housing allowance',
                    'Transportation allowance'
                ],
                expiryDate: '2025-04-27',
                notes: 'Offer pending candidate review.'
            }
        ];
        saveOffers(sampleOffers);
    }
}
