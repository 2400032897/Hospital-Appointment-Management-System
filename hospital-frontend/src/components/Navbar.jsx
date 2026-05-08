import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { notificationApi } from '../api'

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
      background: 'white',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      zIndex: 99,
      boxShadow: 'var(--shadow-sm)',
      transition: 'left 0.3s ease'
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        fontFamily: 'Outfit, sans-serif'
      }}>
        {title}
      </h2>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            id="notif-btn"
            onClick={toggleNotif}
            style={{
              background: showNotif ? 'var(--primary-50)' : 'var(--gray-50)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.1rem', position: 'relative',
              transition: 'var(--transition)'
            }}
          >
            🔔
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                background: 'var(--danger)', color: 'white',
                borderRadius: '50%', width: 18, height: 18,
                fontSize: '0.65rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{unread > 9 ? '9+' : unread}</span>
            )}
          </button>

          {showNotif && (
            <div style={{
              position: 'absolute', right: 0, top: '100%',
              marginTop: '0.5rem',
              background: 'white', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              width: 340, maxHeight: 400, overflowY: 'auto',
              zIndex: 200, animation: 'slideUp 0.2s ease'
            }}>
              <div style={{
                padding: '0.875rem 1rem',
                borderBottom: '1px solid var(--border)',
                fontWeight: 600, fontSize: '0.875rem'
              }}>
                Notifications
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No notifications
                </div>
              ) : notifications.slice(0, 10).map(n => (
                <div key={n.id} style={{
                  padding: '0.875rem 1rem',
                  borderBottom: '1px solid var(--border)',
                  background: n.isRead ? 'white' : 'var(--primary-50)',
                  cursor: 'default'
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: 3 }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--gray-50)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-full)',
          padding: '0.375rem 0.875rem',
          cursor: 'default'
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: `linear-gradient(135deg, ${roleColor}, ${roleColor}99)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, color: 'white'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            {user?.name?.split(' ')[0]}
          </span>
        </div>
      </div>
    </header>
  )
}
