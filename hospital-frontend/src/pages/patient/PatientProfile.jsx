import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
import { patientApi } from '../../api'

export default function PatientProfile() {
  const { user, login, token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirm: '' })
  const [changingPw, setChangingPw] = useState(false)

  useEffect(() => {
    patientApi.getById(user.id)
      .then(res => setProfile(res.data.data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await patientApi.update(user.id, profile)
      setProfile(res.data.data)
      // Update stored user name
      login({ ...user, name: res.data.data.name }, token)
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update profile') }
    finally { setSaving(false) }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) {
      toast.error('New passwords do not match')
      return
    }
    setChangingPw(true)
    try {
      await patientApi.changePassword(user.id, { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword })
      toast.success('Password changed successfully!')
      setPwForm({ oldPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally { setChangingPw(false) }
  }

  if (loading) return <div className="app-layout"><Sidebar /><div className="main-content"><Loader /></div></div>

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="My Profile" />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Profile Settings</h1>
            <p className="page-subtitle">Manage your personal information</p>
          </div>

          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            {/* Profile card */}
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-header">
                  <h3 className="card-title">Personal Information</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSave}>
                    {/* Avatar */}
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <div style={{
                        width: 80, height: 80, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', fontWeight: 700, color: 'white', margin: '0 auto'
                      }}>
                        {profile?.name?.charAt(0)}
                      </div>
                      <h2 style={{ marginTop: '0.75rem', fontSize: '1.1rem' }}>{profile?.name}</h2>
                      <span className="badge badge-approved" style={{ marginTop: 4 }}>Patient</span>
                    </div>

                    {[
                      { key: 'name', label: 'Full Name', type: 'text' },
                      { key: 'phone', label: 'Phone', type: 'tel' },
                      { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
                    ].map(f => (
                      <div className="form-group" key={f.key}>
                        <label className="form-label">{f.label}</label>
                        <input type={f.type} className="form-control"
                          value={profile?.[f.key] || ''}
                          onChange={e => setProfile({ ...profile, [f.key]: e.target.value })} />
                      </div>
                    ))}

                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select className="form-control" value={profile?.gender || ''}
                        onChange={e => setProfile({ ...profile, gender: e.target.value })}>
                        <option value="">Select</option>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Blood Group</label>
                      <select className="form-control" value={profile?.bloodGroup || ''}
                        onChange={e => setProfile({ ...profile, bloodGroup: e.target.value })}>
                        <option value="">Select</option>
                        {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <textarea className="form-control" rows={3}
                        value={profile?.address || ''}
                        onChange={e => setProfile({ ...profile, address: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email (read-only)</label>
                      <input type="email" className="form-control" value={profile?.email || ''} readOnly
                        style={{ background: 'var(--gray-50)', cursor: 'not-allowed' }} />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                      {saving ? '⏳ Saving...' : '💾 Save Changes'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Password card */}
            <div>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Change Password</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handlePasswordChange}>
                    {[
                      { key: 'oldPassword', label: 'Current Password' },
                      { key: 'newPassword', label: 'New Password' },
                      { key: 'confirm', label: 'Confirm New Password' },
                    ].map(f => (
                      <div className="form-group" key={f.key}>
                        <label className="form-label">{f.label}</label>
                        <input type="password" className="form-control"
                          value={pwForm[f.key]}
                          onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })}
                          required minLength={f.key !== 'oldPassword' ? 6 : 1} />
                      </div>
                    ))}
                    <button type="submit" className="btn btn-warning btn-full" disabled={changingPw}>
                      {changingPw ? '⏳ Changing...' : '🔑 Change Password'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
