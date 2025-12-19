import React, { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { getToken, getUserData } from "../utilities/auth";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ContractorForm = ({ onClose, data, mode = "create"  }) => {
  const [listProjects, setListProjects] = useState([]);
  const [listMainForm, setListMainForm] = useState([]);

  const [formDate, setFormDate] = useState({
    project_id: "",
    rfi_no: "",
    date_of_rfi: "",
    previously_requested: "",
    previous_rfi_no: "",
    date_of_inspection: "",
    time_of_inspection: "",
    location: "",
    type_of_activity: "",
    bill_no: "",
    boq_item_no: "",
    drawing_ref_no: "",
    contractor_name: `${getUserData()?.user_name || ""}`,
    contractor_submit_date: "",
    contractor_submit_time: "",
  });

  /* ---------------- PREFILL FOR UPDATE ---------------- */
  useEffect(() => {
    if (mode === "edit" && data) {
      setFormDate({
        consultant_remarks: data.consultant_remarks || "",
        project_id: data.project_id?._id || data.project_id,
        rfi_no: data.rfi_no || "",
        date_of_rfi: data.date_of_rfi?.split("T")[0] || "",
        previously_requested: data.previously_requested || "",
        previous_rfi_no: data.previous_rfi_no || "",
        date_of_inspection: data.date_of_inspection?.split("T")[0] || "",
        time_of_inspection: data.time_of_inspection || "",
        location: data.location || "",
        type_of_activity: data.type_of_activity || "",
        bill_no: data.bill_no || "",
        boq_item_no: data.boq_item_no || "",
        drawing_ref_no: data.drawing_ref_no || "",
        contractor_name: data.contractor_name || "",
        contractor_submit_date: data.contractor_submit_date || "",
        contractor_submit_time: data.contractor_submit_time || "",
      });
    }
  }, [mode, data]);

  /* ---------------- GENERATE RFI NO ---------------- */
  const makeRfiNo = (projectId) => {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const today = `${y}-${m}-${d}`;

    const count = listMainForm.filter(
      (f) =>
        f.project_id === projectId &&
        f.date_of_rfi?.split("T")[0] === today
    ).length;

    return `${y}${m}${d}-${String(count + 1).padStart(2, "0")}`;
  };

  /* ---------------- API CALLS ---------------- */
  const fetchProjects = async () => {
    const res = await fetch(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    setListProjects(data.projects || []);
  };

  const fetchMainForms = async () => {
    const res = await fetch(`${API_URL}/main-form`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    setListMainForm(data.contractorForms || []);
  };

  useEffect(() => {
    fetchProjects();
    fetchMainForms();
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleProjectSelect = (e) => {
    const projectId = e.target.value;
    setFormDate((prev) => ({
      ...prev,
      project_id: projectId,
      rfi_no: mode === "create" ? makeRfiNo(projectId) : prev.rfi_no,
    }));
  };

  /* ---------------- CREATE (POST) ---------------- */
  const handleCreate = async (e) => {
    e.preventDefault();
    const now = new Date();
    const submitDate = now.toISOString().split("T")[0];
    const submitTime = now.toTimeString().slice(0, 5);

    try {
      const res = await fetch(`${API_URL}/main-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          ...formDate,
          contractor_submit_date: submitDate,
          contractor_submit_time: submitTime,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to submit");
      } else {
        toast.success("RFI submitted successfully");
        onClose();
       
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------- UPDATE (PUT) ---------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();

    const now = new Date();
    const submitDate = now.toISOString().split("T")[0];
    const submitTime = now.toTimeString().slice(0, 5);

    try {
      const res = await fetch(`${API_URL}/main-form/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
       body: JSON.stringify({
          ...formDate,
          contractor_status:"pending",
          consultant_status:"pending",
          consultant_remarks:"",
          contractor_submit_date: submitDate,
          contractor_submit_time: submitTime,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Update failed");
      } else {
        toast.success("RFI updated successfully");
        onClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      onClick={() => onClose()}
      className="fixed inset-0 z-50 bg-[#00000061] grid place-items-center p-4"
    >
      <form
         onSubmit={mode === "create" ? handleCreate : handleUpdate}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2/4 relative bg-white rounded max-h-[90vh] overflow-y-auto p-4 space-y-3"
      >
        <IoCloseCircleOutline
          onClick={() => onClose()}
          className="absolute text-2xl top-3 right-3 cursor-pointer"
        />
        <h3 className="text-lg font-medium">{mode ==='create' ? 'Create RFI' : 'Update RFI'}</h3>
        {/* Consultant Remarks for update RFI contractor */}
       {
        mode === 'edit' && (
          <div className="space-y-1">
            <label className="text-sm">Consultant Remarks</label>
            <input
              type="text"
              value={formDate.consultant_remarks}
              className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )
       }
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Select Project */}
          <div className="space-y-1 flex flex-col text-black">
            <label className="text-sm">Select Project</label>
            <select
              value={formDate.project_id}
              onChange={handleProjectSelect}
              className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Option</option>
              {listProjects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.project_title}
                </option>
              ))}
            </select>
          </div>

          {/* RFI No */}
          <div className="space-y-1">
            <label className="text-sm">RFI No</label>
            <input
              type="text"
              value={formDate.rfi_no}
              onChange={(e) =>
                setFormDate((s) => ({ ...s, rfi_no: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date of RFI */}
          <div className="space-y-1">
            <label className="text-sm">Date of RFI</label>
            <input
              type="date"
              value={formDate.date_of_rfi}
              onChange={(e) =>
                setFormDate((s) => ({ ...s, date_of_rfi: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Previously Requested */}
          <div className="space-y-1">
            <label className="text-sm">Previously Requested</label>
            <div className="flex gap-5 mt-2">
              {["yes", "no"].map((val) => (
                <label
                  key={val}
                  className="flex gap-1 font-medium text-sm items-center"
                >
                  <input
                    type="radio"
                    name="previously_requested"
                    value={val}
                    checked={formDate.previously_requested === val}
                    onChange={(e) =>
                      setFormDate((s) => ({
                        ...s,
                        previously_requested: e.target.value,
                      }))
                    }
                    className="cursor-pointer"
                  />
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {formDate.previously_requested === "yes" && (
            <div className="space-y-1">
              <label className="text-sm">Previous RFI No.</label>
              <input
                type="text"
                value={formDate.previous_rfi_no}
                onChange={(e) =>
                  setFormDate((s) => ({
                    ...s,
                    previous_rfi_no: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Date of Inspection */}
          <div className="space-y-1">
            <label className="text-sm">Date of Inspection</label>
            <input
              type="date"
              value={formDate.date_of_inspection}
              onChange={(e) =>
                setFormDate((s) => ({
                  ...s,
                  date_of_inspection: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Time of Inspection */}
          <div className="space-y-1">
            <label className="text-sm">Time of Inspection</label>
            <input
              type="time"
              value={formDate.time_of_inspection}
              onChange={(e) =>
                setFormDate((s) => ({
                  ...s,
                  time_of_inspection: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-sm">Location</label>
            <input
              type="text"
              value={formDate.location}
              onChange={(e) =>
                setFormDate((s) => ({ ...s, location: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type of Activity */}
          <div className="space-y-1">
            <label className="text-sm">Type of Activity</label>
            <input
              type="text"
              value={formDate.type_of_activity}
              onChange={(e) =>
                setFormDate((s) => ({
                  ...s,
                  type_of_activity: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bill No */}
          <div className="space-y-1">
            <label className="text-sm">Bill No</label>
            <input
              type="text"
              value={formDate.bill_no}
              onChange={(e) =>
                setFormDate((s) => ({ ...s, bill_no: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* BOQ Item No */}
          <div className="space-y-1">
            <label className="text-sm">BOQ Item No</label>
            <input
              type="text"
              value={formDate.boq_item_no}
              onChange={(e) =>
                setFormDate((s) => ({ ...s, boq_item_no: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Drawing Ref No */}
          <div className="space-y-1">
            <label className="text-sm">Drawing Ref No</label>
            <input
              type="text"
              value={formDate.drawing_ref_no}
              onChange={(e) =>
                setFormDate((s) => ({
                  ...s,
                  drawing_ref_no: e.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2 flex gap-3">
            {mode === "create" && (
              <button type="submit" className="cursor-pointer bg-blue-600 text-white p-2 rounded w-full">
                Submit
              </button>
            )}
            {mode === "edit" && (
              <button type="submit" className="cursor-pointer bg-green-600 text-white p-2 rounded w-full">
                Update
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContractorForm;
