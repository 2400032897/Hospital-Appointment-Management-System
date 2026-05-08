import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const patientLinks = [
  { to: '/patient/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/patient/book-appointment', icon: '📅', label: 'Book Appointment' },
  { to: '/patient/appointments', icon: '📋', label: 'My Appointments' },
  { to: '/patient/upload-report', icon: '📁', label: 'Medical Reports' },
  { to: '/patient/profile', icon: '👤', label: 'My Profile' },
]

const doctorLinks = [
  { to: '/doctor/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/doctor/appointments', icon: '📋', label: 'Appointments' },
  { to: '/doctor/availability', icon: '🗓️', label: 'Availability' },
  { to: '/doctor/profile', icon: '👤', label: 'My Profile' },
]

const adminLinks = [
  { to: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/admin/doctors', icon: '🩺', label: 'Doctors' },
  { to: '/admin/patients', icon: '👥', label: 'Patients' },
  { to: '/admin/departments', icon: '🏥', label: 'Departments' },
  { to: '/admin/appointments', icon: '📅', label: 'Appointments' },
  { to: '/admin/reports', icon: '📊', label: 'Reports' },
]

export default function Sidebar() {
  const { user, logout, isPatient, isDoctor, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const links = isPatient() ? patientLinks : isDoctor() ? doctorLinks : adminLinks
  const roleLabel = isPatient() ? 'Patient' : isDoctor() ? 'Doctor' : 'Admin'
  const roleColor = isPatient() ? 'var(--primary)' : isDoctor() ? 'var(--secondary)' : 'var(--accent)'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside style={{
      width: collapsed ? '72px' : 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0, top: 0,
      background: 'white',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      transition: 'width 0.3s ease',
      overflowX: 'hidden'
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '1.25rem 1rem' : '1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        minHeight: 'var(--navbar-height)'
      }}>
        <div style={{
          width: 40, height: 40,
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem', flexShrink: 0
        }}>🏥</div>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              MediCare
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Hospital System</div>
          </div>
        )}
      </div>

      {/* User Info */}
      {!collapsed && (
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--gray-50)'
        }}>
          <div style={{
            width: 44, height: 44,
            background: `linear-gradient(135deg, ${roleColor}, ${roleColor}aa)`,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 700, color: 'white',
            marginBottom: '0.5rem'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
            {user?.name}
          </div>
          <div style={{
            fontSize: '0.75rem', color: roleColor,
            fontWeight: 600, background: `${roleColor}15`,
            display: 'inline-block', padding: '2px 8px', borderRadius: 100, marginTop: 4
          }}>
            {roleLabel}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: collapsed ? '0.875rem 1rem' : '0.75rem 1.5rem',
              margin: '0.125rem 0.5rem',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--primary-50)' : 'transparent',
              borderLeft: isActive ? `3px solid var(--primary)` : '3px solid transparent',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap',
              justifyContent: collapsed ? 'center' : 'flex-start'
            })}
          >
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{link.icon}</span>
            {!collapsed && link.label}
          </NavLink>
        ))}
      </nav>

      {/* Collapse + Logout */}
      <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.875rem',
            width: '100%', padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)', border: 'none',
            background: 'transparent', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 500,
            color: 'var(--text-secondary)',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'var(--transition)'
          }}
        >
          <span>{collapsed ? '→' : '←'}</span>
          {!collapsed && 'Collapse'}
        </button>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.875rem',
            width: '100%', padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)', border: 'none',
            background: 'transparent', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 500,
            color: 'var(--danger)',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'var(--transition)'
          }}
        >
          <span>🚪</span>
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  )
}
