// Recruitment Module JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication
    initAuth();
    
    // Set up tab switching
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
        });
    });
    
    // Job actions
    const viewJobButtons = document.querySelectorAll('.view-job');
    const editJobButtons = document.querySelectorAll('.edit-job');
    const deleteJobButtons = document.querySelectorAll('.delete-job');
    
    viewJobButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobTitle = this.closest('.job-card').querySelector('h3').textContent;
            alert(`Viewing details for: ${jobTitle}`);
        });
    });
    
    editJobButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobTitle = this.closest('.job-card').querySelector('h3').textContent;
            alert(`Editing job: ${jobTitle}`);
        });
    });
    
    deleteJobButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobTitle = this.closest('.job-card').querySelector('h3').textContent;
            if (confirm(`Are you sure you want to delete the job: ${jobTitle}?`)) {
                alert(`Job deleted: ${jobTitle}`);
                this.closest('.job-card').remove();
            }
        });
    });
    
    // Application actions
    const viewAppButtons = document.querySelectorAll('.view-application');
    const scheduleButtons = document.querySelectorAll('.schedule-interview');
    const rejectButtons = document.querySelectorAll('.reject-application');
    
    viewAppButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidate = this.closest('tr').querySelector('td').textContent;
            alert(`Viewing application for: ${candidate}`);
        });
    });
    
    scheduleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidate = this.closest('tr').querySelector('td').textContent;
            alert(`Scheduling interview for: ${candidate}`);
        });
    });
    
    rejectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidate = this.closest('tr').querySelector('td').textContent;
            if (confirm(`Are you sure you want to reject the application from: ${candidate}?`)) {
                alert(`Application rejected: ${candidate}`);
                this.closest('tr').querySelector('.status').textContent = 'Rejected';
                this.closest('tr').querySelector('.status').className = 'status rejected';
            }
        });
    });
    
    // Interview actions
    const rescheduleButtons = document.querySelectorAll('.reschedule-interview');
    const cancelButtons = document.querySelectorAll('.cancel-interview');
    
    rescheduleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidate = this.closest('.interview-item').querySelector('h4').textContent;
            alert(`Rescheduling interview for: ${candidate}`);
        });
    });
    
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidate = this.closest('.interview-item').querySelector('h4').textContent;
            if (confirm(`Are you sure you want to cancel the interview with: ${candidate}?`)) {
                alert(`Interview cancelled: ${candidate}`);
                this.closest('.interview-item').remove();
            }
        });
    });
    
    // Offer actions
    const viewOfferButtons = document.querySelectorAll('.view-offer');
    const editOfferButtons = document.querySelectorAll('.edit-offer');
    const reminderButtons = document.querySelectorAll('.send-reminder');
    const onboardingButtons = document.querySelectorAll('.onboarding');
    const archiveButtons = document.querySelectorAll('.archive-offer');
    
    viewOfferButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidate = this.closest('.offer-card').querySelector('h3').textContent;
            alert(`Viewing offer details for: ${candidate}`);
        });
    });
    
    editOfferButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidate = this.closest('.offer-card').querySelector('h3').textContent;
            alert(`Editing offer for: ${candidate}`);
        });
    });
    
    reminderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidate = this.closest('.offer-card').querySelector('h3').textContent;
            alert(`Reminder sent to: ${candidate}`);
        });
    });
    
    onboardingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidate = this.closest('.offer-card').querySelector('h3').textContent;
            alert(`Starting onboarding process for: ${candidate}`);
        });
    });
    
    archiveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const candidate = this.closest('.offer-card').querySelector('h3').textContent;
            if (confirm(`Are you sure you want to archive the offer for: ${candidate}?`)) {
                alert(`Offer archived: ${candidate}`);
                this.closest('.offer-card').remove();
            }
        });
    });
    
    // Add New Job button
    const addJobBtn = document.getElementById('add-job-btn');
    addJobBtn.addEventListener('click', function() {
        alert('New job posting form will be available in the next update.');
    });
    
    // View All Candidates button
    const viewCandidatesBtn = document.getElementById('view-candidates-btn');
    viewCandidatesBtn.addEventListener('click', function() {
        // Switch to Applications tab
        document.querySelector('.tab-btn[data-tab="applications"]').click();
    });
});
