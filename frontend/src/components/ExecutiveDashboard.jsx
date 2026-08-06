import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import WorkforceTable from './WorkforceTable';
import { EmployeeModal, DepartmentModal } from './Modals';

export default function ExecutiveDashboard({ currentUser, onLogout, onReturnHome }) {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('ALL');
    const [sortOption, setSortOption] = useState('NAME_ASC');
    
    // Modal states
    const [showEmpModal, setShowEmpModal] = useState(false);
    const [showDeptModal, setShowDeptModal] = useState(false);
    const [editingEmp, setEditingEmp] = useState(null);

    const isAdmin = currentUser?.role === 'ROLE_ADMIN';
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Administrator')}&background=1a1a1c&color=ccff00&rounded=true&size=40`;

    const fetchData = useCallback(async () => {
        try {
            const [deptRes, empRes] = await Promise.all([
                api.get('/departments'),
                api.get('/employees')
            ]);
            setDepartments(deptRes.data);
            setEmployees(empRes.data);
        } catch (err) {
            console.error('Error synchronizing dashboard database records:', err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle debounced search via API or filtering
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.trim()) {
                api.get(`/employees/search?keyword=${encodeURIComponent(searchTerm.trim().toLowerCase())}`)
                    .then(res => setEmployees(res.data))
                    .catch(err => console.error('Search query failure:', err));
            } else {
                fetchData();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, fetchData]);

    // Calculate KPI metrics
    const totalEmployees = employees.length;
    const totalDepartments = departments.length;
    const avgSalary = totalEmployees > 0 
        ? employees.reduce((sum, e) => sum + Number(e.salary), 0) / totalEmployees 
        : 0;
    
    let topRole = 'N/A';
    if (totalEmployees > 0) {
        const roleCounts = {};
        let maxCount = 0;
        employees.forEach(e => {
            roleCounts[e.designation] = (roleCounts[e.designation] || 0) + 1;
            if (roleCounts[e.designation] > maxCount) {
                maxCount = roleCounts[e.designation];
                topRole = e.designation;
            }
        });
    }

    // Apply client-side Department filter & Sorting
    const getDisplayedEmployees = () => {
        let filtered = [...employees];
        if (selectedDept !== 'ALL') {
            filtered = filtered.filter(e => String(e.departmentId) === String(selectedDept));
        }

        if (sortOption === 'NAME_ASC') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === 'SALARY_DESC') {
            filtered.sort((a, b) => b.salary - a.salary);
        } else if (sortOption === 'SALARY_ASC') {
            filtered.sort((a, b) => a.salary - b.salary);
        } else if (sortOption === 'JOINING_DESC') {
            filtered.sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate));
        }
        return filtered;
    };

    const handleEditEmployee = (emp) => {
        setEditingEmp(emp);
        setShowEmpModal(true);
    };

    const handleDeleteEmployee = async (id) => {
        if (!window.confirm('Warning: Are you certain you wish to execute a DELETE transaction on this record?')) return;
        try {
            await api.delete(`/employees/${id}`);
            fetchData();
        } catch (err) {
            alert('Permission Denied: Your current role lacks ADMIN transactional privileges.');
        }
    };

    const openNewEmployeeModal = () => {
        setEditingEmp(null);
        setShowEmpModal(true);
    };

    return (
        <div className="view active pb-5">
            {/* Top Application Bar */}
            <header className="navbar navbar-expand-lg border-bottom bg-white py-3 px-4 mb-4 sticky-top shadow-sm">
                <div className="container-fluid max-w-1300">
                    <a className="navbar-brand fw-bold d-flex align-items-center gap-2 cursor-pointer" onClick={onReturnHome}>
                        <span className="brand-dots"><i className="bi bi-circle-fill text-dark"></i><i className="bi bi-circle-fill text-lime"></i></span>
                        <span className="brand-text">SMART<span className="fw-light">EMS</span></span>
                        <span className="badge badge-lime ms-2 font-monospace small d-none d-md-inline-block">REACT WORKSPACE</span>
                    </a>
                    
                    <div className="d-flex align-items-center gap-3">
                        <div className="live-beacon d-none d-md-flex align-items-center gap-2 bg-light px-3 py-1 rounded-pill border">
                            <span className="beacon-dot bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></span>
                            <span className="small fw-semibold text-secondary">Vite Live Sync: Active</span>
                        </div>

                        <div className="d-flex align-items-center gap-2 bg-light p-1 pe-3 rounded-pill border">
                            <img src={avatarUrl} className="rounded-circle" width="34" height="34" alt="user" />
                            <div className="d-none d-sm-block text-start lh-1">
                                <span className="fw-bold small d-block mb-1">{currentUser?.name || 'Administrator'}</span>
                                <span className="badge bg-dark text-lime px-2 py-0 text-uppercase" style={{ fontSize: '10px' }}>
                                    {(currentUser?.role || 'ROLE_ADMIN').replace('ROLE_', '')}
                                </span>
                            </div>
                        </div>

                        <button className="btn btn-pill-dark btn-sm px-4 py-2" onClick={onLogout} title="Disconnect session">
                            <i className="bi bi-power me-1"></i> Log Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Dashboard Body */}
            <main className="container-fluid px-4 px-md-5">
                <div className="max-w-1300 mx-auto">
                    
                    {/* BENTO KPI MATRIX */}
                    <div className="row g-4 mb-4">
                        {/* KPI 1: Total Workforce */}
                        <div className="col-md-6 col-xl-3">
                            <div className="bento-card bento-dark p-4 h-100 d-flex flex-column justify-content-between">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="kpi-icon-box bg-dark border border-secondary text-white"><i className="bi bi-people-fill fs-3"></i></div>
                                    <span className="badge badge-lime">+100% Active</span>
                                </div>
                                <div>
                                    <span className="d-block small text-light-gray fw-semibold text-uppercase">Total Workforce</span>
                                    <h2 className="display-5 fw-bold text-white mb-0">{totalEmployees}</h2>
                                </div>
                                <div className="mt-3 pt-3 border-top border-secondary d-flex align-items-center justify-content-between text-secondary small">
                                    <span>Across All Divisions</span>
                                    <i className="bi bi-arrow-up-right text-lime"></i>
                                </div>
                            </div>
                        </div>

                        {/* KPI 2: Departments */}
                        <div className="col-md-6 col-xl-3">
                            <div className="bento-card bento-white p-4 h-100 d-flex flex-column justify-content-between border">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="kpi-icon-box bg-light text-primary border"><i className="bi bi-diagram-3 fs-3"></i></div>
                                    <span className="badge bg-light text-dark border">Spring JPA</span>
                                </div>
                                <div>
                                    <span className="d-block small text-muted fw-semibold text-uppercase">Departmental Units</span>
                                    <h2 className="display-5 fw-bold text-dark mb-0">{totalDepartments}</h2>
                                </div>
                                <div className="mt-3 pt-2">
                                    <div className="progress" style={{ height: '6px' }}>
                                        <div className="progress-bar bg-primary" style={{ width: '45%' }}></div>
                                        <div className="progress-bar bg-success" style={{ width: '30%' }}></div>
                                        <div className="progress-bar bg-warning" style={{ width: '25%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KPI 3: Compensation */}
                        <div className="col-md-6 col-xl-3">
                            <div className="bento-card bento-lime p-4 h-100 d-flex flex-column justify-content-between">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="kpi-icon-box bg-dark text-lime"><i className="bi bi-cash-stack fs-3"></i></div>
                                    <span className="badge bg-dark text-white">Fiscal Q3</span>
                                </div>
                                <div>
                                    <span className="d-block small fw-bold text-dark text-uppercase">Mean Salary Benchmark</span>
                                    <h2 className="display-5 fw-bold text-dark mb-0">${avgSalary.toLocaleString('en-US', { maximumFractionDigits: 0 })}</h2>
                                </div>
                                <div className="mt-3 pt-3 border-top border-dark-subtle d-flex align-items-center justify-content-between text-dark small fw-bold">
                                    <span>Verified Compensation</span>
                                    <i className="bi bi-patch-check-fill fs-5"></i>
                                </div>
                            </div>
                        </div>

                        {/* KPI 4: Primary Designation */}
                        <div className="col-md-6 col-xl-3">
                            <div className="bento-card bento-white p-4 h-100 d-flex flex-column justify-content-between border">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="kpi-icon-box bg-lime-light text-dark"><i className="bi bi-trophy-fill fs-3"></i></div>
                                    <span className="badge bg-dark text-white">Top Role</span>
                                </div>
                                <div>
                                    <span className="d-block small text-muted fw-semibold text-uppercase">Dominant Designation</span>
                                    <h3 className="fw-bold text-dark mb-0 text-truncate max-w-150">{topRole}</h3>
                                </div>
                                <div className="mt-3 pt-3 border-top d-flex align-items-center justify-content-between text-muted small">
                                    <span>Enterprise Statistics</span>
                                    <i className="bi bi-bar-chart-fill text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COMMAND BAR & FILTER CONTROLS */}
                    <div className="bento-card bento-white p-3 p-md-4 mb-4 border">
                        <div className="row align-items-center g-3">
                            <div className="col-lg-5">
                                <div className="input-group input-group-lg bg-light rounded-pill p-1 border">
                                    <span className="input-group-text bg-transparent border-0 text-muted ps-4"><i className="bi bi-search"></i></span>
                                    <input type="text" className="form-control bg-transparent border-0 fs-6" placeholder="Search by name, designation, or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-lg-7 d-flex flex-wrap align-items-center justify-content-lg-end gap-2">
                                <select className="form-select bg-light border rounded-pill w-auto px-3 py-2 text-sm fw-medium" value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
                                    <option value="ALL">All Departments</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                                <select className="form-select bg-light border rounded-pill w-auto px-3 py-2 text-sm fw-medium" value={sortOption} onChange={e => setSortOption(e.target.value)}>
                                    <option value="NAME_ASC">Sort: Name (A-Z)</option>
                                    <option value="SALARY_DESC">Highest Compensation</option>
                                    <option value="SALARY_ASC">Lowest Compensation</option>
                                    <option value="JOINING_DESC">Recently Onboarded</option>
                                </select>
                                {isAdmin && (
                                    <>
                                        <div className="vr mx-2 d-none d-md-block" style={{ height: '30px' }}></div>
                                        <button className="btn btn-pill-dark px-4 py-2" onClick={openNewEmployeeModal}><i className="bi bi-person-plus-fill me-1"></i> Add Employee</button>
                                        <button className="btn btn-outline-dark rounded-pill px-3 py-2 fw-semibold" onClick={() => setShowDeptModal(true)}><i className="bi bi-folder-plus me-1"></i> New Dept</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DATA GRID CONTAINER */}
                    <div className="bento-card bento-white border overflow-hidden shadow-sm">
                        <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-light">
                            <div>
                                <h5 className="fw-bold mb-0">Active Workforce Roster</h5>
                                <span className="small text-muted">Real-time synchronized records from Spring Data JPA & React State</span>
                            </div>
                            <span className="badge bg-white text-dark border px-3 py-2 rounded-pill"><i className="bi bi-lightning-charge me-1 text-primary"></i> Vite Decoupled UI</span>
                        </div>
                        
                        <WorkforceTable 
                            employees={getDisplayedEmployees()} 
                            isAdmin={isAdmin} 
                            onEdit={handleEditEmployee} 
                            onDelete={handleDeleteEmployee} 
                            onAdd={openNewEmployeeModal} 
                        />
                    </div>

                </div>
            </main>

            {/* MODALS */}
            <EmployeeModal 
                show={showEmpModal} 
                onClose={() => setShowEmpModal(false)} 
                onSaveSuccess={fetchData} 
                employeeToEdit={editingEmp} 
                departments={departments} 
            />
            <DepartmentModal 
                show={showDeptModal} 
                onClose={() => setShowDeptModal(false)} 
                onSaveSuccess={fetchData} 
            />
        </div>
    );
}
