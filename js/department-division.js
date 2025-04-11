// Department and Division Management

// Setup department and division management
function setupDepartmentDivisionManagement() {
    // Add department management button to the UI if admin
    const isAdmin = localStorage.getItem('authToken') === 'admin';
    if (isAdmin && document.querySelector('.employee-actions')) {
        const actionsContainer = document.querySelector('.employee-actions');
        
        // Create department management button
        const deptButton = document.createElement('button');
        deptButton.id = 'manage-departments-btn';
        deptButton.className = 'btn secondary-btn';
        deptButton.innerHTML = '<i class="fas fa-building"></i> Manage Departments';
        deptButton.addEventListener('click', showDepartmentManagement);
        
        // Create division management button
        const divButton = document.createElement('button');
        divButton.id = 'manage-divisions-btn';
        divButton.className = 'btn secondary-btn';
        divButton.innerHTML = '<i class="fas fa-sitemap"></i> Manage Divisions';
        divButton.addEventListener('click', showDivisionManagement);
        
        // Add buttons to the UI
        actionsContainer.insertBefore(divButton, document.getElementById('reset-data-btn'));
        actionsContainer.insertBefore(deptButton, divButton);
    }
    
    // Create department and division modals if they don't exist
    createDepartmentModal();
    createDivisionModal();
    
    // Update department and division dropdowns in employee form
    updateDepartmentDropdown();
    updateDivisionDropdown();
}

// Create department management modal
function createDepartmentModal() {
    if (document.getElementById('department-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'department-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-dept-btn">&times;</span>
            <h2>Department Management</h2>
            
            <div class="department-list-container">
                <h3>Departments</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Head</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="department-list"></tbody>
                </table>
                <button id="add-department-btn" class="btn primary-btn"><i class="fas fa-plus"></i> Add Department</button>
            </div>
            
            <div id="department-form-container" style="display: none;">
                <h3 id="department-form-title">Add Department</h3>
                <form id="department-form">
                    <div class="form-group">
                        <label for="department-name">Department Name</label>
                        <input type="text" id="department-name" required>
                    </div>
                    <div class="form-group">
                        <label for="department-head">Department Head</label>
                        <input type="text" id="department-head" required>
                    </div>
                    <div class="form-group">
                        <label for="department-description">Description</label>
                        <textarea id="department-description" rows="3"></textarea>
                    </div>
                    <div class="form-buttons">
                        <button type="button" id="cancel-department-form" class="btn secondary-btn">Cancel</button>
                        <button type="submit" class="btn primary-btn">Save Department</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    document.querySelector('.close-dept-btn').addEventListener('click', () => {
        document.getElementById('department-modal').style.display = 'none';
    });
    
    document.getElementById('add-department-btn').addEventListener('click', () => {
        document.getElementById('department-form-title').textContent = 'Add Department';
        document.getElementById('department-form').reset();
        document.getElementById('department-form').dataset.mode = 'add';
        document.getElementById('department-form').dataset.id = '';
        document.getElementById('department-form-container').style.display = 'block';
        document.querySelector('.department-list-container').style.display = 'none';
    });
    
    document.getElementById('cancel-department-form').addEventListener('click', () => {
        document.getElementById('department-form-container').style.display = 'none';
        document.querySelector('.department-list-container').style.display = 'block';
    });
    
    document.getElementById('department-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveDepartment();
    });
}

// Create division management modal
function createDivisionModal() {
    if (document.getElementById('division-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'division-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-div-btn">&times;</span>
            <h2>Division Management</h2>
            
            <div class="division-list-container">
                <h3>Divisions</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="division-list"></tbody>
                </table>
                <button id="add-division-btn" class="btn primary-btn"><i class="fas fa-plus"></i> Add Division</button>
            </div>
            
            <div id="division-form-container" style="display: none;">
                <h3 id="division-form-title">Add Division</h3>
                <form id="division-form">
                    <div class="form-group">
                        <label for="division-name">Division Name</label>
                        <input type="text" id="division-name" required>
                    </div>
                    <div class="form-group">
                        <label for="division-department">Department</label>
                        <select id="division-department" required></select>
                    </div>
                    <div class="form-group">
                        <label for="division-description">Description</label>
                        <textarea id="division-description" rows="3"></textarea>
                    </div>
                    <div class="form-buttons">
                        <button type="button" id="cancel-division-form" class="btn secondary-btn">Cancel</button>
                        <button type="submit" class="btn primary-btn">Save Division</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    document.querySelector('.close-div-btn').addEventListener('click', () => {
        document.getElementById('division-modal').style.display = 'none';
    });
    
    document.getElementById('add-division-btn').addEventListener('click', () => {
        document.getElementById('division-form-title').textContent = 'Add Division';
        document.getElementById('division-form').reset();
        document.getElementById('division-form').dataset.mode = 'add';
        document.getElementById('division-form').dataset.id = '';
        updateDepartmentDropdownForDivisions();
        document.getElementById('division-form-container').style.display = 'block';
        document.querySelector('.division-list-container').style.display = 'none';
    });
    
    document.getElementById('cancel-division-form').addEventListener('click', () => {
        document.getElementById('division-form-container').style.display = 'none';
        document.querySelector('.division-list-container').style.display = 'block';
    });
    
    document.getElementById('division-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveDivision();
    });
}

// Show department management modal
function showDepartmentManagement() {
    // Load departments
    loadDepartments();
    
    // Show modal
    document.getElementById('department-modal').style.display = 'block';
    document.getElementById('department-form-container').style.display = 'none';
    document.querySelector('.department-list-container').style.display = 'block';
}

// Show division management modal
function showDivisionManagement() {
    // Load divisions
    loadDivisions();
    
    // Show modal
    document.getElementById('division-modal').style.display = 'block';
    document.getElementById('division-form-container').style.display = 'none';
    document.querySelector('.division-list-container').style.display = 'block';
}

// Load departments into the department list
function loadDepartments() {
    const departmentList = document.getElementById('department-list');
    departmentList.innerHTML = '';
    
    // Get departments from localStorage
    const departments = JSON.parse(localStorage.getItem('fuel_express_departments') || '[]');
    
    // Populate department list
    departments.forEach(dept => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dept.id}</td>
            <td>${dept.name}</td>
            <td>${dept.head}</td>
            <td>
                <button class="btn small-btn edit-dept-btn" data-id="${dept.id}"><i class="fas fa-edit"></i></button>
                <button class="btn small-btn danger-btn delete-dept-btn" data-id="${dept.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        departmentList.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-dept-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const deptId = parseInt(this.dataset.id);
            editDepartment(deptId);
        });
    });
    
    document.querySelectorAll('.delete-dept-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const deptId = parseInt(this.dataset.id);
            deleteDepartment(deptId);
        });
    });
}

// Load divisions into the division list
function loadDivisions() {
    const divisionList = document.getElementById('division-list');
    divisionList.innerHTML = '';
    
    // Get divisions and departments from localStorage
    const divisions = JSON.parse(localStorage.getItem('fuel_express_divisions') || '[]');
    const departments = JSON.parse(localStorage.getItem('fuel_express_departments') || '[]');
    
    // Populate division list
    divisions.forEach(div => {
        const dept = departments.find(d => d.id === div.departmentId) || { name: 'Unknown' };
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${div.id}</td>
            <td>${div.name}</td>
            <td>${dept.name}</td>
            <td>
                <button class="btn small-btn edit-div-btn" data-id="${div.id}"><i class="fas fa-edit"></i></button>
                <button class="btn small-btn danger-btn delete-div-btn" data-id="${div.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        divisionList.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-div-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const divId = parseInt(this.dataset.id);
            editDivision(divId);
        });
    });
    
    document.querySelectorAll('.delete-div-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const divId = parseInt(this.dataset.id);
            deleteDivision(divId);
        });
    });
}

// Edit department
function editDepartment(deptId) {
    // Get departments from localStorage
    const departments = JSON.parse(localStorage.getItem('fuel_express_departments') || '[]');
    const department = departments.find(d => d.id === deptId);
    
    if (!department) return;
    
    // Populate form
    document.getElementById('department-form-title').textContent = 'Edit Department';
    document.getElementById('department-name').value = department.name;
    document.getElementById('department-head').value = department.head;
    document.getElementById('department-description').value = department.description || '';
    
    // Set form mode and ID
    document.getElementById('department-form').dataset.mode = 'edit';
    document.getElementById('department-form').dataset.id = deptId;
    
    // Show form
    document.getElementById('department-form-container').style.display = 'block';
    document.querySelector('.department-list-container').style.display = 'none';
}

// Edit division
function editDivision(divId) {
    // Get divisions from localStorage
    const divisions = JSON.parse(localStorage.getItem('fuel_express_divisions') || '[]');
    const division = divisions.find(d => d.id === divId);
    
    if (!division) return;
    
    // Update department dropdown
    updateDepartmentDropdownForDivisions();
    
    // Populate form
    document.getElementById('division-form-title').textContent = 'Edit Division';
    document.getElementById('division-name').value = division.name;
    document.getElementById('division-department').value = division.departmentId;
    document.getElementById('division-description').value = division.description || '';
    
    // Set form mode and ID
    document.getElementById('division-form').dataset.mode = 'edit';
    document.getElementById('division-form').dataset.id = divId;
    
    // Show form
    document.getElementById('division-form-container').style.display = 'block';
    document.querySelector('.division-list-container').style.display = 'none';
}

// Save department
function saveDepartment() {
    // Get form data
    const name = document.getElementById('department-name').value;
    const head = document.getElementById('department-head').value;
    const description = document.getElementById('department-description').value;
    
    // Get departments from localStorage
    const departments = JSON.parse(localStorage.getItem('fuel_express_departments') || '[]');
    
    // Get form mode and ID
    const mode = document.getElementById('department-form').dataset.mode;
    const deptId = parseInt(document.getElementById('department-form').dataset.id) || 0;
    
    if (mode === 'edit') {
        // Update existing department
        const index = departments.findIndex(d => d.id === deptId);
        
        if (index !== -1) {
            departments[index].name = name;
            departments[index].head = head;
            departments[index].description = description;
        }
    } else {
        // Add new department
        const newId = departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1;
        
        departments.push({
            id: newId,
            name,
            head,
            description
        });
    }
    
    // Save to localStorage
    localStorage.setItem('fuel_express_departments', JSON.stringify(departments));
    
    // Reload departments
    loadDepartments();
    
    // Hide form
    document.getElementById('department-form-container').style.display = 'none';
    document.querySelector('.department-list-container').style.display = 'block';
    
    // Update department dropdown in employee form
    updateDepartmentDropdown();
    
    // Show success message
    alert(mode === 'edit' ? 'Department updated successfully' : 'Department added successfully');
}

// Save division
function saveDivision() {
    // Get form data
    const name = document.getElementById('division-name').value;
    const departmentId = parseInt(document.getElementById('division-department').value);
    const description = document.getElementById('division-description').value;
    
    // Get divisions from localStorage
    const divisions = JSON.parse(localStorage.getItem('fuel_express_divisions') || '[]');
    
    // Get form mode and ID
    const mode = document.getElementById('division-form').dataset.mode;
    const divId = parseInt(document.getElementById('division-form').dataset.id) || 0;
    
    if (mode === 'edit') {
        // Update existing division
        const index = divisions.findIndex(d => d.id === divId);
        
        if (index !== -1) {
            divisions[index].name = name;
            divisions[index].departmentId = departmentId;
            divisions[index].description = description;
        }
    } else {
        // Add new division
        const newId = divisions.length > 0 ? Math.max(...divisions.map(d => d.id)) + 1 : 1;
        
        divisions.push({
            id: newId,
            name,
            departmentId,
            description
        });
    }
    
    // Save to localStorage
    localStorage.setItem('fuel_express_divisions', JSON.stringify(divisions));
    
    // Reload divisions
    loadDivisions();
    
    // Hide form
    document.getElementById('division-form-container').style.display = 'none';
    document.querySelector('.division-list-container').style.display = 'block';
    
    // Update division dropdown in employee form
    updateDivisionDropdown();
    
    // Show success message
    alert(mode === 'edit' ? 'Division updated successfully' : 'Division added successfully');
}

// Delete department
function deleteDepartment(deptId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this department? This will affect all employees in this department.')) {
        return;
    }
    
    // Get departments from localStorage
    const departments = JSON.parse(localStorage.getItem('fuel_express_departments') || '[]');
    
    // Check if department has divisions
    const divisions = JSON.parse(localStorage.getItem('fuel_express_divisions') || '[]');
    if (divisions.some(d => d.departmentId === deptId)) {
        alert('Cannot delete department that has divisions. Please delete the divisions first.');
        return;
    }
    
    // Check if department has employees
    const employees = JSON.parse(localStorage.getItem('fuel_express_employees') || '[]');
    if (employees.some(e => e.departmentId === deptId)) {
        alert('Cannot delete department that has employees. Please reassign employees first.');
        return;
    }
    
    // Remove department
    const updatedDepartments = departments.filter(d => d.id !== deptId);
    
    // Save to localStorage
    localStorage.setItem('fuel_express_departments', JSON.stringify(updatedDepartments));
    
    // Reload departments
    loadDepartments();
    
    // Update department dropdown in employee form
    updateDepartmentDropdown();
    
    // Show success message
    alert('Department deleted successfully');
}

// Delete division
function deleteDivision(divId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this division? This will affect all employees in this division.')) {
        return;
    }
    
    // Get divisions from localStorage
    const divisions = JSON.parse(localStorage.getItem('fuel_express_divisions') || '[]');
    
    // Check if division has employees
    const employees = JSON.parse(localStorage.getItem('fuel_express_employees') || '[]');
    if (employees.some(e => e.divisionId === divId)) {
        alert('Cannot delete division that has employees. Please reassign employees first.');
        return;
    }
    
    // Remove division
    const updatedDivisions = divisions.filter(d => d.id !== divId);
    
    // Save to localStorage
    localStorage.setItem('fuel_express_divisions', JSON.stringify(updatedDivisions));
    
    // Reload divisions
    loadDivisions();
    
    // Update division dropdown in employee form
    updateDivisionDropdown();
    
    // Show success message
    alert('Division deleted successfully');
}

// Update department dropdown in employee form
function updateDepartmentDropdown() {
    const departmentSelect = document.getElementById('department');
    if (!departmentSelect) return;
    
    // Clear options
    departmentSelect.innerHTML = '<option value="">Select Department</option>';
    
    // Get departments from localStorage
    const departments = JSON.parse(localStorage.getItem('fuel_express_departments') || '[]');
    
    // Add options
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = dept.name;
        departmentSelect.appendChild(option);
    });
    
    // Add change event to update division dropdown
    departmentSelect.addEventListener('change', updateDivisionDropdown);
}

// Update department dropdown in division form
function updateDepartmentDropdownForDivisions() {
    const departmentSelect = document.getElementById('division-department');
    if (!departmentSelect) return;
    
    // Clear options
    departmentSelect.innerHTML = '<option value="">Select Department</option>';
    
    // Get departments from localStorage
    const departments = JSON.parse(localStorage.getItem('fuel_express_departments') || '[]');
    
    // Add options
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = dept.name;
        departmentSelect.appendChild(option);
    });
}

// Update division dropdown in employee form based on selected department
function updateDivisionDropdown() {
    const divisionSelect = document.getElementById('division');
    if (!divisionSelect) return;
    
    // Clear options
    divisionSelect.innerHTML = '<option value="">Select Division</option>';
    
    // Get selected department
    const departmentSelect = document.getElementById('department');
    const departmentId = parseInt(departmentSelect.value) || 0;
    
    if (departmentId === 0) return;
    
    // Get divisions from localStorage
    const divisions = JSON.parse(localStorage.getItem('fuel_express_divisions') || '[]');
    
    // Filter divisions by department
    const filteredDivisions = divisions.filter(div => div.departmentId === departmentId);
    
    // Add options
    filteredDivisions.forEach(div => {
        const option = document.createElement('option');
        option.value = div.id;
        option.textContent = div.name;
        divisionSelect.appendChild(option);
    });
}
