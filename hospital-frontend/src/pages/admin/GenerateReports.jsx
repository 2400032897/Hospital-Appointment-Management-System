import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { adminApi } from '../../api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function GenerateReports() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!startDate || !endDate) { toast.warn('Select both dates'); return }
    if (startDate > endDate) { toast.warn('Start date must be before end date'); return }
    setLoading(true)
    try {
      const res = await adminApi.generateReport(startDate, endDate)
      if (res.data?.data) {
        setReport(res.data.data)
        toast.success('Report generated!')
      } else {
        toast.error('No data found for this period')
      }
    } catch { toast.error('Failed to generate report') }
    finally { setLoading(false) }
  }

  const chartData = report ? [
    { name: 'Approved', count: report.approved || 0 },
    { name: 'Completed', count: report.completed || 0 },
    { name: 'Cancelled', count: report.cancelled || 0 },
    { name: 'Rejected', count: report.rejected || 0 },
    { name: 'Pending', count: report.pending || 0 },
  ] : []

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Generate Reports" />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Hospital Reports</h1>
            <p className="page-subtitle">Generate appointment analytics for any date range</p>
          </div>

          {/* Date Range Form */}
          <div className="card" style={{ maxWidth: 500, marginBottom: '2rem' }}>
            <div className="card-body">
              <form onSubmit={handleGenerate}>
                <div className="grid grid-2">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Start Date</label>
                    <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">End Date</label>
                    <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1.25rem' }} disabled={loading}>
                  {loading ? '⏳ Generating...' : '📊 Generate Report'}
                </button>
              </form>
            </div>
          </div>

          {loading && <Loader />}

          {report && !loading && (
            <div className="slide-up">
              <div style={{
                background: 'linear-gradient(135deg, #1e1b4b, #7c3aed)',
                borderRadius: 'var(--radius-lg)', padding: '1.5rem 2rem',
                color: 'white', marginBottom: '2rem'
              }}>
                <h2 style={{ fontFamily: 'Outfit', marginBottom: 4 }}>Report: {report.period}</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Total appointments in this period: <strong>{report.totalAppointments}</strong></p>
              </div>

              <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
                {[
                  { label: 'Total', value: report.totalAppointments, icon: '📋', color: 'blue' },
                  { label: 'Completed', value: report.completed, icon: '✅', color: 'green' },
                  { label: 'Approved', value: report.approved, icon: '👍', color: 'teal' },
                  { label: 'Cancelled', value: report.cancelled, icon: '❌', color: 'red' },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                    <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ marginBottom: '2rem' }}>
                <div className="card-header"><h3 className="card-title">Appointment Breakdown</h3></div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="var(--accent)" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {report.appointments && report.appointments.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Appointment Details ({report.appointments.length})</h3>
                  </div>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {report.appointments.map(a => (
                          <tr key={a.id}>
                            <td>{a.patientName}</td>
                            <td>Dr. {a.doctorName}</td>
                            <td>{a.appointmentDate}</td>
                            <td>{a.timeSlot}</td>
                            <td><span className={`badge badge-${a.status?.toLowerCase() || 'pending'}`}>{a.status || 'PENDING'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
