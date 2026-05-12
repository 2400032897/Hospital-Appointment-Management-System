import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { adminApi, departmentApi } from '../../api'

import { FiSearch, FiPlus, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi'

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', password:'Doctor@123', phone:'', specialization:'', qualification:'', experience:0, departmentId:'', consultationFee:'', bio:'' })

  const fetch = () => {
    setLoading(true)
    Promise.all([adminApi.getDoctors(), departmentApi.getAll()])
      .then(([dRes, depRes]) => {
        setDoctors(dRes.data.data || [])
        setDepartments(depRes.data.data || [])
      })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await adminApi.createDoctor(form)
      toast.success('Doctor added!')
      setShowModal(false)
      setForm({ name:'', email:'', password:'Doctor@123', phone:'', specialization:'', qualification:'', experience:0, departmentId:'', consultationFee:'', bio:'' })
      fetch()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add doctor') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor?')) return
    try { await adminApi.deleteDoctor(id); toast.success('Doctor deleted'); fetch() }
    catch { toast.error('Failed to delete') }
  }

  const handleToggle = async (id) => {
    try { await adminApi.toggleDoctor(id); fetch() }
    catch { toast.error('Failed') }
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const filtered = doctors.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()) || d.specialization?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Manage Doctors" />
        <div className="page-content">
          <div className="page-header">
            <div>
              <h1 className="page-title">Manage Doctors</h1>
              <p className="page-subtitle">Add and configure healthcare professionals</p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
              <FiPlus /> Add Doctor
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="search-bar" style={{ width: 320 }}>
              <FiSearch className="search-icon" />
              <input 
                className="form-control" 
                placeholder="Search by name or specialty..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Showing {filtered.length} Doctors
            </div>
          </div>

          {loading ? <Loader /> : (
            <div className="card">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Doctor Info</th>
                      <th>Specialization</th>
                      <th>Department</th>
                      <th>Experience</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(d => (
                      <tr key={d.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className="icon-box" style={{ width: 40, height: 40, background: 'var(--primary-50)', color: 'var(--primary)', fontSize: '1rem', fontWeight: 700 }}>
                              {d.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Dr. {d.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{d.specialization || '—'}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem', background: 'var(--gray-100)', padding: '2px 8px', borderRadius: 100 }}>
                            {d.departmentName || '—'}
                          </span>
                        </td>
                        <td><span style={{ fontWeight: 600 }}>{d.experience}</span> yrs</td>
                        <td>
                          <span className={`badge ${d.active ? 'badge-approved' : 'badge-rejected'}`}>
                            {d.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => handleToggle(d.id)} 
                              className={`btn btn-sm ${d.active ? 'btn-outline' : 'btn-success'}`}
                              style={{ width: '100px' }}
                            >
                              {d.active ? <><FiUserX /> Disable</> : <><FiUserCheck /> Enable</>}
                            </button>
                            <button onClick={() => handleDelete(d.id)} className="btn btn-danger btn-sm" style={{ width: 36, padding: 0, justifyContent: 'center' }}>
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">🩺</div>
                  <div className="empty-state-title">No doctors matched your search</div>
                  <p>Try searching with a different name or specialty.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Doctor</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="grid grid-2">
                  {[['name','Name','text'],['email','Email','email'],['password','Password','password'],['phone','Phone','tel'],
                    ['specialization','Specialization','text'],['qualification','Qualification','text']].map(([key,label,type]) => (
                    <div className="form-group" key={key} style={{ marginBottom: '1rem' }}>
                      <label className="form-label">{label}</label>
                      <input type={type} className="form-control" value={form[key]} onChange={set(key)} required={key !== 'phone'} />
                    </div>
                  ))}
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Experience (yrs)</label>
                    <input type="number" className="form-control" value={form.experience} onChange={set('experience')} min={0} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Consultation Fee (₹)</label>
                    <input type="text" className="form-control" value={form.consultationFee} onChange={set('consultationFee')} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem', gridColumn:'1/-1' }}>
                    <label className="form-label">Department</label>
                    <select className="form-control" value={form.departmentId} onChange={set('departmentId')}>
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-control" rows={2} value={form.bio} onChange={set('bio')} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
