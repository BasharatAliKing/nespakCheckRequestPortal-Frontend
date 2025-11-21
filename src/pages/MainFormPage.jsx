import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Table from '../components/Table'
import { getToken } from '../utilities/auth'

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function MainFormPage() {
  const qc = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    project_name: '',
    rfi_no: '',
    date_of_rfi: '',
    previously_requested: '',
    previous_rfi_no: '',
    date_of_inspection: '',
    time_of_inspection: '',
    location: '',
    type_of_activity: '',
    bill_no: '',
    boq_item_no: '',
    drawing_ref_no: '',
    contractor_name: '',
    contractor_status: 'empty',
    contractor_submit_date: '',
    contractor_submit_time: '',
    consultant_name: '',
    consultant_status: 'pending',
    consultant_update_date: '',
    consultant_update_time: '',
    inspector_name: '',
    inspector_remarks: '',
    inspector_status: '',
    inspector_update_date: '',
    inspector_update_time: '',
    me_name: '',
    me_remarks: '',
    me_status: '',
    me_update_date: '',
    me_update_time: '',
    are_name: '',
    are_remarks: '',
    are_status: '',
    are_update_date: '',
    are_update_time: '',
    re_name: '',
    re_remarks: '',
    re_status: '',
    re_update_date: '',
    re_update_time: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [viewingRow, setViewingRow] = useState(null)
  const [contractorLogo, setContractorLogo] = useState(null)
  const [consultantLogo, setConsultantLogo] = useState(null)
  const [clientLogo, setClientLogo] = useState(null)
  const [projectDetails, setProjectDetails] = useState(null)
  console.log(contractorLogo);
  const authHeaders = () => {
    const token = getToken?.()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const columns = [
    { key: 'sno', header: '#' },
    { key: 'project_name', header: 'Project Name' },
    { key: 'rfi_no', header: 'RFI No' },
  //  { key: 'date_of_rfi', header: 'Date of RFI', render: (val) => val ? new Date(val).toLocaleDateString() : '' },
  //  { key: 'previously_requested', header: 'Previously Requested' },
  //  { key: 'previous_rfi_no', header: 'Previous RFI No' },
  //  { key: 'date_of_inspection', header: 'Date of Inspection', render: (val) => val ? new Date(val).toLocaleDateString() : '' },
  //  { key: 'time_of_inspection', header: 'Time of Inspection' },
  //  { key: 'location', header: 'Location' },
  //  { key: 'type_of_activity', header: 'Type of Activity' },
  //  { key: 'bill_no', header: 'Bill No' },
  //  { key: 'boq_item_no', header: 'BOQ Item No' },
  //  { key: 'drawing_ref_no', header: 'Drawing Ref No' },
  //  { key: 'contractor_name', header: 'Contractor Name' },
  //  { key: 'contractor_status', header: 'Contractor Status' },
  //  { key: 'contractor_submit_date', header: 'Contractor Submit Date', render: (val) => val ? new Date(val).toLocaleDateString() : '' },
  //  { key: 'contractor_submit_time', header: 'Contractor Submit Time' },
  //  { key: 'consultant_name', header: 'Consultant Name' },
  //  { key: 'consultant_status', header: 'Consultant Status' },
  // { key: 'consultant_update_date', header: 'Consultant Update Date' },
  //  { key: 'consultant_update_time', header: 'Consultant Update Time' },
  //  { key: 'inspector_name', header: 'Inspector Name' },
  //  { key: 'inspector_status', header: 'Inspector Status' },
  //  { key: 'inspector_remarks', header: 'Inspector Remarks' },
  //  { key: 'inspector_update_date', header: 'Inspector Update Date' },
  //  { key: 'inspector_update_time', header: 'Inspector Update Time' },
  //  { key: 'me_name', header: 'ME Name' },
  //  { key: 'me_status', header: 'ME Status' },
  //  { key: 'me_remarks', header: 'ME Remarks' },
  //  { key: 'me_update_date', header: 'ME Update Date' },
  //  { key: 'me_update_time', header: 'ME Update Time' },
  //  { key: 'are_name', header: 'ARE Name' },
  //  { key: 'are_status', header: 'ARE Status' },
  //  { key: 'are_remarks', header: 'ARE Remarks' },
  //  { key: 'are_update_date', header: 'ARE Update Date' },
  //  { key: 'are_update_time', header: 'ARE Update Time' },
  //  { key: 're_name', header: 'RE Name' },
  //  { key: 're_status', header: 'RE Status' },
  //  { key: 're_remarks', header: 'RE Remarks' },
  //  { key: 're_update_date', header: 'RE Update Date' },
  //  { key: 're_update_time', header: 'RE Update Time' },
  ];

  const queryKey = useMemo(() => ['main-form', 'list'], [])

  const origin = (() => {
    try { return new URL(API_URL).origin } catch { return '' }
  })()

  // Robust relative/absolute logo URL resolution
  const resolveLogoUrl = (raw) => {
    if (!raw) return null
    try {
      // If raw is already absolute, new URL keeps it; else base with API_URL
      return new URL(raw, API_URL).toString()
    } catch {
      return raw
    }
  }

  // Fetch project details, then client, contractor and consultant logos
  const fetchLogosForProject = async (projectId) => {
    try {
      // Fetch project to get contractor and consultant names
      const projectRes = await fetch(`${API_URL}/projects/${projectId}`, {
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        credentials: 'include',
      })
      const projectData = await projectRes.json()
      const project = projectData.project || projectData
      setProjectDetails(project)

      const contractorName = project.project_contractor;
      console.log(contractorName)
      const consultantName = project.project_consultant;
      const clientName = project.project_client;

      // Fetch all contractors
      const contractorsRes = await fetch(`${API_URL}/contractors`, {
        headers: { ...authHeaders() },
        credentials: 'include',
      })
      const contractorsData = await contractorsRes.json();
      const data=contractorsData.contractors;
      console.log(data);
     // const contractors = Array.isArray(contractorsData) ? contractorsData : contractorsData.contractors || []
      
      // Find matching contractor by name (case-insensitive)
      const contractor = data.find(c => 
        c._id  === contractorName
      );
      console.log(contractor);
      if (contractor?.contractor_logo) {
        setContractorLogo(resolveLogoUrl(contractor.contractor_logo))
      }

      // Fetch all consultants
      const consultantsRes = await fetch(`${API_URL}/consultants`, {
        headers: { ...authHeaders() },
        credentials: 'include',
      })
      const consultantsData = await consultantsRes.json()
      const datacons=consultantsData.consultants;
      // const consultants = Array.isArray(consultantsData) ? consultantsData : consultantsData.consultants || []
      
      // Find matching consultant by name (case-insensitive)
      const consultant = datacons.find(c => 
        c._id=== consultantName
      )
      
      if (consultant?.consultant_logo) {
        setConsultantLogo(resolveLogoUrl(consultant.consultant_logo))
      }

      // Fetch all clients
      const clientsRes = await fetch(`${API_URL}/clients`, {
        headers: { ...authHeaders() },
        credentials: 'include',
      })
      const clientsData = await clientsRes.json()
      const clientsList = clientsData.clients || (Array.isArray(clientsData) ? clientsData : [])

      const client = clientsList.find(c => c._id === clientName)
      if (client?.client_logo || client?.logo) {
        setClientLogo(resolveLogoUrl(client.client_logo || client.logo))
      }
    } catch (error) {
      console.error('Error fetching logos:', error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toDateString() // Returns format like "Wed Nov 19 2025"
  }

  // Fetch projects for name lookup
  const projectsQuery = useQuery({
    queryKey: ['projects', 'list'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/projects`, {
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        credentials: 'include',
      })
      const data = await res.json()
      const arr = Array.isArray(data) ? data : data.projects || []
      return arr.map(p => ({
        id: p.id || p._id,
        name: p.project_title || p.project_name || p.title || '',
      }))
    },
  })

  const listQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`${API_URL}/main-form`, {
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        credentials: 'include',
      })
      const contrform = await res.json();
      //console.log(contrform);
      const data=contrform.contractorForms;
      if (!res.ok) throw new Error('Failed to fetch forms')
      const arr = Array.isArray(data) ? data : data.forms || data.mainForms || []
      return arr.map((r, i) => {
        // If project_id exists, find project name
        let projectName = r.project_name || ''
        if (r.project_id && projectsQuery.data) {
          const project = projectsQuery.data.find(p => p.id === r.project_id)
          if (project) projectName = project.name
        }
        return { 
          ...r, 
          id: r.id || r._id, 
          sno: i + 1,
          project_name: projectName 
        }
      })
    },
    enabled: projectsQuery.isSuccess, // Wait for projects to load first
  });

  const createMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`${API_URL}/main-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create form')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  })

  const updateMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`${API_URL}/main-form/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update form')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  })

  const deleteMut = useMutation({
    mutationFn: async (row) => {
      const res = await fetch(`${API_URL}/main-form/${row.id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete form')
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  })

  function openCreate() {
    setEditingId(null)
    setFormData({
      project_name: '',
      rfi_no: '',
      date_of_rfi: '',
      previously_requested: '',
      previous_rfi_no: '',
      date_of_inspection: '',
      time_of_inspection: '',
      location: '',
      type_of_activity: '',
      bill_no: '',
      boq_item_no: '',
      drawing_ref_no: '',
      contractor_name: '',
      contractor_status: 'empty',
      contractor_submit_date: '',
      contractor_submit_time: '',
      consultant_name: '',
      consultant_status: 'pending',
      consultant_update_date: '',
      consultant_update_time: '',
      inspector_name: '',
      inspector_remarks: '',
      inspector_status: '',
      inspector_update_date: '',
      inspector_update_time: '',
      me_name: '',
      me_remarks: '',
      me_status: '',
      me_update_date: '',
      me_update_time: '',
      are_name: '',
      are_remarks: '',
      are_status: '',
      are_update_date: '',
      are_update_time: '',
      re_name: '',
      re_remarks: '',
      re_status: '',
      re_update_date: '',
      re_update_time: '',
    })
    setFormOpen(true)
  }

  function openEdit(row) {
    setEditingId(row.id)
    setFormData({
      project_name: row.project_name || '',
      rfi_no: row.rfi_no || '',
      date_of_rfi: row.date_of_rfi ? new Date(row.date_of_rfi).toISOString().split('T')[0] : '',
      previously_requested: row.previously_requested || '',
      previous_rfi_no: row.previous_rfi_no || '',
      date_of_inspection: row.date_of_inspection ? new Date(row.date_of_inspection).toISOString().split('T')[0] : '',
      time_of_inspection: row.time_of_inspection || '',
      location: row.location || '',
      type_of_activity: row.type_of_activity || '',
      bill_no: row.bill_no || '',
      boq_item_no: row.boq_item_no || '',
      drawing_ref_no: row.drawing_ref_no || '',
      contractor_name: row.contractor_name || '',
      contractor_status: row.contractor_status || 'empty',
      contractor_submit_date: row.contractor_submit_date ? new Date(row.contractor_submit_date).toISOString().split('T')[0] : '',
      contractor_submit_time: row.contractor_submit_time || '',
      consultant_name: row.consultant_name || '',
      consultant_status: row.consultant_status || 'pending',
      consultant_update_date: row.consultant_update_date || '',
      consultant_update_time: row.consultant_update_time || '',
      inspector_name: row.inspector_name || '',
      inspector_remarks: row.inspector_remarks || '',
      inspector_status: row.inspector_status || '',
      inspector_update_date: row.inspector_update_date || '',
      inspector_update_time: row.inspector_update_time || '',
      me_name: row.me_name || '',
      me_remarks: row.me_remarks || '',
      me_status: row.me_status || '',
      me_update_date: row.me_update_date || '',
      me_update_time: row.me_update_time || '',
      are_name: row.are_name || '',
      are_remarks: row.are_remarks || '',
      are_status: row.are_status || '',
      are_update_date: row.are_update_date || '',
      are_update_time: row.are_update_time || '',
      re_name: row.re_name || '',
      re_remarks: row.re_remarks || '',
      re_status: row.re_status || '',
      re_update_date: row.re_update_date || '',
      re_update_time: row.re_update_time || '',
    })
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
  }

  async function openView(row) {
    setViewingRow(row)
    setContractorLogo(null)
    setConsultantLogo(null)
    setClientLogo(null)
    setProjectDetails(null)
    
    // Fetch logos based on project_id
    const projectId = row.project_id || row.projectId
    if (projectId) {
      await fetchLogosForProject(projectId)
    }
  }

  function closeView() {
    setViewingRow(null)
    setContractorLogo(null)
    setConsultantLogo(null)
    setClientLogo(null)
    setProjectDetails(null)
  }

  function handlePrint() {
    window.print()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (editingId) await updateMut.mutateAsync(formData)
    else await createMut.mutateAsync(formData)
    setFormOpen(false)
  }

  const loading = listQuery.isLoading || createMut.isPending || updateMut.isPending || deleteMut.isPending
  const rows = Array.isArray(listQuery.data) ? listQuery.data : []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Main Form (RFI)</h2>
        <button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={openCreate}>
          Add New Form
        </button>
      </div>

      {listQuery.error && (
        <div className="text-red-600 text-sm">
          {String(listQuery.error?.message)}
        </div>
      )}

      <div className="overflow-x-auto">
        <Table columns={columns} rows={rows} onEdit={openEdit} onDelete={(row) => deleteMut.mutate(row)} onView={openView} />
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="w-full max-w-5xl bg-white border rounded p-6 space-y-6 my-8">
            <h3 className="text-lg font-medium">{editingId ? 'Edit' : 'Create'} Form</h3>

            {/* Basic Information Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-600 border-b pb-2">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="project_name">Project Name *</label>
                  <input
                    id="project_name"
                    value={formData.project_name}
                    onChange={(e) => setFormData((s) => ({ ...s, project_name: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="rfi_no">RFI No *</label>
                  <input
                    id="rfi_no"
                    value={formData.rfi_no}
                    onChange={(e) => setFormData((s) => ({ ...s, rfi_no: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="date_of_rfi">Date of RFI *</label>
                  <input
                    type="date"
                    id="date_of_rfi"
                    value={formData.date_of_rfi}
                    onChange={(e) => setFormData((s) => ({ ...s, date_of_rfi: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="previously_requested">Previously Requested *</label>
                  <select
                    id="previously_requested"
                    value={formData.previously_requested}
                    onChange={(e) => setFormData((s) => ({ ...s, previously_requested: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {formData.previously_requested === 'yes' && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="previous_rfi_no">Previous RFI No</label>
                    <input
                      id="previous_rfi_no"
                      value={formData.previous_rfi_no}
                      onChange={(e) => setFormData((s) => ({ ...s, previous_rfi_no: e.target.value }))}
                      className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="date_of_inspection">Date of Inspection *</label>
                  <input
                    type="date"
                    id="date_of_inspection"
                    value={formData.date_of_inspection}
                    onChange={(e) => setFormData((s) => ({ ...s, date_of_inspection: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="time_of_inspection">Time of Inspection *</label>
                  <input
                    type="time"
                    id="time_of_inspection"
                    value={formData.time_of_inspection}
                    onChange={(e) => setFormData((s) => ({ ...s, time_of_inspection: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="location">Location *</label>
                  <input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((s) => ({ ...s, location: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="type_of_activity">Type of Activity *</label>
                  <input
                    id="type_of_activity"
                    value={formData.type_of_activity}
                    onChange={(e) => setFormData((s) => ({ ...s, type_of_activity: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="bill_no">Bill No *</label>
                  <input
                    id="bill_no"
                    value={formData.bill_no}
                    onChange={(e) => setFormData((s) => ({ ...s, bill_no: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="boq_item_no">BOQ Item No *</label>
                  <input
                    id="boq_item_no"
                    value={formData.boq_item_no}
                    onChange={(e) => setFormData((s) => ({ ...s, boq_item_no: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="drawing_ref_no">Drawing Ref No *</label>
                  <input
                    id="drawing_ref_no"
                    value={formData.drawing_ref_no}
                    onChange={(e) => setFormData((s) => ({ ...s, drawing_ref_no: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contractor Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600 border-b pb-2">Contractor Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="contractor_name">Contractor Name</label>
                  <input
                    id="contractor_name"
                    value={formData.contractor_name}
                    onChange={(e) => setFormData((s) => ({ ...s, contractor_name: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="contractor_status">Contractor Status</label>
                  <select
                    id="contractor_status"
                    value={formData.contractor_status}
                    onChange={(e) => setFormData((s) => ({ ...s, contractor_status: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="send">Send</option>
                    <option value="received">Received</option>
                    <option value="empty">Empty</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="contractor_submit_date">Submit Date</label>
                  <input
                    type="date"
                    id="contractor_submit_date"
                    value={formData.contractor_submit_date}
                    onChange={(e) => setFormData((s) => ({ ...s, contractor_submit_date: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="contractor_submit_time">Submit Time</label>
                  <input
                    type="time"
                    id="contractor_submit_time"
                    value={formData.contractor_submit_time}
                    onChange={(e) => setFormData((s) => ({ ...s, contractor_submit_time: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Consultant Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-purple-600 border-b pb-2">Consultant Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="consultant_name">Consultant Name</label>
                  <input
                    id="consultant_name"
                    value={formData.consultant_name}
                    onChange={(e) => setFormData((s) => ({ ...s, consultant_name: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="consultant_status">Consultant Status</label>
                  <select
                    id="consultant_status"
                    value={formData.consultant_status}
                    onChange={(e) => setFormData((s) => ({ ...s, consultant_status: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="receivedfromcontractor">Received from Contractor</option>
                    <option value="pending">Pending</option>
                    <option value="sendedtocontractor">Sent to Contractor</option>
                    <option value="receivedfromre">Received from RE</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="consultant_update_date">Update Date</label>
                  <input
                    id="consultant_update_date"
                    value={formData.consultant_update_date}
                    onChange={(e) => setFormData((s) => ({ ...s, consultant_update_date: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="consultant_update_time">Update Time</label>
                  <input
                    id="consultant_update_time"
                    value={formData.consultant_update_time}
                    onChange={(e) => setFormData((s) => ({ ...s, consultant_update_time: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Inspector Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-orange-600 border-b pb-2">Inspector Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="inspector_name">Inspector Name</label>
                  <input
                    id="inspector_name"
                    value={formData.inspector_name}
                    onChange={(e) => setFormData((s) => ({ ...s, inspector_name: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="inspector_status">Inspector Status</label>
                  <select
                    id="inspector_status"
                    value={formData.inspector_status}
                    onChange={(e) => setFormData((s) => ({ ...s, inspector_status: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="okay">Okay</option>
                    <option value="not_okay">Not Okay</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="inspector_update_date">Update Date</label>
                  <input
                    id="inspector_update_date"
                    value={formData.inspector_update_date}
                    onChange={(e) => setFormData((s) => ({ ...s, inspector_update_date: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="inspector_update_time">Update Time</label>
                  <input
                    id="inspector_update_time"
                    value={formData.inspector_update_time}
                    onChange={(e) => setFormData((s) => ({ ...s, inspector_update_time: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium" htmlFor="inspector_remarks">Inspector Remarks</label>
                  <textarea
                    id="inspector_remarks"
                    value={formData.inspector_remarks}
                    onChange={(e) => setFormData((s) => ({ ...s, inspector_remarks: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>
              </div>
            </div>

            {/* ME Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-teal-600 border-b pb-2">ME Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="me_name">ME Name</label>
                  <input
                    id="me_name"
                    value={formData.me_name}
                    onChange={(e) => setFormData((s) => ({ ...s, me_name: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="me_status">ME Status</label>
                  <select
                    id="me_status"
                    value={formData.me_status}
                    onChange={(e) => setFormData((s) => ({ ...s, me_status: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="okay">Okay</option>
                    <option value="not_okay">Not Okay</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="me_update_date">Update Date</label>
                  <input
                    id="me_update_date"
                    value={formData.me_update_date}
                    onChange={(e) => setFormData((s) => ({ ...s, me_update_date: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="me_update_time">Update Time</label>
                  <input
                    id="me_update_time"
                    value={formData.me_update_time}
                    onChange={(e) => setFormData((s) => ({ ...s, me_update_time: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium" htmlFor="me_remarks">ME Remarks</label>
                  <textarea
                    id="me_remarks"
                    value={formData.me_remarks}
                    onChange={(e) => setFormData((s) => ({ ...s, me_remarks: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>
              </div>
            </div>

            {/* ARE Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-indigo-600 border-b pb-2">ARE Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="are_name">ARE Name</label>
                  <input
                    id="are_name"
                    value={formData.are_name}
                    onChange={(e) => setFormData((s) => ({ ...s, are_name: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="are_status">ARE Status</label>
                  <select
                    id="are_status"
                    value={formData.are_status}
                    onChange={(e) => setFormData((s) => ({ ...s, are_status: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="okay">Okay</option>
                    <option value="not_okay">Not Okay</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="are_update_date">Update Date</label>
                  <input
                    id="are_update_date"
                    value={formData.are_update_date}
                    onChange={(e) => setFormData((s) => ({ ...s, are_update_date: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="are_update_time">Update Time</label>
                  <input
                    id="are_update_time"
                    value={formData.are_update_time}
                    onChange={(e) => setFormData((s) => ({ ...s, are_update_time: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium" htmlFor="are_remarks">ARE Remarks</label>
                  <textarea
                    id="are_remarks"
                    value={formData.are_remarks}
                    onChange={(e) => setFormData((s) => ({ ...s, are_remarks: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>
              </div>
            </div>

            {/* RE Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-red-600 border-b pb-2">RE Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="re_name">RE Name</label>
                  <input
                    id="re_name"
                    value={formData.re_name}
                    onChange={(e) => setFormData((s) => ({ ...s, re_name: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="re_status">RE Status</label>
                  <select
                    id="re_status"
                    value={formData.re_status}
                    onChange={(e) => setFormData((s) => ({ ...s, re_status: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="approved">Approved</option>
                    <option value="not_approved">Not Approved</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="re_update_date">Update Date</label>
                  <input
                    id="re_update_date"
                    value={formData.re_update_date}
                    onChange={(e) => setFormData((s) => ({ ...s, re_update_date: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="re_update_time">Update Time</label>
                  <input
                    id="re_update_time"
                    value={formData.re_update_time}
                    onChange={(e) => setFormData((s) => ({ ...s, re_update_time: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium" htmlFor="re_remarks">RE Remarks</label>
                  <textarea
                    id="re_remarks"
                    value={formData.re_remarks}
                    onChange={(e) => setFormData((s) => ({ ...s, re_remarks: e.target.value }))}
                    className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button type="button" className="px-4 py-2 rounded border" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={loading}>
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Print View Modal */}
      {viewingRow && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl">
              {/* Modal Header - Hidden in print */}
              <div className="flex items-center justify-between p-4 border-b print:hidden">
                <h3 className="text-lg font-semibold">Request for Inspection (RFI) - Print View</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrint}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Print PDF
                  </button>
                  <button 
                    onClick={closeView}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Printable Content */}
              <div className="p-6 print:p-8" id="printable-form">
                <style>{`
                  @media print {
                    body * { visibility: hidden; }
                    #printable-form, #printable-form * { visibility: visible; }
                    #printable-form { position: absolute; left: 0; top: 0; width: 100%; }
                    .print\\:hidden { display: none !important; }
                    @page { 
                      margin: 0.5cm;
                      size: A4;
                    }
                    /* Force background colors to print */
                    * {
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                      color-adjust: exact !important;
                    }
                  }
                  .print-table { border-collapse: collapse; width: 100%; }
                  .print-table td, .print-table th { border: 1px solid black; padding: 4px 8px; font-size: 10px; }
                  .print-table .header-cell { background-color: #e5e7eb; font-weight: 600; }
                  /* Ensure colors show in print */
                  .bg-blue-500 {
                    background-color: #3b82f6 !important;
                  }
                  .bg-\\[\\#861517\\] {
                    background-color: #861517 !important;
                  }
                `}</style>

                {/* Header Section */}
                <table className="print-table mb-2">
                  <tbody>
                    <tr>
                      <td className="text-center" style={{width: '20%', padding: '6px'}}>
                        <div className="flex justify-center items-center gap-1">
                          {clientLogo ? (
                            <img
                              src={clientLogo}
                              alt="Client Logo"
                              className=' h-8 w-12 object-contain'
                            />
                          ) : (
                            <div className="text-[10px]">[Client Logo]</div>
                          )}
                          {contractorLogo ? (
                            <img
                              src={contractorLogo}
                              alt="Contractor Logo"
                              className=' h-8 w-12 object-contain'
                            />
                          ) : (
                            <div className="text-[10px]">[Contractor Logo]</div>
                          )}
                        </div>
                      </td>
                      <td className="text-center font-bold" style={{width: '60%'}}>
                        <div className="text-lg font-bold">{projectDetails?.project_title || projectDetails?.project_name || viewingRow.project_name}</div>
                      </td>
                      <td className="text-center" style={{width: '20%', padding: '8px'}}>
                        {consultantLogo ? (
                          <img
                            src={consultantLogo}
                            alt="Consultant Logo"
                            className='mx-auto h-8 w-12 object-fit-cover'
                          />
                        ) : (
                          <div className="text-xs">[Consultant Logo]</div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-center font-bold bg-gray-100 ">
                        <h1 className='text-base'>REQUEST FOR INSPECTION (RFI)</h1>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* Main Form Table */}
                <table className="print-table mb-2">
                  <tbody>
                    {/* RFI Basic Info */}
                    <tr>
                      <td className="header-cell" style={{width: '20%'}}>RFI No.</td>
                      <td style={{width: '30%'}}>{viewingRow.rfi_no}</td>
                      <td className="header-cell" style={{width: '20%'}}>Date of RFI</td>
                      <td style={{width: '30%'}}>{formatDate(viewingRow.date_of_rfi)}</td>
                    </tr>
                    <tr>
                      <td className="header-cell">Previously Requested</td>
                      <td>
                        [ {viewingRow.previously_requested === 'no' ? 'No' : '  '} ]  |  [ {viewingRow.previously_requested === 'yes' ? 'Yes' : '  '} ]
                      </td>
                      <td className="header-cell">Previous RFI No.</td>
                      <td>{viewingRow.previous_rfi_no || ''}</td>
                    </tr>
                    <tr>
                      <td className="header-cell">Date of Inspection:</td>
                      <td>{formatDate(viewingRow.date_of_inspection)}</td>
                      <td className="header-cell">Time of Inspection:</td>
                      <td>{viewingRow.time_of_inspection}</td>
                    </tr>
                    <tr>
                      <td className="header-cell">Location</td>
                      <td>{viewingRow.location}</td>
                      <td className="header-cell">Type of Work Activity</td>
                      <td>{viewingRow.type_of_activity}</td>
                    </tr>
                    <tr>
                      <td className="header-cell">Bill  No.</td>
                      <td>{viewingRow.bill_no}</td>
                      <td className="header-cell">BOQ Item No.</td>
                      <td>{viewingRow.boq_item_no}</td>
                    </tr>
                    <tr>
                      <td className="header-cell">Drawing Ref No.</td>
                      <td colSpan="3">{viewingRow.drawing_ref_no}</td>
                    </tr>

                    {/* Contractor Section */}
                    <tr>
                      <td colSpan="2" className="bg-blue-500 text-white" >Requested by <strong>Contractor's</strong> Authorized Representative</td>
                      <td colSpan="2" className="bg-[#861517] text-white" >Received by <strong>Consultant's</strong> Authorized Representative</td>
                    </tr>
                    <tr>
                      <td className="header-cell" style={{width: '15%'}}>Signature:</td>
                      <td style={{height: '20px'}}></td>
                      <td className="header-cell" style={{width: '15%'}}>Signature:</td>
                      <td style={{height: '20px'}}></td>
                    </tr>
                    <tr>
                      <td className="header-cell">Name:</td>
                      <td>{viewingRow.contractor_name}</td>
                      <td className="header-cell">Name:</td>
                      <td>{viewingRow.consultant_name}</td>
                    </tr>
                    <tr>
                      <td className="header-cell">Date:</td>
                      <td>{formatDate(viewingRow.contractor_submit_date)}</td>
                      <td className="header-cell">Date:</td>
                      <td>{viewingRow.consultant_update_date}</td>
                    </tr>
                    <tr>
                      <td className="header-cell">Time:</td>
                      <td>{viewingRow.contractor_submit_time}</td>
                      <td className="header-cell">Time:</td>
                      <td>{viewingRow.consultant_update_time}</td>
                    </tr>

                    {/* Inspection Notes */}
                    <tr>
                      <td colSpan="4" className="text-center font-bold bg-[#861517] text-white">
                        Inspection Notes by Inspectors and Key Staff
                      </td>
                    </tr>

                    {/* Inspector Section */}
                   
                       <strong className='whitespace-nowrap text-xs'>Inspector:</strong>
                   
                    <tr>
                         <td className="header-cell">Name:</td>
                         <td>{viewingRow.inspector_name}</td>
                         <td className="header-cell">Status:</td>
                         <td> <strong>{viewingRow.inspector_status === 'okay' ? 'Pass' : 'Fail'}</strong></td>
                      </tr>
                    <tr>
                         <td className="header-cell">Date:</td>
                         <td>{viewingRow.inspector_update_date}</td>
                         <td className="header-cell">Time:</td>
                         <td>{viewingRow.inspector_update_time}</td>
                   </tr>
                    <tr>
                      <td colSpan="4" className="header-cell">
                       <strong>Remarks:</strong> {viewingRow.inspector_remarks}
                      </td>
                    </tr>
                    {/* Surveyor Section */}
                    <tr>
                       <strong className='whitespace-nowrap text-xs'>Surveyor:</strong>
                    </tr>
                     <tr>
                         <td className="header-cell">Name:</td>
                         <td>{viewingRow.surveyor_name}</td>
                         <td className="header-cell">Status:</td>
                         <td> <strong>{viewingRow.surveyor_status === 'okay' ? 'Pass' : 'Fail'}</strong></td>
                      </tr>
                        <tr>
                         <td className="header-cell">Date:</td>
                         <td>{viewingRow.surveyor_update_date}</td>
                         <td className="header-cell">Time:</td>
                         <td>{viewingRow.surveyor_update_time}</td>
                      </tr>
                       <tr>
                      <td colSpan="4" className="header-cell">
                       <strong>Remarks:</strong> {viewingRow.surveyor_remarks}
                      </td>
                    </tr>
                    {/* Material Engineer (ME) Section */}
                    <tr>
                       <strong className='whitespace-nowrap text-xs'>Material Engineer (ME):</strong>
                      </tr>
                       <tr>
                         <td className="header-cell">Name:</td>
                         <td>{viewingRow.me_name}</td>
                         <td className="header-cell">Status:</td>
                         <td> <strong>{viewingRow.me_status === 'okay' ? 'Pass' : 'Fail'}</strong></td>
                      </tr>
                        <tr>
                         <td className="header-cell">Date:</td>
                         <td>{viewingRow.me_update_date}</td>
                         <td className="header-cell">Time:</td>
                         <td>{viewingRow.me_update_time}</td>
                      </tr>
                       <tr>
                      <td colSpan="4" className="header-cell">
                       <strong>Remarks:</strong> {viewingRow.me_remarks}
                      </td>
                    </tr>
                    {/* Assistant Resident Engineer (ARE) Section */}
                    <tr>
                       <strong className='whitespace-nowrap text-xs'>Assistant Resident Engineer (ARE):</strong>
                      </tr>
                       <tr>
                         <td className="header-cell">Name:</td>
                         <td>{viewingRow.are_name}</td>
                         <td className="header-cell">Status:</td>
                         <td> <strong>{viewingRow.are_status === 'okay' ? 'Pass' : 'Fail'}</strong></td>
                      </tr>
                        <tr>
                         <td className="header-cell">Date:</td>
                         <td>{viewingRow.are_update_date}</td>
                         <td className="header-cell">Time:</td>
                         <td>{viewingRow.are_update_time}</td>
                      </tr>
                       <tr>
                      <td colSpan="4" className="header-cell">
                       <strong>Remarks:</strong> {viewingRow.are_remarks}
                      </td>
                    </tr>
                    {/* RE Section */}
                    <tr >
                       <td colSpan="4" className="text-center font-bold bg-[#861517] text-white">
                       Resident Engineer's Remarks
                      </td>
                     </tr>
                       <tr>
                      <td className="header-cell">Name:</td>
                      <td>{viewingRow.re_name}</td>
                      <td className="header-cell">Date:</td>
                      <td>{viewingRow.re_update_date}</td>
                    </tr>
                      <tr>
                      <td className="header-cell" style={{width: '15%'}}>Approved</td>
                      <td style={{width: '10%'}}>{viewingRow.re_status === 'approved' ? '✓' : ''}</td>
                      <td className="header-cell" style={{width: '15%'}}>Not Approved</td>
                      <td style={{width: '10%'}}>{viewingRow.re_status === 'not_approved' ? '✓' : ''}</td>
                    </tr>
                    <td colSpan="4" className="header-cell">
                       <strong>Remarks:</strong> {viewingRow.re_remarks}
                      </td>
                    <tr>
                      <td className="header-cell">Signature:</td>
                      <td colSpan="3" style={{height: '20px'}}></td>
                    </tr>
                  

                    {/* Bottom Section */}
                    <tr>
                      <td colSpan="2" className=" text-white bg-[#861517]">Handed over by <strong>Consultant's</strong> Representative</td>
                      <td colSpan="2" className=" text-white bg-blue-500">Received by <strong>Contractor's</strong> <u>Authorized</u> Representative</td>
                    </tr>
                    <tr>
                      <td className="header-cell">Signature:</td>
                      <td style={{height: '20px'}}></td>
                      <td className="header-cell">Signature:</td>
                      <td style={{height: '20px'}}></td>
                    </tr>
                    <tr>
                      <td className="header-cell">Name:</td>
                      <td>{viewingRow.consultant_name}</td>
                      <td className="header-cell">Name:</td>
                      <td>{viewingRow.contractor_name}</td>
                    </tr>
                    <tr>
                      <td className="header-cell">Date:</td>
                      <td>{viewingRow.consultant_update_date}</td>
                      <td className="header-cell">Date:</td>
                      <td>{formatDate(viewingRow.contractor_submit_date)}</td>
                    </tr>
                    <tr>
                      <td className="header-cell">Time:</td>
                      <td>{viewingRow.consultant_update_time}</td>
                      <td className="header-cell">Time:</td>
                      <td>{viewingRow.contractor_submit_time}</td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="text-xs italic">
                        Note: This approval is null and void if works are left to deteriorate for a period
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
