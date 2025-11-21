import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Table from '../components/Table'
import { getToken } from '../utilities/auth'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://nespakcheckrequest.cmsurveycell.com/api'

export default function ProjectsPage() {
  const qc = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    project_client: '',
    project_contractor: '',
    project_consultant: '',
    project_job_no: '',
    project_title: '',
  })
  const [editingId, setEditingId] = useState(null)

  const authHeaders = () => {
    const token = getToken?.()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const columns = [
    { key: 'sno', header: '#' },
  //  { key: 'id', header: 'ID' },
    { key: 'project_job_no', header: 'Job No' },
    { key: 'project_title', header: 'Title' },
    {
      key: 'project_client',
      header: 'Client',
      render: (_val, row) => clientNameById(row.project_client),
    },
    {
      key: 'project_contractor',
      header: 'Contractor',
      render: (_val, row) => contractorNameById(row.project_contractor),
    },
    {
      key: 'project_consultant',
      header: 'Consultant',
      render: (_val, row) => consultantNameById(row.project_consultant),
    },
  ]

  const queryKey = useMemo(() => ['projects', 'list'], [])

  const clientsQuery = useQuery({
    queryKey: ['clients','options'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/clients`)
      const data = await res.json()
      const arr = Array.isArray(data) ? data : data.clients || []
      return arr.map((c) => ({ id: c.id || c._id, name: c.client_name || c.name }))
    },
  })
  const contractorsQuery = useQuery({
    queryKey: ['contractors','options'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/contractors`)
      const data = await res.json()
      const arr = Array.isArray(data) ? data : data.contractors || []
      return arr.map((c) => ({ id: c.id || c._id, name: c.contractor_name || c.name }))
    },
  })
  const consultantsQuery = useQuery({
    queryKey: ['consultants','options'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/consultants`)
      const data = await res.json()
      const arr = Array.isArray(data) ? data : data.consultants || []
      return arr.map((c) => ({ id: c.id || c._id, name: c.consultant_name || c.name }))
    },
  })

  const clientNameById = (id) => clientsQuery.data?.find((c) => c.id === id)?.name || id || ''
  const contractorNameById = (id) => contractorsQuery.data?.find((c) => c.id === id)?.name || id || ''
  const consultantNameById = (id) => consultantsQuery.data?.find((c) => c.id === id)?.name || id || ''

  const listQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`${API_URL}/projects`, {
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error('Failed to fetch projects')
      const arr = Array.isArray(data) ? data : data.projects || []
      return arr.map((r, i) => ({ ...r, id: r.id || r._id, sno: i + 1 }))
    },
  })

  const createMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create project')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  })

  const updateMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`${API_URL}/projects/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update project')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  })

  const deleteMut = useMutation({
    mutationFn: async (row) => {
      const res = await fetch(`${API_URL}/projects/${row.id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete project')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  })

  function openCreate() {
    setEditingId(null)
    setFormData({
      project_client: '',
      project_contractor: '',
      project_consultant: '',
      project_job_no: '',
      project_title: '',
    })
    setFormOpen(true)
  }

  function openEdit(row) {
    setEditingId(row.id)
    setFormData({
      project_client: row.project_client || '',
      project_contractor: row.project_contractor || '',
      project_consultant: row.project_consultant || '',
      project_job_no: row.project_job_no || '',
      project_title: row.project_title || '',
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

  const loading =
    listQuery.isLoading || createMut.isPending || updateMut.isPending || deleteMut.isPending ||
    clientsQuery.isLoading || contractorsQuery.isLoading || consultantsQuery.isLoading
  const rows = Array.isArray(listQuery.data) ? listQuery.data : []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={openCreate}>
          Add Project
        </button>
      </div>

      {(listQuery.error || clientsQuery.error || contractorsQuery.error || consultantsQuery.error) && (
        <div className="text-red-600 text-sm">
          {String(listQuery.error?.message || clientsQuery.error?.message || contractorsQuery.error?.message || consultantsQuery.error?.message)}
        </div>
      )}

      <Table columns={columns} rows={rows} onEdit={openEdit} onDelete={(row) => deleteMut.mutate(row)} />

      {formOpen && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white border rounded p-4 space-y-3">
            <h3 className="text-lg font-medium">{editingId ? 'Edit' : 'Create'} Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm" htmlFor="project_job_no">Project Job No</label>
                <input
                  id="project_job_no"
                  value={formData.project_job_no}
                  onChange={(e) => setFormData((s) => ({ ...s, project_job_no: e.target.value }))}
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm" htmlFor="project_title">Project Title</label>
                <input
                  id="project_title"
                  value={formData.project_title}
                  onChange={(e) => setFormData((s) => ({ ...s, project_title: e.target.value }))}
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm" htmlFor="project_client">Client</label>
                <select
                  id="project_client"
                  value={formData.project_client}
                  onChange={(e) => setFormData((s) => ({ ...s, project_client: e.target.value }))}
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Select client</option>
                  {clientsQuery.data?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm" htmlFor="project_contractor">Contractor</label>
                <select
                  id="project_contractor"
                  value={formData.project_contractor}
                  onChange={(e) => setFormData((s) => ({ ...s, project_contractor: e.target.value }))}
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Select contractor</option>
                  {contractorsQuery.data?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm" htmlFor="project_consultant">Consultant</label>
                <select
                  id="project_consultant"
                  value={formData.project_consultant}
                  onChange={(e) => setFormData((s) => ({ ...s, project_consultant: e.target.value }))}
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Select consultant</option>
                  {consultantsQuery.data?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
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
