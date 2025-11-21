import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Table from '../components/Table'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://nespakcheckrequest.cmsurveycell.com/api'

export default function UsersPage() {
  const qc = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({ 
    user_name: '', 
    user_email: '', 
    user_password: '',
    role: 'user',
    time_duration: '1'
  })
  const [editingId, setEditingId] = useState(null)

  const roleOptions = ['inspector', 'surveyor', 'me', 're', 'contractor_rep', 'consultant_rep', 'admin', 'user']
  const timeOptions = Array.from({ length: 24 }, (_, i) => i + 1)

  const columns = [
    { key: 'sno', header: '#' },
   // { key: '_id', header: 'ID' },
    { key: 'user_name', header: 'Name' },
    { key: 'user_email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'time_duration', header: 'Time Duration (h)' },
  ]

  const queryKey = useMemo(() => ['users', 'list'], [])

  const listQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`${API_URL}/users`, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to fetch users')
      return data.users;
    },
  })
  const createMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create user')
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  })

  const updateMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`${API_URL}/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update user')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  })
  const deleteMut = useMutation({
    mutationFn: async (row) => {
      const res = await fetch(`${API_URL}/users/${row._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to delete user')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  })

  function openCreate() {
    setEditingId(null)
    setFormData({ 
      user_name: '', 
      user_email: '', 
      user_password: '',
      role: 'user',
      time_duration: '1'
    })
    setFormOpen(true)
  }

  function openEdit(row) {
    setEditingId(row._id)
    setFormData({ 
      user_name: row.user_name || '', 
      user_email: row.user_email || '', 
      user_password: '', // Don't populate password on edit
      role: row.role || 'user',
      time_duration: row.time_duration || '1'
    })
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) await updateMut.mutateAsync(formData)
    else await createMut.mutateAsync(formData)
    setFormOpen(false)
  }

  const loading = listQuery.isLoading || createMut.isPending || updateMut.isPending || deleteMut.isPending
  const rawRows = Array.isArray(listQuery.data) ? listQuery.data : listQuery.data?.items || []
  const rows = rawRows.map((r, i) => ({ ...r, id: r.id || r._id, sno: i + 1 }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Users</h2>
        <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={openCreate}>
          Add User
        </button>
      </div>

      {listQuery.error && (
        <div className="text-red-600 text-sm">{String(listQuery.error.message || listQuery.error)}</div>
      )}

      <Table columns={columns} rows={rows} onEdit={openEdit} onDelete={(row) => deleteMut.mutate(row)} />

      {formOpen && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white border rounded p-4 space-y-3">
            <h3 className="text-lg font-medium">{editingId ? 'Edit' : 'Create'} User</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm" htmlFor="user_name">Name</label>
                <input
                  id="user_name"
                  type="text"
                  value={formData.user_name}
                  onChange={(e) => setFormData((s) => ({ ...s, user_name: e.target.value }))}
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm" htmlFor="user_email">Email</label>
                <input
                  id="user_email"
                  type="email"
                  value={formData.user_email}
                  onChange={(e) => setFormData((s) => ({ ...s, user_email: e.target.value }))}
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm" htmlFor="user_password">Password {editingId && '(leave blank to keep current)'}</label>
                <input
                  id="user_password"
                  type="password"
                  value={formData.user_password}
                  onChange={(e) => setFormData((s) => ({ ...s, user_password: e.target.value }))}
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required={!editingId}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm" htmlFor="role">Role</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData((s) => ({ ...s, role: e.target.value }))}
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm" htmlFor="time_duration">Time Duration (hours)</label>
                <select
                  id="time_duration"
                  value={formData.time_duration}
                  onChange={(e) => setFormData((s) => ({ ...s, time_duration: e.target.value }))}
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {timeOptions.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour} {hour === 1 ? 'hour' : 'hours'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="px-3 py-2 rounded border" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white" disabled={loading}>
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
