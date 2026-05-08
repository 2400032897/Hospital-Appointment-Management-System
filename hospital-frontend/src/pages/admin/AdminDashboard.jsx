import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { adminApi } from '../../api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#7c3aed', '#0891b2']

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getDashboard()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const pieData = stats ? [
    { name: 'Pending', value: stats.pending || 0 },
    { name: 'Approved', value: stats.approved || 0 },
    { name: 'Completed', value: stats.completed || 0 },
    { name: 'Cancelled', value: stats.cancelled || 0 },
    { name: 'Rejected', value: stats.rejected || 0 },
  ].filter(d => d.value > 0) : []

  const barData = stats ? [
    { name: 'Pending', count: stats.pending || 0 },
    { name: 'Approved', count: stats.approved || 0 },
    { name: 'Completed', count: stats.completed || 0 },
    { name: 'Cancelled', count: stats.cancelled || 0 },
  ] : []

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Admin Dashboard" />
        <div className="page-content">
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b, #7c3aed, #2563eb)',
            borderRadius: 'var(--radius-lg)', padding: '2rem',
            color: 'white', marginBottom: '2rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontFamily: 'Outfit', marginBottom: 6 }}>
                Hospital Control Center 🏥
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                Complete overview of hospital operations
              </p>
            </div>
            <div style={{ fontSize: '5rem', opacity: 0.3 }}>📊</div>
          </div>

          {loading ? <Loader /> : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
                {[
                  { label: 'Total Patients', value: stats?.totalPatients || 0, icon: '👥', color: 'blue', to: '/admin/patients' },
                  { label: 'Total Doctors', value: stats?.totalDoctors || 0, icon: '🩺', color: 'teal', to: '/admin/doctors' },
                  { label: 'Departments', value: stats?.totalDepartments || 0, icon: '🏥', color: 'purple', to: '/admin/departments' },
                  { label: "Today's Appointments", value: stats?.today || 0, icon: '📅', color: 'orange', to: '/admin/appointments' },
                ].map(s => (
                  <Link key={s.label} to={s.to} style={{ textDecoration: 'none' }}>
                    <div className="stat-card">
                      <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                      <div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Appointment stats row */}
              <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
                {[
                  { label: 'Total Appointments', value: stats?.total || 0, icon: '📋', color: 'blue' },
                  { label: 'Pending', value: stats?.pending || 0, icon: '⏳', color: 'orange' },
                  { label: 'Completed', value: stats?.completed || 0, icon: '✅', color: 'green' },
                  { label: 'Cancelled', value: stats?.cancelled || 0, icon: '❌', color: 'red' },
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

              {/* Charts */}
              <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
                <div className="card">
                  <div className="card-header"><h3 className="card-title">Appointment Status Overview</h3></div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="var(--primary)" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header"><h3 className="card-title">Status Distribution</h3></div>
                  <div className="card-body">
                    {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="empty-state"><div className="empty-state-icon">📊</div><div className="empty-state-title">No appointment data yet</div></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-3">
                {[
                  { to: '/admin/doctors', icon: '🩺', label: 'Manage Doctors', desc: 'Add, edit, or remove doctors' },
                  { to: '/admin/patients', icon: '👥', label: 'Manage Patients', desc: 'View and manage patient records' },
                  { to: '/admin/reports', icon: '📊', label: 'Generate Reports', desc: 'Hospital performance analytics' },
                ].map(a => (
                  <Link key={a.to} to={a.to} style={{
                    background: 'white', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: '1.5rem',
                    textDecoration: 'none', display: 'flex', gap: '1rem',
                    alignItems: 'center', transition: 'var(--transition)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ fontSize: '2rem' }}>{a.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{a.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
