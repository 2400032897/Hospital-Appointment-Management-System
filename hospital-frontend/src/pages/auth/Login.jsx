import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', role: 'PATIENT' })
  const [loading, setLoading] = useState(false)

  const roles = [
    { id: 'PATIENT', label: 'Patient' },
    { id: 'DOCTOR', label: 'Doctor' },
    { id: 'ADMIN', label: 'Admin' }
  ]

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
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <h1 id="login-title">MediCare Login</h1>

        <form onSubmit={handleSubmit}>
          <fieldset className="login-roles">
            <legend>Login as</legend>
            <div className="login-role-options">
              {roles.map(role => (
                <button
                  key={role.id}
                  type="button"
                  className={`login-role${form.role === role.id ? ' selected' : ''}`}
                  aria-pressed={form.role === role.id}
                  onClick={() => setForm({ ...form, role: role.id })}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="login-forgot">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button id="login-submit" className="login-submit" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="login-register">
          New to MediCare? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  )
}
