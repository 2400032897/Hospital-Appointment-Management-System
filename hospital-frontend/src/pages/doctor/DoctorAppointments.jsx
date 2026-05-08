import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
import { appointmentApi } from '../../api'

export default function DoctorAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [prescModal, setPrescModal] = useState(null)
  const [prescription, setPrescription] = useState('')
  const [doctorNotes, setDoctorNotes] = useState('')

  const fetch = () => {
    setLoading(true)
    appointmentApi.getByDoctor(user.id)
      .then(res => setAppointments(res.data.data || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { if (user?.id) fetch() }, [user])

  const updateStatus = async (id, status, extra = {}) => {
    try {
      await appointmentApi.updateStatus(id, { status, ...extra })
      toast.success(`Status updated to ${status}`)
      fetch()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection:')
    if (reason === null) return
    await updateStatus(id, 'REJECTED', { reason })
  }

  const handleComplete = async () => {
    if (!prescModal) return
    await updateStatus(prescModal.id, 'COMPLETED', { prescription, doctorNotes })
    setPrescModal(null); setPrescription(''); setDoctorNotes('')
  }

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter)
  const FILTERS = ['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED', 'CANCELLED']

  const statusBadge = (s) => {
    const m = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected', CANCELLED: 'badge-cancelled', COMPLETED: 'badge-completed' }
    return <span className={`badge ${m[s] || ''}`}>{s}</span>
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Appointments" />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">My Appointments</h1>
          </div>

          {/* Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
                  border: filter === f ? '2px solid var(--secondary)' : '1.5px solid var(--border)',
                  background: filter === f ? 'var(--secondary)' : 'white',
                  color: filter === f ? 'white' : 'var(--text-secondary)',
                  fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer', transition: 'var(--transition)'
                }}>{f}</button>
            ))}
          </div>

          {loading ? <Loader /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filtered.map(a => (
                <div key={a.id} className={`appointment-card ${a.status.toLowerCase()}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontWeight: 700 }}>{a.patientName}</h3>
                        {statusBadge(a.status)}
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span>📅 {a.appointmentDate}</span>
                        <span>🕐 {a.timeSlot}</span>
                        <span>📧 {a.patientEmail}</span>
                        {a.patientPhone && <span>📞 {a.patientPhone}</span>}
                      </div>
                      {a.symptoms && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>📝 {a.symptoms}</p>}
                      {a.prescription && (
                        <div style={{ background: 'var(--primary-50)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                          💊 <strong>Prescription:</strong> {a.prescription}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {a.status === 'PENDING' && (
                        <>
                          <button onClick={() => updateStatus(a.id, 'APPROVED')} className="btn btn-success btn-sm">✅ Approve</button>
                          <button onClick={() => handleReject(a.id)} className="btn btn-danger btn-sm">❌ Reject</button>
                        </>
                      )}
                      {a.status === 'APPROVED' && (
                        <button onClick={() => setPrescModal(a)} className="btn btn-primary btn-sm">✅ Mark Complete</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="empty-state" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-title">No appointments found</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Prescription Modal */}
      {prescModal && (
        <div className="modal-overlay" onClick={() => setPrescModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Complete Appointment — {prescModal.patientName}</h3>
              <button className="modal-close" onClick={() => setPrescModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Prescription</label>
                <textarea className="form-control" rows={4} placeholder="Enter prescription details..."
                  value={prescription} onChange={e => setPrescription(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Doctor's Notes</label>
                <textarea className="form-control" rows={3} placeholder="Follow-up notes, observations..."
                  value={doctorNotes} onChange={e => setDoctorNotes(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setPrescModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={handleComplete}>✅ Mark as Completed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
