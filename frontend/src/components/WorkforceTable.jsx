import React from 'react';

export default function WorkforceTable({ employees, isAdmin, onEdit, onDelete, onAdd }) {
    if (employees.length === 0) {
        return (
            <div className="p-5 text-center text-muted">
                <div className="icon-circle bg-light mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
                    <i className="bi bi-people fs-2 text-muted"></i>
                </div>
                <h6 className="fw-bold text-dark">No Workforce Records Present</h6>
                <p className="small text-muted mb-3">Start building your enterprise directory by adding new employees or adjusting your filter criteria.</p>
                {isAdmin && (
                    <button className="btn btn-pill-dark px-4" onClick={onAdd}>+ Onboard First Employee</button>
                )}
            </div>
        );
    }

    const statuses = [
        { label: 'Onsite Active', color: '#10b981' },
        { label: 'Remote Sync', color: '#3b82f6' },
        { label: 'Hybrid Flex', color: '#8b5cf6' }
    ];

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
                <thead className="bg-light border-bottom">
                    <tr>
                        <th className="py-3 px-4 text-secondary small fw-bold">EMPLOYEE & ID</th>
                        <th className="py-3 text-secondary small fw-bold">DESIGNATION</th>
                        <th className="py-3 text-secondary small fw-bold">DEPARTMENT</th>
                        <th className="py-3 text-secondary small fw-bold">CONTACT CHANNELS</th>
                        <th className="py-3 text-secondary small fw-bold">STATUS & JOIN DATE</th>
                        <th className="py-3 text-secondary small fw-bold">SALARY</th>
                        {isAdmin && <th className="py-3 px-4 text-end text-secondary small fw-bold">ACTIONS</th>}
                    </tr>
                </thead>
                <tbody className="border-top-0">
                    {employees.map((emp, idx) => {
                        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random&color=fff&rounded=true&size=44`;
                        const st = statuses[idx % statuses.length];

                        return (
                            <tr key={emp.id}>
                                <td className="px-4 py-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <img src={avatarUrl} alt={emp.name} className="rounded-circle shadow-sm border border-2 border-white" width="44" height="44" />
                                        <div>
                                            <span className="d-block fw-bold text-dark fs-6">{emp.name}</span>
                                            <span className="badge bg-light text-secondary border font-monospace mt-1" style={{ fontSize: '10px' }}>ID: #EMS-{1000 + emp.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="fw-semibold text-dark d-block">{emp.designation}</span>
                                    <span className="small text-muted">Full-Time Staff</span>
                                </td>
                                <td>
                                    <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-semibold">
                                        <i className="bi bi-folder-fill me-1 text-primary"></i> {emp.departmentName || 'General Operation'}
                                    </span>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 mb-1"><i className="bi bi-envelope-check-fill text-muted"></i> <span className="small fw-medium text-dark">{emp.email}</span></div>
                                    <div className="d-flex align-items-center gap-2"><i className="bi bi-telephone-fill text-muted"></i> <span className="small text-muted font-monospace">{emp.phone}</span></div>
                                </td>
                                <td>
                                    <div className="mb-1"><span className="status-dot" style={{ backgroundColor: st.color }}></span><span className="small fw-bold text-dark">{st.label}</span></div>
                                    <span className="small text-muted"><i className="bi bi-calendar3 me-1"></i> {emp.joiningDate}</span>
                                </td>
                                <td>
                                    <span className="fw-bold text-dark fs-6 d-block">${Number(emp.salary).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    <span className="badge bg-success-subtle text-success font-monospace" style={{ fontSize: '10px' }}>Verified USD</span>
                                </td>
                                {isAdmin && (
                                    <td className="px-4 py-3 text-end">
                                        <div className="btn-group shadow-sm rounded-pill" role="group">
                                            <button className="btn btn-sm btn-outline-dark px-3 fw-semibold" onClick={() => onEdit(emp)} title="Edit Employee">
                                                <i className="bi bi-pencil-square me-1"></i> Edit
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger px-3 fw-semibold" onClick={() => onDelete(emp.id)} title="Delete Record">
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
