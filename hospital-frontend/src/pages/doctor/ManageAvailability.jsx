import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
import { doctorApi } from '../../api'

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const DAY_LABELS = { MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday', SAT: 'Saturday', SUN: 'Sunday' }

export default function ManageAvailability() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedDays, setSelectedDays] = useState([])
  const [timeStart, setTimeStart] = useState('09:00')
  const [timeEnd, setTimeEnd] = useState('17:00')
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    doctorApi.getById(user.id)
      .then(res => {
        const d = res.data.data
        setSelectedDays(d.availableDays ? d.availableDays.split(',') : [])
        setTimeStart(d.availableTimeStart || '09:00')
        setTimeEnd(d.availableTimeEnd || '17:00')
        setIsAvailable(d.available ?? true)
      })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [user])

  const toggleDay = (day) =>
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])

  const handleSave = async () => {
    setSaving(true)
    try {
      await doctorApi.update(user.id, {
        availableDays: selectedDays.join(','),
        availableTimeStart: timeStart,
        availableTimeEnd: timeEnd,
        available: isAvailable
      })
      toast.success('Availability updated!')
    } catch { toast.error('Failed to update') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="app-layout"><Sidebar /><div className="main-content"><Navbar title="Availability" /><Loader /></div></div>

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Manage Availability" />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Manage Availability</h1>
            <p className="page-subtitle">Set your available days and consultation hours</p>
          </div>
          <div style={{ maxWidth: 600 }}>
            <div className="card">
              <div className="card-body">
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1rem', background: isAvailable ? 'var(--success-light)' : 'var(--gray-100)',
                  borderRadius: 'var(--radius)', marginBottom: '1.5rem',
                  border: `1px solid ${isAvailable ? 'var(--success)' : 'var(--border)'}`
                }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Overall Availability</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {isAvailable ? '🟢 Accepting appointments' : '🔴 Not accepting appointments'}
                    </div>
                  </div>
                  <button onClick={() => setIsAvailable(!isAvailable)}
                    className={`btn ${isAvailable ? 'btn-danger' : 'btn-success'}`}>
                    {isAvailable ? 'Set Unavailable' : 'Set Available'}
                  </button>
                </div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>Available Days</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {DAYS.map(day => (
                    <button key={day} onClick={() => toggleDay(day)} style={{
                      padding: '0.75rem', borderRadius: 'var(--radius)',
                      border: selectedDays.includes(day) ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                      background: selectedDays.includes(day) ? 'var(--primary-50)' : 'white',
                      color: selectedDays.includes(day) ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: selectedDays.includes(day) ? 700 : 400,
                      cursor: 'pointer', fontSize: '0.85rem', transition: 'var(--transition)'
                    }}>{DAY_LABELS[day]}</button>
                  ))}
                </div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>Consultation Hours</h3>
                <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Start Time</label>
                    <input type="time" className="form-control" value={timeStart} onChange={e => setTimeStart(e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">End Time</label>
                    <input type="time" className="form-control" value={timeEnd} onChange={e => setTimeEnd(e.target.value)} />
                  </div>
                </div>
                <button onClick={handleSave} className="btn btn-primary btn-full" disabled={saving}>
                  {saving ? '⏳ Saving...' : '💾 Save Availability'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
