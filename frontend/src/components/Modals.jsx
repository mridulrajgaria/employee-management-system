import React, { useState, useEffect } from 'react';
import api from '../services/api';

export function EmployeeModal({ show, onClose, onSaveSuccess, employeeToEdit, departments }) {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', designation: '', salary: '', departmentId: '', joiningDate: ''
    });
    const [localDepts, setLocalDepts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            // Fetch departments directly on open to ensure dropdown is never stale or empty
            api.get('/departments')
                .then(res => setLocalDepts(res.data))
                .catch(err => {
                    console.error('Failed fetching departments in modal, utilizing props:', err);
                    setLocalDepts(departments || []);
                });

            if (employeeToEdit) {
                setFormData({
                    name: employeeToEdit.name || '',
                    email: employeeToEdit.email || '',
                    phone: employeeToEdit.phone || '',
                    designation: employeeToEdit.designation || '',
                    salary: employeeToEdit.salary || '',
                    departmentId: employeeToEdit.departmentId || '',
                    joiningDate: employeeToEdit.joiningDate || ''
                });
            } else {
                setFormData({ name: '', email: '', phone: '', designation: '', salary: '', departmentId: '', joiningDate: '' });
            }
            setError('');
        }
    }, [employeeToEdit, show, departments]);

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (localDepts.length === 0) {
            setError('Cannot register employee: You must create at least one department first!');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const payload = { ...formData, salary: parseFloat(formData.salary), departmentId: parseInt(formData.departmentId) };
            if (employeeToEdit?.id) {
                await api.put(`/employees/${employeeToEdit.id}`, payload);
            } else {
                await api.post('/employees', payload);
            }
            onSaveSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to execute transaction. Please verify field inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content rounded-5 border-0 shadow-lg p-3">
                    <div className="modal-header border-bottom pb-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="icon-circle bg-dark text-lime"><i className="bi bi-person-badge"></i></div>
                            <div>
                                <h5 className="modal-title fw-bold mb-0">{employeeToEdit ? 'Update Employee Profile' : 'Workforce Onboarding'}</h5>
                                <span className="small text-muted">Enter verified employee credentials and compensation details</span>
                            </div>
                        </div>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body py-4">
                            {error && <div className="alert alert-danger py-2 small fw-bold mb-3">{error}</div>}
                            
                            {/* Explicit guidance if no departments exist in DB yet */}
                            {localDepts.length === 0 && (
                                <div className="alert alert-warning p-3 rounded-3 mb-3 border border-warning-subtle">
                                    <div className="d-flex align-items-center gap-2 text-dark fw-bold mb-1">
                                        <i className="bi bi-exclamation-triangle-fill text-warning fs-5"></i>
                                        <span>No Departments Established Yet!</span>
                                    </div>
                                    <p className="small m-0 text-secondary">
                                        Because an employee row must have a relational foreign key in Spring Data JPA, please close this window and click <b>"New Dept"</b> in your dashboard to create a department unit first!
                                    </p>
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">FULL NAME</label>
                                <input type="text" className="form-control form-control-lg bg-light rounded-3" required placeholder="e.g. Sarah Connor" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-secondary">CORPORATE EMAIL</label>
                                    <input type="email" className="form-control bg-light rounded-3 py-2" required placeholder="sarah.c@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-secondary">PHONE CONTACT</label>
                                    <input type="text" className="form-control bg-light rounded-3 py-2" required placeholder="+1 (555) 321-7654" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-secondary">DESIGNATION / TITLE</label>
                                    <input type="text" className="form-control bg-light rounded-3 py-2" required placeholder="Principal Lead Architect" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-secondary">ANNUAL COMPENSATION ($)</label>
                                    <input type="number" className="form-control bg-light rounded-3 py-2 fw-bold text-success" required min="1" step="any" placeholder="115000" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
                                </div>
                            </div>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-secondary">ASSIGNED DEPARTMENT</label>
                                    <select className="form-select bg-light rounded-3 py-2 fw-semibold" required value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} disabled={localDepts.length === 0}>
                                        <option value="" disabled>{localDepts.length === 0 ? '⚠️ Create a department first...' : 'Select Department'}</option>
                                        {localDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-secondary">OFFICIAL JOINING DATE</label>
                                    <input type="date" className="form-control bg-light rounded-3 py-2" required value={formData.joiningDate} onChange={e => setFormData({...formData, joiningDate: e.target.value})} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-top-0 pt-0">
                            <button type="button" className="btn btn-light rounded-pill px-4 fw-semibold" onClick={onClose}>Cancel</button>
                            <button type="submit" disabled={loading || localDepts.length === 0} className="btn btn-pill-dark px-5 py-2">
                                {loading ? 'Committing...' : <span>Commit Record <i className="bi bi-cloud-check ms-1"></i></span>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export function DepartmentModal({ show, onClose, onSaveSuccess }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            setName(''); setDescription(''); setError('');
        }
    }, [show]);

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/departments', { name, description });
            onSaveSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Error establishing department unit.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-5 border-0 shadow-lg p-3">
                    <div className="modal-header border-bottom pb-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="icon-circle bg-primary text-white"><i className="bi bi-building-add"></i></div>
                            <div>
                                <h5 className="modal-title fw-bold mb-0">Establish Unit</h5>
                                <span className="small text-muted">Create a new departmental relationship</span>
                            </div>
                        </div>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body py-4">
                            {error && <div className="alert alert-danger py-2 small fw-bold mb-3">{error}</div>}
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">DEPARTMENT NAME</label>
                                <input type="text" className="form-control bg-light rounded-3 py-2 fs-6 fw-bold" required placeholder="e.g. Artificial Intelligence Core" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">RESPONSIBILITY OVERVIEW</label>
                                <textarea className="form-control bg-light rounded-3" rows="3" placeholder="Core mission and departmental responsibilities" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                            </div>
                        </div>
                        <div className="modal-footer border-top-0 pt-0">
                            <button type="button" className="btn btn-light rounded-pill px-4 fw-semibold" onClick={onClose}>Cancel</button>
                            <button type="submit" disabled={loading} className="btn btn-pill-primary px-4 py-2">
                                {loading ? 'Establishing...' : <span>Establish Unit <i className="bi bi-plus-circle ms-1"></i></span>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
