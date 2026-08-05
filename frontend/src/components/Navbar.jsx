import React from 'react';

export default function Navbar({ currentView, setView, currentUser, onLogout }) {
    return (
        <nav className="navbar navbar-expand-lg bg-transparent py-4 px-4 px-lg-5">
            <div className="container-fluid max-w-1300">
                <a className="navbar-brand d-flex align-items-center gap-2 fw-bold cursor-pointer" onClick={() => setView('landing')}>
                    <span className="brand-dots">
                        <i className="bi bi-circle-fill text-dark"></i>
                        <i className="bi bi-circle-fill text-lime"></i>
                    </span>
                    <span className="brand-text">SMART<span class="fw-light">EMS</span></span>
                </a>
                
                <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav gap-lg-4 fw-medium">
                        <li className="nav-item">
                            <a className="nav-link cursor-pointer" onClick={() => setView('landing')}>Platform</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link cursor-pointer" onClick={() => setView('landing')}>Architecture</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link cursor-pointer" onClick={() => setView('landing')}>Security</a>
                        </li>
                    </ul>
                </div>

                <div className="d-none d-lg-flex align-items-center gap-3">
                    {currentUser ? (
                        <>
                            <button className="btn btn-pill-dark px-4 py-2" onClick={() => setView('dashboard')}>
                                My Workspace <i className="bi bi-arrow-right ms-1"></i>
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-pill-dark px-4 py-2" onClick={() => setView('auth')}>
                            Open Workforce Portal <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
