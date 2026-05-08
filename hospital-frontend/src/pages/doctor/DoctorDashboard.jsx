import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
import { appointmentApi } from '../../api'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      appointmentApi.getByDoctor(user.id)
        .then(res => setAppointments(res.data.data || []))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [user])

  const today = new Date().toISOString().split('T')[0]
  const stats = {
    total: appointments.length,
    today: appointments.filter(a => a.appointmentDate === today).length,
    pending: appointments.filter(a => a.status === 'PENDING').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
  }

  const todayAppts = appointments.filter(a => a.appointmentDate === today && a.status === 'APPROVED')
  const pending = appointments.filter(a => a.status === 'PENDING').slice(0, 5)

  const handleApprove = async (id) => {
    try {
      await appointmentApi.updateStatus(id, { status: 'APPROVED' })
      toast.success('Appointment approved!')
      const res = await appointmentApi.getByDoctor(user.id)
      setAppointments(res.data.data || [])
    } catch { toast.error('Failed to approve') }
  }

  const handleReject = async (id) => {
    const reason = window.prompt('Rejection reason:')
    if (!reason) return
    try {
      await appointmentApi.updateStatus(id, { status: 'REJECTED', reason })
      toast.success('Appointment rejected')
      const res = await appointmentApi.getByDoctor(user.id)
      setAppointments(res.data.data || [])
    } catch { toast.error('Failed to reject') }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Doctor Dashboard" />
        <div className="page-content">
          {/* Welcome banner */}
          <div style={{
            background: 'linear-gradient(135deg, #065f46, #10b981, #0891b2)',
            borderRadius: 'var(--radius-lg)', padding: '2rem',
            color: 'white', marginBottom: '2rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontFamily: 'Outfit', marginBottom: 6 }}>
                Good day, Dr. {user?.name?.split(' ')[0]}! 🩺
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                You have <strong>{stats.today}</strong> appointments today and <strong>{stats.pending}</strong> pending approval
              </p>
            </div>
            <div style={{ fontSize: '5rem', opacity: 0.3 }}>🩺</div>
          </div>

          {/* Stats */}
          <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
            {[
              { label: 'Total Appointments', value: stats.total, icon: '📋', color: 'blue' },
              { label: "Today's Appointments", value: stats.today, icon: '📅', color: 'teal' },
              { label: 'Pending Approval', value: stats.pending, icon: '⏳', color: 'orange' },
              { label: 'Completed', value: stats.completed, icon: '✅', color: 'green' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                <div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            {/* Today's Schedule */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📅 Today's Schedule</h3>
              </div>
              <div className="card-body p-0">
                {loading ? <Loader /> : todayAppts.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">☀️</div>
                    <div className="empty-state-title">No approved appointments today</div>
                  </div>
                ) : todayAppts.map(a => (
                  <div key={a.id} style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{a.patientName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.timeSlot} • {a.symptoms || 'General checkup'}</div>
                    </div>
                    <button className="btn btn-primary btn-sm"
                      onClick={() => appointmentApi.updateStatus(a.id, { status: 'COMPLETED' }).then(() => toast.success('Marked complete!'))}>
                      ✅ Done
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">⏳ Pending Approvals</h3>
              </div>
              <div className="card-body p-0">
                {loading ? <Loader /> : pending.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">✅</div>
                    <div className="empty-state-title">All caught up!</div>
                  </div>
                ) : pending.map(a => (
                  <div key={a.id} style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{a.patientName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          📅 {a.appointmentDate} at {a.timeSlot}
                        </div>
                        {a.symptoms && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>📝 {a.symptoms}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleApprove(a.id)} className="btn btn-success btn-sm">✅</button>
                        <button onClick={() => handleReject(a.id)} className="btn btn-danger btn-sm">❌</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
