import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { adminApi, appointmentApi } from '../../api'

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    adminApi.getAppointments()
      .then(res => setAppointments(res.data.data || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await appointmentApi.updateStatus(id, { status })
      toast.success('Status updated')
      const res = await adminApi.getAppointments()
      setAppointments(res.data.data || [])
    } catch { toast.error('Failed') }
  }

  const filtered = appointments.filter(a => {
    const matchStatus = filter === 'ALL' || a.status === filter
    const matchSearch = !search || a.patientName?.toLowerCase().includes(search.toLowerCase()) || a.doctorName?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const statusBadge = (s) => {
    const m = { PENDING:'badge-pending', APPROVED:'badge-approved', REJECTED:'badge-rejected', CANCELLED:'badge-cancelled', COMPLETED:'badge-completed' }
    return <span className={`badge ${m[s]||''}`}>{s}</span>
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Manage Appointments" />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">All Appointments</h1>
            <p className="page-subtitle">{appointments.length} total appointments</p>
          </div>

          <div className="flex justify-between items-center mb-4" style={{ flexWrap:'wrap', gap:'1rem' }}>
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
              {['ALL','PENDING','APPROVED','COMPLETED','CANCELLED','REJECTED'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{
                    padding:'0.4rem 0.875rem', borderRadius:'var(--radius-full)',
                    border: filter===f ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                    background: filter===f ? 'var(--accent)' : 'white',
                    color: filter===f ? 'white' : 'var(--text-secondary)',
                    fontWeight:500, fontSize:'0.8rem', cursor:'pointer', transition:'var(--transition)'
                  }}>{f}</button>
              ))}
            </div>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:'0.875rem', top:'50%', transform:'translateY(-50%)' }}>🔍</span>
              <input className="form-control" style={{ paddingLeft:'2.5rem', width:260 }}
                placeholder="Search patient/doctor..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? <Loader /> : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Patient</th><th>Doctor</th><th>Department</th>
                    <th>Date</th><th>Time</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <tr key={a.id}>
                      <td style={{ color:'var(--text-muted)' }}>{i+1}</td>
                      <td><div style={{ fontWeight:600 }}>{a.patientName}</div><div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{a.patientEmail}</div></td>
                      <td><div style={{ fontWeight:600 }}>Dr. {a.doctorName}</div><div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{a.doctorSpecialization}</div></td>
                      <td>{a.departmentName || '—'}</td>
                      <td>{a.appointmentDate}</td>
                      <td>{a.timeSlot}</td>
                      <td>{statusBadge(a.status)}</td>
                      <td>
                        <select className="form-control" style={{ fontSize:'0.8rem', padding:'0.375rem', width:130 }}
                          value={a.status} onChange={e => updateStatus(a.id, e.target.value)}>
                          {['PENDING','APPROVED','REJECTED','CANCELLED','COMPLETED'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="empty-state"><div className="empty-state-icon">📅</div><div className="empty-state-title">No appointments found</div></div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
