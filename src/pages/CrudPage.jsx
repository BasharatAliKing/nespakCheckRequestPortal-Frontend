import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../utilities/apiClient'
import Table from '../components/Table'

export default function CrudPage({ resource, title, columns, defaults = {} }) {
  const qc = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState(defaults)
  const [editingId, setEditingId] = useState(null)

  const queryKey = useMemo(() => [resource, 'list'], [resource])

  const listQuery = useQuery({
    queryKey,
    queryFn: () => apiClient.list(resource),
  })

  const createMut = useMutation({
    mutationFn: (data) => apiClient.create(resource, data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  })
  const updateMut = useMutation({
    mutationFn: (data) => apiClient.update(resource, editingId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  })
  const deleteMut = useMutation({
    mutationFn: (row) => apiClient.remove(resource, row.id),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  })

  function openCreate() {
    setEditingId(null)
    setFormData(defaults)
    setFormOpen(true)
  }
  function openEdit(row) {
    setEditingId(row.id)
    setFormData(Object.fromEntries(columns.map((c) => [c.key, row[c.key] ?? ''])))
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
  const rows = Array.isArray(listQuery.data) ? listQuery.data : listQuery.data?.items || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={openCreate}>
          Add {title.slice(0, -1)}
        </button>
      </div>

      {listQuery.error && (
        <div className="text-red-600 text-sm">{String(listQuery.error.message || listQuery.error)}</div>
      )}

      <Table columns={columns} rows={rows} onEdit={openEdit} onDelete={(row) => deleteMut.mutate(row)} />

      {formOpen && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white border rounded p-4 space-y-3">
            <h3 className="text-lg font-medium">{editingId ? 'Edit' : 'Create'} {title.slice(0, -1)}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {columns.map((c) => (
                <div key={c.key} className="space-y-1">
                  <label className="text-sm" htmlFor={String(c.key)}>{c.header}</label>
                  <input
                    id={String(c.key)}
                    value={formData[c.key] ?? ''}
                    onChange={(e) => setFormData((s) => ({ ...s, [c.key]: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
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
