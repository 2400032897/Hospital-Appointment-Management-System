import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'
import { reportApi } from '../../api'

export default function UploadReport() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState(null)
  const [description, setDescription] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const fetchReports = () => {
    reportApi.getByPatient(user.id)
      .then(res => setReports(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { if (user?.id) fetchReports() }, [user])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) { toast.warn('Please select a file'); return }
    const formData = new FormData()
    formData.append('patientId', user.id)
    formData.append('description', description)
    formData.append('file', file)
    setUploading(true)
    try {
      await reportApi.upload(formData)
      toast.success('Report uploaded successfully!')
      setFile(null); setDescription('')
      fetchReports()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally { setUploading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return
    try {
      await reportApi.delete(id)
      toast.success('Report deleted')
      fetchReports()
    } catch { toast.error('Failed to delete') }
  }

  const formatSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  const getFileIcon = (type) => {
    if (!type) return '📄'
    if (type.includes('pdf')) return '📋'
    if (type.includes('image')) return '🖼️'
    if (type.includes('word') || type.includes('document')) return '📝'
    return '📄'
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Medical Reports" />
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Medical Reports</h1>
            <p className="page-subtitle">Upload and manage your medical documents</p>
          </div>

          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            {/* Upload form */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">📁 Upload New Report</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleUpload}>
                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault(); setDragOver(false)
                      const dropped = e.dataTransfer.files[0]
                      if (dropped) setFile(dropped)
                    }}
                    onClick={() => document.getElementById('file-input').click()}
                    style={{
                      border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '2.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: dragOver ? 'var(--primary-50)' : 'var(--gray-50)',
                      transition: 'var(--transition)',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
                      {file ? getFileIcon(file.type) : '☁️'}
                    </div>
                    {file ? (
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{file.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatSize(file.size)}</p>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontWeight: 600 }}>Drop file here or click to browse</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                          PDF, Images, Word docs up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                  <input id="file-input" type="file" style={{ display: 'none' }}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={e => setFile(e.target.files[0])} />

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" placeholder="E.g. Blood test results from Jan 2025"
                      value={description} onChange={e => setDescription(e.target.value)} rows={3} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-full" disabled={uploading || !file}>
                    {uploading ? '⏳ Uploading...' : '📤 Upload Report'}
                  </button>
                </form>
              </div>
            </div>

            {/* Reports list */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">My Reports ({reports.length})</h3>
              </div>
              <div className="card-body p-0">
                {loading ? <Loader /> : reports.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📁</div>
                    <div className="empty-state-title">No reports uploaded yet</div>
                  </div>
                ) : (
                  <div>
                    {reports.map(r => (
                      <div key={r.id} style={{
                        padding: '1rem 1.25rem',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.5rem' }}>{getFileIcon(r.fileType)}</span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.originalFileName}</div>
                            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                              {formatSize(r.fileSize)} • {new Date(r.uploadedAt).toLocaleDateString()}
                            </div>
                            {r.description && (
                              <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                                {r.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <a
                            href={`/api/reports/download/${r.fileName}`}
                            download className="btn btn-secondary btn-sm"
                            style={{ textDecoration: 'none' }}>
                            ⬇️
                          </a>
                          <button onClick={() => handleDelete(r.id)} className="btn btn-danger btn-sm">🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
