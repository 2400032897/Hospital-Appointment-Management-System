import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { notificationApi } from '../api'
import { FiBell, FiChevronDown, FiUser, FiActivity } from 'react-icons/fi'

export default function Navbar({ title }) {
  const { user, logout, isPatient, isDoctor, isAdmin } = useAuth()
  const [unread, setUnread] = useState(0)
  const [showNotif, setShowNotif] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (user?.email) fetchUnread()
  }, [user])

  const fetchUnread = async () => {
    try {
      const res = await notificationApi.getUnreadCount(user.email)
      setUnread(res.data.data || 0)
    } catch {}
  }

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getAll(user.email)
      setNotifications(res.data.data || [])
      await notificationApi.markAllAsRead(user.email)
      setUnread(0)
    } catch {}
  }

  const toggleNotif = () => {
    if (!showNotif) fetchNotifications()
    setShowNotif(!showNotif)
  }

  const roleColor = isPatient() ? 'var(--primary)' : isDoctor() ? 'var(--secondary)' : 'var(--accent)'

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 'var(--sidebar-width)', right: 0,
      height: 'var(--navbar-height)',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2.5rem',
      zIndex: 99,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <h2 style={{
        fontSize: '1.4rem',
        fontWeight: 800,
        color: 'var(--text-primary)',
        fontFamily: 'Outfit, sans-serif',
        letterSpacing: '-0.5px'
      }}>
        {title}
      </h2>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            id="notif-btn"
            onClick={toggleNotif}
            style={{
              background: showNotif ? 'var(--primary-50)' : 'white',
              border: '1.5px solid var(--border)',
              borderRadius: '12px',
              width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.2rem', position: 'relative',
              transition: 'all 0.2s ease',
              color: showNotif ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            <FiBell />
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--danger)', color: 'white',
                borderRadius: '50%', width: 20, height: 20,
                fontSize: '0.7rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)',
                border: '2px solid white'
              }}>{unread > 9 ? '9+' : unread}</span>
            )}
          </button>

          {showNotif && (
            <div className="fade-in" style={{
              position: 'absolute', right: 0, top: '100%',
              marginTop: '0.75rem',
              background: 'white', border: '1px solid var(--border)',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              width: 360, maxHeight: 480, overflowY: 'auto',
              zIndex: 200
            }}>
              <div style={{
                padding: '1.25rem',
                borderBottom: '1px solid var(--border)',
                fontWeight: 700, fontSize: '0.95rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span>Notifications</span>
                <span style={{ fontSize: '0.75rem', background: 'var(--primary-50)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 100 }}>{notifications.length} Total</span>
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>All Caught Up!</div>
                    <p style={{ fontSize: '0.8rem' }}>No new notifications found.</p>
                  </div>
                ) : notifications.slice(0, 10).map(n => (
                  <div key={n.id} style={{
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid var(--border)',
                    background: n.isRead ? 'white' : 'rgba(37, 99, 235, 0.03)',
                    transition: 'var(--transition)',
                    cursor: 'pointer'
                  }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.isRead ? 'transparent' : 'var(--primary)', marginTop: 6, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 2 }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 8, fontWeight: 500 }}>
                          {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                <Link to="/notifications" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>View All Activity</Link>
              </div>
            </div>
          )}
        </div>

        {/* User chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: 'white',
          border: '1.5px solid var(--border)',
          borderRadius: '12px',
          padding: '0.375rem 0.5rem 0.375rem 0.375rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '10px',
            background: `linear-gradient(135deg, ${roleColor}, ${roleColor}99)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 800, color: 'white',
            boxShadow: `0 2px 8px ${roleColor}33`
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {user?.name?.split(' ')[0]}
          </span>
          <FiChevronDown style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }} />
        </div>
      </div>
    </header>
  )
}
