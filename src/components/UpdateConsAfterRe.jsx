import React from "react";
import { getToken, getUserData } from "../utilities/auth";
import { toast } from "react-toastify";
import MainPageDesing from "./MainPageDesing";
const API_URL = import.meta.env.VITE_API_BASE_URL;
const Display = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold  md:max-w-[200px] lg:max-w-[300px] capitalize">
      {value}
    </p>
  </div>
);
const UpdateConsAfterRe = ({selectedRow, hideConsAfterRe }) => {
  const role = getUserData()?.role || "";
  async function handlesubmit(e) {
    e.preventDefault();

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    let hours = now.getHours();
    const min = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hh = String(hours).padStart(2, "0");

    const submitDate = `${yyyy}-${mm}-${dd}`;
    const submitTime = `${hh}:${min} ${ampm}`;

    const payload = {
        ...(role === "consultant_rep" && {
      cons_stat_name: getUserData().user_name,
      contractor_status:"received_from_consultant",
      consultant_status: selectedRow.re_status === "okay" ? "approved" : "rejected",
       cons_stat_time: submitTime,
        cons_stat_date: submitDate,
        }),
        ...(role === "contractor_rep" && {
          contractor_status: selectedRow.re_status === "okay" ? "approved" : "rejected",
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
      <div  onClick={(e) => e.stopPropagation()} className="bg-gray-50 p-4 rounded-md w-3/4">
        <MainPageDesing viewingRow={selectedRow} />
        <div className=" flex gap-2 mt-2 w-full">
          <button
            onClick={handlesubmit}
            className="bg-green-500 py-2 px-3 cursor-pointer rounded-md text-base font-medium text-white"
          >
            Approve
          </button>
          <button
            onClick={hideConsAfterRe}
            className="bg-red-500 py-2 px-3 cursor-pointer rounded-md text-base font-medium text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateConsAfterRe;
