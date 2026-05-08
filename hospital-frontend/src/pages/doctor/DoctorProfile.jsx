import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
import { doctorApi, departmentApi } from '../../api'

export default function DoctorProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([doctorApi.getById(user.id), departmentApi.getAll()])
      .then(([dRes, depRes]) => {
        setProfile(dRes.data.data)
        setDepartments(depRes.data.data || [])
      })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await doctorApi.update(user.id, profile)
      setProfile(res.data.data)
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update') }
    finally { setSaving(false) }
  }

  const set = (key) => (e) => setProfile({ ...profile, [key]: e.target.value })

  if (loading) return <div className="app-layout"><Sidebar /><div className="main-content"><Navbar title="Profile" /><Loader /></div></div>

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Doctor Profile" />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">My Profile</h1>
          </div>
          <div style={{ maxWidth: 700 }}>
            <div className="card">
              <div className="card-body">
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', color: 'white', margin: '0 auto'
                  }}>{profile?.name?.charAt(0)}</div>
                  <h2 style={{ marginTop: '0.75rem' }}>Dr. {profile?.name}</h2>
                  <span className="badge badge-approved" style={{ marginTop: 4 }}>Doctor</span>
                </div>
                <form onSubmit={handleSave}>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input type="text" className="form-control" value={profile?.name || ''} onChange={set('name')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input type="tel" className="form-control" value={profile?.phone || ''} onChange={set('phone')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Specialization</label>
                      <input type="text" className="form-control" value={profile?.specialization || ''} onChange={set('specialization')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Qualification</label>
                      <input type="text" className="form-control" value={profile?.qualification || ''} onChange={set('qualification')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Experience (years)</label>
                      <input type="number" className="form-control" value={profile?.experience || 0} onChange={set('experience')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Consultation Fee (₹)</label>
                      <input type="text" className="form-control" value={profile?.consultationFee || ''} onChange={set('consultationFee')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <select className="form-control" value={profile?.departmentId || ''} onChange={set('departmentId')}>
                        <option value="">Select Department</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email (read-only)</label>
                      <input type="email" className="form-control" value={profile?.email || ''} readOnly
                        style={{ background: 'var(--gray-50)' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea className="form-control" rows={3} value={profile?.bio || ''} onChange={set('bio')}
                      placeholder="Tell patients about yourself..." />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? '⏳ Saving...' : '💾 Save Changes'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
