import React, { useEffect, useState } from "react";
import KpisCard from "../components/KpisCard";
import { getToken, getUserData , logout} from "../utilities/auth";
import { toast } from "react-toastify";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const KpisPage = () => {
  const [listProjects, setListProjects] = useState([]);
  const [listMainForm, setListMainForm] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  console.log(kpiData);
  const [projects, setProjects] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
  const [showContractorForm, setShowContractorForm] = useState(false);
  // Form state
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
  const userRole=getUserData()?.role || '';
  // Generate RFI number based on project and today's date
  const makeRfiNo = (projectId) => {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;
    const filteredForms = listMainForm.filter((form) => {
      const projectMatch = form.project_id === projectId;
      const formDateStr = form.date_of_rfi
        ? form.date_of_rfi.split("T")[0]
        : "";
      const dateMatch = formDateStr === todayStr;
      return projectMatch && dateMatch;
    });

    return `${year}${month}${day}-${String(filteredForms.length + 1).padStart(
      2,
      "0"
    )}`;
  };

  // Handle project selection
  const handleProjectSelect = (e) => {
    const projectId = e.target.value;
    setFormDate((prev) => ({
      ...prev,
      project_id: projectId,
      rfi_no: makeRfiNo(projectId),
    }));
  };
  // Toggle Contractor Form
  const handleRfiFormOpen = (val) => {
    setShowContractorForm(val);
  };
  // Fetch main form
  const mainForm = async () => {
    try {
      const res = await fetch(`${API_URL}/main-form`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch main form data");
      setListMainForm(data.contractorForms || []);
    } catch (err) {
      console.log(err);
    }
  };
  // Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch projects");
      setListProjects(data.projects || []);
    } catch (err) {
      console.log(err);
    }
  };
  const getKpisData = async () => {
    try {
      const res = await fetch(`${API_URL}/main-form/contractorkpis/${selectedOption===null? "" :`${selectedOption?.value}`}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch KPI data");
      setKpiData(data.kpiData || []);
    } catch (err) {
      console.log(err);
    }
  };
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Get current date and time
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    const submitDate = `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD
    const submitTime = `${hh}:${min}`; // HH:MM in 24-hour format

    const formDataWithDate = {
      ...formDate,
      contractor_submit_date: submitDate,
      contractor_submit_time: submitTime,
    };
    try {
      const res = await fetch(`${API_URL}/main-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formDataWithDate),
      });
      const data = await res.json();
      if (!res.ok) toast.error(data.message || "Failed to submit RFI form");
      else {
        toast.success("RFI form submitted successfully");
        setShowContractorForm(false);
        setFormDate({
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
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
  }, []);
  useEffect(() => {
    fetchProjects();
    getKpisData();
    mainForm();
  }, [formDate, selectedOption]);
  return (
 <>
    <Link to="/login" onClick={()=> logout()} className="absolute top-5 right-5 bg-red-500 p-3 py-1 rounded-md text-white font-medium text-sm cursor-pointer " >Logged Out</Link>
    <div className="md:w-1/4 h-screen flex items-center mx-auto ">
    {
      userRole === 'contractor_rep' ?
      <KpisCard
        kpiscontractor={kpiData.constractor}
        value="contractor"
        projects={listProjects}
        option={selectedOption}
        setOption={setSelectedOption}
        handleRfiFormOpen={handleRfiFormOpen}
      />
    : userRole ==='consultant_rep' ?
     <KpisCard
        kpiscontractor={kpiData.consultant}
        value="contractor"
        projects={listProjects}
        option={selectedOption}
        setOption={setSelectedOption}
        handleRfiFormOpen={handleRfiFormOpen}
      />
    :
     null
    }
      {showContractorForm && (
        <div className="fixed inset-0 bg-[#a7a6ba] grid place-items-center p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg relative bg-white rounded p-4 space-y-3"
          >
            <IoCloseCircleOutline
              onClick={() => setShowContractorForm(false)}
              className="absolute text-2xl top-3 right-3 cursor-pointer"
            />
            <h3 className="text-lg font-medium">Create RFI</h3>
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

              <button
                type="submit"
                className="bg-blue-500 p-2 rounded-md text-white font-medium cursor-pointer col-span-2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
 </>
 
  );
};

export default KpisPage;
