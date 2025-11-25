import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Table from '../components/Table'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://nespakcheckrequest.cmsurveycell.com/api'

export default function ConsultantsPage() {
  const qc = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({ consultant_name: '' })
  const [logoFile, setLogoFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [currentLogo, setCurrentLogo] = useState('')
  const [actionLoading, setActionLoading] = useState('')

  const queryKey = useMemo(() => ['consultants', 'list'], [])

  const origin = (() => {
    try { return new URL(API_URL).origin } catch { return '' }
  })()

  const columns = [
    { key: 'sno', header: '#' },
  //  { key: 'id', header: 'ID' },
    { key: 'consultant_name', header: 'Consultant' },
    {
      key: 'consultant_logo',
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
      const res = await fetch(`${API_URL}/consultants`)
      const data = await res.json()
      if (!res.ok) throw new Error('Failed to fetch consultants')
      const arr = Array.isArray(data) ? data : data.consultants || []
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
    mutationFn: async ({ consultant_name, consultant_logo }) => {
      const fd = new FormData()
      fd.append('consultant_name', consultant_name)
      if (consultant_logo) fd.append('consultant_logo', consultant_logo)
      const res = await fetch(`${API_URL}/consultants`, {
        method: 'POST',
        body: fd,
      })
      if (!res.ok) throw new Error('Failed to create consultant')
      return res.json()
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey }); handleSuccess('Consultant added successfully!') },
    onError: handleError
  })

  const updateMut = useMutation({
    mutationFn: async ({ id, consultant_name, consultant_logo }) => {
      const fd = new FormData()
      fd.append('consultant_name', consultant_name)
      if (consultant_logo) fd.append('consultant_logo', consultant_logo)
      const res = await fetch(`${API_URL}/consultants/${id}`, {
        method: 'PUT',
        body: fd,
      })
      if (!res.ok) throw new Error('Failed to update consultant')
      return res.json()
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey }); handleSuccess('Consultant updated successfully!') },
    onError: handleError
  })

  const deleteMut = useMutation({
    mutationFn: async (row) => {
      const res = await fetch(`${API_URL}/consultants/${row.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete consultant')
      return res.json()
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey }); handleSuccess('Consultant deleted successfully!') },
    onError: handleError
  })

  function openCreate() {
    setEditingId(null)
    setFormData({ consultant_name: '' })
    setLogoFile(null)
    setCurrentLogo('')
    setFormOpen(true)
  }

  function openEdit(row) {
    setEditingId(row.id)
    setFormData({ consultant_name: row.consultant_name || '' })
    setLogoFile(null)
    setCurrentLogo(row.consultant_logo || '')
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      setActionLoading('updating')
      await updateMut.mutateAsync({ id: editingId, ...formData, consultant_logo: logoFile })
    } else {
      setActionLoading('adding')
      await createMut.mutateAsync({ ...formData, consultant_logo: logoFile })
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
        <h2 className="text-xl font-semibold">Consultants</h2>
        <button className="px-3 py-1 text-sm cursor-pointer md:text-base font-medium rounded bg-blue-600 hover:bg-blue-700 text-white" onClick={openCreate}>
          Add Consultant
        </button>
      </div>

      {listQuery.error && (
        <div className="text-red-600 text-sm">{String(listQuery.error.message || listQuery.error)}</div>
      )}

      <Table columns={columns} rows={rows} onEdit={openEdit} onDelete={async (row) => { setActionLoading('deleting'); await deleteMut.mutateAsync(row); setActionLoading(''); }} searchKey="consultant_name" searchPlaceholder="Search by consultant name" pageSize={10} />

      {formOpen && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white  rounded p-4 space-y-3">
            <h3 className="text-lg font-medium">{editingId ? 'Edit' : 'Create'} Consultant</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm" htmlFor="consultant_name">Consultant Name</label>
                <input
                  id="consultant_name"
                  value={formData.consultant_name}
                  onChange={(e) => setFormData((s) => ({ ...s, consultant_name: e.target.value }))}
                  className="w-full border rounded px-3 py-2 text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm" htmlFor="consultant_logo">Consultant Logo</label>
                <input
                  id="consultant_logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="w-full border rounded px-3 py-2 text-sm md:text-base file:mr-3 file:px-3 file:py-2 file:border file:rounded"
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
              <button type="button" className="px-3 py-1 cursor-pointer text-sm rounded border" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="px-3 py-1 cursor-pointer text-sm rounded bg-blue-600 text-white" disabled={loading || actionLoading}>
                {actionLoading === 'adding' ? 'Adding...' : actionLoading === 'updating' ? 'Updating...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
