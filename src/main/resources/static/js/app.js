// Global App State
let authToken = localStorage.getItem('jwt_token') || null;
let currentUser = null;
let employees = [];
let departments = [];
let searchTimeout = null;

const API_BASE = '/api';

// Initialize Bootstrap Modals
let empModalInstance = null;
let deptModalInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    // Instantiate Bootstrap modal controls
    const empEl = document.getElementById('employee-modal');
    const deptEl = document.getElementById('dept-modal');
    if (empEl && window.bootstrap) empModalInstance = new bootstrap.Modal(empEl);
    if (deptEl && window.bootstrap) deptModalInstance = new bootstrap.Modal(deptEl);

    // Check Login State
    const storedUser = localStorage.getItem('user_data');
    if (authToken && storedUser) {
        currentUser = JSON.parse(storedUser);
        showDashboard();
    } else {
        showLanding();
    }
});

// ─── VIEW SWITCHING & NAVIGATION ─────────────────────────────────────

function showLanding() {
    document.getElementById('landing-container').classList.remove('hidden');
    document.getElementById('landing-container').classList.add('active');
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('active');
    document.getElementById('dashboard-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.remove('active');
    window.scrollTo(0, 0);
}

function showAuth(initialTab = 'login') {
    document.getElementById('landing-container').classList.add('hidden');
    document.getElementById('landing-container').classList.remove('active');
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('auth-container').classList.add('active');
    document.getElementById('dashboard-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.remove('active');
    switchAuthTab(initialTab);
    window.scrollTo(0, 0);
}

function showDashboard() {
    document.getElementById('landing-container').classList.add('hidden');
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.remove('hidden');
    document.getElementById('dashboard-container').classList.add('active');

    if (currentUser) {
        document.getElementById('user-display-name').textContent = currentUser.name || 'Administrator';
        document.getElementById('user-role-badge').textContent = (currentUser.role || 'ROLE_ADMIN').replace('ROLE_', '');
        // Update user avatar
        const avatarImg = document.getElementById('user-avatar-img');
        if (avatarImg) {
            avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'Admin')}&background=1a1a1c&color=ccff00&rounded=true&size=40`;
        }
        
        const isAdmin = currentUser.role === 'ROLE_ADMIN';
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = isAdmin ? '' : 'none';
        });
    }

    loadDashboardData();
    window.scrollTo(0, 0);
}

// ─── AUTHENTICATION PORTAL HANDLERS ──────────────────────────────────

function switchAuthTab(tab) {
    const signinBtn = document.getElementById('signin-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (tab === 'login') {
        signinBtn.classList.add('active');
        signupBtn.classList.remove('active');
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        signupBtn.classList.add('active');
        signinBtn.classList.remove('active');
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.className = 'form-text text-center mt-3 text-secondary fw-bold';
    errorEl.textContent = 'Verifying JWT enterprise credentials...';

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Invalid credentials or non-existent user');
        }

        authToken = data.token;
        currentUser = { id: data.id, name: data.name, email: data.email, role: data.role };
        localStorage.setItem('jwt_token', authToken);
        localStorage.setItem('user_data', JSON.stringify(currentUser));
        errorEl.textContent = '';
        showDashboard();
    } catch (err) {
        errorEl.className = 'form-text text-center mt-3 text-danger fw-bold';
        errorEl.textContent = err.message || 'Authentication error. Did you register first?';
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('signup-role').value;
    const msgEl = document.getElementById('signup-error');
    msgEl.className = 'form-text text-center mt-3 text-secondary fw-bold';
    msgEl.textContent = 'Committing encrypted identity to database...';

    try {
        const response = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Account registration failed');
        }

        msgEl.className = 'form-text text-center mt-3 text-success fw-bold';
        msgEl.textContent = '✔ Identity established! Redirecting to login portal...';
        setTimeout(() => switchAuthTab('login'), 1500);
    } catch (err) {
        msgEl.className = 'form-text text-center mt-3 text-danger fw-bold';
        msgEl.textContent = err.message;
    }
}

function handleLogout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    authToken = null;
    currentUser = null;
    showLanding();
}

// ─── API WORKFLOW & SYNCHRONIZATION ──────────────────────────────────

async function apiFetch(endpoint, options = {}) {
    const headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        ...options.headers
    };
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (res.status === 401) {
        alert('Your JWT authorization session has expired. Re-authentication required.');
        handleLogout();
    }
    return res;
}

async function loadDashboardData() {
    try {
        const [deptRes, empRes] = await Promise.all([
            apiFetch('/departments'),
            apiFetch('/employees')
        ]);

        if (deptRes.ok) departments = await deptRes.json();
        if (empRes.ok) employees = await empRes.json();

        populateDeptDropdowns();
        renderEmployees(employees);
        updateKPIs();
    } catch (err) {
        console.error('Error synchronizing database records:', err);
    }
}

// ─── AFTER-LOGIN KPI & ROSTER RENDERING ──────────────────────────────

function updateKPIs() {
    document.getElementById('stat-total-emp').textContent = employees.length;
    document.getElementById('stat-total-dept').textContent = departments.length;

    if (employees.length > 0) {
        const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0);
        const avg = totalSalary / employees.length;
        document.getElementById('stat-avg-sal').textContent = `$${avg.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

        const roleCounts = {};
        let topRole = 'General Staff';
        let maxCount = 0;
        employees.forEach(e => {
            roleCounts[e.designation] = (roleCounts[e.designation] || 0) + 1;
            if (roleCounts[e.designation] > maxCount) {
                maxCount = roleCounts[e.designation];
                topRole = e.designation;
            }
        });
        document.getElementById('stat-top-role').textContent = topRole;
    } else {
        document.getElementById('stat-avg-sal').textContent = '$0';
        document.getElementById('stat-top-role').textContent = 'N/A';
    }
}

function populateDeptDropdowns() {
    const filterSelect = document.getElementById('dept-filter');
    const modalSelect = document.getElementById('emp-dept');

    filterSelect.innerHTML = '<option value="ALL">All Departments</option>';
    modalSelect.innerHTML = '<option value="" disabled selected>Select Department</option>';

    departments.forEach(d => {
        filterSelect.innerHTML += `<option value="${d.id}">${d.name}</option>`;
        modalSelect.innerHTML += `<option value="${d.id}">${d.name}</option>`;
    });
}

function renderEmployees(list) {
    const tbody = document.getElementById('employee-tbody');
    const emptyState = document.getElementById('empty-state');
    const isAdmin = currentUser && currentUser.role === 'ROLE_ADMIN';
    tbody.innerHTML = '';

    if (list.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    emptyState.classList.add('hidden');

    // Alternate realistic workplace statuses for high fidelity visual presentation
    const statuses = [
        { label: 'Onsite Active', color: '#10b981', badge: 'bg-light-green text-success' },
        { label: 'Remote Sync', color: '#3b82f6', badge: 'bg-primary-subtle text-primary' },
        { label: 'Hybrid Flex', color: '#8b5cf6', badge: 'bg-purple-subtle text-purple' }
    ];

    list.forEach((emp, idx) => {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random&color=fff&rounded=true&size=44`;
        const st = statuses[idx % statuses.length];

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-4 py-3">
                <div class="d-flex align-items-center gap-3">
                    <img src="${avatarUrl}" alt="${emp.name}" class="rounded-circle shadow-sm border border-2 border-white" width="44" height="44">
                    <div>
                        <span class="d-block fw-bold text-dark fs-6">${emp.name}</span>
                        <span class="badge bg-light text-secondary border font-monospace mt-1" style="font-size: 10px;">ID: #EMS-${1000 + emp.id}</span>
                    </div>
                </div>
            </td>
            <td>
                <span class="fw-semibold text-dark d-block">${emp.designation}</span>
                <span class="small text-muted">Full-Time Staff</span>
            </td>
            <td>
                <span class="badge bg-light text-dark border px-3 py-2 rounded-pill fw-semibold">
                    <i class="bi bi-folder-fill me-1 text-primary"></i> ${emp.departmentName || 'General Operation'}
                </span>
            </td>
            <td>
                <div class="d-flex align-items-center gap-2 mb-1"><i class="bi bi-envelope-check-fill text-muted"></i> <span class="small fw-medium text-dark">${emp.email}</span></div>
                <div class="d-flex align-items-center gap-2"><i class="bi bi-telephone-fill text-muted"></i> <span class="small text-muted font-monospace">${emp.phone}</span></div>
            </td>
            <td>
                <div class="mb-1"><span class="status-dot" style="background-color: ${st.color};"></span><span class="small fw-bold text-dark">${st.label}</span></div>
                <span class="small text-muted"><i class="bi bi-calendar3 me-1"></i> ${emp.joiningDate}</span>
            </td>
            <td>
                <span class="fw-bold text-dark fs-6 d-block">$${emp.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <span class="badge bg-success-subtle text-success font-monospace" style="font-size: 10px;">Verified USD</span>
            </td>
            <td class="px-4 py-3 text-end admin-only" style="${isAdmin ? '' : 'display: none;'}">
                <div class="btn-group shadow-sm rounded-pill" role="group">
                    <button class="btn btn-sm btn-outline-dark px-3 fw-semibold" onclick="openEditEmployee(${emp.id})" title="Edit Employee"><i class="bi bi-pencil-square me-1"></i> Edit</button>
                    <button class="btn btn-sm btn-outline-danger px-3 fw-semibold" onclick="deleteEmployee(${emp.id})" title="Delete Record"><i class="bi bi-trash-fill"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ─── SEARCH & FILTER ENGINE ──────────────────────────────────────────

function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const keyword = document.getElementById('search-input').value.trim().toLowerCase();
        if (!keyword) {
            filterEmployees();
            return;
        }
        apiFetch(`/employees/search?keyword=${encodeURIComponent(keyword)}`)
            .then(res => res.json())
            .then(data => renderEmployees(data));
    }, 250);
}

function filterEmployees() {
    const deptId = document.getElementById('dept-filter').value;
    if (deptId === 'ALL') {
        renderEmployees(employees);
    } else {
        const filtered = employees.filter(e => String(e.departmentId) === String(deptId));
        renderEmployees(filtered);
    }
}

function sortEmployees() {
    const sortType = document.getElementById('sort-filter').value;
    let sorted = [...employees];

    if (sortType === 'NAME_ASC') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'SALARY_DESC') {
        sorted.sort((a, b) => b.salary - a.salary);
    } else if (sortType === 'SALARY_ASC') {
        sorted.sort((a, b) => a.salary - b.salary);
    } else if (sortType === 'JOINING_DESC') {
        sorted.sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate));
    }
    renderEmployees(sorted);
}

// ─── MODAL LIFECYCLE & CRUD EXECUTIONS ───────────────────────────────

function openModal(id) {
    if (id === 'employee-modal') {
        if (!document.getElementById('emp-id').value) {
            document.getElementById('emp-modal-title').textContent = 'Workforce Onboarding';
            document.getElementById('employee-form').reset();
        }
        empModalInstance ? empModalInstance.show() : null;
    } else if (id === 'dept-modal') {
        document.getElementById('dept-form').reset();
        deptModalInstance ? deptModalInstance.show() : null;
    }
}

function closeModal(id) {
    if (id === 'employee-modal') {
        document.getElementById('emp-id').value = '';
        document.getElementById('employee-form').reset();
        empModalInstance ? empModalInstance.hide() : null;
    } else if (id === 'dept-modal') {
        deptModalInstance ? deptModalInstance.hide() : null;
    }
}

async function saveDepartment(e) {
    e.preventDefault();
    const name = document.getElementById('dept-name').value;
    const description = document.getElementById('dept-desc').value;
    const errEl = document.getElementById('dept-form-error');
    errEl.textContent = 'Committing departmental unit...';

    const res = await apiFetch('/departments', {
        method: 'POST',
        body: JSON.stringify({ name, description })
    });

    if (res.ok) {
        errEl.textContent = '';
        closeModal('dept-modal');
        loadDashboardData();
    } else {
        const data = await res.json();
        errEl.textContent = data.message || 'Error establishing departmental relationship';
    }
}

function openEditEmployee(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    document.getElementById('emp-modal-title').textContent = 'Update Employee Profile';
    document.getElementById('emp-id').value = emp.id;
    document.getElementById('emp-name').value = emp.name;
    document.getElementById('emp-email').value = emp.email;
    document.getElementById('emp-phone').value = emp.phone;
    document.getElementById('emp-desg').value = emp.designation;
    document.getElementById('emp-sal').value = emp.salary;
    document.getElementById('emp-dept').value = emp.departmentId;
    document.getElementById('emp-date').value = emp.joiningDate;

    openModal('employee-modal');
}

async function saveEmployee(e) {
    e.preventDefault();
    const id = document.getElementById('emp-id').value;
    const payload = {
        name: document.getElementById('emp-name').value,
        email: document.getElementById('emp-email').value,
        phone: document.getElementById('emp-phone').value,
        designation: document.getElementById('emp-desg').value,
        salary: parseFloat(document.getElementById('emp-sal').value),
        departmentId: parseInt(document.getElementById('emp-dept').value),
        joiningDate: document.getElementById('emp-date').value
    };
    const errEl = document.getElementById('emp-form-error');
    errEl.textContent = 'Verifying validation invariants...';

    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `/employees/${id}` : '/employees';

    const res = await apiFetch(endpoint, {
        method: method,
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        errEl.textContent = '';
        closeModal('employee-modal');
        loadDashboardData();
    } else {
        const data = await res.json();
        errEl.textContent = data.message || 'Validation error while executing transaction';
    }
}

async function deleteEmployee(id) {
    if (!confirm('Warning: Are you certain you wish to permanently execute a DELETE transaction on this workforce record?')) return;

    const res = await apiFetch(`/employees/${id}`, { method: 'DELETE' });
    if (res.ok || res.status === 204) {
        loadDashboardData();
    } else {
        alert('Permission Denied: Your current role lacks ADMIN transactional privileges.');
    }
}
