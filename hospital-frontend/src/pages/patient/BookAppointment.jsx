import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
import { departmentApi, doctorApi, appointmentApi } from '../../api'

const STEPS = ['Department', 'Doctor', 'Date & Time', 'Confirm']

export default function BookAppointment() {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [departments, setDepartments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState(false)
  const [form, setForm] = useState({
    departmentId: null, departmentName: '',
    doctorId: null, doctorName: '', doctorSpec: '',
    date: '', timeSlot: '', symptoms: '', notes: ''
  })

  useEffect(() => {
    departmentApi.getAll()
      .then(res => setDepartments(res.data.data || []))
      .catch(() => toast.error('Failed to load departments'))
  }, [])

  const selectDepartment = async (dept) => {
    setForm({ ...form, departmentId: dept.id, departmentName: dept.name, doctorId: null, doctorName: '', date: '', timeSlot: '' })
    setLoading(true)
    try {
      const res = await doctorApi.getByDepartment(dept.id)
      setDoctors((res.data.data || []).filter(d => d.available))
    } catch { toast.error('Failed to load doctors') }
    finally { setLoading(false) }
    setStep(1)
  }

  const selectDoctor = (doc) => {
    setForm({ ...form, doctorId: doc.id, doctorName: doc.name, doctorSpec: doc.specialization, date: '', timeSlot: '' })
    setStep(2)
  }

  const loadSlots = async (date) => {
    setForm(f => ({ ...f, date, timeSlot: '' }))
    if (!form.doctorId || !date) return
    try {
      const res = await appointmentApi.getSlots(form.doctorId, date)
      setSlots(res.data.data || [])
    } catch { setSlots([]) }
  }

  const handleBook = async () => {
    setBooking(true)
    try {
      await appointmentApi.book({
        patientId: user.id, doctorId: form.doctorId,
        departmentId: form.departmentId, appointmentDate: form.date,
        timeSlot: form.timeSlot, symptoms: form.symptoms, notes: form.notes
      })
      toast.success('Appointment booked successfully! Pending doctor approval.')
      setForm({ departmentId: null, departmentName: '', doctorId: null, doctorName: '', doctorSpec: '', date: '', timeSlot: '', symptoms: '', notes: '' })
      setStep(0)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment')
    } finally { setBooking(false) }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Book Appointment" />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Book an Appointment</h1>
            <p className="page-subtitle">Follow the steps below to schedule your visit</p>
          </div>

          {/* Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: 0 }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: i <= step ? 'var(--primary)' : 'var(--text-muted)',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: i < step ? 'var(--primary)' : i === step ? 'var(--primary)' : 'var(--gray-200)',
                    color: i <= step ? 'white' : 'var(--gray-400)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700, flexShrink: 0
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span style={{ fontWeight: i === step ? 600 : 400, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: i < step ? 'var(--primary)' : 'var(--gray-200)', margin: '0 0.75rem' }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 0: Department */}
          {step === 0 && (
            <div className="slide-up">
              <h2 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: 700 }}>
                Select a Department
              </h2>
              <div className="grid grid-3">
                {departments.map(dept => (
                  <div key={dept.id} onClick={() => selectDepartment(dept)}
                    style={{
                      background: 'white', border: '1.5px solid var(--border)',
                      borderRadius: 'var(--radius-md)', padding: '1.5rem',
                      cursor: 'pointer', textAlign: 'center',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{dept.icon || '🏥'}</div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{dept.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dept.doctorCount} doctor(s)</div>
                  </div>
                ))}
              </div>
              {departments.length === 0 && (
                <div className="empty-state"><div className="empty-state-icon">🏥</div>
                  <div className="empty-state-title">No departments available</div>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Doctor */}
          {step === 1 && (
            <div className="slide-up">
              <div className="flex items-center justify-between mb-3">
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Select a Doctor — {form.departmentName}</h2>
                <button className="btn btn-secondary btn-sm" onClick={() => setStep(0)}>← Back</button>
              </div>
              {loading ? <Loader /> : (
                <div className="grid grid-2">
                  {doctors.map(doc => (
                    <div key={doc.id} onClick={() => selectDoctor(doc)} className="doctor-card">
                      <div className="flex items-center gap-3">
                        <div className="doctor-avatar">{doc.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 700 }}>Dr. {doc.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{doc.specialization}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {doc.experience} yrs experience {doc.consultationFee ? `• ₹${doc.consultationFee}` : ''}
                          </div>
                        </div>
                      </div>
                      {doc.availableDays && (
                        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          📅 Available: {doc.availableDays}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {!loading && doctors.length === 0 && (
                <div className="empty-state"><div className="empty-state-icon">🩺</div>
                  <div className="empty-state-title">No available doctors in this department</div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div className="slide-up">
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Choose Date & Time — Dr. {form.doctorName}</h2>
                <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>← Back</button>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="form-group">
                    <label className="form-label">Appointment Date *</label>
                    <input type="date" className="form-control" min={minDate}
                      value={form.date} onChange={e => loadSlots(e.target.value)} />
                  </div>

                  {form.date && (
                    <>
                      <div className="form-label" style={{ marginBottom: '0.75rem' }}>
                        Available Time Slots
                      </div>
                      {slots.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                          No slots available for this date. Please select another date.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                          {slots.map(slot => (
                            <button key={slot} onClick={() => setForm({ ...form, timeSlot: slot })}
                              style={{
                                padding: '0.5rem 1rem', borderRadius: 'var(--radius)',
                                border: form.timeSlot === slot ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                                background: form.timeSlot === slot ? 'var(--primary-50)' : 'white',
                                color: form.timeSlot === slot ? 'var(--primary)' : 'var(--text-primary)',
                                fontWeight: form.timeSlot === slot ? 600 : 400,
                                cursor: 'pointer', fontSize: '0.85rem',
                                transition: 'var(--transition)'
                              }}>
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  <div className="form-group">
                    <label className="form-label">Symptoms (optional)</label>
                    <textarea className="form-control" placeholder="Describe your symptoms..."
                      value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} rows={3} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Additional Notes</label>
                    <textarea className="form-control" placeholder="Any additional information..."
                      value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
                  </div>
                  <button className="btn btn-primary" onClick={() => setStep(3)}
                    disabled={!form.date || !form.timeSlot}>
                    Continue → Review
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="slide-up">
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Confirm Your Appointment</h2>
                <button className="btn btn-secondary btn-sm" onClick={() => setStep(2)}>← Back</button>
              </div>
              <div className="card">
                <div className="card-body">
                  <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                      { label: 'Department', value: form.departmentName, icon: '🏥' },
                      { label: 'Doctor', value: `Dr. ${form.doctorName}`, icon: '🩺' },
                      { label: 'Specialization', value: form.doctorSpec, icon: '⚕️' },
                      { label: 'Date', value: form.date, icon: '📅' },
                      { label: 'Time', value: form.timeSlot, icon: '🕐' },
                      { label: 'Symptoms', value: form.symptoms || '—', icon: '📝' },
                    ].map(r => (
                      <div key={r.label} style={{
                        display: 'flex', gap: '1rem',
                        padding: '0.875rem',
                        background: 'var(--gray-50)',
                        borderRadius: 'var(--radius)',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '1.2rem' }}>{r.icon}</span>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{r.label}</div>
                          <div style={{ fontWeight: 600 }}>{r.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    background: 'var(--warning-light)', border: '1px solid var(--warning)',
                    borderRadius: 'var(--radius)', padding: '0.875rem',
                    fontSize: '0.85rem', color: '#92400e', marginBottom: '1.5rem'
                  }}>
                    ⚠️ Your appointment will be <strong>PENDING</strong> until the doctor approves it.
                    You'll receive a notification once confirmed.
                  </div>
                  <button className="btn btn-primary btn-lg btn-full" onClick={handleBook} disabled={booking}>
                    {booking ? '⏳ Booking...' : '✅ Confirm Appointment'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
