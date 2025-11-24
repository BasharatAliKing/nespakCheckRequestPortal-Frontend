import { useMemo, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Table from '../components/Table'
import 'react-toastify/dist/ReactToastify.css'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://nespakcheckrequest.cmsurveycell.com/api'

export default function ClientsPage() {
  const qc = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({ client_name: '' })
  const [logoFile, setLogoFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [currentLogo, setCurrentLogo] = useState('')
  const [actionLoading, setActionLoading] = useState('')

  const queryKey = useMemo(() => ['clients', 'list'], [])

  const origin = (() => {
    try { return new URL(API_URL).origin } catch { return '' }
  })()

  const columns = [
    { key: 'sno', header: '#' },
   // { key: 'id', header: 'ID' },
    { key: 'client_name', header: 'Client Name' },
    {
      key: 'client_logo',
      header: 'Logo',
      render: (val) => {
        if (!val) return ''
        const src = String(val).startsWith('http') ? val : `${origin}${String(val).startsWith('/') ? '' : '/'}${val}`
        return (<img src={src} alt="logo" className="h-10 w-10 object-contain rounded border" />)
      }
    },
  ]

  const listQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`${API_URL}/clients`)
      const data = await res.json()
      if (!res.ok) throw new Error('Failed to fetch clients')
      const arr = Array.isArray(data) ? data : data.clients || []
      return arr.map((r, i) => ({
        ...r,
        id: r.id || r._id || String(i + 1),
        sno: i + 1,
      }))
    },
  })

  const handleSuccess = (msg) => toast.success(msg)
  const handleError = (err) => toast.error(String(err))

  const createMut = useMutation({
    mutationFn: async ({ client_name, client_logo }) => {
      const fd = new FormData()
      fd.append('client_name', client_name)
      if (client_logo) fd.append('client_logo', client_logo)
      const res = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        body: fd,
      })
      if (!res.ok) throw new Error('Failed to create client')
      return res.json()
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey }); handleSuccess('Client added successfully!') },
    onError: handleError
  })

  const updateMut = useMutation({
    mutationFn: async ({ id, client_name, client_logo }) => {
      const fd = new FormData()
      fd.append('client_name', client_name)
      if (client_logo) fd.append('client_logo', client_logo)
      const res = await fetch(`${API_URL}/clients/${id}`, {
        method: 'PUT',
        body: fd,
      })
      if (!res.ok) throw new Error('Failed to update client')
      return res.json()
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey }); handleSuccess('Client updated successfully!') },
    onError: handleError
  })

  const deleteMut = useMutation({
    mutationFn: async (row) => {
      const res = await fetch(`${API_URL}/clients/${row.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete client')
      return res.json()
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey }); handleSuccess('Client deleted successfully!') },
    onError: handleError
  })

  function openCreate() {
    setEditingId(null)
    setFormData({ client_name: '' })
    setLogoFile(null)
    setCurrentLogo('')
    setFormOpen(true)
  }

  function openEdit(row) {
    setEditingId(row.id)
    setFormData({ client_name: row.client_name || '' })
    setLogoFile(null)
    setCurrentLogo(row.client_logo || '')
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      setActionLoading('updating')
      await updateMut.mutateAsync({ id: editingId, ...formData, client_logo: logoFile })
    } else {
      setActionLoading('adding')
      await createMut.mutateAsync({ ...formData, client_logo: logoFile })
    }
    setActionLoading('')
    setFormOpen(false)
  }

  const loading = listQuery.isLoading || createMut.isPending || updateMut.isPending || deleteMut.isPending
  const rows = Array.isArray(listQuery.data) ? listQuery.data : []

  return (
    <div className="space-y-4">
      <ToastContainer position="top-right" autoClose={2000} />
      {loading && <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"><div className="loader" /></div>}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Clients</h2>
        <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={openCreate}>
          Add Client
        </button>
      </div>

      {listQuery.error && (
        <div className="text-red-600 text-sm">{String(listQuery.error.message || listQuery.error)}</div>
      )}

      <Table columns={columns} rows={rows} onEdit={openEdit} onDelete={async (row) => { setActionLoading('deleting'); await deleteMut.mutateAsync(row); setActionLoading(''); }} searchKey="client_name" searchPlaceholder="Search by client" pageSize={10} />

      {formOpen && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white border rounded p-4 space-y-3">
            <h3 className="text-lg font-medium">{editingId ? 'Edit' : 'Create'} Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm" htmlFor="client_name">Client Name</label>
                <input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData((s) => ({ ...s, client_name: e.target.value }))}
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm" htmlFor="client_logo">Client Logo</label>
                <input
                  id="client_logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="w-full border rounded px-3 py-2 file:mr-3 file:px-3 file:py-2 file:border file:rounded"
                />
                {(logoFile || currentLogo) && (
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-xs text-gray-600">Preview:</span>
                    {logoFile ? (
                      <img src={URL.createObjectURL(logoFile)} alt="preview" className="h-12 w-12 object-contain rounded border" />
                    ) : currentLogo ? (
                      <img src={String(currentLogo).startsWith('http') ? currentLogo : `${origin}${String(currentLogo).startsWith('/') ? '' : '/'}${currentLogo}`} alt="current" className="h-12 w-12 object-contain rounded border" />
                    ) : null}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="px-3 py-2 rounded border" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white" disabled={loading || actionLoading}>
                {actionLoading === 'adding' ? 'Adding...' : actionLoading === 'updating' ? 'Updating...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
