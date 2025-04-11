// Main JavaScript for Fuel Express HR Management System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard data
    updateDashboardCounts();
    renderDepartmentChart();
});

// Update dashboard counts
function updateDashboardCounts() {
    // In a real application, these would be fetched from a database
    // For now, we'll use dummy data
    
    // Update employee count (this would normally be dynamic)
    document.getElementById('employee-count').textContent = '150';
    
    // Simulate attendance count for today
    const attendanceToday = Math.floor(Math.random() * 150);
    document.getElementById('attendance-today').textContent = attendanceToday;
    
    // Simulate pending leave requests
    const pendingLeaves = Math.floor(Math.random() * 10);
    document.getElementById('pending-leaves').textContent = pendingLeaves;
}

// Render department distribution chart
function renderDepartmentChart() {
    const chartContainer = document.getElementById('dept-chart');
    
    // Sample department data
    const departments = [
        { name: 'Operations', count: 45 },
        { name: 'Finance', count: 20 },
        { name: 'HR', count: 15 },
        { name: 'IT', count: 25 },
        { name: 'Marketing', count: 15 },
        { name: 'Sales', count: 30 }
    ];
    
    // Create a simple bar chart
    const chartHTML = `
        <div class="simple-chart">
            ${departments.map(dept => `
                <div class="chart-item">
                    <div class="chart-label">${dept.name}</div>
                    <div class="chart-bar" style="width: ${(dept.count / 150) * 100}%;">${dept.count}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    chartContainer.innerHTML = chartHTML;
    
    // Add CSS for the simple chart
    const style = document.createElement('style');
    style.textContent = `
        .simple-chart {
            width: 100%;
        }
        .chart-item {
            margin-bottom: 10px;
        }
        .chart-label {
            margin-bottom: 5px;
            font-weight: 500;
        }
        .chart-bar {
            background-color: var(--primary-color);
            color: white;
            padding: 5px;
            border-radius: var(--border-radius);
            text-align: right;
            min-width: 30px;
        }
    `;
    document.head.appendChild(style);
}

// Function to format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Function to generate employee ID
function generateEmployeeID(index) {
    return `FE${String(index).padStart(4, '0')}`;
}