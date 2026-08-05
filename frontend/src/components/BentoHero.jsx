import React from 'react';

export default function BentoHero({ onOpenAuth }) {
    return (
        <main className="container-fluid px-3 px-md-5 pb-5">
            <div className="bento-hero-wrapper max-w-1300 mx-auto p-4 p-md-5">
                <div className="row align-items-center mb-5 pb-2">
                    <div className="col-lg-8">
                        <h1 className="hero-headline display-4 fw-bold">
                            Your <span className="highlight-circle">Ultimate</span> Employee<br />Management Solution
                        </h1>
                    </div>
                    <div className="col-lg-4 mt-4 mt-lg-0">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="icon-circle"><i className="bi bi-people-fill"></i></div>
                            <div className="icon-circle"><i className="bi bi-diagram-3-fill"></i></div>
                            <div className="icon-circle bg-lime text-dark"><i className="bi bi-shield-lock-fill"></i></div>
                        </div>
                        <p className="hero-subtext mb-0 text-secondary fw-medium">
                            All essential workforce organization, department orchestration, and payroll reporting in one robust React 18 + Spring Boot unified platform.
                        </p>
                    </div>
                </div>

                {/* Bento Grid Section */}
                <div className="row g-4">
                    {/* Bento 1: Live Directory Preview */}
                    <div className="col-lg-4 col-md-6">
                        <div className="bento-card bento-white h-100 p-4 d-flex flex-column justify-content-between">
                            <div>
                                <div className="search-pill mb-4 d-flex align-items-center text-muted">
                                    <i className="bi bi-search me-2"></i> <span>Search Workforce...</span>
                                </div>
                                <h6 className="fw-bold text-dark mb-3">Engineers On Active Projects</h6>
                                <div className="mini-emp-list d-flex flex-column gap-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-2">
                                            <img src="https://ui-avatars.com/api/?name=Kristin+Watson&background=2563eb&color=fff&rounded=true&size=36" alt="avatar" className="avatar-sm" />
                                            <span className="fw-medium">Kristin Watson</span>
                                        </div>
                                        <span className="badge bg-light-green text-success">Active</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-2">
                                            <img src="https://ui-avatars.com/api/?name=Jacob+Jones&background=4f46e5&color=fff&rounded=true&size=36" alt="avatar" className="avatar-sm" />
                                            <span className="fw-medium">Jacob Jones</span>
                                        </div>
                                        <span className="badge bg-light-green text-success">Onsite</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-2">
                                            <img src="https://ui-avatars.com/api/?name=Ronald+Richards&background=0284c7&color=fff&rounded=true&size=36" alt="avatar" className="avatar-sm" />
                                            <span className="fw-medium">Ronald Richards</span>
                                        </div>
                                        <span className="badge bg-light-green text-success">Remote</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                                <span className="small text-muted"><i className="bi bi-shield-check text-success"></i> JWT Encrypted</span>
                                <span onClick={onOpenAuth} className="fw-bold text-decoration-none small text-primary cursor-pointer">View Full Grid →</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento 2: Payroll Receipt Card (Dark Theme) */}
                    <div className="col-lg-4 col-md-6">
                        <div className="bento-card bento-dark h-100 p-4 d-flex flex-column justify-content-between">
                            <div>
                                <div className="receipt-header text-center pb-3 border-bottom border-secondary mb-3">
                                    <span className="receipt-title fw-bold letter-spacing-1 text-uppercase">PAYROLL & COMP</span>
                                    <div className="d-flex justify-content-between small text-secondary mt-2">
                                        <span>Dept: Engineering</span>
                                        <span>Q3 Compensation</span>
                                    </div>
                                </div>
                                <div className="receipt-items d-flex flex-column gap-3 mb-4">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-light-gray">Senior Cloud Architect</span>
                                        <span className="fw-bold text-white">$125,000</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-light-gray">Full Stack Developer</span>
                                        <span className="fw-bold text-white">$95,500</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-light-gray">Product UI Specialist</span>
                                        <span className="fw-bold text-white">$82,000</span>
                                    </div>
                                </div>
                            </div>
                            <div className="receipt-footer pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
                                <span className="fw-bold text-white fs-5">Avg Compensation</span>
                                <span className="badge badge-lime fs-6">$100,833</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento 3: Architecture & Action */}
                    <div className="col-lg-4 col-md-12">
                        <div className="row g-4 h-100">
                            <div className="col-lg-12 col-md-6">
                                <div className="bento-card bento-white p-4 h-100 d-flex flex-column justify-content-between">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <h6 className="fw-bold m-0">Departmental Units</h6>
                                        <span className="badge bg-dark text-white">Spring JPA</span>
                                    </div>
                                    <p className="small text-muted mb-3">Organize teams into isolated database relationships with relational auditing.</p>
                                    <div className="d-flex flex-wrap gap-2">
                                        <span className="badge-pill-light"><i className="bi bi-cloud text-primary"></i> Cloud Infra</span>
                                        <span className="badge-pill-light"><i className="bi bi-cpu text-warning"></i> AI Core</span>
                                        <span className="badge-pill-light"><i className="bi bi-graph-up text-success"></i> Sales Ops</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-6">
                                <div className="bento-card bento-lime p-4 h-100 d-flex align-items-center justify-content-between cursor-pointer" onClick={onOpenAuth}>
                                    <div>
                                        <span className="badge bg-dark text-lime mb-2">Instant Demo</span>
                                        <h5 className="fw-bold text-dark m-0">Try seamless operational control</h5>
                                    </div>
                                    <div className="arrow-btn-circle">
                                        <i className="bi bi-arrow-right fs-4"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5 pt-4 border-top d-flex flex-wrap align-items-center justify-content-between text-muted small">
                    <span><i className="bi bi-check-circle-fill text-dark me-1"></i> Java 17 LTS + Spring Boot 3</span>
                    <span><i className="bi bi-check-circle-fill text-dark me-1"></i> React 18 (Vite) Modular UI</span>
                    <span><i className="bi bi-check-circle-fill text-dark me-1"></i> Stateless JWT & CORS Security</span>
                    <span><i className="bi bi-check-circle-fill text-dark me-1"></i> Zero-Setup H2 & MySQL Persistence</span>
                </div>
            </div>
        </main>
    );
}
