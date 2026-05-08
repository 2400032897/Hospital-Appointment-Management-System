import api from './axiosConfig'

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  forgotPassword: (email, role) => api.post('/auth/forgot-password', { email, role }),
  resetPassword: (token, newPassword, role) => api.post('/auth/reset-password', { token, newPassword, role })
}

export const patientApi = {
  getById: (id) => api.get(`/patients/${id}`),
  getByEmail: (email) => api.get(`/patients/email/${email}`),
  getAll: (search) => api.get('/patients', { params: search ? { search } : {} }),
  update: (id, data) => api.put(`/patients/${id}`, data),
  changePassword: (id, data) => api.put(`/patients/${id}/change-password`, data),
  toggleStatus: (id) => api.put(`/patients/${id}/toggle-status`),
  delete: (id) => api.delete(`/patients/${id}`)
}

export const doctorApi = {
  getAll: (search) => api.get('/doctors', { params: search ? { search } : {} }),
  getById: (id) => api.get(`/doctors/${id}`),
  getAvailable: () => api.get('/doctors/available'),
  getByDepartment: (departmentId) => api.get(`/doctors/department/${departmentId}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  toggleAvailability: (id) => api.put(`/doctors/${id}/availability`),
  delete: (id) => api.delete(`/doctors/${id}`)
}

export const appointmentApi = {
  book: (data) => api.post('/appointments/book', data),
  getByPatient: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  getAll: (status) => api.get('/appointments', { params: status ? { status } : {} }),
  updateStatus: (id, data) => api.put(`/appointments/${id}/status`, data),
  cancel: (id, patientId) => api.put(`/appointments/${id}/cancel`, { patientId }),
  getSlots: (doctorId, date) => api.get('/appointments/slots', { params: { doctorId, date } }),
  getStats: () => api.get('/appointments/stats')
}

export const departmentApi = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`)
}

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getPatients: () => api.get('/admin/patients'),
  getDoctors: () => api.get('/admin/doctors'),
  getAppointments: () => api.get('/admin/appointments'),
  createDoctor: (data) => api.post('/admin/doctors', data),
  togglePatient: (id) => api.put(`/admin/patients/${id}/toggle`),
  toggleDoctor: (id) => api.put(`/admin/doctors/${id}/toggle`),
  deletePatient: (id) => api.delete(`/admin/patients/${id}`),
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
  generateReport: (startDate, endDate) => api.get('/admin/reports', { params: { startDate, endDate } })
}

export const notificationApi = {
  getAll: (email) => api.get('/notifications', { params: { email } }),
  getUnreadCount: (email) => api.get('/notifications/unread-count', { params: { email } }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: (email) => api.put('/notifications/mark-all-read', { email })
}

export const reportApi = {
  upload: (formData) => api.post('/reports/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getByPatient: (patientId) => api.get(`/reports/patient/${patientId}`),
  download: (fileName) => api.get(`/reports/download/${fileName}`, { responseType: 'blob' }),
  delete: (id) => api.delete(`/reports/${id}`)
}
