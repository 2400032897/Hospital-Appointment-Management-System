import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from '../../api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', gender: '', dateOfBirth: '', bloodGroup: '', address: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const { confirmPassword, ...data } = form
      await authApi.register(data)
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  return (
    <div className="auth-layout">
      {/* Premium Mesh Background */}
      <div className="mesh-bg">
        <div className="mesh-gradient"></div>
        <div className="floating-circle" style={{ width: '400px', height: '400px', top: '-10%', left: '-5%' }}></div>
        <div className="floating-circle" style={{ width: '300px', height: '300px', bottom: '10%', right: '5%', animationDelay: '2s' }}></div>
      </div>

      <div style={{ width: '100%', maxWidth: 560, position: 'relative', zIndex: 1 }} className="scale-in">
        <div className="auth-card">
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #065f46, #10b981)',
            padding: '2rem', textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏥</div>
            <h1 style={{ color: 'white', fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800 }}>
              Patient Registration
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>Create your MediCare account</p>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name *</label>
                <input id="reg-name" type="text" className="form-control" placeholder="John Doe"
                  value={form.name} onChange={set('name')} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email *</label>
                <input id="reg-email" type="email" className="form-control" placeholder="john@email.com"
                  value={form.email} onChange={set('email')} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Password *</label>
                <input id="reg-password" type="password" className="form-control" placeholder="Min 6 characters"
                  value={form.password} onChange={set('password')} required minLength={6} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Confirm Password *</label>
                <input id="reg-confirm" type="password" className="form-control" placeholder="Repeat password"
                  value={form.confirmPassword} onChange={set('confirmPassword')} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone</label>
                <input type="tel" className="form-control" placeholder="+91 9999999999"
                  value={form.phone} onChange={set('phone')} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-control"
                  value={form.dateOfBirth} onChange={set('dateOfBirth')} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Gender</label>
                <select className="form-control" value={form.gender} onChange={set('gender')}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Blood Group</label>
                <select className="form-control" value={form.bloodGroup} onChange={set('bloodGroup')}>
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Address</label>
              <textarea className="form-control" placeholder="Your address..."
                value={form.address} onChange={set('address')} rows={2} />
            </div>

            <button id="reg-submit" type="submit" className="btn btn-success btn-full btn-lg"
              style={{ marginTop: '0.5rem' }} disabled={loading}>
              {loading ? '⏳ Creating Account...' : '✅ Create Account'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
