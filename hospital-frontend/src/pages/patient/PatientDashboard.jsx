import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
import { appointmentApi } from '../../api'

export default function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      appointmentApi.getByPatient(user.id)
        .then(res => setAppointments(res.data.data || []))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [user])

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => ['PENDING', 'APPROVED'].includes(a.status)).length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
  }

  const recent = appointments.slice(0, 5)

  const statusClass = (status) => {
    const map = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected', CANCELLED: 'badge-cancelled', COMPLETED: 'badge-completed' }
    return map[status] || 'badge-pending'
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Patient Dashboard" />
        <div className="page-content">
          {/* Welcome */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #0891b2 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            color: 'white',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontFamily: 'Outfit', marginBottom: 6 }}>
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                Manage your appointments and health records
              </p>
              <Link to="/patient/book-appointment" className="btn" style={{
                marginTop: '1rem',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(4px)'
              }}>
                📅 Book New Appointment
              </Link>
            </div>
            <div style={{ fontSize: '5rem', opacity: 0.3 }}>🏥</div>
          </div>

          {/* Stats */}
          <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
            {[
              { label: 'Total Appointments', value: stats.total, icon: '📋', color: 'blue' },
              { label: 'Upcoming', value: stats.upcoming, icon: '📅', color: 'teal' },
              { label: 'Completed', value: stats.completed, icon: '✅', color: 'green' },
              { label: 'Cancelled', value: stats.cancelled, icon: '❌', color: 'red' },
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

          {/* Quick Actions */}
          <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
            {[
              { to: '/patient/book-appointment', icon: '📅', label: 'Book Appointment', desc: 'Schedule with a doctor', color: '#2563eb' },
              { to: '/patient/appointments', icon: '📋', label: 'My Appointments', desc: 'View all appointments', color: '#0891b2' },
              { to: '/patient/upload-report', icon: '📁', label: 'Upload Report', desc: 'Add medical documents', color: '#7c3aed' },
            ].map(a => (
              <Link key={a.to} to={a.to} style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'var(--transition)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: 52, height: 52,
                  borderRadius: 'var(--radius)',
                  background: `${a.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0
                }}>{a.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{a.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Appointments */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Appointments</h3>
              <Link to="/patient/appointments" style={{
                fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500
              }}>
                View All →
              </Link>
            </div>
            <div className="card-body p-0">
              {loading ? <Loader /> : recent.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📅</div>
                  <div className="empty-state-title">No appointments yet</div>
                  <Link to="/patient/book-appointment" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Book Your First Appointment
                  </Link>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Doctor</th>
                        <th>Department</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map(a => (
                        <tr key={a.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>Dr. {a.doctorName}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.doctorSpecialization}</div>
                          </td>
                          <td>{a.departmentName || '—'}</td>
                          <td>{a.appointmentDate}</td>
                          <td>{a.timeSlot}</td>
                          <td><span className={`badge ${statusClass(a.status)}`}>{a.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
