import React, { useMemo, useState } from "react";
import Table from "../../components/Table";
import { useQuery } from "@tanstack/react-query";
import { getToken, getUserData } from "../../utilities/auth";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const TotalRequests = () => {
  console.log(getUserData());
  const role=getUserData()?.role||"";
  // Dropdown state for project filter
  const [selectedProject, setSelectedProject] = useState("");
  const { type, status } = useParams();

  const queryKey = useMemo(() => ["requests", "list"], []);

  // Fetch requests
  const listQuery = useQuery({
    queryKey: ["requests", type, status, selectedProject], // 👈 dynamic key
    queryFn: async () => {
      const url =
        selectedProject === ""
          ? `${API_URL}/main-form/status/${type}/${status}`
          : `${API_URL}/main-form/status/${selectedProject}/${type}/${status}`;
      console.log(url);
      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.data || [];

      return arr.map((r, i) => ({
        ...r,
        id: r.id || r._id || String(i + 1),
        sno: i + 1,
      }));
    },
  });

  // Fetch projects
  const projectsQuery = useQuery({
    queryKey: ["projects", "list"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/projects`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      return Array.isArray(data) ? data : data.projects || [];
    },
  });
  // Merge project names into rows and filter by selected project
  const rows = useMemo(() => {
    if (!listQuery.data || !projectsQuery.data) return [];

    return listQuery.data
      .filter((r) => !selectedProject || r.project_id === selectedProject)
      .map((r) => {
        const project = projectsQuery.data.find((p) => p._id === r.project_id);
        return {
          ...r,
          project_name: project ? project.project_title : "Unknown",
        };
      });
  }, [listQuery.data, projectsQuery.data, selectedProject]);

  const columns = [
    { key: "sno", header: "#" },
    { key: "rfi_no", header: "RFI No" },
    { key: "project_name", header: "Project Name" },
    { key: "contractor_submit_date", header: "Date of Submission" },
    { key: "contractor_submit_time", header: "Time of Submission" },
  {
  key: "actions",
  header: "Actions",
  render: (_, row) => {
    if (role === "consultant_rep") {
      return (
        row.contractor_status === "pending" ? (
          <button
             onClick={() => handleConsultantToggle(row)}
            className="px-3 py-1.5 cursor-pointer rounded bg-blue-600 text-white text-xs font-medium hover:opacity-90"
          >
            Pending 
          </button>
        ) : (
         null
        )
      );
    } 
    
    else if (role === "inspector") {
      return (
        <button
           onClick={() => handleInspectorToggle(row)}
          className="px-3 py-1.5 rounded bg-yellow-400 text-black text-xs font-medium hover:opacity-90"
        >
          Update
        </button>
      );
    } 
    
    else {
      return <span className="text-sm text-gray-600">No actions</span>;
    }
  },
}

  ];
  const options = [
    { value: "", label: "All Projects" }, // empty default option
    ...(projectsQuery?.data?.map((proj) => ({
      value: proj._id,
      label: proj.project_title,
    })) || []),
  ];
  // update Consultant here status
  async function handleConsultantToggle(row) {
     const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    const submitDate = `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD
    const submitTime = `${hh}:${min}`; // HH:MM in 24-hour format
    const payload = {
      consultant_name: getUserData().user_name,
      consultant_status: "received_from_contractor",
      consultant_update_date: submitDate,
      consultant_update_time: submitTime,
      inspector_status: "pending",
      contractor_status: "received",
    };
      try{
        const res = await fetch(`${API_URL}/main-form/${row.id}/`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}` 
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Status updated successfully");
      }
    }catch(err){
        console.error("Error updating status:", err);
      }
  }
  // update Inspector status here
   async function handleInspectorToggle(row) {
     const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    const submitDate = `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD
    const submitTime = `${hh}:${min}`; // HH:MM in 24-hour format
    const payload = {
      consultant_name: getUserData().user_name,
      consultant_status: "received_from_contractor",
      consultant_update_date: submitDate,
      consultant_update_time: submitTime,
      inspector_status: "pending",
      contractor_status: "received",
    };
      try{
        const res = await fetch(`${API_URL}/main-form/${row.id}/`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}` 
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Status updated successfully");
      }
    }catch(err){
        console.error("Error updating status:", err);
      }
  }
  return (
    <>
      <div className="flex items-center justify-end gap-4 mb-4">
        <label className="text-sm font-medium">Filter by Project:</label>
        <Select
          className="w-50"
          value={options.find((opt) => opt.value === selectedProject) || null}
          onChange={(option) => setSelectedProject(option ? option.value : "")}
          options={options}
        />
      </div>
      <Table
        columns={columns}
        rows={rows}
        // onEdit={openEdit}
        searchKey="rfi_no"
        searchPlaceholder="Search by RFI No"
        pageSize={10}
      />
    </>
  );
};

export default TotalRequests;
