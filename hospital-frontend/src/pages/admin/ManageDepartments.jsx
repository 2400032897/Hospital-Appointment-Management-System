import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { departmentApi } from '../../api'

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', icon: '' })

  const ICONS = ['🏥','🫀','🧠','🦴','👁️','🦷','🫁','👶','🩺','💊','🔬','🩻']

  const fetch = () => {
    setLoading(true)
    departmentApi.getAll()
      .then(res => setDepartments(res.data.data || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const openAdd = () => { setEditingId(null); setForm({ name:'', description:'', icon:'' }); setShowModal(true) }
  const openEdit = (d) => { setEditingId(d.id); setForm({ name:d.name, description:d.description||'', icon:d.icon||'' }); setShowModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await departmentApi.update(editingId, form)
        toast.success('Department updated!')
      } else {
        await departmentApi.create(form)
        toast.success('Department created!')
      }
      setShowModal(false); fetch()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return
    try { await departmentApi.delete(id); toast.success('Deleted'); fetch() }
    catch (err) { toast.error(err.response?.data?.message || 'Cannot delete') }
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Manage Departments" />
        <div className="page-content">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="page-title">Departments</h1>
              <p className="page-subtitle">{departments.length} departments</p>
            </div>
            <button className="btn btn-primary" onClick={openAdd}>+ Add Department</button>
          </div>

          {loading ? <Loader /> : (
            <div className="grid grid-3">
              {departments.map(dept => (
                <div key={dept.id} className="card">
                  <div className="card-body">
                    <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' }}>
                      <div style={{
                        width:52, height:52, background:'var(--primary-100)',
                        borderRadius:'var(--radius)', display:'flex', alignItems:'center',
                        justifyContent:'center', fontSize:'1.5rem', flexShrink:0
                      }}>{dept.icon || '🏥'}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:'1rem' }}>{dept.name}</div>
                        <div style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{dept.doctorCount} doctor(s)</div>
                      </div>
                    </div>
                    {dept.description && (
                      <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'1rem' }}>{dept.description}</p>
                    )}
                    <div style={{ display:'flex', gap:'0.5rem' }}>
                      <button onClick={() => openEdit(dept)} className="btn btn-secondary btn-sm" style={{ flex:1 }}>✏️ Edit</button>
                      <button onClick={() => handleDelete(dept.id)} className="btn btn-danger btn-sm">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
              {departments.length === 0 && (
                <div className="empty-state" style={{ gridColumn:'1/-1' }}>
                  <div className="empty-state-icon">🏥</div>
                  <div className="empty-state-title">No departments yet</div>
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
              <h3 className="modal-title">{editingId ? 'Edit Department' : 'Add Department'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Department Name *</label>
                  <input type="text" className="form-control" value={form.name}
                    onChange={e => setForm({...form, name:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} value={form.description}
                    onChange={e => setForm({...form, description:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Icon</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'0.5rem' }}>
                    {ICONS.map(icon => (
                      <button key={icon} type="button" onClick={() => setForm({...form, icon})}
                        style={{
                          width:40, height:40, fontSize:'1.3rem', borderRadius:'var(--radius-sm)',
                          border: form.icon === icon ? '2px solid var(--primary)' : '1px solid var(--border)',
                          background: form.icon === icon ? 'var(--primary-50)' : 'white',
                          cursor:'pointer'
                        }}>{icon}</button>
                    ))}
                  </div>
                  <input type="text" className="form-control" placeholder="Or type custom icon/emoji"
                    value={form.icon} onChange={e => setForm({...form, icon:e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
