import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ToastContainer, toast } from 'react-toastify'
import Table from '../components/Table'
import 'react-toastify/dist/ReactToastify.css'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://nespakcheckrequest.cmsurveycell.com/api'

export default function ContractorsPage() {
  const qc = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({ contractor_name: '' })
  const [logoFile, setLogoFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [currentLogo, setCurrentLogo] = useState('')
  const [actionLoading, setActionLoading] = useState('')

  const queryKey = useMemo(() => ['contractors', 'list'], [])

  const origin = (() => {
    try { return new URL(API_URL).origin } catch { return '' }
  })()

  const columns = [
    { key: 'sno', header: '#' },
   // { key: 'id', header: 'ID' },
    { key: 'contractor_name', header: 'Contractor' },
    {
      key: 'contractor_logo',
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
      const res = await fetch(`${API_URL}/contractors`)
      const data = await res.json()
      if (!res.ok) throw new Error('Failed to fetch contractors')
      const arr = Array.isArray(data) ? data : data.contractors || []
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
    mutationFn: async ({ contractor_name, contractor_logo }) => {
      const fd = new FormData()
      fd.append('contractor_name', contractor_name)
      if (contractor_logo) fd.append('contractor_logo', contractor_logo)
      const res = await fetch(`${API_URL}/contractors`, {
        method: 'POST',
        body: fd,
      })
      if (!res.ok) throw new Error('Failed to create contractor')
      return res.json()
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey }); handleSuccess('Contractor added successfully!') },
    onError: handleError
  })

  const updateMut = useMutation({
    mutationFn: async ({ id, contractor_name, contractor_logo }) => {
      const fd = new FormData()
      fd.append('contractor_name', contractor_name)
      if (contractor_logo) fd.append('contractor_logo', contractor_logo)
      const res = await fetch(`${API_URL}/contractors/${id}`, {
        method: 'PUT',
        body: fd,
      })
      if (!res.ok) throw new Error('Failed to update contractor')
      return res.json()
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey }); handleSuccess('Contractor updated successfully!') },
    onError: handleError
  })

  const deleteMut = useMutation({
    mutationFn: async (row) => {
      const res = await fetch(`${API_URL}/contractors/${row.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete contractor')
      return res.json()
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey }); handleSuccess('Contractor deleted successfully!') },
    onError: handleError
  })

  function openCreate() {
    setEditingId(null)
    setFormData({ contractor_name: '' })
    setLogoFile(null)
    setCurrentLogo('')
    setFormOpen(true)
  }

  function openEdit(row) {
    setEditingId(row.id)
    setFormData({ contractor_name: row.contractor_name || '' })
    setLogoFile(null)
    setCurrentLogo(row.contractor_logo || '')
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      setActionLoading('updating')
      await updateMut.mutateAsync({ id: editingId, ...formData, contractor_logo: logoFile })
    } else {
      setActionLoading('adding')
      await createMut.mutateAsync({ ...formData, contractor_logo: logoFile })
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
        <h2 className="text-xl font-semibold">Contractors</h2>
        <button className="px-3 py-1 text-sm cursor-pointer md:text-base font-medium rounded bg-blue-600 hover:bg-blue-700 text-white" onClick={openCreate}>
          Add Contractor
        </button>
      </div>

      {listQuery.error && (
        <div className="text-red-600 text-sm">{String(listQuery.error.message || listQuery.error)}</div>
      )}

      <Table columns={columns} rows={rows} onEdit={openEdit} onDelete={async (row) => { setActionLoading('deleting'); await deleteMut.mutateAsync(row); setActionLoading(''); }} searchKey="contractor_name" searchPlaceholder="Search by contractor name" pageSize={10} />

      {formOpen && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white  rounded p-4 space-y-3">
            <h3 className="text-lg font-medium">{editingId ? 'Edit' : 'Create'} Contractor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm" htmlFor="contractor_name">Contractor Name</label>
                <input
                  id="contractor_name"
                  value={formData.contractor_name}
                  onChange={(e) => setFormData((s) => ({ ...s, contractor_name: e.target.value }))}
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm" htmlFor="contractor_logo">Contractor Logo</label>
                <input
                  id="contractor_logo"
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
              <button type="button" className="px-3 py-1 text-sm cursor-pointer md:text-base font-medium rounded border" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="px-3 py-1 text-sm cursor-pointer md:text-base font-medium rounded bg-blue-600 hover:bg-blue-700 text-white" disabled={loading || actionLoading}>
                {actionLoading === 'adding' ? 'Adding...' : actionLoading === 'updating' ? 'Updating...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
