// Recruitment Fix - Ensures the recruitment page functions properly

document.addEventListener('DOMContentLoaded', function() {
    console.log('Recruitment fix loaded');
    
    // Initialize sample data
    initializeSampleData();
    
    // Set up tab switching
    setupTabSwitching();
    
    // Set up job actions
    setupJobActions();
    
    // Set up application actions
    setupApplicationActions();
    
    // Set up interview calendar
    setupInterviewCalendar();
    
    // Set up offer actions
    setupOfferActions();
    
    // Add notification system if not exists
    if (typeof showNotification !== 'function') {
        window.showNotification = function(message, type = 'success') {
            const notificationContainer = document.getElementById('notification-container') || createNotificationContainer();
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <span class="notification-message">${message}</span>
                <span class="notification-close">&times;</span>
            `;
            notificationContainer.appendChild(notification);
            
            // Auto-remove notification after 5 seconds
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 5000);
            
            // Close button
            notification.querySelector('.notification-close').addEventListener('click', function() {
                notification.remove();
            });
        };
        
        function createNotificationContainer() {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
            document.body.appendChild(container);
            
            // Add CSS for notifications
            const style = document.createElement('style');
            style.textContent = `
                .notification {
                    padding: 12px 20px;
                    margin-bottom: 10px;
                    border-radius: 4px;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    min-width: 250px;
                    opacity: 1;
                    transition: opacity 0.5s;
                }
                .notification.success { background-color: #4CAF50; }
                .notification.error { background-color: #f44336; }
                .notification.warning { background-color: #ff9800; }
                .notification.info { background-color: #2196F3; }
                .notification.fade-out { opacity: 0; }
                .notification-close {
                    cursor: pointer;
                    font-size: 18px;
                    margin-left: 10px;
                }
            `;
            document.head.appendChild(style);
            
            return container;
        }
    }
    
    // Function to initialize sample data if none exists
    function initializeSampleData() {
        try {
            // Check if jobs data exists in localStorage
            if (!localStorage.getItem('fuelExpressJobs')) {
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
                        applications: 12,
                        description: 'We are looking for an experienced HR Manager to oversee all aspects of human resources practices and processes. The successful candidate will design and implement HR strategies and initiatives aligned with the overall business strategy.',
                        requirements: '• Bachelor\'s degree in Human Resources or related field\n• Minimum 5 years of experience in HR management\n• Strong knowledge of labor laws and regulations\n• Excellent communication and leadership skills'
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
                        applications: 8,
                        description: 'We are seeking a dedicated Fuel Station Manager to oversee daily operations, staff management, and ensure compliance with safety regulations. The ideal candidate will have experience in retail management and customer service.',
                        requirements: '• High school diploma required, Bachelor\'s degree preferred\n• Minimum 3 years of experience in retail or service management\n• Strong leadership and problem-solving skills\n• Knowledge of safety regulations related to fuel handling'
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
                        applications: 5,
                        description: 'We are looking for a Financial Analyst to support our finance department with budgeting, forecasting, and financial reporting. The ideal candidate will have strong analytical skills and attention to detail.',
                        requirements: '• Bachelor\'s degree in Finance, Accounting, or related field\n• Minimum 2 years of experience in financial analysis\n• Proficiency in Excel and financial modeling\n• Strong analytical and problem-solving skills'
                    }
                ];
                
                // Save to localStorage
                localStorage.setItem('fuelExpressJobs', JSON.stringify(sampleJobs));
            }
            
            // Check if candidates data exists in localStorage
            if (!localStorage.getItem('fuelExpressCandidates')) {
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
                        resume: 'Resume link would be here',
                        coverLetter: 'I am writing to express my interest in the Senior HR Manager position at Fuel Express.'
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
                        resume: 'Resume link would be here',
                        coverLetter: 'With over 7 years of experience in HR management, I believe I am well-qualified for this position.'
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
                        resume: 'Resume link would be here',
                        coverLetter: 'I am excited about the opportunity to join Fuel Express as a Fuel Station Manager.'
                    }
                ];
                
                // Save to localStorage
                localStorage.setItem('fuelExpressCandidates', JSON.stringify(sampleCandidates));
            }
            
            // Initialize job listings
            updateJobListings();
            
            console.log('Sample recruitment data initialized');
        } catch (error) {
            console.error('Error initializing sample data:', error);
        }
    }
    
    // Function to update job listings
    function updateJobListings() {
        try {
            const jobListings = document.querySelector('.job-listings');
            if (!jobListings) return;
            
            // Clear existing job listings
            jobListings.innerHTML = '';
            
            // Get jobs from localStorage
            const jobs = JSON.parse(localStorage.getItem('fuelExpressJobs') || '[]');
            
            // Create job cards
            jobs.forEach(job => {
                const jobCard = document.createElement('div');
                jobCard.className = 'job-card';
                jobCard.dataset.jobId = job.id;
                
                const statusClass = job.status.toLowerCase().replace(' ', '-');
                
                jobCard.innerHTML = `
                    <div class="job-header">
                        <h3>${job.title}</h3>
                        <span class="job-status ${statusClass}">${job.status}</span>
                    </div>
                    <div class="job-details">
                        <p><i class="fas fa-building"></i> Department: ${job.department}</p>
                        <p><i class="fas fa-map-marker-alt"></i> Location: ${job.location}</p>
                        <p><i class="fas fa-calendar-alt"></i> Posted: ${formatDate(job.postedDate)}</p>
                        <p><i class="fas fa-users"></i> Applications: ${job.applications || 0}</p>
                    </div>
                    <div class="job-actions">
                        <button class="btn view-job"><i class="fas fa-eye"></i> View</button>
                        <button class="btn edit-job"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn delete-job"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                `;
                
                jobListings.appendChild(jobCard);
            });
            
            console.log('Job listings updated');
        } catch (error) {
            console.error('Error updating job listings:', error);
        }
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (error) {
            return dateString;
        }
    }
    
    // Set up tab switching
    function setupTabSwitching() {
        try {
            const tabButtons = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');
            
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons and contents
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    
                    // Add active class to clicked button and corresponding content
                    button.classList.add('active');
                    const tabId = button.getAttribute('data-tab');
                    document.getElementById(tabId).classList.add('active');
                    
                    // Update content based on tab
                    if (tabId === 'open-positions') {
                        updateJobListings();
                    } else if (tabId === 'applications') {
                        updateApplicationsTab();
                    } else if (tabId === 'interviews') {
                        updateInterviewsTab();
                    } else if (tabId === 'offers') {
                        updateOffersTab();
                    }
                });
            });
            
            console.log('Tab switching set up');
        } catch (error) {
            console.error('Error setting up tab switching:', error);
        }
    }
    
    // Set up job actions
    function setupJobActions() {
        try {
            // Add new job button
            const addJobBtn = document.getElementById('add-job-btn');
            if (addJobBtn) {
                addJobBtn.addEventListener('click', function() {
                    // Create and show add job modal
                    createAddJobModal();
                });
            }
            
            // View candidates button
            const viewCandidatesBtn = document.getElementById('view-candidates-btn');
            if (viewCandidatesBtn) {
                viewCandidatesBtn.addEventListener('click', function() {
                    // Switch to applications tab
                    const applicationsTab = document.querySelector('[data-tab="applications"]');
                    if (applicationsTab) {
                        applicationsTab.click();
                    }
                });
            }
            
            // Job actions - using event delegation for better performance and to handle dynamically added elements
            const jobListings = document.querySelector('.job-listings');
            if (jobListings) {
                jobListings.addEventListener('click', function(event) {
                    // Handle view job button click
                    if (event.target.closest('.view-job')) {
                        const button = event.target.closest('.view-job');
                        const jobCard = button.closest('.job-card');
                        const jobId = jobCard.dataset.jobId;
                        
                        // Get job details from localStorage
                        const jobs = JSON.parse(localStorage.getItem('fuelExpressJobs') || '[]');
                        const job = jobs.find(j => j.id === jobId);
                        
                        if (job) {
                            // Create and show job details modal
                            createViewJobModal(
                                job.title, 
                                job.department, 
                                job.location, 
                                job.type, 
                                job.status, 
                                job.description, 
                                job.requirements, 
                                job.closingDate
                            );
                        } else {
                            // Fallback if job not found in localStorage
                            const jobTitle = jobCard.querySelector('h3').textContent;
                            const jobDepartment = jobCard.querySelector('p:nth-child(1)').textContent.replace('Department: ', '').replace(/^\s*\S+\s+/, '');
                            const jobLocation = jobCard.querySelector('p:nth-child(2)').textContent.replace('Location: ', '').replace(/^\s*\S+\s+/, '');
                            const jobStatus = jobCard.querySelector('.job-status').textContent;
                            
                            createViewJobModal(
                                jobTitle, 
                                jobDepartment, 
                                jobLocation, 
                                'Full-time', 
                                jobStatus, 
                                'Detailed job description would appear here. This position requires expertise in the field and excellent communication skills.', 
                                '• Bachelor\'s degree in related field\n• Minimum 3 years of experience\n• Strong analytical skills\n• Team player with excellent communication', 
                                '2025-05-30'
                            );
                        }
                    }
                    
                    // Handle edit job button click
                    else if (event.target.closest('.edit-job')) {
                        const button = event.target.closest('.edit-job');
                        const jobCard = button.closest('.job-card');
                        const jobId = jobCard.dataset.jobId;
                        
                        // Get job details from localStorage
                        const jobs = JSON.parse(localStorage.getItem('fuelExpressJobs') || '[]');
                        const job = jobs.find(j => j.id === jobId);
                        
                        if (job) {
                            // Create and show edit job modal
                            createEditJobModal(
                                job.id,
                                job.title, 
                                job.department, 
                                job.location, 
                                job.type, 
                                job.status, 
                                job.description, 
                                job.requirements, 
                                job.closingDate
                            );
                        } else {
                            // Fallback if job not found in localStorage
                            const jobTitle = jobCard.querySelector('h3').textContent;
                            const jobDepartment = jobCard.querySelector('p:nth-child(1)').textContent.replace('Department: ', '').replace(/^\s*\S+\s+/, '');
                            const jobLocation = jobCard.querySelector('p:nth-child(2)').textContent.replace('Location: ', '').replace(/^\s*\S+\s+/, '');
                            const jobStatus = jobCard.querySelector('.job-status').textContent;
                            
                            createEditJobModal(
                                'job_' + Date.now(),
                                jobTitle, 
                                jobDepartment, 
                                jobLocation, 
                                'Full-time', 
                                jobStatus, 
                                'Detailed job description would appear here. This position requires expertise in the field and excellent communication skills.', 
                                '• Bachelor\'s degree in related field\n• Minimum 3 years of experience\n• Strong analytical skills\n• Team player with excellent communication', 
                                '2025-05-30'
                            );
                        }
                    }
                    
                    // Handle delete job button click
                    else if (event.target.closest('.delete-job')) {
                        const button = event.target.closest('.delete-job');
                        const jobCard = button.closest('.job-card');
                        const jobId = jobCard.dataset.jobId;
                        const jobTitle = jobCard.querySelector('h3').textContent;
                        
                        if (confirm(`Are you sure you want to delete the job: ${jobTitle}?`)) {
                            // Remove job from localStorage
                            const jobs = JSON.parse(localStorage.getItem('fuelExpressJobs') || '[]');
                            const updatedJobs = jobs.filter(job => job.id !== jobId);
                            localStorage.setItem('fuelExpressJobs', JSON.stringify(updatedJobs));
                            
                            // Remove job card from DOM
                            jobCard.remove();
                            
                            // Show success message
                            showNotification(`Job "${jobTitle}" has been deleted successfully.`, 'success');
                        }
                    }
                });
            }
            
            // Initialize job search functionality
            const jobSearch = document.getElementById('job-search');
            if (jobSearch) {
                jobSearch.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase();
                    const jobCards = document.querySelectorAll('.job-card');
                    
                    jobCards.forEach(card => {
                        const title = card.querySelector('h3').textContent.toLowerCase();
                        const department = card.querySelector('p:nth-child(1)').textContent.toLowerCase();
                        
                        if (title.includes(searchTerm) || department.includes(searchTerm)) {
                            card.style.display = '';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            }
            
            // Initialize department filter
            const departmentFilter = document.getElementById('department-filter');
            if (departmentFilter) {
                departmentFilter.addEventListener('change', function() {
                    const selectedDepartment = this.value.toLowerCase();
                    const jobCards = document.querySelectorAll('.job-card');
                    
                    jobCards.forEach(card => {
                        const department = card.querySelector('p:nth-child(1)').textContent.toLowerCase();
                        
                        if (selectedDepartment === '' || department.includes(selectedDepartment)) {
                            card.style.display = '';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            }
            
            // Initialize status filter
            const statusFilter = document.getElementById('status-filter');
            if (statusFilter) {
                statusFilter.addEventListener('change', function() {
                    const selectedStatus = this.value.toLowerCase();
                    const jobCards = document.querySelectorAll('.job-card');
                    
                    jobCards.forEach(card => {
                        const status = card.querySelector('.job-status').textContent.toLowerCase();
                        
                        if (selectedStatus === '' || status === selectedStatus) {
                            card.style.display = '';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            }
            
            console.log('Job actions set up');
        } catch (error) {
            console.error('Error setting up job actions:', error);
        }
    }
    
    // Create add job modal
    function createAddJobModal() {
        try {
            // Create modal HTML
            const modalHtml = `
                <div id="add-job-modal" style="display: block; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);">
                    <div style="background-color: white; margin: 5% auto; padding: 20px; border-radius: 5px; width: 70%; max-width: 700px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h2 style="margin: 0;">Add New Job</h2>
                            <span id="close-add-job-modal" style="cursor: pointer; font-size: 24px;">&times;</span>
                        </div>
                        <form id="add-job-form">
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Job Title:</label>
                                <input type="text" id="job-title" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Department:</label>
                                <select id="job-department" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                                    <option value="">Select Department</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Human Resources">Human Resources</option>
                                    <option value="IT">IT</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Operations">Operations</option>
                                    <option value="Sales">Sales</option>
                                </select>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Location:</label>
                                <input type="text" id="job-location" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Job Type:</label>
                                <select id="job-type" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                                    <option value="">Select Job Type</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Status:</label>
                                <select id="job-status" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                                    <option value="Open" selected>Open</option>
                                    <option value="Closed">Closed</option>
                                    <option value="On Hold">On Hold</option>
                                </select>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Closing Date:</label>
                                <input type="date" id="job-closing-date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Job Description:</label>
                                <textarea id="job-description" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 100px;" required></textarea>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Requirements:</label>
                                <textarea id="job-requirements" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 100px;" required></textarea>
                            </div>
                            <div style="text-align: right;">
                                <button type="button" id="cancel-add-job" style="padding: 8px 16px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Cancel</button>
                                <button type="button" id="save-add-job" style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
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
            document.getElementById('close-add-job-modal').addEventListener('click', function() {
                document.body.removeChild(modalContainer);
            });
            
            document.getElementById('cancel-add-job').addEventListener('click', function() {
                document.body.removeChild(modalContainer);
            });
            
            // Close modal when clicking outside
            modalContainer.querySelector('#add-job-modal').addEventListener('click', function(event) {
                if (event.target === this) {
                    document.body.removeChild(modalContainer);
                }
            });
            
            // Set today's date as the minimum date for closing date
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            document.getElementById('job-closing-date').min = formattedDate;
            
            document.getElementById('save-add-job').addEventListener('click', function() {
                // Get form values
                const title = document.getElementById('job-title').value;
                const department = document.getElementById('job-department').value;
                const location = document.getElementById('job-location').value;
                const type = document.getElementById('job-type').value;
                const status = document.getElementById('job-status').value;
                const closingDate = document.getElementById('job-closing-date').value;
                const description = document.getElementById('job-description').value;
                const requirements = document.getElementById('job-requirements').value;
                
                // Validate form
                if (!title || !department || !location || !type || !status || !closingDate || !description || !requirements) {
                    alert('Please fill in all required fields.');
                    return;
                }
                
                // Create new job object
                const newJob = {
                    id: 'job_' + Date.now(),
                    title,
                    department,
                    location,
                    type,
                    status,
                    postedDate: new Date().toISOString().split('T')[0],
                    closingDate,
                    applications: 0,
                    description,
                    requirements
                };
                
                // Add to localStorage
                const jobs = JSON.parse(localStorage.getItem('fuelExpressJobs') || '[]');
                jobs.unshift(newJob);
                localStorage.setItem('fuelExpressJobs', JSON.stringify(jobs));
                
                // Update job listings
                updateJobListings();
                
                // Close modal
                document.body.removeChild(modalContainer);
                
                // Show success message
                showNotification(`Job "${title}" has been added successfully.`, 'success');
            });
        } catch (error) {
            console.error('Error creating add job modal:', error);
        }
    }
    
    // Create view job modal
    function createViewJobModal(title, department, location, type, status, description = 'Job description not available.', requirements = 'Requirements not specified.', closingDate = null) {
        try {
            // Create modal HTML
            const modalHtml = `
                <div id="view-job-modal" style="display: block; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);">
                    <div style="background-color: white; margin: 5% auto; padding: 20px; border-radius: 5px; width: 70%; max-width: 700px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h2 style="margin: 0;">${title}</h2>
                            <span id="close-view-job-modal" style="cursor: pointer; font-size: 24px;">&times;</span>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 15px;">
                                <div style="background-color: #f5f5f5; padding: 8px 12px; border-radius: 4px;">
                                    <strong>Department:</strong> ${department}
                                </div>
                                <div style="background-color: #f5f5f5; padding: 8px 12px; border-radius: 4px;">
                                    <strong>Location:</strong> ${location}
                                </div>
                                <div style="background-color: #f5f5f5; padding: 8px 12px; border-radius: 4px;">
                                    <strong>Type:</strong> ${type}
                                </div>
                                <div style="background-color: #f5f5f5; padding: 8px 12px; border-radius: 4px;">
                                    <strong>Status:</strong> ${status}
                                </div>
                                ${closingDate ? `<div style="background-color: #f5f5f5; padding: 8px 12px; border-radius: 4px;"><strong>Closing Date:</strong> ${new Date(closingDate).toLocaleDateString()}</div>` : ''}
                            </div>
                            <div style="margin-bottom: 15px;">
                                <h3 style="margin-top: 0;">Job Description</h3>
                                <p style="white-space: pre-line;">${description}</p>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <h3 style="margin-top: 0;">Requirements</h3>
                                <p style="white-space: pre-line;">${requirements}</p>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <button type="button" id="close-view-job-btn" style="padding: 8px 16px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal to body
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHtml;
            document.body.appendChild(modalContainer);
            
            // Set up event listeners
            document.getElementById('close-view-job-modal').addEventListener('click', function() {
                document.body.removeChild(modalContainer);
            });
            
            document.getElementById('close-view-job-btn').addEventListener('click', function() {
                document.body.removeChild(modalContainer);
            });
            
            // Close modal when clicking outside
            modalContainer.querySelector('#view-job-modal').addEventListener('click', function(event) {
                if (event.target === this) {
                    document.body.removeChild(modalContainer);
                }
            });
        } catch (error) {
            console.error('Error creating view job modal:', error);
        }
    }
    
    // Create edit job modal
    function createEditJobModal(jobId, title, department, location, type, status, description = '', requirements = '', closingDate = null) {
        try {
            // Create modal HTML
            const modalHtml = `
                <div id="edit-job-modal" style="display: block; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);">
                    <div style="background-color: white; margin: 5% auto; padding: 20px; border-radius: 5px; width: 70%; max-width: 700px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h2 style="margin: 0;">Edit Job: ${title}</h2>
                            <span id="close-edit-job-modal" style="cursor: pointer; font-size: 24px;">&times;</span>
                        </div>
                        <form id="edit-job-form">
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Job Title:</label>
                                <input type="text" id="edit-job-title" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="${title}" required>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Department:</label>
                                <select id="edit-job-department" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                                    <option value="Admin" ${department === 'Admin' ? 'selected' : ''}>Admin</option>
                                    <option value="Finance" ${department === 'Finance' ? 'selected' : ''}>Finance</option>
                                    <option value="Human Resources" ${department === 'Human Resources' ? 'selected' : ''}>Human Resources</option>
                                    <option value="IT" ${department === 'IT' ? 'selected' : ''}>IT</option>
                                    <option value="Marketing" ${department === 'Marketing' ? 'selected' : ''}>Marketing</option>
                                    <option value="Operations" ${department === 'Operations' ? 'selected' : ''}>Operations</option>
                                    <option value="Sales" ${department === 'Sales' ? 'selected' : ''}>Sales</option>
                                </select>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Location:</label>
                                <input type="text" id="edit-job-location" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="${location}" required>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Job Type:</label>
                                <select id="edit-job-type" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                                    <option value="Full-time" ${type === 'Full-time' ? 'selected' : ''}>Full-time</option>
                                    <option value="Part-time" ${type === 'Part-time' ? 'selected' : ''}>Part-time</option>
                                    <option value="Contract" ${type === 'Contract' ? 'selected' : ''}>Contract</option>
                                    <option value="Internship" ${type === 'Internship' ? 'selected' : ''}>Internship</option>
                                </select>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Status:</label>
                                <select id="edit-job-status" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                                    <option value="Open" ${status === 'Open' ? 'selected' : ''}>Open</option>
                                    <option value="Closed" ${status === 'Closed' ? 'selected' : ''}>Closed</option>
                                    <option value="On Hold" ${status === 'On Hold' ? 'selected' : ''}>On Hold</option>
                                </select>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Closing Date:</label>
                                <input type="date" id="edit-job-closing-date" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" value="${closingDate}" required>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Job Description:</label>
                                <textarea id="edit-job-description" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 100px;" required>${description}</textarea>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 5px; font-weight: 500;">Requirements:</label>
                                <textarea id="edit-job-requirements" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 100px;" required>${requirements}</textarea>
                            </div>
                            <div style="text-align: right;">
                                <button type="button" id="cancel-edit-job" style="padding: 8px 16px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Cancel</button>
                                <button type="button" id="save-edit-job" style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Changes</button>
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
            document.getElementById('close-edit-job-modal').addEventListener('click', function() {
                document.body.removeChild(modalContainer);
            });
            
            document.getElementById('cancel-edit-job').addEventListener('click', function() {
                document.body.removeChild(modalContainer);
            });
            
            // Close modal when clicking outside
            modalContainer.querySelector('#edit-job-modal').addEventListener('click', function(event) {
                if (event.target === this) {
                    document.body.removeChild(modalContainer);
                }
            });
            
            // Set today's date as the minimum date for closing date
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            document.getElementById('edit-job-closing-date').min = formattedDate;
            
            document.getElementById('save-edit-job').addEventListener('click', function() {
                // Get form values
                const newTitle = document.getElementById('edit-job-title').value;
                const newDepartment = document.getElementById('edit-job-department').value;
                const newLocation = document.getElementById('edit-job-location').value;
                const newType = document.getElementById('edit-job-type').value;
                const newStatus = document.getElementById('edit-job-status').value;
                const newClosingDate = document.getElementById('edit-job-closing-date').value;
                const newDescription = document.getElementById('edit-job-description').value;
                const newRequirements = document.getElementById('edit-job-requirements').value;
                
                // Validate form
                if (!newTitle || !newDepartment || !newLocation || !newType || !newStatus || !newClosingDate || !newDescription || !newRequirements) {
                    alert('Please fill in all required fields.');
                    return;
                }
                
                // Get jobs from localStorage
                const jobs = JSON.parse(localStorage.getItem('fuelExpressJobs') || '[]');
                
                // Find job and update it
                const jobIndex = jobs.findIndex(job => job.id === jobId);
                
                if (jobIndex !== -1) {
                    // Update job
                    jobs[jobIndex] = {
                        ...jobs[jobIndex],
                        title: newTitle,
                        department: newDepartment,
                        location: newLocation,
                        type: newType,
                        status: newStatus,
                        closingDate: newClosingDate,
                        description: newDescription,
                        requirements: newRequirements
                    };
                    
                    // Save to localStorage
                    localStorage.setItem('fuelExpressJobs', JSON.stringify(jobs));
                    
                    // Update job listings
                    updateJobListings();
                }
                
                // Close modal
                document.body.removeChild(modalContainer);
                
                // Show success message
                showNotification(`Job "${newTitle}" has been updated successfully.`, 'success');
            });
        } catch (error) {
            console.error('Error creating edit job modal:', error);
        }
    }
    
    // Set up application actions
    function setupApplicationActions() {
        try {
            // Get applications tab content
            const applicationsTab = document.getElementById('applications');
            if (!applicationsTab) return;
            
            // Initialize applications view if needed
            updateApplicationsTab();
            
            console.log('Application actions set up');
        } catch (error) {
            console.error('Error setting up application actions:', error);
        }
    }
    
    // Update applications tab
    function updateApplicationsTab() {
        try {
            const applicationsContainer = document.querySelector('.applications-container');
            if (!applicationsContainer) return;
            
            // Clear existing applications
            applicationsContainer.innerHTML = '';
            
            // Get candidates from localStorage
            const candidates = JSON.parse(localStorage.getItem('fuelExpressCandidates') || '[]');
            
            if (candidates.length === 0) {
                applicationsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No applications received yet.</p></div>';
                return;
            }
            
            // Create application cards
            candidates.forEach(candidate => {
                const applicationCard = document.createElement('div');
                applicationCard.className = 'application-card';
                applicationCard.dataset.candidateId = candidate.id;
                
                const statusClass = candidate.status.toLowerCase().replace(' ', '-');
                
                applicationCard.innerHTML = `
                    <div class="application-header">
                        <h3>${candidate.name}</h3>
                        <span class="application-status ${statusClass}">${candidate.status}</span>
                    </div>
                    <div class="application-details">
                        <p><i class="fas fa-briefcase"></i> Applied for: ${candidate.jobTitle}</p>
                        <p><i class="fas fa-envelope"></i> Email: ${candidate.email}</p>
                        <p><i class="fas fa-phone"></i> Phone: ${candidate.phone}</p>
                        <p><i class="fas fa-calendar-alt"></i> Applied: ${formatDate(candidate.appliedDate)}</p>
                    </div>
                    <div class="application-actions">
                        <button class="btn view-application"><i class="fas fa-eye"></i> View</button>
                        <button class="btn shortlist-btn" ${candidate.status === 'Shortlisted' ? 'disabled' : ''}><i class="fas fa-check"></i> Shortlist</button>
                        <button class="btn reject-btn" ${candidate.status === 'Rejected' ? 'disabled' : ''}><i class="fas fa-times"></i> Reject</button>
                    </div>
                `;
                
                applicationsContainer.appendChild(applicationCard);
            });
            
            // Set up event delegation for application actions
            applicationsContainer.addEventListener('click', function(event) {
                // Handle view application button click
                if (event.target.closest('.view-application')) {
                    const button = event.target.closest('.view-application');
                    const applicationCard = button.closest('.application-card');
                    const candidateId = applicationCard.dataset.candidateId;
                    
                    // Get candidate details from localStorage
                    const candidates = JSON.parse(localStorage.getItem('fuelExpressCandidates') || '[]');
                    const candidate = candidates.find(c => c.id === candidateId);
                    
                    if (candidate) {
                        // Create and show candidate details modal
                        createViewCandidateModal(candidate);
                    }
                }
                
                // Handle shortlist button click
                else if (event.target.closest('.shortlist-btn')) {
                    const button = event.target.closest('.shortlist-btn');
                    const applicationCard = button.closest('.application-card');
                    const candidateId = applicationCard.dataset.candidateId;
                    const candidateName = applicationCard.querySelector('h3').textContent;
                    
                    // Get candidates from localStorage
                    const candidates = JSON.parse(localStorage.getItem('fuelExpressCandidates') || '[]');
                    const candidateIndex = candidates.findIndex(c => c.id === candidateId);
                    
                    if (candidateIndex !== -1) {
                        // Update candidate status
                        candidates[candidateIndex].status = 'Shortlisted';
                        
                        // Save to localStorage
                        localStorage.setItem('fuelExpressCandidates', JSON.stringify(candidates));
                        
                        // Update UI
                        const statusElement = applicationCard.querySelector('.application-status');
                        statusElement.textContent = 'Shortlisted';
                        statusElement.className = 'application-status shortlisted';
                        
                        // Disable shortlist button
                        button.disabled = true;
                        
                        // Show success message
                        showNotification(`Candidate "${candidateName}" has been shortlisted.`, 'success');
                    }
                }
                
                // Handle reject button click
                else if (event.target.closest('.reject-btn')) {
                    const button = event.target.closest('.reject-btn');
                    const applicationCard = button.closest('.application-card');
                    const candidateId = applicationCard.dataset.candidateId;
                    const candidateName = applicationCard.querySelector('h3').textContent;
                    
                    if (confirm(`Are you sure you want to reject the application from ${candidateName}?`)) {
                        // Get candidates from localStorage
                        const candidates = JSON.parse(localStorage.getItem('fuelExpressCandidates') || '[]');
                        const candidateIndex = candidates.findIndex(c => c.id === candidateId);
                        
                        if (candidateIndex !== -1) {
                            // Update candidate status
                            candidates[candidateIndex].status = 'Rejected';
                            
                            // Save to localStorage
                            localStorage.setItem('fuelExpressCandidates', JSON.stringify(candidates));
                            
                            // Update UI
                            const statusElement = applicationCard.querySelector('.application-status');
                            statusElement.textContent = 'Rejected';
                            statusElement.className = 'application-status rejected';
                            
                            // Disable reject button
                            button.disabled = true;
                            
                            // Show success message
                            showNotification(`Candidate "${candidateName}" has been rejected.`, 'success');
                        }
                    }
                }
            });
            
            console.log('Applications tab updated');
        } catch (error) {
            console.error('Error updating applications tab:', error);
        }
    }
    
    // Create view candidate modal
    function createViewCandidateModal(candidate) {
        try {
            // Create modal HTML
            const modalHtml = `
                <div id="view-candidate-modal" style="display: block; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);">
                    <div style="background-color: white; margin: 5% auto; padding: 20px; border-radius: 5px; width: 70%; max-width: 700px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h2 style="margin: 0;">${candidate.name}</h2>
                            <span id="close-view-candidate-modal" style="cursor: pointer; font-size: 24px;">&times;</span>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 15px;">
                                <div style="background-color: #f5f5f5; padding: 8px 12px; border-radius: 4px;">
                                    <strong>Applied for:</strong> ${candidate.jobTitle}
                                </div>
                                <div style="background-color: #f5f5f5; padding: 8px 12px; border-radius: 4px;">
                                    <strong>Status:</strong> ${candidate.status}
                                </div>
                                <div style="background-color: #f5f5f5; padding: 8px 12px; border-radius: 4px;">
                                    <strong>Applied:</strong> ${formatDate(candidate.appliedDate)}
                                </div>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <h3 style="margin-top: 0;">Contact Information</h3>
                                <p><strong>Email:</strong> ${candidate.email}</p>
                                <p><strong>Phone:</strong> ${candidate.phone}</p>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <h3 style="margin-top: 0;">Cover Letter</h3>
                                <p style="white-space: pre-line;">${candidate.coverLetter || 'No cover letter provided.'}</p>
                            </div>
                            <div style="margin-bottom: 15px;">
                                <h3 style="margin-top: 0;">Resume</h3>
                                <p>${candidate.resume ? `<a href="${candidate.resume}" target="_blank">View Resume</a>` : 'No resume provided.'}</p>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <button type="button" id="close-view-candidate-btn" style="padding: 8px 16px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal to body
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHtml;
            document.body.appendChild(modalContainer);
            
            // Set up event listeners
            document.getElementById('close-view-candidate-modal').addEventListener('click', function() {
                document.body.removeChild(modalContainer);
            });
            
            document.getElementById('close-view-candidate-btn').addEventListener('click', function() {
                document.body.removeChild(modalContainer);
            });
            
            // Close modal when clicking outside
            modalContainer.querySelector('#view-candidate-modal').addEventListener('click', function(event) {
                if (event.target === this) {
                    document.body.removeChild(modalContainer);
                }
            });
        } catch (error) {
            console.error('Error creating view candidate modal:', error);
        }
    }
    
    // Set up interview calendar
    function setupInterviewCalendar() {
        try {
            // Get interviews tab content
            const interviewsTab = document.getElementById('interviews');
            if (!interviewsTab) return;
            
            // Initialize interviews view if needed
            updateInterviewsTab();
            
            console.log('Interview calendar set up');
        } catch (error) {
            console.error('Error setting up interview calendar:', error);
        }
    }
    
    // Update interviews tab
    function updateInterviewsTab() {
        try {
            const interviewsContainer = document.querySelector('.interviews-container');
            if (!interviewsContainer) return;
            
            // Set current month
            const currentMonth = document.getElementById('current-month');
            if (currentMonth) {
                const now = new Date();
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                currentMonth.textContent = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
            }
            
            // Previous month button
            const prevMonthBtn = document.getElementById('prev-month');
            if (prevMonthBtn) {
                prevMonthBtn.addEventListener('click', function() {
                    showNotification('Calendar navigation will be implemented in a future update.', 'info');
                });
            }
            
            // Next month button
            const nextMonthBtn = document.getElementById('next-month');
            if (nextMonthBtn) {
                nextMonthBtn.addEventListener('click', function() {
                    showNotification('Calendar navigation will be implemented in a future update.', 'info');
                });
            }
            
            // Sample interviews (would be stored in localStorage in a real implementation)
            const sampleInterviews = [
                {
                    id: 'int_001',
                    candidateId: 'cand_001',
                    candidateName: 'Ahmed Hassan',
                    jobTitle: 'Senior HR Manager',
                    date: '2025-04-20',
                    time: '10:00 AM',
                    interviewers: 'Jane Smith, John Doe',
                    location: 'Conference Room A',
                    status: 'Scheduled'
                },
                {
                    id: 'int_002',
                    candidateId: 'cand_003',
                    candidateName: 'Ibrahim Naseer',
                    jobTitle: 'Fuel Station Manager',
                    date: '2025-04-22',
                    time: '2:00 PM',
                    interviewers: 'Mike Johnson, Sarah Lee',
                    location: 'Conference Room B',
                    status: 'Scheduled'
                }
            ];
            
            // Create interview items
            const interviewList = interviewsContainer.querySelector('.interview-list') || document.createElement('div');
            interviewList.className = 'interview-list';
            interviewList.innerHTML = '';
            
            if (sampleInterviews.length === 0) {
                interviewList.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-times"></i><p>No interviews scheduled.</p></div>';
            } else {
                sampleInterviews.forEach(interview => {
                    const interviewItem = document.createElement('div');
                    interviewItem.className = 'interview-item';
                    interviewItem.dataset.interviewId = interview.id;
                    
                    interviewItem.innerHTML = `
                        <div class="interview-header">
                            <h4>${interview.candidateName} - ${interview.jobTitle}</h4>
                            <span class="interview-status">${interview.status}</span>
                        </div>
                        <div class="interview-details">
                            <p><i class="fas fa-calendar-day"></i> Date: ${formatDate(interview.date)}</p>
                            <p><i class="fas fa-clock"></i> Time: ${interview.time}</p>
                            <p><i class="fas fa-users"></i> Interviewers: ${interview.interviewers}</p>
                            <p><i class="fas fa-map-marker-alt"></i> Location: ${interview.location}</p>
                        </div>
                        <div class="interview-actions">
                            <button class="btn view-interview"><i class="fas fa-eye"></i> View</button>
                            <button class="btn reschedule-btn"><i class="fas fa-calendar-alt"></i> Reschedule</button>
                            <button class="btn cancel-interview"><i class="fas fa-times"></i> Cancel</button>
                        </div>
                    `;
                    
                    interviewList.appendChild(interviewItem);
                });
            }
            
            // Add interview list to container if not already there
            if (!interviewsContainer.querySelector('.interview-list')) {
                interviewsContainer.appendChild(interviewList);
            }
            
            // Set up event delegation for interview actions
            interviewList.addEventListener('click', function(event) {
                // Handle view interview button click
                if (event.target.closest('.view-interview')) {
                    const button = event.target.closest('.view-interview');
                    const interviewItem = button.closest('.interview-item');
                    const interviewId = interviewItem.dataset.interviewId;
                    const interviewInfo = interviewItem.querySelector('h4').textContent;
                    
                    showNotification(`Viewing interview details for: ${interviewInfo}`, 'info');
                }
                
                // Handle reschedule button click
                else if (event.target.closest('.reschedule-btn')) {
                    const button = event.target.closest('.reschedule-btn');
                    const interviewItem = button.closest('.interview-item');
                    const interviewInfo = interviewItem.querySelector('h4').textContent;
                    
                    showNotification(`Rescheduling interview for: ${interviewInfo}`, 'info');
                }
                
                // Handle cancel interview button click
                else if (event.target.closest('.cancel-interview')) {
                    const button = event.target.closest('.cancel-interview');
                    const interviewItem = button.closest('.interview-item');
                    const interviewInfo = interviewItem.querySelector('h4').textContent;
                    
                    if (confirm(`Are you sure you want to cancel the interview for: ${interviewInfo}?`)) {
                        interviewItem.remove();
                        showNotification(`Interview cancelled for: ${interviewInfo}`, 'success');
                    }
                }
            });
            
            console.log('Interviews tab updated');
        } catch (error) {
            console.error('Error updating interviews tab:', error);
        }
    }
    
    // Set up offer actions
    function setupOfferActions() {
        try {
            // Get offers tab content
            const offersTab = document.getElementById('offers');
            if (!offersTab) return;
            
            // Initialize offers view if needed
            updateOffersTab();
            
            console.log('Offer actions set up');
        } catch (error) {
            console.error('Error setting up offer actions:', error);
        }
    }
    
    // Update offers tab
    function updateOffersTab() {
        try {
            const offersContainer = document.querySelector('.offers-container');
            if (!offersContainer) return;
            
            // Sample offers (would be stored in localStorage in a real implementation)
            const sampleOffers = [
                {
                    id: 'offer_001',
                    candidateId: 'cand_001',
                    candidateName: 'Ahmed Hassan',
                    jobTitle: 'Senior HR Manager',
                    salary: '$75,000',
                    startDate: '2025-06-01',
                    status: 'Pending'
                },
                {
                    id: 'offer_002',
                    candidateId: 'cand_003',
                    candidateName: 'Ibrahim Naseer',
                    jobTitle: 'Fuel Station Manager',
                    salary: '$60,000',
                    startDate: '2025-05-15',
                    status: 'Accepted'
                }
            ];
            
            // Create offer cards
            offersContainer.innerHTML = '';
            
            if (sampleOffers.length === 0) {
                offersContainer.innerHTML = '<div class="empty-state"><i class="fas fa-file-contract"></i><p>No offers created yet.</p></div>';
            } else {
                sampleOffers.forEach(offer => {
                    const offerCard = document.createElement('div');
                    offerCard.className = 'offer-card';
                    offerCard.dataset.offerId = offer.id;
                    
                    const statusClass = offer.status.toLowerCase();
                    
                    offerCard.innerHTML = `
                        <div class="offer-header">
                            <h3>${offer.candidateName}</h3>
                            <span class="offer-status ${statusClass}">${offer.status}</span>
                        </div>
                        <div class="offer-details">
                            <p><i class="fas fa-briefcase"></i> Position: ${offer.jobTitle}</p>
                            <p><i class="fas fa-money-bill-wave"></i> Salary: ${offer.salary}</p>
                            <p><i class="fas fa-calendar-day"></i> Start Date: ${formatDate(offer.startDate)}</p>
                        </div>
                        <div class="offer-actions">
                            <button class="btn view-offer"><i class="fas fa-eye"></i> View</button>
                            <button class="btn edit-offer" ${offer.status !== 'Pending' ? 'disabled' : ''}><i class="fas fa-edit"></i> Edit</button>
                            <button class="btn send-offer" ${offer.status !== 'Pending' ? 'disabled' : ''}><i class="fas fa-paper-plane"></i> Send</button>
                        </div>
                    `;
                    
                    offersContainer.appendChild(offerCard);
                });
            }
            
            // Set up event delegation for offer actions
            offersContainer.addEventListener('click', function(event) {
                // Handle view offer button click
                if (event.target.closest('.view-offer')) {
                    const button = event.target.closest('.view-offer');
                    const offerCard = button.closest('.offer-card');
                    const offerId = offerCard.dataset.offerId;
                    const candidateName = offerCard.querySelector('h3').textContent;
                    
                    showNotification(`Viewing offer for: ${candidateName}`, 'info');
                }
                
                // Handle edit offer button click
                else if (event.target.closest('.edit-offer')) {
                    const button = event.target.closest('.edit-offer');
                    const offerCard = button.closest('.offer-card');
                    const candidateName = offerCard.querySelector('h3').textContent;
                    
                    if (!button.disabled) {
                        showNotification(`Editing offer for: ${candidateName}`, 'info');
                    }
                }
                
                // Handle send offer button click
                else if (event.target.closest('.send-offer')) {
                    const button = event.target.closest('.send-offer');
                    const offerCard = button.closest('.offer-card');
                    const candidateName = offerCard.querySelector('h3').textContent;
                    
                    if (!button.disabled) {
                        // Update status
                        offerCard.querySelector('.offer-status').textContent = 'Sent';
                        offerCard.querySelector('.offer-status').className = 'offer-status sent';
                        
                        // Disable buttons
                        offerCard.querySelector('.edit-offer').disabled = true;
                        button.disabled = true;
                        
                        showNotification(`Offer sent to: ${candidateName}`, 'success');
                    }
                }
            });
            
            console.log('Offers tab updated');
        } catch (error) {
            console.error('Error updating offers tab:', error);
        }
    }
});