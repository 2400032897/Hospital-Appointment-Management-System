import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
import { appointmentApi } from '../../api'

export default function AppointmentHistory() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [cancelling, setCancelling] = useState(null)

  const fetchAppointments = () => {
    setLoading(true)
    appointmentApi.getByPatient(user.id)
      .then(res => setAppointments(res.data.data || []))
      .catch(() => toast.error('Failed to load appointments'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { if (user?.id) fetchAppointments() }, [user])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    setCancelling(id)
    try {
      await appointmentApi.cancel(id, user.id)
      toast.success('Appointment cancelled')
      fetchAppointments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel')
    } finally { setCancelling(null) }
  }

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter)

  const statusBadge = (status) => {
    const classes = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected', CANCELLED: 'badge-cancelled', COMPLETED: 'badge-completed' }
    return <span className={`badge ${classes[status] || 'badge-pending'}`}>{status}</span>
  }

  const FILTERS = ['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED', 'REJECTED']

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Appointment History" />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">My Appointments</h1>
            <p className="page-subtitle">Track all your appointment history and status</p>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  border: filter === f ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                  background: filter === f ? 'var(--primary)' : 'white',
                  color: filter === f ? 'white' : 'var(--text-secondary)',
                  fontWeight: 500, fontSize: '0.85rem',
                  cursor: 'pointer', transition: 'var(--transition)'
                }}>
                {f} {f !== 'ALL' && `(${appointments.filter(a => a.status === f).length})`}
              </button>
            ))}
          </div>

          {loading ? <Loader /> : filtered.length === 0 ? (
            <div className="empty-state" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-title">No appointments found</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filtered.map(a => (
                <div key={a.id} className={`appointment-card ${a.status.toLowerCase()}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Dr. {a.doctorName}</h3>
                        {statusBadge(a.status)}
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        {[
                          { icon: '⚕️', val: a.doctorSpecialization },
                          { icon: '🏥', val: a.departmentName || 'N/A' },
                          { icon: '📅', val: a.appointmentDate },
                          { icon: '🕐', val: a.timeSlot },
                        ].map(i => (
                          <span key={i.icon} style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {i.icon} {i.val}
                          </span>
                        ))}
                      </div>
                      {a.symptoms && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                          📝 {a.symptoms}
                        </p>
                      )}
                      {a.prescription && (
                        <div style={{
                          background: 'var(--primary-50)', borderRadius: 'var(--radius-sm)',
                          padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.85rem'
                        }}>
                          💊 <strong>Prescription:</strong> {a.prescription}
                        </div>
                      )}
                      {a.rejectionReason && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--danger)', marginTop: '0.5rem' }}>
                          ❌ Reason: {a.rejectionReason}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['PENDING', 'APPROVED'].includes(a.status) && (
                        <button
                          onClick={() => handleCancel(a.id)}
                          disabled={cancelling === a.id}
                          className="btn btn-danger btn-sm">
                          {cancelling === a.id ? '⏳' : '❌ Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
