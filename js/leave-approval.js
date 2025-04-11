// Leave Approval Workflow

document.addEventListener('DOMContentLoaded', function() {
    // Load sample data
    if (!document.querySelector('script[src="../js/sample-data.js"]')) {
        const script = document.createElement('script');
        script.src = '../js/sample-data.js';
        document.body.appendChild(script);
    }
    
    // Initialize leave approval system
    initLeaveApprovalSystem();
    
    // Add download button to leave request modal
    addDownloadButton();
});

// Initialize leave approval system
function initLeaveApprovalSystem() {
    // Get user role
    const userRole = getUserRole();
    
    // Add approval buttons based on role
    if (userRole === 'admin' || userRole === 'hr') {
        addHRApprovalButtons();
    }
    
    if (userRole === 'admin' || userRole === 'manager') {
        addDepartmentHeadApprovalButtons();
    }
    
    // Update leave request display to show approval status
    updateLeaveRequestDisplay();
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

// Add HR approval buttons to leave requests
function addHRApprovalButtons() {
    // Get leave requests container
    const leaveRequestsContainer = document.getElementById('leave-requests-container');
    if (!leaveRequestsContainer) return;
    
    // Get leave requests
    const leaveRequests = JSON.parse(localStorage.getItem('fuel_express_leave_requests') || '[]');
    
    // Filter leave requests that need HR approval
    const pendingHRApproval = leaveRequests.filter(request => 
        request.status === 'Approved by Department Head'
    );
    
    // Add HR approval section if there are pending requests
    if (pendingHRApproval.length > 0) {
        const hrApprovalSection = document.createElement('div');
        hrApprovalSection.className = 'hr-approval-section';
        hrApprovalSection.innerHTML = `
            <h3>Pending HR Approval</h3>
            <div class="pending-approvals">
                ${pendingHRApproval.map(request => `
                    <div class="leave-request-card pending-hr" data-id="${request.id}">
                        <div class="leave-request-header">
                            <h4>${request.employeeName}</h4>
                            <span class="leave-status">${request.status}</span>
                        </div>
                        <div class="leave-request-details">
                            <p><strong>Department:</strong> ${request.department}</p>
                            <p><strong>Leave Type:</strong> ${request.leaveType}</p>
                            <p><strong>Duration:</strong> ${request.startDate} to ${request.endDate} (${request.days} days)</p>
                            <p><strong>Reason:</strong> ${request.reason}</p>
                            <p><strong>Department Approval:</strong> Approved by ${request.departmentHead} on ${request.departmentApprovalDate}</p>
                        </div>
                        <div class="leave-request-actions">
                            <button class="btn primary-btn hr-approve-btn" data-id="${request.id}">Approve</button>
                            <button class="btn danger-btn hr-reject-btn" data-id="${request.id}">Reject</button>
                            <button class="btn secondary-btn view-details-btn" data-id="${request.id}">View Details</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Insert HR approval section at the top of leave requests container
        leaveRequestsContainer.insertBefore(hrApprovalSection, leaveRequestsContainer.firstChild);
        
        // Add event listeners to approval buttons
        document.querySelectorAll('.hr-approve-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.dataset.id;
                approveLeaveRequestByHR(requestId);
            });
        });
        
        document.querySelectorAll('.hr-reject-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.dataset.id;
                rejectLeaveRequestByHR(requestId);
            });
        });
    }
}

// Add Department Head approval buttons to leave requests
function addDepartmentHeadApprovalButtons() {
    // Get leave requests container
    const leaveRequestsContainer = document.getElementById('leave-requests-container');
    if (!leaveRequestsContainer) return;
    
    // Get leave requests
    const leaveRequests = JSON.parse(localStorage.getItem('fuel_express_leave_requests') || '[]');
    
    // Filter leave requests that need Department Head approval
    const pendingDeptApproval = leaveRequests.filter(request => 
        request.status === 'Pending'
    );
    
    // Add Department Head approval section if there are pending requests
    if (pendingDeptApproval.length > 0) {
        const deptApprovalSection = document.createElement('div');
        deptApprovalSection.className = 'dept-approval-section';
        deptApprovalSection.innerHTML = `
            <h3>Pending Department Head Approval</h3>
            <div class="pending-approvals">
                ${pendingDeptApproval.map(request => `
                    <div class="leave-request-card pending-dept" data-id="${request.id}">
                        <div class="leave-request-header">
                            <h4>${request.employeeName}</h4>
                            <span class="leave-status">${request.status}</span>
                        </div>
                        <div class="leave-request-details">
                            <p><strong>Department:</strong> ${request.department}</p>
                            <p><strong>Leave Type:</strong> ${request.leaveType}</p>
                            <p><strong>Duration:</strong> ${request.startDate} to ${request.endDate} (${request.days} days)</p>
                            <p><strong>Reason:</strong> ${request.reason}</p>
                            <p><strong>Request Date:</strong> ${request.requestDate}</p>
                        </div>
                        <div class="leave-request-actions">
                            <button class="btn primary-btn dept-approve-btn" data-id="${request.id}">Approve</button>
                            <button class="btn danger-btn dept-reject-btn" data-id="${request.id}">Reject</button>
                            <button class="btn secondary-btn view-details-btn" data-id="${request.id}">View Details</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Insert Department Head approval section at the top of leave requests container
        leaveRequestsContainer.insertBefore(deptApprovalSection, leaveRequestsContainer.firstChild);
        
        // Add event listeners to approval buttons
        document.querySelectorAll('.dept-approve-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.dataset.id;
                approveLeaveRequestByDepartmentHead(requestId);
            });
        });
        
        document.querySelectorAll('.dept-reject-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.dataset.id;
                rejectLeaveRequestByDepartmentHead(requestId);
            });
        });
    }
}

// Update leave request display to show approval status
function updateLeaveRequestDisplay() {
    // Get all leave request cards
    const leaveRequestCards = document.querySelectorAll('.leave-request-card:not(.pending-hr):not(.pending-dept)');
    
    leaveRequestCards.forEach(card => {
        const requestId = card.dataset.id;
        const leaveRequests = JSON.parse(localStorage.getItem('fuel_express_leave_requests') || '[]');
        const request = leaveRequests.find(r => r.id === requestId);
        
        if (!request) return;
        
        // Add approval status to card
        const statusElement = card.querySelector('.leave-status');
        if (statusElement) {
            statusElement.textContent = request.status;
            
            // Add color based on status
            statusElement.className = 'leave-status';
            if (request.status === 'Approved by HR') {
                statusElement.classList.add('approved');
            } else if (request.status === 'Rejected') {
                statusElement.classList.add('rejected');
            } else if (request.status === 'Approved by Department Head') {
                statusElement.classList.add('pending');
            } else if (request.status === 'Pending') {
                statusElement.classList.add('new');
            }
        }
        
        // Add approval details to card
        const detailsElement = card.querySelector('.leave-request-details');
        if (detailsElement) {
            let approvalDetails = '';
            
            if (request.departmentApprovalDate) {
                approvalDetails += `<p><strong>Department Approval:</strong> ${request.status === 'Rejected' ? 'Rejected' : 'Approved'} by ${request.departmentHead} on ${request.departmentApprovalDate}</p>`;
            }
            
            if (request.hrApprovalDate) {
                approvalDetails += `<p><strong>HR Approval:</strong> ${request.status === 'Rejected' ? 'Rejected' : 'Approved'} by ${request.hrApprover} on ${request.hrApprovalDate}</p>`;
            }
            
            if (approvalDetails) {
                detailsElement.innerHTML += approvalDetails;
            }
        }
        
        // Add download button if approved
        if (request.status === 'Approved by HR') {
            const actionsElement = card.querySelector('.leave-request-actions');
            if (actionsElement && !actionsElement.querySelector('.download-btn')) {
                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'btn secondary-btn download-btn';
                downloadBtn.dataset.id = requestId;
                downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Form';
                downloadBtn.addEventListener('click', function() {
                    downloadLeaveForm(requestId);
                });
                
                actionsElement.appendChild(downloadBtn);
            }
        }
    });
}

// Approve leave request by Department Head
function approveLeaveRequestByDepartmentHead(requestId) {
    // Get leave requests
    const leaveRequests = JSON.parse(localStorage.getItem('fuel_express_leave_requests') || '[]');
    const requestIndex = leaveRequests.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) return;
    
    // Update request status
    leaveRequests[requestIndex].status = 'Approved by Department Head';
    leaveRequests[requestIndex].departmentApprovalDate = new Date().toISOString().split('T')[0];
    
    // Save to localStorage
    localStorage.setItem('fuel_express_leave_requests', JSON.stringify(leaveRequests));
    
    // Refresh page
    location.reload();
}

// Reject leave request by Department Head
function rejectLeaveRequestByDepartmentHead(requestId) {
    // Get rejection reason
    const reason = prompt('Please provide a reason for rejection:');
    if (reason === null) return; // User cancelled
    
    // Get leave requests
    const leaveRequests = JSON.parse(localStorage.getItem('fuel_express_leave_requests') || '[]');
    const requestIndex = leaveRequests.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) return;
    
    // Update request status
    leaveRequests[requestIndex].status = 'Rejected';
    leaveRequests[requestIndex].departmentApprovalDate = new Date().toISOString().split('T')[0];
    leaveRequests[requestIndex].rejectionReason = reason;
    
    // Save to localStorage
    localStorage.setItem('fuel_express_leave_requests', JSON.stringify(leaveRequests));
    
    // Refresh page
    location.reload();
}

// Approve leave request by HR
function approveLeaveRequestByHR(requestId) {
    // Get leave requests
    const leaveRequests = JSON.parse(localStorage.getItem('fuel_express_leave_requests') || '[]');
    const requestIndex = leaveRequests.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) return;
    
    // Update request status
    leaveRequests[requestIndex].status = 'Approved by HR';
    leaveRequests[requestIndex].hrApprovalDate = new Date().toISOString().split('T')[0];
    
    // Save to localStorage
    localStorage.setItem('fuel_express_leave_requests', JSON.stringify(leaveRequests));
    
    // Refresh page
    location.reload();
}

// Reject leave request by HR
function rejectLeaveRequestByHR(requestId) {
    // Get rejection reason
    const reason = prompt('Please provide a reason for rejection:');
    if (reason === null) return; // User cancelled
    
    // Get leave requests
    const leaveRequests = JSON.parse(localStorage.getItem('fuel_express_leave_requests') || '[]');
    const requestIndex = leaveRequests.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) return;
    
    // Update request status
    leaveRequests[requestIndex].status = 'Rejected';
    leaveRequests[requestIndex].hrApprovalDate = new Date().toISOString().split('T')[0];
    leaveRequests[requestIndex].rejectionReason = reason;
    
    // Save to localStorage
    localStorage.setItem('fuel_express_leave_requests', JSON.stringify(leaveRequests));
    
    // Refresh page
    location.reload();
}

// Add download button to leave request modal
function addDownloadButton() {
    // Get leave request modal
    const leaveRequestModal = document.getElementById('leave-request-modal');
    if (!leaveRequestModal) return;
    
    // Get modal content
    const modalContent = leaveRequestModal.querySelector('.modal-content');
    if (!modalContent) return;
    
    // Add download button to modal footer
    const modalFooter = modalContent.querySelector('.modal-footer') || document.createElement('div');
    if (!modalContent.querySelector('.modal-footer')) {
        modalFooter.className = 'modal-footer';
        modalContent.appendChild(modalFooter);
    }
    
    // Add download button if not already present
    if (!modalFooter.querySelector('.download-form-btn')) {
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'download-form-btn';
        downloadBtn.className = 'btn secondary-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Form';
        downloadBtn.addEventListener('click', function() {
            const requestId = leaveRequestModal.dataset.requestId;
            if (requestId) {
                downloadLeaveForm(requestId);
            }
        });
        
        modalFooter.appendChild(downloadBtn);
    }
}

// Download leave form as PDF
function downloadLeaveForm(requestId) {
    // Get leave request
    const leaveRequests = JSON.parse(localStorage.getItem('fuel_express_leave_requests') || '[]');
    const request = leaveRequests.find(r => r.id === requestId);
    
    if (!request) {
        alert('Leave request not found');
        return;
    }
    
    // Check if approved
    if (request.status !== 'Approved by HR') {
        alert('Leave form can only be downloaded after HR approval');
        return;
    }
    
    // Create leave form HTML
    const formHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Leave Request Form - ${request.id}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #1976d2;
                    padding-bottom: 10px;
                }
                .logo {
                    max-width: 150px;
                }
                h1 {
                    color: #1976d2;
                    margin: 10px 0;
                }
                .form-section {
                    margin-bottom: 20px;
                }
                .form-row {
                    display: flex;
                    margin-bottom: 10px;
                }
                .form-label {
                    font-weight: bold;
                    width: 200px;
                }
                .form-value {
                    flex: 1;
                }
                .approval-section {
                    margin-top: 40px;
                    border-top: 1px solid #ddd;
                    padding-top: 20px;
                }
                .signature-line {
                    margin-top: 70px;
                    border-top: 1px solid #000;
                    width: 200px;
                    display: inline-block;
                    text-align: center;
                    margin-right: 50px;
                }
                .footer {
                    margin-top: 50px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="../img/logo.png" alt="Fuel Express Logo" class="logo">
                <h1>Leave Request Form</h1>
                <p>Form ID: ${request.id}</p>
            </div>
            
            <div class="form-section">
                <h2>Employee Information</h2>
                <div class="form-row">
                    <div class="form-label">Employee Name:</div>
                    <div class="form-value">${request.employeeName}</div>
                </div>
                <div class="form-row">
                    <div class="form-label">Department:</div>
                    <div class="form-value">${request.department}</div>
                </div>
                <div class="form-row">
                    <div class="form-label">Employee ID:</div>
                    <div class="form-value">${request.employeeId}</div>
                </div>
            </div>
            
            <div class="form-section">
                <h2>Leave Details</h2>
                <div class="form-row">
                    <div class="form-label">Leave Type:</div>
                    <div class="form-value">${request.leaveType}</div>
                </div>
                <div class="form-row">
                    <div class="form-label">Start Date:</div>
                    <div class="form-value">${request.startDate}</div>
                </div>
                <div class="form-row">
                    <div class="form-label">End Date:</div>
                    <div class="form-value">${request.endDate}</div>
                </div>
                <div class="form-row">
                    <div class="form-label">Number of Days:</div>
                    <div class="form-value">${request.days}</div>
                </div>
                <div class="form-row">
                    <div class="form-label">Reason:</div>
                    <div class="form-value">${request.reason}</div>
                </div>
            </div>
            
            <div class="approval-section">
                <h2>Approval Information</h2>
                <div class="form-row">
                    <div class="form-label">Request Date:</div>
                    <div class="form-value">${request.requestDate}</div>
                </div>
                <div class="form-row">
                    <div class="form-label">Department Head:</div>
                    <div class="form-value">${request.departmentHead}</div>
                </div>
                <div class="form-row">
                    <div class="form-label">Department Approval Date:</div>
                    <div class="form-value">${request.departmentApprovalDate}</div>
                </div>
                <div class="form-row">
                    <div class="form-label">HR Approver:</div>
                    <div class="form-value">${request.hrApprover}</div>
                </div>
                <div class="form-row">
                    <div class="form-label">HR Approval Date:</div>
                    <div class="form-value">${request.hrApprovalDate}</div>
                </div>
                <div class="form-row">
                    <div class="form-label">Status:</div>
                    <div class="form-value">${request.status}</div>
                </div>
            </div>
            
            <div class="signature-section">
                <div class="signature-line">
                    <p>Employee Signature</p>
                </div>
                <div class="signature-line">
                    <p>Department Head Signature</p>
                </div>
                <div class="signature-line">
                    <p>HR Signature</p>
                </div>
            </div>
            
            <div class="footer">
                <p>This is an official document of Fuel Express Pvt. Ltd. Please keep a copy for your records.</p>
                <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
        </body>
        </html>
    `;
    
    // Create a Blob from the HTML
    const blob = new Blob([formHtml], { type: 'text/html' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Leave_Form_${request.id}.html`;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}
