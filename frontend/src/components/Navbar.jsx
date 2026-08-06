import React, { useState } from 'react';

export default function Navbar({ currentView, setView, currentUser, onLogout }) {
    const [showArchModal, setShowArchModal] = useState(false);
    const [showSecModal, setShowSecModal] = useState(false);

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-transparent py-3 px-3 px-lg-5">
                <div className="container-fluid max-w-1300">
                    <a className="navbar-brand d-flex align-items-center gap-2 fw-bold cursor-pointer" onClick={() => setView('landing')}>
                        <span className="brand-dots">
                            <i className="bi bi-circle-fill text-dark"></i>
                            <i className="bi bi-circle-fill text-lime"></i>
                        </span>
                        <span className="brand-text tracking-tight">SMART<span className="fw-light">EMS</span></span>
                    </a>
                    
                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                        <ul className="navbar-nav gap-lg-4 fw-medium small text-uppercase" style={{ letterSpacing: '0.5px' }}>
                            <li className="nav-item">
                                <a className="nav-link cursor-pointer text-dark hover-opacity" onClick={() => setView(currentUser ? 'dashboard' : 'landing')}>
                                    <i className="bi bi-window-fullscreen me-1 text-primary"></i> Platform
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link cursor-pointer text-dark hover-opacity" onClick={() => setShowArchModal(true)}>
                                    <i className="bi bi-cpu-fill me-1 text-success"></i> Architecture
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link cursor-pointer text-dark hover-opacity" onClick={() => setShowSecModal(true)}>
                                    <i className="bi bi-shield-lock-fill me-1 text-danger"></i> Security
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="d-none d-lg-flex align-items-center gap-3">
                        {currentUser ? (
                            <>
                                <button className="btn btn-pill-dark px-4 py-2 small fw-bold d-flex align-items-center" onClick={() => setView('dashboard')}>
                                    Executive Dashboard <i className="bi bi-arrow-right ms-2"></i>
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-pill-dark px-4 py-2 small fw-bold d-flex align-items-center" onClick={() => setView('auth')}>
                                Open Workforce Portal <i className="bi bi-box-arrow-in-right ms-2 text-lime"></i>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* INTERACTIVE ARCHITECTURE SPECIFICATION MODAL */}
            {showArchModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content rounded-5 border-0 shadow-lg p-4 bg-dark text-white">
                            <div className="modal-header border-bottom border-secondary pb-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="icon-circle bg-white text-dark"><i className="bi bi-diagram-3-fill fs-4 text-success"></i></div>
                                    <div>
                                        <h4 className="modal-title fw-bold mb-0 text-white">System Architecture Matrix</h4>
                                        <span className="small text-light-gray">Enterprise Full-Stack Java & Decoupled React Specifications</span>
                                    </div>
                                </div>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowArchModal(false)}></button>
                            </div>
                            <div className="modal-body py-4">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="p-3 rounded-4" style={{ backgroundColor: '#2a2a2d', border: '1px solid #3f3f44' }}>
                                            <div className="badge badge-lime mb-2">Presentation Layer</div>
                                            <h6 className="fw-bold text-white mb-2"><i className="bi bi-boxes text-primary me-2"></i>React 18.3 & Vite 8 SPA</h6>
                                            <p className="small text-light-gray m-0">
                                                Engineered with decoupled modular JSX component hooks (`useState`, `useEffect`, `useCallback`) and an automated Axios HTTP interceptor to communicate across CORS boundaries.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="p-3 rounded-4" style={{ backgroundColor: '#2a2a2d', border: '1px solid #3f3f44' }}>
                                            <div className="badge bg-primary text-white mb-2">Core Engine</div>
                                            <h6 className="fw-bold text-white mb-2"><i className="bi bi-filetype-java text-warning me-2"></i>Java 17 LTS & Spring Boot 3</h6>
                                            <p className="small text-light-gray m-0">
                                                Adheres to separation-of-concerns layered patterns (Controller → Service → Repository). Leverages Spring Data JPA and Hibernate ORM for relational persistence.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 rounded-4 d-flex align-items-center justify-content-between" style={{ backgroundColor: '#1a1a1c', border: '1px dashed #444' }}>
                                    <div>
                                        <span className="fw-bold d-block text-white mb-1"><i className="bi bi-journal-code text-lime me-2"></i>OpenAPI 3 / Swagger Documentation</span>
                                        <span className="small text-muted">Live testable REST endpoints available in your local dev environment.</span>
                                    </div>
                                    <a href="/swagger-ui.html" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light rounded-pill px-3 py-2 fw-bold">
                                        Launch Swagger <i className="bi bi-box-arrow-up-right ms-1"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="modal-footer border-top-0 pt-0">
                                <button type="button" className="btn btn-pill-dark border px-5 py-2 fw-bold text-white w-100" onClick={() => setShowArchModal(false)}>
                                    Close Specifications
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* INTERACTIVE SECURITY SPECIFICATION MODAL */}
            {showSecModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content rounded-5 border-0 shadow-lg p-4 bg-white text-dark">
                            <div className="modal-header border-bottom pb-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="icon-circle bg-danger text-white"><i className="bi bi-shield-lock-fill fs-4"></i></div>
                                    <div>
                                        <h4 className="modal-title fw-bold mb-0">Enterprise Security Suite</h4>
                                        <span className="small text-muted">Stateless JWT Authorization & Role-Based Access Control</span>
                                    </div>
                                </div>
                                <button type="button" className="btn-close" onClick={() => setShowSecModal(false)}></button>
                            </div>
                            <div className="modal-body py-4">
                                <div className="list-group list-group-flush gap-3">
                                    <div className="list-group-item bg-light p-3 rounded-4 border-0">
                                        <div className="d-flex align-items-center gap-2 fw-bold text-dark mb-1">
                                            <i className="bi bi-key-fill text-danger fs-5"></i>
                                            <span>100% Stateless JSON Web Tokens (JWT)</span>
                                        </div>
                                        <p className="small text-secondary m-0">
                                            HTTP server sessions are disabled in Spring Security in favor of cryptographic 256-bit signed Bearer tokens. Subsequent network interactions are verified in memory via `JwtAuthFilter` without executing blocking database session reads.
                                        </p>
                                    </div>

                                    <div className="list-group-item bg-light p-3 rounded-4 border-0">
                                        <div className="d-flex align-items-center gap-2 fw-bold text-dark mb-1">
                                            <i className="bi bi-people-fill text-primary fs-5"></i>
                                            <span>Granular Role-Based Access Control (RBAC)</span>
                                        </div>
                                        <p className="small text-secondary m-0">
                                            System authorities distinguish between executive administrators (<code>ROLE_ADMIN</code>) who possess complete CRUD modification and deletion capabilities versus standard workforce observers (<code>ROLE_EMPLOYEE</code>) with restricted read-only authorization.
                                        </p>
                                    </div>

                                    <div className="list-group-item bg-light p-3 rounded-4 border-0">
                                        <div className="d-flex align-items-center gap-2 fw-bold text-dark mb-1">
                                            <i className="bi bi-globe-americas text-success fs-5"></i>
                                            <span>Cross-Origin Resource Sharing (CORS) Whitelisting</span>
                                        </div>
                                        <p className="small text-secondary m-0">
                                            Integrated `CorsConfigurationSource` beans authorize preflight HTTP OPTIONS communications between the standalone React 18 frontend domain and the Java 17 backend infrastructure.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-top-0 pt-0">
                                <button type="button" className="btn btn-pill-dark px-5 py-2 fw-bold w-100" onClick={() => setShowSecModal(false)}>
                                    Acknowledge Security Protocol
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
