import React, { useState } from 'react';
import api from '../services/api';

export default function AuthPortal({ onLoginSuccess, onReturnHome }) {
    const [tab, setTab] = useState('login');
    const [loginData, setLoginData] = useState({ email: 'admin@ems.com', password: 'admin123' });
    const [signupData, setSignupData] = useState({ name: '', email: '', password: '', role: 'ROLE_ADMIN' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: 'info', msg: 'Verifying JWT enterprise credentials via Spring Boot...' });

        try {
            const res = await api.post('/auth/login', loginData);
            localStorage.setItem('jwt_token', res.data.token);
            const user = { id: res.data.id, name: res.data.name, email: res.data.email, role: res.data.role };
            localStorage.setItem('user_data', JSON.stringify(user));
            setStatus({ type: 'success', msg: '✔ Authorization verified!' });
            onLoginSuccess(user);
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Authentication failed. Did you register an account first?';
            setStatus({ type: 'error', msg: errMsg });
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: 'info', msg: 'Committing identity record to Spring Data JPA...' });

        try {
            await api.post('/auth/signup', signupData);
            setStatus({ type: 'success', msg: '✔ Account registered! Transitioning to login portal...' });
            setTimeout(() => {
                setTab('login');
                setLoginData({ email: signupData.email, password: signupData.password });
                setStatus({ type: '', msg: '' });
            }, 1500);
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Registration failed. Email might already exist.';
            setStatus({ type: 'error', msg: errMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view active my-4 py-4">
            <div className="container max-w-1100">
                <div className="auth-split-box bg-white border rounded-5 shadow-lg overflow-hidden row g-0">
                    
                    {/* Left Column: Bento Security & Enterprise Value Proposition */}
                    <div className="col-lg-5 bento-dark p-5 d-flex flex-column justify-content-between position-relative overflow-hidden">
                        <div className="position-relative z-1">
                            <a onClick={onReturnHome} className="text-decoration-none d-inline-flex align-items-center gap-2 mb-4 text-white opacity-75 hover-opacity-100 cursor-pointer">
                                <i className="bi bi-arrow-left"></i> <span className="small fw-semibold">Return to Landing</span>
                            </a>
                            <span className="badge badge-lime d-inline-block mb-3">ENTERPRISE PORTAL</span>
                            <h2 className="fw-bold display-6 text-white mb-3">Secure Executive Command</h2>
                            <p className="text-light-gray small mb-4">
                                Access real-time employee directories, salary audit logs, and department orchestration governed by strict Role-Based Access Control (RBAC).
                            </p>

                            <div className="security-card p-3 rounded-4 bg-dark border border-secondary mb-4">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="small fw-bold text-lime"><i className="bi bi-key-fill me-1"></i> STATELESS JWT</span>
                                    <span className="badge bg-success small">256-Bit Encrypted</span>
                                </div>
                                <div className="code-snippet small font-monospace text-light-gray bg-black p-2 rounded-2 text-truncate">
                                    Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoi...
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 border-top border-secondary position-relative z-1">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="avatar-stack d-flex">
                                        <img src="https://ui-avatars.com/api/?name=A+V&background=2563eb&color=fff" className="rounded-circle border border-dark" width="30" height="30" style={{ marginRight: '-10px', zIndex: 3 }} alt="avatar" />
                                        <img src="https://ui-avatars.com/api/?name=R+K&background=10b981&color=fff" className="rounded-circle border border-dark" width="30" height="30" style={{ marginRight: '-10px', zIndex: 2 }} alt="avatar" />
                                        <img src="https://ui-avatars.com/api/?name=M+D&background=f59e0b&color=fff" className="rounded-circle border border-dark" width="30" height="30" style={{ zIndex: 1 }} alt="avatar" />
                                    </div>
                                    <span className="small text-white ms-3 fw-medium">Active HR Team</span>
                                </div>
                                <span className="text-lime fw-bold small">React v18.3</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Clean Forms & Fast-Track Login */}
                    <div className="col-lg-7 p-4 p-md-5 bg-white d-flex flex-column justify-content-center">
                        <div className="max-w-450 mx-auto w-100">
                            
                            {/* Toggle Tabs */}
                            <ul className="nav nav-pills nav-fill mb-4 p-2 bg-light rounded-4 border">
                                <li className="nav-item">
                                    <button className={`nav-link rounded-3 py-2 fw-bold ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setStatus({ type: '', msg: '' }); }}>
                                        <i className="bi bi-person-check-fill me-2"></i>Sign In
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link rounded-3 py-2 fw-bold ${tab === 'signup' ? 'active' : ''}`} onClick={() => { setTab('signup'); setStatus({ type: '', msg: '' }); }}>
                                        <i className="bi bi-person-plus-fill me-2"></i>Register
                                    </button>
                                </li>
                            </ul>

                            {/* Status messages */}
                            {status.msg && (
                                <div className={`alert ${status.type === 'error' ? 'alert-danger' : status.type === 'success' ? 'alert-success' : 'alert-secondary'} py-2 px-3 rounded-3 small fw-bold text-center mb-3`}>
                                    {status.msg}
                                </div>
                            )}

                            {/* SIGN IN FORM */}
                            {tab === 'login' ? (
                                <form onSubmit={handleLoginSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small text-secondary">WORK EMAIL</label>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-envelope"></i></span>
                                            <input type="email" className="form-control bg-light border-start-0 fs-6" required placeholder="admin@ems.com" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between">
                                            <label className="form-label fw-bold small text-secondary">SECURITY PASSWORD</label>
                                        </div>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-lock"></i></span>
                                            <input type="password" className="form-control bg-light border-start-0 fs-6" required placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={loading} className="btn btn-pill-dark w-100 py-3 fw-bold fs-6">
                                        {loading ? 'Authorizing Access...' : <span>Authorize Access <i className="bi bi-box-arrow-in-right ms-2"></i></span>}
                                    </button>
                                    
                                    {/* Demo fast-track hint */}
                                    <div className="mt-4 p-3 bg-lime-light rounded-3 border border-warning-subtle text-center">
                                        <span className="d-block small fw-bold text-dark mb-1"><i className="bi bi-lightning-charge-fill text-warning me-1"></i> FIRST TIME HERE?</span>
                                        <span className="text-secondary small">Because this app runs on a zero-setup portable H2 database, click <b>Register</b> above to create your Admin account first!</span>
                                    </div>
                                </form>
                            ) : (
                                /* REGISTER FORM */
                                <form onSubmit={handleSignupSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small text-secondary">FULL NAME</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-person"></i></span>
                                            <input type="text" className="form-control bg-light border-start-0" required placeholder="e.g. Alexander Pierce" value={signupData.name} onChange={(e) => setSignupData({...signupData, name: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small text-secondary">CORPORATE EMAIL</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-envelope"></i></span>
                                            <input type="email" className="form-control bg-light border-start-0" required placeholder="alexander@ems.com" value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="row g-3 mb-4">
                                        <div className="col-sm-6">
                                            <label className="form-label fw-bold small text-secondary">PASSWORD</label>
                                            <input type="password" className="form-control bg-light" required placeholder="Min 6 characters" value={signupData.password} onChange={(e) => setSignupData({...signupData, password: e.target.value})} />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label fw-bold small text-secondary">SECURITY ROLE</label>
                                            <select className="form-select bg-light fw-semibold text-primary" value={signupData.role} onChange={(e) => setSignupData({...signupData, role: e.target.value})}>
                                                <option value="ROLE_ADMIN">Admin (Full Control)</option>
                                                <option value="ROLE_EMPLOYEE">Employee (Read-Only)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={loading} className="btn btn-pill-primary w-100 py-3 fw-bold fs-6">
                                        {loading ? 'Creating Account...' : <span>Create Executive Account <i className="bi bi-check2-circle ms-2"></i></span>}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
