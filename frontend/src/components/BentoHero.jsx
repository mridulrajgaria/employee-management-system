import React from 'react';

export default function BentoHero({ onOpenAuth }) {
    return (
        <main className="container-fluid px-1 px-md-2 pb-3">
            <div className="bento-hero-wrapper max-w-1300 mx-auto p-4 p-md-4 shadow-sm">
                
                {/* Top Header Section (Compact, No Scrolling Overhead) */}
                <div className="row align-items-center mb-4 pb-1">
                    <div className="col-lg-7">
                        <h1 className="hero-headline display-5 fw-bold mb-3">
                            Your <span className="highlight-circle">Ultimate</span> Enterprise<br />Workforce Engine
                        </h1>
                        
                        {/* Redesigned Tech Stack as Interactive Architecture Pills */}
                        <div className="d-flex flex-wrap gap-2 pt-1">
                            <span className="tech-badge bg-dark text-lime shadow-sm">
                                <i className="bi bi-filetype-java me-2 fs-6"></i>Java 17 & Spring Boot 3
                            </span>
                            <span className="tech-badge bg-white text-dark shadow-sm border">
                                <i className="bi bi-boxes me-2 text-primary"></i>React 18 Modular UI
                            </span>
                            <span className="tech-badge bg-white text-dark shadow-sm border">
                                <i className="bi bi-shield-lock me-2 text-danger"></i>Stateless JWT & CORS
                            </span>
                            <span className="tech-badge bg-white text-dark shadow-sm border">
                                <i className="bi bi-server me-2 text-success"></i>Zero-Setup H2 / MySQL
                            </span>
                        </div>
                    </div>
                    
                    <div className="col-lg-5 mt-3 mt-lg-0">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="pulse-beacon bg-success"></span>
                            <span className="fw-bold small text-dark text-uppercase letter-spacing-1">Live Executive Demo Engine</span>
                        </div>
                        <p className="small text-secondary fw-medium mb-3">
                            Seamless organizational orchestration, granular role-based permissions, and dynamic JPA relational modeling built for scalable enterprise infrastructure.
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                            <button onClick={onOpenAuth} className="btn btn-pill-dark px-4 py-2 fw-bold small d-flex align-items-center shadow-sm">
                                Launch Portal <i className="bi bi-arrow-up-right-circle ms-2 text-lime fs-5"></i>
                            </button>
                            <a href="/swagger-ui.html" target="_blank" rel="noreferrer" className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold small text-decoration-none d-flex align-items-center">
                                <i className="bi bi-terminal-fill me-2"></i> REST API Specs
                            </a>
                        </div>
                    </div>
                </div>

                {/* Compact Bento Grid Section (Vibrant, Image-Enriched, Fits in 1 Screen) */}
                <div className="row g-3">
                    
                    {/* Bento 1: Active Interactive Workforce Directory */}
                    <div className="col-lg-4 col-md-6">
                        <div className="bento-card bento-white h-100 p-4 d-flex flex-column justify-content-between">
                            <div>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <span className="badge bg-dark text-white px-3 py-2 rounded-pill small fw-bold">Active Workforce</span>
                                    <span className="text-muted small"><i className="bi bi-circle-fill text-success small me-1"></i> Live JPA Sync</span>
                                </div>
                                <div className="search-pill mb-3 d-flex align-items-center text-muted small py-2">
                                    <i className="bi bi-search me-2 text-primary"></i> <span>Filter 4,800+ employees...</span>
                                </div>
                                
                                <div className="mini-emp-list d-flex flex-column gap-3 my-2">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-2">
                                            <img src="https://ui-avatars.com/api/?name=Kristin+Watson&background=2563eb&color=fff&rounded=true&size=36" alt="avatar" className="avatar-sm" />
                                            <div>
                                                <div className="fw-bold small lh-1">Kristin Watson</div>
                                                <span className="text-muted" style={{fontSize: '11px'}}>Cloud Architecture</span>
                                            </div>
                                        </div>
                                        <span className="badge bg-light-green text-success small">Onsite</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-2">
                                            <img src="https://ui-avatars.com/api/?name=Jacob+Jones&background=4f46e5&color=fff&rounded=true&size=36" alt="avatar" className="avatar-sm" />
                                            <div>
                                                <div className="fw-bold small lh-1">Jacob Jones</div>
                                                <span className="text-muted" style={{fontSize: '11px'}}>AI Research Core</span>
                                            </div>
                                        </div>
                                        <span className="badge bg-light-green text-success small">Remote</span>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-2">
                                            <img src="https://ui-avatars.com/api/?name=Devon+Lane&background=0284c7&color=fff&rounded=true&size=36" alt="avatar" className="avatar-sm" />
                                            <div>
                                                <div className="fw-bold small lh-1">Devon Lane</div>
                                                <span className="text-muted" style={{fontSize: '11px'}}>DevOps Operations</span>
                                            </div>
                                        </div>
                                        <span className="badge bg-light text-dark border small">Hybrid</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                                <span className="small text-muted" style={{fontSize: '12px'}}><i className="bi bi-shield-check text-success"></i> 256-bit Token Encrypted</span>
                                <span onClick={onOpenAuth} className="fw-bold text-decoration-none small text-primary cursor-pointer">Explore Grid →</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento 2: 3D Visual Analytics & AI Architecture (Featuring Bespoke Graphic Asset) */}
                    <div className="col-lg-4 col-md-6">
                        <div className="bento-card bento-dark h-100 p-0 overflow-hidden position-relative d-flex flex-column justify-content-end text-white shadow-lg" style={{ minHeight: '280px' }}>
                            {/* Embedded 3D SaaS Graphic Illustration */}
                            <img src="assets/saas_visual.jpg" alt="SaaS Analytics" className="position-absolute w-100 h-100 object-fit-cover" style={{ filter: 'brightness(0.55) contrast(1.15)', zIndex: 0, top: 0, left: 0 }} />
                            
                            <div className="p-4 position-relative z-1 bg-gradient-dark-up w-100">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="badge badge-lime text-uppercase small px-2 py-1" style={{fontSize: '10px', letterSpacing: '1px'}}>Realtime Telemetry</span>
                                    <span className="small text-white opacity-75" style={{fontSize: '12px'}}><i className="bi bi-lightning-fill text-warning"></i> Sub-10ms Latency</span>
                                </div>
                                <h5 className="fw-bold m-0 text-white mb-1">Relational JPA Matrix & Auditing</h5>
                                <p className="text-light-gray m-0" style={{fontSize: '12.5px', lineHeight: '1.4'}}>
                                    Enterprise Spring Boot engine dynamically maps department hierarchy architectures with high-availability transaction guarantees.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bento 3: Vibrant Electric Lime Financial Command */}
                    <div className="col-lg-4 col-md-12">
                        <div className="bento-card bento-lime h-100 p-4 d-flex flex-column justify-content-between shadow-sm">
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="badge bg-dark text-white rounded-pill px-3 py-1 small fw-bold">Q3 Compensation Intelligence</span>
                                    <i className="bi bi-graph-up-arrow fs-4 text-dark"></i>
                                </div>
                                <p className="small text-dark fw-medium mb-2 opacity-75">Automated payroll benchmarking across technical engineering and cloud divisions.</p>
                                
                                {/* High-Contrast Charcoal KPI Box inside Lime Card */}
                                <div className="bg-dark text-white p-3 rounded-4 my-2 shadow">
                                    <div className="d-flex justify-content-between small text-muted mb-1" style={{fontSize: '11px'}}>
                                        <span>AVG TECH COMPENSATION</span>
                                        <span className="text-lime fw-bold">+14.2% vs YoY</span>
                                    </div>
                                    <h2 className="fw-extrabold text-lime mb-1 d-flex align-items-baseline">
                                        $124,500 <span className="fs-6 text-white fw-normal ms-1">/ year</span>
                                    </h2>
                                    <div className="progress mt-2" style={{height: '4px', backgroundColor: '#333336'}}>
                                        <div className="progress-bar bg-lime" role="progressbar" style={{width: '85%'}}></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="d-flex align-items-center justify-content-between mt-3 pt-2 border-top border-dark-subtle cursor-pointer" onClick={onOpenAuth}>
                                <div>
                                    <div className="fw-bold text-dark lh-1 m-0">Manage Payroll Privileges</div>
                                    <span className="small text-dark opacity-75" style={{fontSize: '11px'}}>Requires Admin Authentication</span>
                                </div>
                                <div className="arrow-btn-circle-sm bg-dark text-lime">
                                    <i className="bi bi-arrow-right fs-5"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
