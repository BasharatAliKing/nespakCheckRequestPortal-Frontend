import React, { useEffect, useMemo, useState } from "react";
import Table from "../../components/Table";
import { useQuery } from "@tanstack/react-query";
import { getToken, getUserData } from "../../utilities/auth";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ContractorForm from "../../components/ContractorForm";
import UpdateConsAfterRe from "../../components/UpdateConsAfterRe";
import MainPageDesing from "../../components/MainPageDesing";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Display = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold capitalize">{value}</p>
  </div>
);
const TotalRequests = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [revertMode, setRevertMode] = useState(false);
  const [showConsultantForm, setShowConsultantForm] = useState(false);
  const [showConsultantReceiveForm, setShowConsultantReceiveForm] =
    useState(false);
  const [remarks, setRemarks] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const role = getUserData()?.role || "";
  // Dropdown state for project filter
  const [selectedProject, setSelectedProject] = useState("");
  const [inspecForm, setInspecForm] = useState(false);
  const { type, status } = useParams();
  const [users, setUsers] = useState([]);
  const [revertContractor, setRevertContractor] = useState(false);
  const [consultantSelect, setConsultantSelect] = useState({
    selectInspector: "",
    selectSurveyor: "",
    selectME: "",
    selectARE: "",
    selectRE: "",
  });
  const optionsInspector = [
    ...users
      .filter((user) => user.role === "inspector")
      .map((user) => ({
        value: user._id,
        label: user.user_name,
      })),
  ];
  const optionsSurveyor = [
    ...users
      .filter((user) => user.role === "surveyor")
      .map((user) => ({
        value: user._id,
        label: user.user_name,
      })),
  ];
  const optionsMe = [
    ...users
      .filter((user) => user.role === "me")
      .map((user) => ({
        value: user._id,
        label: user.user_name,
      })),
  ];
  const optionsAre = [
    ...users
      .filter((user) => user.role === "are")
      .map((user) => ({
        value: user._id,
        label: user.user_name,
      })),
  ];
  const optionsRe = [
    ...users
      .filter((user) => user.role === "re")
      .map((user) => ({
        value: user._id,
        label: user.user_name,
      })),
  ];
  const queryKey = useMemo(() => ["requests", "list"], []);
  // Fetch requests
  const listQuery = useQuery({
    queryKey: ["requests", type, status, selectedProject], // 👈 dynamic key
    queryFn: async () => {
      const url =
        selectedProject === ""
          ? role === "consultant_rep"
            ? `${API_URL}/main-form/status/${type}/${status}`
            : `${API_URL}/main-form/status/${
                type === "contractor_rep" ? "contractor" : type
              }/${status}/${role === "contractor_rep" ? "contractor" : role}/${
                getUserData()._id
              }`
          : role === "consultant_rep"
          ? `${API_URL}/main-form/status/${selectedProject}/${type}/${status}`
          : `${API_URL}/main-form/status/${
              type === "contractor_rep" ? "contractor" : type
            }/${status}/${role === "contractor_rep" ? "contractor" : role}/${
              getUserData()._id
            }`;
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
  console.log(selectedRow);
  const columns = [
    { key: "sno", header: "#" },
    { key: "rfi_no", header: "RFI No" },
    { key: "project_name", header: "Project Name" },
  ];
  // ➤ Add consultant-only fields
  if (role === "consultant_rep") {
    columns.push(
      { key: "contractor_submit_date", header: "Date of Submission" },
      { key: "contractor_submit_time", header: "Time of Submission" }
    );
    columns.push({
      key: "actions",
      header: "Actions",
      render: (_, row) => {
        if (role === "contractor_rep" && row.contractor_status === "revert") {
          return (
            <button
              onClick={() => {
                setSelectedRow(row);
                setShowConsultantReceiveForm(true);
              }}
              className="px-3 py-1.5 cursor-pointer rounded bg-yellow-600 text-white text-xs font-medium hover:opacity-90"
            >
              Update Check Request
            </button>
          );
        } else if (role === "consultant_rep") {
          return row.contractor_status === "pending" ? (
            <button
              onClick={() => {
                setSelectedRow(row);
                setShowConsultantForm(true);
              }}
              className="px-3 py-1.5 cursor-pointer rounded bg-blue-600 text-white text-xs font-medium hover:opacity-90"
            >
              Pending
            </button>
          ) : role === "consultant_rep" &&
            row.consultant_status === "received_from_re" ? (
            <button
              onClick={() => {
                setSelectedRow(row);
                setShowConsultantReceiveForm(true);
              }}
              className="px-3 py-1.5 cursor-pointer rounded bg-blue-600 text-white text-xs font-medium hover:opacity-90"
            >
              Received from RE
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
    });
  } else {
    // ➤ Add common fields
    columns.push(
      { key: "consultant_update_date", header: "Date of Submission" },
      { key: "consultant_update_time", header: "Time of Submission" }
    );
    columns.push({
      key: "actions",
      header: "Actions",
      render: (_, row) => {
        if (role === "contractor_rep" && row.contractor_status === "revert") {
          return (
            <button
              onClick={() => {
                setSelectedRow(row);
                setRevertContractor(true);
              }}
              className="px-3 py-1.5 cursor-pointer rounded bg-yellow-600 text-white text-xs font-medium hover:opacity-90"
            >
              Update Check Request
            </button>
          );
        } else if (
          role === "contractor_rep" &&
          row.contractor_status === "received_from_consultant"
        ) {
          return (
            <button
              onClick={() => {
                setSelectedRow(row);
                setShowConsultantReceiveForm(true);
              }}
              className="px-3 py-1.5 cursor-pointer rounded bg-blue-600 text-white text-xs font-medium hover:opacity-90"
            >
              Accept Request
            </button>
          );
        } else if (role === "consultant_rep") {
          return row.contractor_status === "pending" ? (
            <button
              onClick={() => {
                setSelectedRow(row);
                setShowConsultantForm(true);
              }}
              className="px-3 py-1.5 cursor-pointer rounded bg-blue-600 text-white text-xs font-medium hover:opacity-90"
            >
              Pending
            </button>
          ) : row.contractor_status === "received_from_re" ? (
            <button
              onClick={() => {
                setSelectedRow(row);
                setShowConsultantForm(true);
              }}
              className="px-3 py-1.5 cursor-pointer rounded bg-blue-600 text-white text-xs font-medium hover:opacity-90"
            >
              Received from RE
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
    });
  }
  const options = [
    { value: "", label: "All Projects" }, // empty default option
    ...(projectsQuery?.data?.map((proj) => ({
      value: proj._id,
      label: proj.project_title,
    })) || []),
  ];
  // update Inspector status here
  async function handleSubmit(e) {
    e.preventDefault();
    if (role === "consultant_rep") {
      if (!revertMode) {
        if (consultantSelect.selectInspector === "") {
          toast.error("Please select Inspector");
          return;
        }
        if (consultantSelect.selectSurveyor === "") {
          toast.error("Please select Surveyor");
          return;
        }
        if (consultantSelect.selectME === "") {
          toast.error("Please select ME");
          return;
        }
        if (consultantSelect.selectARE === "") {
          toast.error("Please select ARE");
          return;
        }
        if (consultantSelect.selectRE === "") {
          toast.error("Please select RE");
          return;
        }
      } else {
        if (remarks === "") {
          toast.error("Revert Remarks are required");
          return;
        }
      }
    } else {
      if (!statusValue) {
        toast.error("Please select Pass or Fail");
        return;
      }
      if (!remarks.trim()) {
        toast.error("Remarks are required");
        return;
      }
    }
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    let hours = now.getHours();
    const min = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hh = String(hours).padStart(2, "0");

    const submitDate = `${yyyy}-${mm}-${dd}`;
    const submitTime = `${hh}:${min} ${ampm}`;

    const payload = {
      ...(role === "consultant_rep" && {
        ...(revertMode
          ? {
              consultant_name: getUserData().user_name,
              consultant_update_date: submitDate,
              consultant_update_time: submitTime,
              consultant_status: "revert",
              contractor_status: "revert",
              consultant_remarks: remarks,
            }
          : {
              consultant_name: getUserData().user_name,
              consultant_update_date: submitDate,
              consultant_update_time: submitTime,
              selected_inspector: consultantSelect.selectInspector?.value || "",
              selected_surveyor: consultantSelect.selectSurveyor?.value || "",
              selected_me: consultantSelect.selectME?.value || "",
              selected_are: consultantSelect.selectARE?.value || "",
              selected_re: consultantSelect.selectRE?.value || "",
              contractor_status: "received",
              consultant_status: "received_from_contractor",
              inspector_status: "pending",
            }),
      }),
      ...(role === "inspector" && {
        inspector_name: getUserData().user_name,
        inspector_update_date: submitDate,
        inspector_update_time: submitTime,
        ...(statusValue === "okay" && { surveyor_status: "pending" }),
        ...(statusValue !== "okay" && { re_status: "pending" }),
        inspector_status: statusValue,
        inspector_remarks: remarks,
      }),
      ...(role === "surveyor" && {
        surveyor_name: getUserData().user_name,
        surveyor_update_date: submitDate,
        surveyor_update_time: submitTime,
        ...(statusValue === "okay" && { me_status: "pending" }),
        ...(statusValue !== "okay" && { re_status: "pending" }),
        surveyor_status: statusValue,
        surveyor_remarks: remarks,
      }),
      ...(role === "me" && {
        me_name: getUserData().user_name,
        me_update_date: submitDate,
        me_update_time: submitTime,
        ...(statusValue === "okay" && { are_status: "pending" }),
        ...(statusValue !== "okay" && { re_status: "pending" }),
        me_status: statusValue,
        me_remarks: remarks,
      }),
      ...(role === "are" && {
        are_name: getUserData().user_name,
        are_update_date: submitDate,
        are_update_time: submitTime,
        re_status: "pending",
        are_status: statusValue,
        are_remarks: remarks,
      }),
      ...(role === "re" && {
        re_name: getUserData().user_name,
        re_update_date: submitDate,
        re_update_time: submitTime,
        // cons_stat_status: "pending",
        re_status: statusValue,
        re_remarks: remarks,
        consultant_status: "received_from_re",
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
        setShowConsultantForm(false);
        setRemarks("");
        setRevertMode(false);
        // 🔥 Reload API after 1 seconds
        setTimeout(() => {
          listQuery.refetch();
        }, 1000);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${API_URL}/users`, {
          method: "GET",
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.log(err);
      }
    }
    fetchUsers();
  }, []);
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
          className="fixed inset-0 bg-black/30 overflow-y-auto grid place-items-center p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="w-full max-w-3/4 bg-white rounded p-4 space-y-3"
          >
            <h3 className="text-lg font-medium">Update CR</h3>
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md border">
              <Display label="Project ID" value={selectedRow?.project_title} />
              <Display label="RFI No" value={selectedRow?.rfi_no} />
              <Display
                label="Date of RFI"
                value={selectedRow?.date_of_rfi?.slice(0, 10)}
              />
              <Display
                label="Previously Requested"
                value={selectedRow?.previously_requested}
              />

              {selectedRow?.previously_requested === "yes" && (
                <>
                  <Display
                    label="Previous RFI No"
                    value={selectedRow?.previous_rfi_no}
                  />
                </>
              )}

              <Display
                label="Date of Inspection"
                value={selectedRow?.date_of_inspection?.slice(0, 10)}
              />
              <Display
                label="Time of Inspection"
                value={selectedRow?.time_of_inspection}
              />
              <Display
                label="Type of Activity"
                value={selectedRow?.type_of_activity}
              />
              <Display label="Location" value={selectedRow?.location} />
              <Display label="Bill No" value={selectedRow?.bill_no} />
              <Display label="BOQ Item No" value={selectedRow?.boq_item_no} />
              <Display
                label="Drawing Ref No"
                value={selectedRow?.drawing_ref_no}
              />
              <Display
                label="Contractor Status"
                value={selectedRow?.contractor_status}
              />
              <Display
                label="Contractor Submit Date"
                value={selectedRow?.contractor_submit_date || "—"}
              />
              <Display
                label="Contractor Submit Time"
                value={selectedRow?.contractor_submit_time || "—"}
              />
            </div> */}
            <MainPageDesing viewingRow={selectedRow} />
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
                  {role === 're' ? 'Approved':'Pass'}
                </label>

                <label className="flex gap-1 font-medium text-base">
                  <input
                    type="radio"
                    name="status"
                    value="not_okay"
                    onChange={(e) => setStatusValue(e.target.value)}
                  />
                  {role === 're' ? 'Not Approved':'Fail'}
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
         <div className="flex gap-3">
             <button
              type="submit"
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md"
            >
              Submit
            </button>
            <button
              className="px-4 py-2 cursor-pointer bg-yellow-600 text-white rounded-md"
             onClick={() => setInspecForm(false)}
            >
              Cancel
            </button>
         </div>
          </form>
        </div>
      )}
      {showConsultantForm && (
        <div
          onClick={() => setShowConsultantForm(false)}
          className="fixed inset-0 bg-black/30 grid w-full place-items-center p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="w-full sm:w-3/4 md:max-w-3/4 bg-white max-h-[90vh] rounded p-4 overflow-y-auto space-y-4"
          >
            {/* HEADER + REVERT BUTTON */}
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-xl font-semibold">Update Check Request</h3>
              <button
                type="button"
                onClick={() => setRevertMode(!revertMode)}
                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
              >
                {revertMode ? "Cancel Revert" : "Revert"}
              </button>
            </div>
            {/* ------------------------------------------------------------------ */}
            {/* VIEW API FIELDS (HIDDEN IN REVERT MODE) */}
            {/* ------------------------------------------------------------------ */}
            {!revertMode && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md border">
                <Display
                  label="Project ID"
                  value={selectedRow?.project_title}
                />
                <Display label="RFI No" value={selectedRow?.rfi_no} />
                <Display
                  label="Date of RFI"
                  value={selectedRow?.date_of_rfi?.slice(0, 10)}
                />
                <Display
                  label="Previously Requested"
                  value={selectedRow?.previously_requested}
                />

                {selectedRow?.previously_requested === "yes" && (
                  <>
                    <Display
                      label="Previous RFI No"
                      value={selectedRow?.previous_rfi_no}
                    />
                  </>
                )}

                <Display
                  label="Date of Inspection"
                  value={selectedRow?.date_of_inspection?.slice(0, 10)}
                />
                <Display
                  label="Time of Inspection"
                  value={selectedRow?.time_of_inspection}
                />
                <Display
                  label="Type of Activity"
                  value={selectedRow?.type_of_activity}
                />
                <Display label="Location" value={selectedRow?.location} />
                <Display label="Bill No" value={selectedRow?.bill_no} />
                <Display label="BOQ Item No" value={selectedRow?.boq_item_no} />
                <Display
                  label="Drawing Ref No"
                  value={selectedRow?.drawing_ref_no}
                />
                <Display
                  label="Contractor Status"
                  value={selectedRow?.contractor_status}
                />
                <Display
                  label="Contractor Submit Date"
                  value={selectedRow?.contractor_submit_date || "—"}
                />
                <Display
                  label="Contractor Submit Time"
                  value={selectedRow?.contractor_submit_time || "—"}
                />
              </div>
            )}
            {/* ------------------------------------------------------------------ */}
            {/* STATUS (HIDDEN IN REVERT MODE) */}
            {/* ------------------------------------------------------------------ */}
            {!revertMode && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xxl:grid-cols-5 gap-y-2 gap-x-5">
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Select Inspector
                  </label>
                  <Select
                    name="inspector"
                    options={optionsInspector}
                    value={consultantSelect.selectInspector}
                    onChange={(option) => {
                      setConsultantSelect({
                        ...consultantSelect,
                        selectInspector: option,
                      });
                    }}
                    placeholder="Select Inspector"
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Select Surveyor</label>
                  <Select
                    name="surveyor"
                    options={optionsSurveyor}
                    value={consultantSelect.selectSurveyor}
                    onChange={(option) => {
                      setConsultantSelect({
                        ...consultantSelect,
                        selectSurveyor: option,
                      });
                    }}
                    placeholder="Select Surveyor"
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Select ME</label>
                  <Select
                    name="me"
                    options={optionsMe}
                    value={consultantSelect.selectME}
                    onChange={(option) => {
                      setConsultantSelect({
                        ...consultantSelect,
                        selectME: option,
                      });
                    }}
                    placeholder="Select ME"
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Select ARE</label>
                  <Select
                    name="are"
                    options={optionsAre}
                    value={consultantSelect.selectARE}
                    onChange={(option) => {
                      setConsultantSelect({
                        ...consultantSelect,
                        selectARE: option,
                      });
                    }}
                    placeholder="Select ARE"
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Select Re</label>
                  <Select
                    options={optionsRe}
                    value={consultantSelect.selectRE}
                    onChange={(option) =>
                      setConsultantSelect({
                        ...consultantSelect,
                        selectRE: option,
                      })
                    }
                    placeholder="Select Re"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------ */}
            {/* REMARKS (show when revert button selected) */}
            {/* ------------------------------------------------------------------ */}

            {revertMode && (
              <div className="space-y-1 flex flex-col">
                <label className="text-sm font-medium">Remarks</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="p-2 rounded-md outline-none border ring-1 ring-gray-300 focus:ring-blue-400"
                  placeholder="Enter remarks"
                />
              </div>
            )}
            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-2 cursor-pointer bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              Submit
            </button>
           
          </form>
        </div>
      )}
      {revertContractor ? (
        <ContractorForm
          mode="edit"
          data={selectedRow}
          onClose={() => {
            setTimeout(() => {
              listQuery.refetch();
            }, 1000);
            setRevertContractor(false);
          }}
        />
      ) : null}
      {showConsultantReceiveForm && (
        <UpdateConsAfterRe
          hideConsAfterRe={() => {
            setTimeout(() => {
              listQuery.refetch();
            }, 1000);
            setShowConsultantReceiveForm(false);
          }}
          selectedRow={selectedRow}
        />
      )}
    </>
  );
};

export default TotalRequests;
