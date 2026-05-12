import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { departmentApi } from '../../api'
import * as FiIcons from 'react-icons/fi'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', icon: '' })

  const ICONS = ['🏥','🫀','🧠','🦴','👁️','🦷','🫁','👶','🩺','💊','🔬','🩻']

  const renderIcon = (iconName) => {
    if (!iconName) return <FiIcons.FiActivity />
    // If it's an emoji (single char or surrogate pair)
    if (iconName.length <= 2) return <span>{iconName}</span>
    
    // If it's a Fi icon name
    const IconComponent = FiIcons[iconName]
    return IconComponent ? <IconComponent /> : <FiIcons.FiActivity />
  }

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
          <div className="page-header">
            <div>
              <h1 className="page-title">Departments</h1>
              <p className="page-subtitle">Configure hospital departments and specialties</p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={openAdd}>
              <FiPlus /> Add Department
            </button>
          </div>

          {loading ? <Loader /> : (
            <>
              <div style={{ marginBottom: '1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {departments.length} Active Departments
              </div>
              <div className="grid grid-3">
                {departments.map(dept => (
                  <div key={dept.id} className="card hover-lift">
                    <div className="card-body">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="icon-box" style={{ background: 'var(--primary-100)', color: 'var(--primary)' }}>
                          {renderIcon(dept.icon)}
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{dept.name}</h3>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                            {dept.doctorCount} Professional Doctor(s)
                          </div>
                        </div>
                      </div>
                      
                      <p style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--text-secondary)', 
                        minHeight: '4.5rem',
                        lineHeight: '1.6',
                        marginBottom: '1.5rem'
                      }}>
                        {dept.description || 'No description provided for this department.'}
                      </p>

                      <div className="flex gap-2">
                        <button onClick={() => openEdit(dept)} className="btn btn-secondary" style={{ flex: 1 }}>
                          <FiEdit2 /> Edit
                        </button>
                        <button onClick={() => handleDelete(dept.id)} className="btn btn-danger" style={{ width: '48px', padding: 0, justifyContent: 'center' }}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {departments.length === 0 && (
                  <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                    <div className="empty-state-icon">🏥</div>
                    <div className="empty-state-title">No departments found</div>
                    <p>Start by adding a new department to the system.</p>
                  </div>
                )}
              </div>
            </>
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
