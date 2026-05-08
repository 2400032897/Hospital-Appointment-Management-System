import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { adminApi } from '../../api'

export default function ManagePatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const fetch = () => {
    setLoading(true)
    adminApi.getPatients()
      .then(res => setPatients(res.data.data || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const handleToggle = async (id) => {
    try { await adminApi.togglePatient(id); toast.success('Status updated'); fetch() }
    catch { toast.error('Failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete patient? This cannot be undone.')) return
    try { await adminApi.deletePatient(id); toast.success('Patient deleted'); fetch() }
    catch { toast.error('Failed to delete') }
  }

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Manage Patients" />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Manage Patients</h1>
            <p className="page-subtitle">{patients.length} patients registered</p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div style={{ position: 'relative' }}>
              <span style={{ position:'absolute', left:'0.875rem', top:'50%', transform:'translateY(-50%)' }}>🔍</span>
              <input className="form-control" style={{ paddingLeft:'2.5rem', width:300 }}
                placeholder="Search by name or email..." value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }} />
            </div>
            <span style={{ fontSize:'0.875rem', color:'var(--text-muted)' }}>
              Showing {paginated.length} of {filtered.length}
            </span>
          </div>

          {loading ? <Loader /> : (
            <>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th><th>Name</th><th>Email</th><th>Phone</th>
                      <th>Blood Group</th><th>Status</th><th>Registered</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((p, i) => (
                      <tr key={p.id}>
                        <td style={{ color:'var(--text-muted)' }}>{(page-1)*PER_PAGE + i + 1}</td>
                        <td><div style={{ fontWeight:600 }}>{p.name}</div></td>
                        <td style={{ color:'var(--text-muted)' }}>{p.email}</td>
                        <td>{p.phone || '—'}</td>
                        <td>{p.bloodGroup || '—'}</td>
                        <td>
                          <span className={`badge ${p.active ? 'badge-approved' : 'badge-cancelled'}`}>
                            {p.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td>
                          <div style={{ display:'flex', gap:'0.5rem' }}>
                            <button onClick={() => handleToggle(p.id)}
                              className={`btn btn-sm ${p.active ? 'btn-warning' : 'btn-success'}`}>
                              {p.active ? 'Block' : 'Unblock'}
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {paginated.length === 0 && (
                  <div className="empty-state"><div className="empty-state-icon">👥</div><div className="empty-state-title">No patients found</div></div>
                )}
              </div>

              {totalPages > 1 && (
                <div style={{ display:'flex', justifyContent:'center', gap:'0.5rem', marginTop:'1.5rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}>← Prev</button>
                  {Array.from({length:totalPages},(_, i) => i+1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-secondary'}`}>{p}</button>
                  ))}
                  <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
