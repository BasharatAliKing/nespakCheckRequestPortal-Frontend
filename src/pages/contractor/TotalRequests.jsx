import React, { useMemo, useState } from "react";
import Table from "../../components/Table";
import { useQuery } from "@tanstack/react-query";
import { getToken, getUserData } from "../../utilities/auth";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const TotalRequests = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const role = getUserData()?.role || "";
  // Dropdown state for project filter
  const [selectedProject, setSelectedProject] = useState("");
  const [inspecForm, setInspecForm] = useState(false);
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
          return row.contractor_status === "pending" ? (
            <button
              onClick={() => handleConsultantToggle(row)}
              className="px-3 py-1.5 cursor-pointer rounded bg-blue-600 text-white text-xs font-medium hover:opacity-90"
            >
              Pending
            </button>
          ) : null;
        } else if (role === "inspector" && row.inspector_status === "pending") {
          return (
            <button
              onClick={() => {
                setSelectedRow(row);
                setInspecForm(true);
              }}
              className="px-3 py-1.5 rounded bg-yellow-400 text-black cursor-pointer text-xs font-medium hover:opacity-90"
            >
              Update CR
            </button>
          );
        } else if (role === "surveyor" && row.surveyor_status === "pending") {
          return (
            <button
              onClick={() => {
                setSelectedRow(row);
                setInspecForm(true);
              }}
              className="px-3 py-1.5 rounded bg-yellow-400 text-black cursor-pointer text-xs font-medium hover:opacity-90"
            >
              Update CR
            </button>
          );
        } else if (role === "me" && row.me_status === "pending") {
          return (
            <button
              onClick={() => {
                setSelectedRow(row);
                setInspecForm(true);
              }}
              className="px-3 py-1.5 rounded bg-yellow-400 text-black cursor-pointer text-xs font-medium hover:opacity-90"
            >
              Update CR
            </button>
          );
        } else if (role === "are" && row.are_status === "pending") {
          return (
            <button
              onClick={() => {
                setSelectedRow(row);
                setInspecForm(true);
              }}
              className="px-3 py-1.5 rounded bg-yellow-400 text-black cursor-pointer text-xs font-medium hover:opacity-90"
            >
              Update CR
            </button>
          );
        } else if (role === "re" && row.re_status === "pending") {
          return (
            <button
              onClick={() => {
                setSelectedRow(row);
                setInspecForm(true);
              }}
              className="px-3 py-1.5 rounded bg-yellow-400 text-black cursor-pointer text-xs font-medium hover:opacity-90"
            >
              Update CR
            </button>
          );
        } else {
          return <span className="text-sm text-gray-600">No actions</span>;
        }
      },
    },
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
    try {
      const res = await fetch(`${API_URL}/main-form/${row.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("Status updated successfully");
      }
      // 🔥 Reload API after 2 seconds
      setTimeout(() => {
        listQuery.refetch();
      }, 1000);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }
  // update Inspector status here
  async function handleSubmit(e) {
    e.preventDefault();
    if (!statusValue) {
      toast.error("Please select Pass or Fail");
      return;
    }
    if (!remarks.trim()) {
      toast.error("Remarks are required");
      return;
    }
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    const submitDate = `${yyyy}-${mm}-${dd}`;
    const submitTime = `${hh}:${min}`;

    const payload = {
      ...(role === "inspector" && {
        consultant_name: getUserData().user_name,
        consultant_update_date: submitDate,
        consultant_update_time: submitTime,
        surveyor_status: statusValue === "okay" ? "pending" : "",
        re_status: statusValue === "okay" ? "" : "pending",
        inspector_status: statusValue,
        inspector_remarks: remarks,
      }),
      ...(role === "surveyor" && {
        consultant_name: getUserData().user_name,
        consultant_update_date: submitDate,
        consultant_update_time: submitTime,
        me_status: statusValue === "okay" ? "pending" : "",
        re_status: statusValue === "okay" ? "" : "pending",
        surveyor_status: statusValue,
        surveyor_remarks: remarks,
      }),
      ...(role === "me" && {
        consultant_name: getUserData().user_name,
        consultant_update_date: submitDate,
        consultant_update_time: submitTime,
        are_status: statusValue === "okay" ? "pending" : "",
        re_status: statusValue === "okay" ? "" : "pending",
        me_status: statusValue,
        me_remarks: remarks,
      }),
      ...(role === "are" && {
        consultant_name: getUserData().user_name,
        consultant_update_date: submitDate,
        consultant_update_time: submitTime,
        re_status:"pending",
        are_status: statusValue,
        are_remarks: remarks,
      }),
      ...(role === "re" && {
        consultant_name: getUserData().user_name,
        consultant_update_date: submitDate,
        consultant_update_time: submitTime,
        cons_stat_status: statusValue === "okay" ? "" : "pending",
        re_status: statusValue,
        re_remarks: remarks,
      }),
    };
    try {
      const res = await fetch(`${API_URL}/main-form/${selectedRow.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("Status updated successfully");
        // 🔥 Close modal
        setInspecForm(false);
        // 🔥 Reload API after 1 seconds
        setTimeout(() => {
          listQuery.refetch();
        }, 1000);
      }
    } catch (err) {
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
        searchKey="rfi_no"
        searchPlaceholder="Search by RFI No"
        pageSize={10}
      />
      {inspecForm && (
        <div
          onClick={() => setInspecForm(false)}
          className="fixed inset-0 bg-black/30 grid place-items-center p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-white rounded p-4 space-y-3"
          >
            <h3 className="text-lg font-medium">Update CR</h3>
            <div className="space-y-1">
              <label className="text-sm">Status</label>
              <div className="flex gap-5">
                <label className="flex gap-1 font-medium text-base">
                  <input
                    type="radio"
                    name="status"
                    value="okay"
                    onChange={(e) => setStatusValue(e.target.value)}
                  />
                  Pass
                </label>

                <label className="flex gap-1 font-medium text-base">
                  <input
                    type="radio"
                    name="status"
                    value="not_okay"
                    onChange={(e) => setStatusValue(e.target.value)}
                  />
                  Fail
                </label>
              </div>
            </div>
            <div className="space-y-1 flex flex-col">
              <label className="text-sm">Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="p-2 rounded-md outline-none border-none ring-2 ring-gray-300 focus:ring-blue-300"
                placeholder="Enter remarks"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default TotalRequests;
