import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  FiHome, FiCalendar, FiFileText, FiUser, FiActivity, 
  FiUsers, FiLayers, FiBarChart2, FiLogOut, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi'

const patientLinks = [
  { to: '/patient/dashboard', icon: <FiHome />, label: 'Dashboard' },
  { to: '/patient/book-appointment', icon: <FiCalendar />, label: 'Book Appointment' },
  { to: '/patient/appointments', icon: <FiFileText />, label: 'My Appointments' },
  { to: '/patient/upload-report', icon: <FiActivity />, label: 'Medical Reports' },
  { to: '/patient/profile', icon: <FiUser />, label: 'My Profile' },
]

const doctorLinks = [
  { to: '/doctor/dashboard', icon: <FiHome />, label: 'Dashboard' },
  { to: '/doctor/appointments', icon: <FiCalendar />, label: 'Appointments' },
  { to: '/doctor/availability', icon: <FiLayers />, label: 'Availability' },
  { to: '/doctor/profile', icon: <FiUser />, label: 'My Profile' },
]

const adminLinks = [
  { to: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
  { to: '/admin/doctors', icon: <FiActivity />, label: 'Doctors' },
  { to: '/admin/patients', icon: <FiUsers />, label: 'Patients' },
  { to: '/admin/departments', icon: <FiLayers />, label: 'Departments' },
  { to: '/admin/appointments', icon: <FiCalendar />, label: 'Appointments' },
  { to: '/admin/reports', icon: <FiBarChart2 />, label: 'Reports' },
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
      width: collapsed ? '80px' : 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0, top: 0,
      background: 'white',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflowX: 'hidden',
      boxShadow: '4px 0 20px rgba(0,0,0,0.02)'
    }}>
      {/* Logo */}
      <div style={{
        padding: '0 1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        minHeight: 'var(--navbar-height)',
        background: 'white'
      }}>
        <div style={{
          width: 40, height: 40,
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem', color: 'white', flexShrink: 0,
          boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
        }}>🏥</div>
        {!collapsed && (
          <div className="fade-in">
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              MediCare
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Center
            </div>
          </div>
        )}
      </div>

      {/* User Info */}
      {!collapsed && (
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(to bottom, var(--gray-50), white)'
        }} className="fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 44, height: 44,
              background: `linear-gradient(135deg, ${roleColor}, ${roleColor}aa)`,
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 700, color: 'white',
              boxShadow: `0 4px 12px ${roleColor}33`
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{
                fontSize: '0.7rem', color: roleColor,
                fontWeight: 700, background: `${roleColor}15`,
                display: 'inline-block', padding: '1px 8px', borderRadius: 100, marginTop: 2
              }}>
                {roleLabel}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: collapsed ? '0.875rem' : '0.875rem 1.5rem',
              margin: '0.25rem 0.75rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              background: isActive ? 'var(--primary-50)' : 'transparent',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              justifyContent: collapsed ? 'center' : 'flex-start'
            })}
          >
            <span style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center' }}>{link.icon}</span>
            {!collapsed && <span className="fade-in">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border)', background: 'var(--gray-50)' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.875rem',
            width: '100%', padding: '0.75rem 1rem',
            borderRadius: '12px', border: 'none',
            background: 'white', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 600,
            color: 'var(--text-secondary)',
            justifyContent: collapsed ? 'center' : 'flex-start',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            marginBottom: '0.5rem'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>{collapsed ? <FiChevronRight /> : <FiChevronLeft />}</span>
          {!collapsed && 'Collapse'}
        </button>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.875rem',
            width: '100%', padding: '0.75rem 1rem',
            borderRadius: '12px', border: 'none',
            background: 'rgba(239, 68, 68, 0.05)', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 600,
            color: 'var(--danger)',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'var(--transition)'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}><FiLogOut /></span>
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  )
}
