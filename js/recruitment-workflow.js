// Recruitment Workflow Management

document.addEventListener('DOMContentLoaded', function() {
    // Load sample data
    if (!document.querySelector('script[src="../js/sample-data.js"]')) {
        const script = document.createElement('script');
        script.src = '../js/sample-data.js';
        document.body.appendChild(script);
    }
    
    // Initialize recruitment workflow
    initRecruitmentWorkflow();
});

// Initialize recruitment workflow
function initRecruitmentWorkflow() {
    // Get user role
    const userRole = getUserRole();
    
    // Add interview sections based on role
    if (userRole === 'admin') {
        addFinalApprovalSection();
    }
    
    if (userRole === 'admin' || userRole === 'hr') {
        addHRInterviewSection();
    }
    
    if (userRole === 'admin' || userRole === 'manager') {
        addDepartmentInterviewSection();
    }
    
    // Update application cards to show current status
    updateApplicationCards();
}

// Get user role from localStorage
function getUserRole() {
    const authToken = localStorage.getItem('authToken');
    if (authToken === 'admin') return 'admin';
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return 'employee';
    
    const users = JSON.parse(localStorage.getItem('fuel_express_users') || '[]');
    const user = users.find(u => u.username === currentUser);
    
    return user ? user.role : 'employee';
}

// Add Department Interview Section
function addDepartmentInterviewSection() {
    // Get applications container
    const applicationsContainer = document.querySelector('.applications-container');
    if (!applicationsContainer) return;
    
    // Get applications
    const applications = JSON.parse(localStorage.getItem('fuel_express_applications') || '[]');
    
    // Filter applications that need department interview
    const pendingDeptInterview = applications.filter(app => 
        app.status === 'Screening'
    );
    
    // Add department interview section if there are pending interviews
    if (pendingDeptInterview.length > 0) {
        const deptInterviewSection = document.createElement('div');
        deptInterviewSection.className = 'dept-interview-section';
        deptInterviewSection.innerHTML = `
            <h3>Pending Department Interviews</h3>
            <div class="pending-interviews">
                ${pendingDeptInterview.map(app => `
                    <div class="application-card pending-dept-interview" data-id="${app.id}">
                        <div class="application-header">
                            <h4>${app.fullName}</h4>
                            <span class="application-status">${app.status}</span>
                        </div>
                        <div class="application-details">
                            <p><strong>Position:</strong> ${app.jobTitle}</p>
                            <p><strong>Department:</strong> ${app.department}</p>
                            <p><strong>Applied:</strong> ${app.applicationDate}</p>
                            <p><strong>Email:</strong> ${app.email}</p>
                            <p><strong>Phone:</strong> ${app.phone}</p>
                        </div>
                        <div class="application-actions">
                            <button class="btn primary-btn conduct-dept-interview-btn" data-id="${app.id}">Conduct Interview</button>
                            <button class="btn secondary-btn view-resume-btn" data-id="${app.id}">View Resume</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Insert department interview section at the top of applications container
        applicationsContainer.insertBefore(deptInterviewSection, applicationsContainer.firstChild);
        
        // Add event listeners to interview buttons
        document.querySelectorAll('.conduct-dept-interview-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const appId = this.dataset.id;
                showDepartmentInterviewForm(appId);
            });
        });
    }
}

// Add HR Interview Section
function addHRInterviewSection() {
    // Get applications container
    const applicationsContainer = document.querySelector('.applications-container');
    if (!applicationsContainer) return;
    
    // Get applications
    const applications = JSON.parse(localStorage.getItem('fuel_express_applications') || '[]');
    
    // Filter applications that need HR interview
    const pendingHRInterview = applications.filter(app => 
        app.status === 'Department Interview'
    );
    
    // Add HR interview section if there are pending interviews
    if (pendingHRInterview.length > 0) {
        const hrInterviewSection = document.createElement('div');
        hrInterviewSection.className = 'hr-interview-section';
        hrInterviewSection.innerHTML = `
            <h3>Pending HR Interviews</h3>
            <div class="pending-interviews">
                ${pendingHRInterview.map(app => `
                    <div class="application-card pending-hr-interview" data-id="${app.id}">
                        <div class="application-header">
                            <h4>${app.fullName}</h4>
                            <span class="application-status">${app.status}</span>
                        </div>
                        <div class="application-details">
                            <p><strong>Position:</strong> ${app.jobTitle}</p>
                            <p><strong>Department:</strong> ${app.department}</p>
                            <p><strong>Applied:</strong> ${app.applicationDate}</p>
                            <p><strong>Department Interview:</strong> ${app.departmentInterviewDate}</p>
                            <p><strong>Department Notes:</strong> ${app.departmentInterviewNotes}</p>
                        </div>
                        <div class="application-actions">
                            <button class="btn primary-btn conduct-hr-interview-btn" data-id="${app.id}">Conduct Interview</button>
                            <button class="btn secondary-btn view-resume-btn" data-id="${app.id}">View Resume</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Insert HR interview section at the top of applications container
        applicationsContainer.insertBefore(hrInterviewSection, applicationsContainer.firstChild);
        
        // Add event listeners to interview buttons
        document.querySelectorAll('.conduct-hr-interview-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const appId = this.dataset.id;
                showHRInterviewForm(appId);
            });
        });
    }
}

// Add Final Approval Section
function addFinalApprovalSection() {
    // Get applications container
    const applicationsContainer = document.querySelector('.applications-container');
    if (!applicationsContainer) return;
    
    // Get applications
    const applications = JSON.parse(localStorage.getItem('fuel_express_applications') || '[]');
    
    // Filter applications that need final approval
    const pendingFinalApproval = applications.filter(app => 
        app.status === 'HR Interview'
    );
    
    // Add final approval section if there are pending approvals
    if (pendingFinalApproval.length > 0) {
        const finalApprovalSection = document.createElement('div');
        finalApprovalSection.className = 'final-approval-section';
        finalApprovalSection.innerHTML = `
            <h3>Pending Final Approval</h3>
            <div class="pending-approvals">
                ${pendingFinalApproval.map(app => `
                    <div class="application-card pending-final-approval" data-id="${app.id}">
                        <div class="application-header">
                            <h4>${app.fullName}</h4>
                            <span class="application-status">${app.status}</span>
                        </div>
                        <div class="application-details">
                            <p><strong>Position:</strong> ${app.jobTitle}</p>
                            <p><strong>Department:</strong> ${app.department}</p>
                            <p><strong>Applied:</strong> ${app.applicationDate}</p>
                            <p><strong>Department Interview:</strong> ${app.departmentInterviewDate}</p>
                            <p><strong>HR Interview:</strong> ${app.hrInterviewDate}</p>
                            <p><strong>HR Notes:</strong> ${app.hrInterviewNotes}</p>
                        </div>
                        <div class="application-actions">
                            <button class="btn primary-btn extend-offer-btn" data-id="${app.id}">Extend Offer</button>
                            <button class="btn danger-btn reject-application-btn" data-id="${app.id}">Reject</button>
                            <button class="btn secondary-btn view-resume-btn" data-id="${app.id}">View Resume</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Insert final approval section at the top of applications container
        applicationsContainer.insertBefore(finalApprovalSection, applicationsContainer.firstChild);
        
        // Add event listeners to approval buttons
        document.querySelectorAll('.extend-offer-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const appId = this.dataset.id;
                showOfferForm(appId);
            });
        });
        
        document.querySelectorAll('.reject-application-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const appId = this.dataset.id;
                rejectApplication(appId);
            });
        });
    }
}

// Update application cards to show current status
function updateApplicationCards() {
    // Get all application cards
    const applicationCards = document.querySelectorAll('.application-card:not(.pending-dept-interview):not(.pending-hr-interview):not(.pending-final-approval)');
    
    applicationCards.forEach(card => {
        const appId = card.dataset.id;
        const applications = JSON.parse(localStorage.getItem('fuel_express_applications') || '[]');
        const app = applications.find(a => a.id === appId);
        
        if (!app) return;
        
        // Update status
        const statusElement = card.querySelector('.application-status');
        if (statusElement) {
            statusElement.textContent = app.status;
            
            // Add color based on status
            statusElement.className = 'application-status';
            if (app.status === 'Hired') {
                statusElement.classList.add('hired');
            } else if (app.status === 'Offer Extended') {
                statusElement.classList.add('offer');
            } else if (app.status === 'Rejected') {
                statusElement.classList.add('rejected');
            } else if (app.status === 'HR Interview') {
                statusElement.classList.add('hr-interview');
            } else if (app.status === 'Department Interview') {
                statusElement.classList.add('dept-interview');
            } else if (app.status === 'Screening') {
                statusElement.classList.add('screening');
            }
        }
        
        // Update details
        const detailsElement = card.querySelector('.application-details');
        if (detailsElement) {
            let interviewDetails = '';
            
            if (app.departmentInterviewDate) {
                interviewDetails += `<p><strong>Department Interview:</strong> ${app.departmentInterviewDate}</p>`;
            }
            
            if (app.hrInterviewDate) {
                interviewDetails += `<p><strong>HR Interview:</strong> ${app.hrInterviewDate}</p>`;
            }
            
            if (app.offerDate) {
                interviewDetails += `<p><strong>Offer Extended:</strong> ${app.offerDate}</p>`;
            }
            
            if (app.hireDate) {
                interviewDetails += `<p><strong>Hire Date:</strong> ${app.hireDate}</p>`;
            }
            
            if (interviewDetails) {
                detailsElement.innerHTML += interviewDetails;
            }
        }
    });
}

// Show Department Interview Form
function showDepartmentInterviewForm(appId) {
    // Create modal if it doesn't exist
    if (!document.getElementById('dept-interview-modal')) {
        const modal = document.createElement('div');
        modal.id = 'dept-interview-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h2>Department Interview</h2>
                <form id="dept-interview-form">
                    <input type="hidden" id="dept-interview-app-id">
                    <div class="form-group">
                        <label for="dept-interview-date">Interview Date</label>
                        <input type="date" id="dept-interview-date" required>
                    </div>
                    <div class="form-group">
                        <label for="dept-interview-notes">Interview Notes</label>
                        <textarea id="dept-interview-notes" rows="5" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="dept-interview-rating">Rating (1-5)</label>
                        <select id="dept-interview-rating" required>
                            <option value="">Select Rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Below Average</option>
                            <option value="3">3 - Average</option>
                            <option value="4">4 - Good</option>
                            <option value="5">5 - Excellent</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="dept-interview-recommendation">Recommendation</label>
                        <select id="dept-interview-recommendation" required>
                            <option value="">Select Recommendation</option>
                            <option value="proceed">Proceed to HR Interview</option>
                            <option value="reject">Reject Application</option>
                            <option value="hold">Hold for Further Consideration</option>
                        </select>
                    </div>
                    <div class="form-buttons">
                        <button type="button" id="cancel-dept-interview-btn" class="btn secondary-btn">Cancel</button>
                        <button type="submit" class="btn primary-btn">Submit</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        document.querySelector('#dept-interview-modal .close-btn').addEventListener('click', () => {
            document.getElementById('dept-interview-modal').style.display = 'none';
        });
        
        document.getElementById('cancel-dept-interview-btn').addEventListener('click', () => {
            document.getElementById('dept-interview-modal').style.display = 'none';
        });
        
        document.getElementById('dept-interview-form').addEventListener('submit', function(e) {
            e.preventDefault();
            submitDepartmentInterview();
        });
    }
    
    // Get application
    const applications = JSON.parse(localStorage.getItem('fuel_express_applications') || '[]');
    const app = applications.find(a => a.id === appId);
    
    if (!app) {
        alert('Application not found');
        return;
    }
    
    // Set application ID
    document.getElementById('dept-interview-app-id').value = appId;
    
    // Set default date to today
    document.getElementById('dept-interview-date').value = new Date().toISOString().split('T')[0];
    
    // Show modal
    document.getElementById('dept-interview-modal').style.display = 'block';
}

// Submit Department Interview
function submitDepartmentInterview() {
    // Get form data
    const appId = document.getElementById('dept-interview-app-id').value;
    const interviewDate = document.getElementById('dept-interview-date').value;
    const interviewNotes = document.getElementById('dept-interview-notes').value;
    const rating = document.getElementById('dept-interview-rating').value;
    const recommendation = document.getElementById('dept-interview-recommendation').value;
    
    // Get applications
    const applications = JSON.parse(localStorage.getItem('fuel_express_applications') || '[]');
    const appIndex = applications.findIndex(a => a.id === appId);
    
    if (appIndex === -1) {
        alert('Application not found');
        return;
    }
    
    // Update application
    applications[appIndex].departmentInterviewDate = interviewDate;
    applications[appIndex].departmentInterviewNotes = interviewNotes;
    applications[appIndex].departmentInterviewRating = rating;
    applications[appIndex].departmentInterviewRecommendation = recommendation;
    
    // Update status based on recommendation
    if (recommendation === 'proceed') {
        applications[appIndex].status = 'Department Interview';
    } else if (recommendation === 'reject') {
        applications[appIndex].status = 'Rejected';
        applications[appIndex].rejectionReason = 'Did not meet department requirements';
    } else {
        applications[appIndex].status = 'On Hold';
    }
    
    // Save to localStorage
    localStorage.setItem('fuel_express_applications', JSON.stringify(applications));
    
    // Hide modal
    document.getElementById('dept-interview-modal').style.display = 'none';
    
    // Refresh page
    location.reload();
}

// Show HR Interview Form
function showHRInterviewForm(appId) {
    // Create modal if it doesn't exist
    if (!document.getElementById('hr-interview-modal')) {
        const modal = document.createElement('div');
        modal.id = 'hr-interview-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h2>HR Interview</h2>
                <form id="hr-interview-form">
                    <input type="hidden" id="hr-interview-app-id">
                    <div class="form-group">
                        <label for="hr-interview-date">Interview Date</label>
                        <input type="date" id="hr-interview-date" required>
                    </div>
                    <div class="form-group">
                        <label for="hr-interview-notes">Interview Notes</label>
                        <textarea id="hr-interview-notes" rows="5" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="hr-interview-cultural-fit">Cultural Fit (1-5)</label>
                        <select id="hr-interview-cultural-fit" required>
                            <option value="">Select Rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Below Average</option>
                            <option value="3">3 - Average</option>
                            <option value="4">4 - Good</option>
                            <option value="5">5 - Excellent</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="hr-interview-salary-expectation">Salary Expectation</label>
                        <input type="number" id="hr-interview-salary-expectation" required>
                    </div>
                    <div class="form-group">
                        <label for="hr-interview-recommendation">Recommendation</label>
                        <select id="hr-interview-recommendation" required>
                            <option value="">Select Recommendation</option>
                            <option value="proceed">Proceed to Final Approval</option>
                            <option value="reject">Reject Application</option>
                            <option value="hold">Hold for Further Consideration</option>
                        </select>
                    </div>
                    <div class="form-buttons">
                        <button type="button" id="cancel-hr-interview-btn" class="btn secondary-btn">Cancel</button>
                        <button type="submit" class="btn primary-btn">Submit</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        document.querySelector('#hr-interview-modal .close-btn').addEventListener('click', () => {
            document.getElementById('hr-interview-modal').style.display = 'none';
        });
        
        document.getElementById('cancel-hr-interview-btn').addEventListener('click', () => {
            document.getElementById('hr-interview-modal').style.display = 'none';
        });
        
        document.getElementById('hr-interview-form').addEventListener('submit', function(e) {
            e.preventDefault();
            submitHRInterview();
        });
    }
    
    // Get application
    const applications = JSON.parse(localStorage.getItem('fuel_express_applications') || '[]');
    const app = applications.find(a => a.id === appId);
    
    if (!app) {
        alert('Application not found');
        return;
    }
    
    // Set application ID
    document.getElementById('hr-interview-app-id').value = appId;
    
    // Set default date to today
    document.getElementById('hr-interview-date').value = new Date().toISOString().split('T')[0];
    
    // Show modal
    document.getElementById('hr-interview-modal').style.display = 'block';
}

// Submit HR Interview
function submitHRInterview() {
    // Get form data
    const appId = document.getElementById('hr-interview-app-id').value;
    const interviewDate = document.getElementById('hr-interview-date').value;
    const interviewNotes = document.getElementById('hr-interview-notes').value;
    const culturalFit = document.getElementById('hr-interview-cultural-fit').value;
    const salaryExpectation = document.getElementById('hr-interview-salary-expectation').value;
    const recommendation = document.getElementById('hr-interview-recommendation').value;
    
    // Get applications
    const applications = JSON.parse(localStorage.getItem('fuel_express_applications') || '[]');
    const appIndex = applications.findIndex(a => a.id === appId);
    
    if (appIndex === -1) {
        alert('Application not found');
        return;
    }
    
    // Update application
    applications[appIndex].hrInterviewDate = interviewDate;
    applications[appIndex].hrInterviewNotes = interviewNotes;
    applications[appIndex].culturalFit = culturalFit;
    applications[appIndex].salaryExpectation = salaryExpectation;
    applications[appIndex].hrInterviewRecommendation = recommendation;
    
    // Update status based on recommendation
    if (recommendation === 'proceed') {
        applications[appIndex].status = 'HR Interview';
    } else if (recommendation === 'reject') {
        applications[appIndex].status = 'Rejected';
        applications[appIndex].rejectionReason = 'Did not meet HR requirements';
    } else {
        applications[appIndex].status = 'On Hold';
    }
    
    // Save to localStorage
    localStorage.setItem('fuel_express_applications', JSON.stringify(applications));
    
    // Hide modal
    document.getElementById('hr-interview-modal').style.display = 'none';
    
    // Refresh page
    location.reload();
}

// Show Offer Form
function showOfferForm(appId) {
    // Create modal if it doesn't exist
    if (!document.getElementById('offer-modal')) {
        const modal = document.createElement('div');
        modal.id = 'offer-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h2>Extend Offer</h2>
                <form id="offer-form">
                    <input type="hidden" id="offer-app-id">
                    <div class="form-group">
                        <label for="offer-date">Offer Date</label>
                        <input type="date" id="offer-date" required>
                    </div>
                    <div class="form-group">
                        <label for="offer-salary">Offered Salary</label>
                        <input type="number" id="offer-salary" required>
                    </div>
                    <div class="form-group">
                        <label for="offer-position">Position Title</label>
                        <input type="text" id="offer-position" required>
                    </div>
                    <div class="form-group">
                        <label for="offer-start-date">Expected Start Date</label>
                        <input type="date" id="offer-start-date" required>
                    </div>
                    <div class="form-group">
                        <label for="offer-details">Offer Details</label>
                        <textarea id="offer-details" rows="5" required></textarea>
                    </div>
                    <div class="form-buttons">
                        <button type="button" id="cancel-offer-btn" class="btn secondary-btn">Cancel</button>
                        <button type="submit" class="btn primary-btn">Extend Offer</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        document.querySelector('#offer-modal .close-btn').addEventListener('click', () => {
            document.getElementById('offer-modal').style.display = 'none';
        });
        
        document.getElementById('cancel-offer-btn').addEventListener('click', () => {
            document.getElementById('offer-modal').style.display = 'none';
        });
        
        document.getElementById('offer-form').addEventListener('submit', function(e) {
            e.preventDefault();
            submitOffer();
        });
    }
    
    // Get application
    const applications = JSON.parse(localStorage.getItem('fuel_express_applications') || '[]');
    const app = applications.find(a => a.id === appId);
    
    if (!app) {
        alert('Application not found');
        return;
    }
    
    // Set application ID
    document.getElementById('offer-app-id').value = appId;
    
    // Set default values
    document.getElementById('offer-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('offer-position').value = app.jobTitle;
    document.getElementById('offer-salary').value = app.salaryExpectation || '';
    
    // Set start date to 2 weeks from now
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 14);
    document.getElementById('offer-start-date').value = startDate.toISOString().split('T')[0];
    
    // Set default offer details
    document.getElementById('offer-details').value = `We are pleased to offer you the position of ${app.jobTitle} at Fuel Express Pvt. Ltd. This offer includes:
- Competitive salary package
- Health insurance benefits
- 401(k) retirement plan
- Paid time off
- Professional development opportunities`;
    
    // Show modal
    document.getElementById('offer-modal').style.display = 'block';
}

// Submit Offer
function submitOffer() {
    // Get form data
    const appId = document.getElementById('offer-app-id').value;
    const offerDate = document.getElementById('offer-date').value;
    const offeredSalary = document.getElementById('offer-salary').value;
    const position = document.getElementById('offer-position').value;
    const startDate = document.getElementById('offer-start-date').value;
    const offerDetails = document.getElementById('offer-details').value;
    
    // Get applications
    const applications = JSON.parse(localStorage.getItem('fuel_express_applications') || '[]');
    const appIndex = applications.findIndex(a => a.id === appId);
    
    if (appIndex === -1) {
        alert('Application not found');
        return;
    }
    
    // Update application
    applications[appIndex].offerDate = offerDate;
    applications[appIndex].offeredSalary = offeredSalary;
    applications[appIndex].offeredPosition = position;
    applications[appIndex].startDate = startDate;
    applications[appIndex].offerDetails = offerDetails;
    applications[appIndex].status = 'Offer Extended';
    
    // Save to localStorage
    localStorage.setItem('fuel_express_applications', JSON.stringify(applications));
    
    // Hide modal
    document.getElementById('offer-modal').style.display = 'none';
    
    // Refresh page
    location.reload();
}

// Reject Application
function rejectApplication(appId) {
    // Get rejection reason
    const reason = prompt('Please provide a reason for rejection:');
    if (reason === null) return; // User cancelled
    
    // Get applications
    const applications = JSON.parse(localStorage.getItem('fuel_express_applications') || '[]');
    const appIndex = applications.findIndex(a => a.id === appId);
    
    if (appIndex === -1) {
        alert('Application not found');
        return;
    }
    
    // Update application
    applications[appIndex].status = 'Rejected';
    applications[appIndex].rejectionReason = reason;
    applications[appIndex].rejectionDate = new Date().toISOString().split('T')[0];
    
    // Save to localStorage
    localStorage.setItem('fuel_express_applications', JSON.stringify(applications));
    
    // Refresh page
    location.reload();
}
