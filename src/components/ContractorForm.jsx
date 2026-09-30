import React, { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { getToken, getUserData } from "../utilities/auth";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const API_IMG = import.meta.env.VITE_API_BASE_IMG;

const ContractorForm = ({ onClose, data, mode = "create" }) => {
  const [listProjects, setListProjects] = useState([]);
  const [listMainForm, setListMainForm] = useState([]);
  const [boqType, setBoqType] = useState(() =>
    data?.non_boq_item ? "nonboq" : "boq",
  );
  const [existingContractorAttachments, setExistingContractorAttachments] =
    useState(() =>
      Array.isArray(data?.contractor_attachments)
        ? data.contractor_attachments.filter(
            (attachment) => attachment?.file_path,
          )
        : [],
    );
  const [removedContractorAttachments, setRemovedContractorAttachments] =
    useState([]);
  const [contractorAttachments, setContractorAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    non_boq_item: "",
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
        non_boq_item: data.non_boq_item || "",
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

    const count = listMainForm.filter((f) => {
      const existingProjectId =
        typeof f.project_id === "object" ? f.project_id?._id : f.project_id;

      const existingDate = f.date_of_rfi ? f.date_of_rfi.split("T")[0] : "";

      return (
        String(existingProjectId) === String(projectId) &&
        existingDate === today
      );
    }).length;

    return `${y}${m}${d}-${String(count + 1).padStart(2, "0")}`;
  };
  /* ---------------- API CALLS ---------------- */
  const fetchProjects = async () => {
    const res = await fetch(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    const userProjects = getUserData().user_projects || [];

    const filter = data.projects.filter((val) =>
      userProjects.includes(val._id),
    );
    setListProjects(filter || []);
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
    if (isSubmitting) return;

    setIsSubmitting(true);
    const now = new Date();
    const submitDate = now.toISOString().split("T")[0];

    let hours = now.getHours();
    const min = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    const hh = String(hours).padStart(2, "0");
    const submitTime = `${hh}:${min} ${ampm}`;

    try {
      const formData = new FormData();

      Object.entries(formDate).forEach(([key, value]) => {
        // Skip fields that we are setting separately
        if (
          key === "contractor_submit_date" ||
          key === "contractor_submit_time"
        ) {
          return;
        }

        formData.append(key, value ?? "");
      });

      formData.append("selected_contractor", getUserData()._id);

      formData.append("contractor_submit_date", submitDate);
      formData.append("contractor_submit_time", submitTime);
      // Add multiple attachments
      contractorAttachments.forEach((file) => {
        formData.append("contractor_attachments", file);
      });

      const res = await fetch(`${API_URL}/main-form`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
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
      toast.error("Something went wrong");
    }
  };

  /* ---------------- UPDATE (PUT) ---------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    const now = new Date();

    const submitDate = now.toISOString().split("T")[0];

    let hours = now.getHours();

    const min = String(now.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    const hh = String(hours).padStart(2, "0");

    const submitTime = `${hh}:${min} ${ampm}`;

    try {
      const formData = new FormData();

      // -----------------------------
      // NORMAL DATA
      // -----------------------------

      Object.entries(formDate).forEach(([key, value]) => {
        if (
          key === "contractor_submit_date" ||
          key === "contractor_submit_time"
        ) {
          return;
        }

        formData.append(key, value ?? "");
      });

      // -----------------------------
      // OTHER DATA
      // -----------------------------

      formData.append("selected_contractor", getUserData()._id);

      formData.append("contractor_submit_date", submitDate);

      formData.append("contractor_submit_time", submitTime);

      formData.append("contractor_status", "pending");

      formData.append("consultant_status", "pending");

      // -----------------------------
      // REMOVED OLD ATTACHMENTS
      // -----------------------------

      formData.append(
        "removed_contractor_attachments",
        JSON.stringify(removedContractorAttachments),
      );

      // -----------------------------
      // NEW ATTACHMENTS
      // -----------------------------

      contractorAttachments.forEach((file) => {
        formData.append("contractor_attachments", file);
      });

      // -----------------------------
      // DEBUG
      // -----------------------------

      console.log("Removed attachments:", removedContractorAttachments);

      console.log("New attachments:", contractorAttachments);

      // -----------------------------
      // API
      // -----------------------------

      const res = await fetch(`${API_URL}/main-form/${data._id}`, {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${getToken()}`,
        },

        body: formData,
      });

      const result = await res.json();

      console.log("UPDATE RESPONSE:", result);

      if (!res.ok) {
        toast.error(result.message || "Update failed");

        return;
      }

      toast.success("RFI updated successfully");

      onClose();
    } catch (err) {
      console.error("Update Error:", err);

      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
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
        className="w-full sm:max-w-2/4 relative bg-[#ffffff] rounded max-h-[90vh] overflow-y-auto p-4 space-y-3"
      >
        <IoCloseCircleOutline
          onClick={() => onClose()}
          className="absolute text-2xl top-3 right-3 cursor-pointer"
        />
        <h3 className="text-lg font-medium">
          {mode === "create" ? "Create RFI" : "Update RFI"}
        </h3>
        {/* Consultant Remarks for update RFI contractor */}
        {mode === "edit" && (
          <div className="space-y-1">
            <label className="text-sm">Consultant Remarks</label>
            <input
              type="text"
              value={formDate.consultant_remarks}
              className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
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
            <label className="text-sm">Check Request No</label>
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
          <div className="space-y-1 col-span-2">
            <label className="text-sm">Select Item</label>
            <div className="flex gap-5 mt-2">
              <label className="flex gap-1 font-medium text-sm items-center">
                <input
                  type="radio"
                  name="boqType"
                  value="boq"
                  checked={boqType === "boq"}
                  onChange={() => {
                    setBoqType("boq");
                    setFormDate((prev) => ({ ...prev, non_boq_item: "" }));
                  }}
                  className="cursor-pointer"
                />
                BOQ Item
              </label>
              <label className="flex gap-1 font-medium text-sm items-center">
                <input
                  type="radio"
                  name="boqType"
                  value="nonboq"
                  checked={boqType === "nonboq"}
                  onChange={() => {
                    setBoqType("nonboq");
                    setFormDate((prev) => ({ ...prev, boq_item_no: "" }));
                  }}
                  className="cursor-pointer"
                />
                Non BOQ Item
              </label>
            </div>
          </div>
          {/* BOQ Item No */}
          {boqType === "boq" && (
            <div className="space-y-1">
              <label className="text-sm">BOQ Item No</label>
              <input
                type="text"
                value={formDate.boq_item_no}
                required
                onChange={(e) =>
                  setFormDate((s) => ({ ...s, boq_item_no: e.target.value }))
                }
                className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          {/* NonBOQ Item No */}
          {boqType === "nonboq" && (
            <div className="space-y-1">
              <label className="text-sm">Non BOQ Item </label>
              <input
                type="text"
                value={formDate.non_boq_item}
                required
                onChange={(e) =>
                  setFormDate((s) => ({ ...s, non_boq_item: e.target.value }))
                }
                className="w-full border border-gray-300 rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

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
          {/* Contractor Attachments */}
          <div className="col-span-2 space-y-3">

  <label className="text-sm font-medium">
    {mode === "edit"
      ? "Add / Manage Attachments"
      : "Attachments"}
  </label>

  {/* FILE SELECT */}
  <input
    type="file"
    multiple
    onChange={(e) => {
      const selectedFiles = Array.from(e.target.files || []);

      if (selectedFiles.length === 0) return;

      setContractorAttachments((prev) => [
        ...prev,
        ...selectedFiles,
      ]);

      // allow selecting same file again
      e.target.value = "";
    }}
    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* ============================= */}
  {/* EXISTING / SAVED ATTACHMENTS */}
  {/* ============================= */}

  {mode === "edit" &&
    existingContractorAttachments.length > 0 && (
      <div className="space-y-2">

        <p className="text-sm font-semibold text-gray-700">
          Existing Attachments
        </p>

        {existingContractorAttachments.map(
          (attachment, index) => (
            <div
              key={
                attachment._id ||
                attachment.file_path ||
                index
              }
              className="flex items-center justify-between gap-3 bg-gray-100 border rounded px-3 py-2"
            >
              <a
                href={`${API_IMG || ""}${attachment.file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 truncate text-sm text-blue-600 hover:underline"
              >
                📎 Attachment {index + 1}
              </a>

              <button
                type="button"
                onClick={() => {
                  // Remove from UI
                  setExistingContractorAttachments(
                    (prev) =>
                      prev.filter(
                        (item) =>
                          item.file_path !==
                          attachment.file_path
                      )
                  );

                  // Mark for backend deletion
                  setRemovedContractorAttachments(
                    (prev) =>
                      prev.includes(
                        attachment.file_path
                      )
                        ? prev
                        : [
                            ...prev,
                            attachment.file_path,
                          ]
                  );
                }}
                className="shrink-0 text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          )
        )}
      </div>
    )}

  {/* ============================= */}
  {/* NEW SELECTED ATTACHMENTS */}
  {/* ============================= */}

  {contractorAttachments.length > 0 && (
    <div className="space-y-2">

      <p className="text-sm font-semibold text-green-700">
        New Attachments
      </p>

      {contractorAttachments.map((file, index) => (
        <div
          key={`${file.name}-${file.lastModified}-${index}`}
          className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded px-3 py-2"
        >
          <div className="flex items-center gap-2 min-w-0">

            <span>📎</span>

            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700">
                Attachment {index + 1}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {file.name}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() => {
              setContractorAttachments(
                (prev) =>
                  prev.filter(
                    (_, i) => i !== index
                  )
              );
            }}
            className="shrink-0 text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )}

  {/* NOTHING */}
  {mode === "edit" &&
    existingContractorAttachments.length === 0 &&
    contractorAttachments.length === 0 && (
      <p className="text-sm text-gray-400">
        No attachments
      </p>
    )}
</div>
          <div className="col-span-2 flex gap-3">
            {mode === "create" && (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`text-white p-2 rounded w-full flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            )}
           {mode === "edit" && (
  <button
    type="submit"
    disabled={isSubmitting}
    className={`text-white p-2 rounded w-full flex items-center justify-center gap-2 ${
      isSubmitting
        ? "bg-green-400 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700 cursor-pointer"
    }`}
  >
    {isSubmitting ? (
      <>
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        Updating...
      </>
    ) : (
      "Update"
    )}
  </button>
)}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContractorForm;
