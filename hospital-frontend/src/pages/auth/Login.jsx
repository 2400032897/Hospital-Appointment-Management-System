import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { FiMail, FiLock, FiUser, FiShield, FiActivity, FiArrowRight } from 'react-icons/fi'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', role: 'PATIENT' })
  const [loading, setLoading] = useState(false)

  const roles = [
    { id: 'PATIENT', label: 'Patient', icon: <FiUser /> },
    { id: 'DOCTOR', label: 'Doctor', icon: <FiActivity /> },
    { id: 'ADMIN', label: 'Admin', icon: <FiShield /> }
  ]

  const activeIndex = roles.findIndex(r => r.id === form.role)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.login(form)
      const { token, role, userId, name, email } = res.data.data
      login({ id: userId, name, email, role }, token)
      toast.success(`Welcome back, ${name}!`)
      if (role === 'PATIENT') navigate('/patient/dashboard')
      else if (role === 'DOCTOR') navigate('/doctor/dashboard')
      else navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout" style={{ background: 'transparent' }}>
      {/* Premium Mesh Background */}
      <div className="mesh-bg">
        <div className="mesh-gradient"></div>
        {/* Floating Glass Circles */}
        <div className="floating-circle" style={{ width: '400px', height: '400px', top: '-10%', left: '-5%', animationDelay: '0s' }}></div>
        <div className="floating-circle" style={{ width: '300px', height: '300px', bottom: '10%', right: '5%', animationDelay: '2s' }}></div>
        <div className="floating-circle" style={{ width: '150px', height: '150px', top: '40%', right: '20%', animationDelay: '4s', opacity: 0.3 }}></div>
      </div>

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }} className="scale-in">
        {/* Futuristic Glass Card */}
        <div className="glass-panel" style={{ borderRadius: '32px', overflow: 'hidden' }}>
          
          {/* Premium Branding Section */}
          <div style={{ padding: '3rem 2rem 1.5rem', textAlign: 'center', position: 'relative' }}>
            {/* Animated Logo Container */}
            <div className="heartbeat-logo" style={{
              width: 90, height: 90,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.8rem', margin: '0 auto 1.5rem',
              color: 'var(--vibrant-cyan)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 30px rgba(34, 211, 238, 0.2)'
            }}>
              <FiActivity />
            </div>
            
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 800, 
              letterSpacing: '-1px', 
              marginBottom: '0.5rem',
              background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0.7))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              MediCare
            </h1>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
              Your Health, Our Priority
            </p>
            
            {/* Animated ECG Line Decoration */}
            <div style={{ width: '120px', height: '2px', margin: '1rem auto 0', opacity: 0.4 }}>
              <svg viewBox="0 0 100 20" style={{ width: '100%', height: '100%' }}>
                <path 
                  className="ecg-line"
                  d="M0 10 L10 10 L15 2 L25 18 L30 10 L100 10" 
                  fill="none" 
                  stroke="var(--vibrant-cyan)" 
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Form Section */}
          <div style={{ padding: '0 2.5rem 3rem' }}>
            
            {/* Segmented Role Tabs */}
            <div className="segmented-control">
              <div 
                className="active-pill" 
                style={{ 
                  width: `calc(33.33% - 4px)`, 
                  left: `calc(${activeIndex * 33.33}% + 2px)` 
                }} 
              />
              {roles.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.id })}
                  className={`segment-btn ${form.role === r.id ? 'active' : ''}`}
                >
                  {r.icon}
                  <span style={{ fontSize: '0.9rem' }}>{r.label}</span>
                </button>
              ))}
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center', opacity: 0.9 }}>
              Sign In
            </h2>

            <form onSubmit={handleSubmit} className="slide-up">
              <div className="floating-group">
                <input
                  id="login-email"
                  type="email"
                  className="premium-input"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
                <FiMail className="input-icon" />
              </div>

              <div className="floating-group" style={{ marginBottom: '1rem' }}>
                <input
                  id="login-password"
                  type="password"
                  className="premium-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <FiLock className="input-icon" />
              </div>

              <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
                <Link to="/forgot-password" style={{
                  fontSize: '0.85rem', color: 'var(--vibrant-cyan)', textDecoration: 'none', fontWeight: 600, opacity: 0.8
                }}>
                  Forgot Password?
                </Link>
              </div>

              <button
                id="login-submit"
                type="submit"
                className="btn btn-premium btn-full btn-lg"
                disabled={loading}
                style={{ height: 60, borderRadius: '18px' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                    Processing...
                  </span>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <FiArrowRight style={{ fontSize: '1.2rem' }} />
                  </>
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                New to MediCare?{' '}
                <Link to="/register" style={{ color: 'var(--vibrant-cyan)', fontWeight: 700, textDecoration: 'none' }}>
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          © 2025 MediCare Global • Secure Access
        </p>
      </div>
    </div>
  )
}
