import React, { useMemo, useState } from "react";
import Table from "../../components/Table";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "../../utilities/auth";
import Select from "react-select";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const TotalRequests = () => {
    // Dropdown state for project filter
  const [selectedProject, setSelectedProject] = useState("");
    const {type,status}=useParams();

  const queryKey = useMemo(() => ["requests", "list"], []);

  // Fetch requests
  const listQuery = useQuery({
      queryKey: ["requests", type, status, selectedProject],  // 👈 dynamic key
    queryFn: async () => {
        const url = selectedProject === ''
  ? 
  `${API_URL}/main-form/status/${type}/${status}`
  : 
  `${API_URL}/main-form/status/${selectedProject}/${type}/${status}`;
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
  ];
const options = [
  { value: "", label: "All Projects" },  // empty default option
  ...(projectsQuery?.data?.map((proj) => ({
    value: proj._id,
    label: proj.project_title,
  })) || [])
];
  return (
    <>
      <div className="flex items-center justify-end gap-4 mb-4">
        <label className="text-sm font-medium">Filter by Project:</label>
        <Select 
        className="w-50"
           value={options.find(opt => opt.value === selectedProject) || null}
        onChange={(option) => setSelectedProject(option ? option.value : '')}
        options={options}
        />
      <button className="bg-blue-500 text-white font-medium cursor-pointer px-3 py-1 rounded-md ">Add Request</button>
      </div>
      <Table
        columns={columns}
        rows={rows}
        searchKey="rfi_no"
        searchPlaceholder="Search by RFI No"
        pageSize={10}
      />
    </>
  );
};

export default TotalRequests;
