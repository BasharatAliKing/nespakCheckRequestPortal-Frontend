import React from "react";
import { getToken, getUserData } from "../utilities/auth";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_BASE_URL;
const Display = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold  md:max-w-[200px] lg:max-w-[300px] capitalize">
      {value}
    </p>
  </div>
);
const UpdateConsAfterRe = ({ selectedRow, hideConsAfterRe }) => {
  const role = getUserData()?.role || "";
  async function handlesubmit(e) {
    e.preventDefault();

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    const submitDate = `${yyyy}-${mm}-${dd}`;
    const submitTime = `${hh}:${min}`;

    const payload = {
        ...(role === "consultant_rep" && {
      cons_stat_name: getUserData().user_name,
      contractor_status:"received_from_consultant",
      consultant_status: "approved",
       cons_stat_time: submitTime,
        cons_stat_date: submitDate,
        }),
        ...(role === "contractor_rep" && {
          contractor_status:"approved",
          cont_rec_name: getUserData().user_name,
          cont_rec_date: submitDate,
          cont_rec_time: submitTime,
        })
    };
    try {
      const res = await fetch(`${API_URL}/main-form/${selectedRow._id}/`, {
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
        hideConsAfterRe();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }
  return (
    <div onClick={()=>{hideConsAfterRe()}} className="fixed inset-0 bg-black/30 grid w-full  overflow-y-scroll place-items-center p-4">
      <div  onClick={(e) => e.stopPropagation()} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md border">
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
        <Display label="Drawing Ref No" value={selectedRow?.drawing_ref_no} />
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
        <Display
          label="Contractor Submit Time"
          value={selectedRow?.contractor_submit_time || "—"}
        />
        <div className="col-span-3 flex gap-2 flex-col">
          <h1 className=" font-medium text-xl">Inspector</h1>
          <hr />
        </div>
        <Display
          label="Inspector Name"
          value={selectedRow?.inspector_name || "—"}
        />
        <Display
          label="Inspector Status"
          value={
            selectedRow?.inspector_status === "okay" ? "Pass" : "Fail" || "—"
          }
        />
        <Display
          label="Inspector Remarks"
          value={selectedRow?.inspector_remarks || "—"}
        />
        <Display
          label="Inspector Update Date"
          value={selectedRow?.inspector_update_date?.slice(0, 10) || "—"}
        />
        <Display
          label="Inspector Update Time"
          value={selectedRow?.inspector_update_time || "—"}
        />
        <div className="col-span-3 flex gap-2 flex-col">
          <h1 className=" font-medium text-xl">Surveyor</h1>
          <hr />
        </div>
        <Display
          label="Surveyor Name"
          value={selectedRow?.surveyor_name || "—"}
        />
        <Display
          label="Surveyor Status"
          value={
            selectedRow?.surveyor_status === "okay" ? "Pass" : "Fail" || "—"
          }
        />
        <Display
          label="Surveyor Remarks"
          value={selectedRow?.surveyor_remarks || "—"}
        />
        <Display
          label="Surveyor Update Date"
          value={selectedRow?.surveyor_update_date?.slice(0, 10) || "—"}
        />
        <Display
          label="Surveyor Update Time"
          value={selectedRow?.surveyor_update_time || "—"}
        />
        <div className="col-span-3 flex gap-2 flex-col">
          <h1 className=" font-medium text-xl">Material Engineer (ME)</h1>
          <hr />
        </div>
        <Display label="Me Name" value={selectedRow?.me_name || "—"} />
        <Display
          label="Me Status"
          value={selectedRow?.me_status === "okay" ? "Pass" : "Fail" || "—"}
        />
        <Display label="Me Remarks" value={selectedRow?.me_remarks || "—"} />
        <Display
          label="Me Update Date"
          value={selectedRow?.me_update_date?.slice(0, 10) || "—"}
        />
        <Display
          label="Me Update Time"
          value={selectedRow?.me_update_time || "—"}
        />
        <div className="col-span-3 flex gap-2 flex-col">
          <h1 className=" font-medium text-xl">
            Assistant Resident Engineer (ARE)
          </h1>
          <hr />
        </div>
        <Display label="ARE Name" value={selectedRow?.are_name || "—"} />
        <Display
          label="ARE Status"
          value={selectedRow?.are_status === "okay" ? "Pass" : "Fail" || "—"}
        />
        <Display label="ARE Remarks" value={selectedRow?.are_remarks || "—"} />
        <Display
          label="ARE Update Date"
          value={selectedRow?.are_update_date?.slice(0, 10) || "—"}
        />
        <Display
          label="ARE Update Time"
          value={selectedRow?.are_update_time || "—"}
        />
        <div className="col-span-3 flex gap-2 flex-col">
          <h1 className=" font-medium text-xl">Resident Engineer (RE)</h1>
          <hr />
        </div>
        <Display label="RE Name" value={selectedRow?.re_name || "—"} />
        <Display
          label="RE Status"
          value={selectedRow?.re_status === "okay" ? "Pass" : "Fail" || "—"}
        />
        <Display label="RE Remarks" value={selectedRow?.re_remarks || "—"} />
        <Display
          label="RE Update Date"
          value={selectedRow?.re_update_date?.slice(0, 10) || "—"}
        />
        <Display
          label="RE Update Time"
          value={selectedRow?.re_update_time || "—"}
        />
        <div className="col-span-3 flex gap-2 flex-col">
          <button
            onClick={handlesubmit}
            className="bg-green-500 py-2 px-3 cursor-pointer rounded-md text-base font-medium text-white"
          >
            Approve
          </button>
        </div>{" "}
      </div>
    </div>
  );
};

export default UpdateConsAfterRe;
