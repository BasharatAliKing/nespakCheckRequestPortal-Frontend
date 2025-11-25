import React, { useEffect, useState } from "react";
import KpisCard from "../components/KpisCard";
import { getToken } from "../utilities/auth";
const API_URL = import.meta.env.VITE_API_BASE_URL;
const KpisPage = () => {
  const [listProjects, setListProjects] = useState([]);
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
    contractor_name: "",
    contractor_submit_date: "",
    contractor_submit_time: "",
  });

  // API to fetch porjects
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch projects");
      setListProjects(data.projects);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{ 
        const res =await fetch(`${API_URL}/main-form`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(formDate)
        });
        const data = await res.json();
        if(!res.ok) throw new Error('Failed to submit RFI form');
        alert('RFI form submitted successfully');
    }catch(err){
        console.log(err);
    }
  };
  console.log(formDate);
  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <div className="md:w-1/4 h-screen flex items-center  mx-auto">
      <KpisCard />

      <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white rounded p-4 space-y-3"
        >
          <h3 className="text-lg font-medium">Create RFI</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1 flex flex-col text-black">
              <label className="text-sm" htmlFor="rfi_no">
                Select Project
              </label>
              <select
                name=""
                id=""
                value={formDate.project_id}
                onChange={(e) =>
                  setFormDate((s) => ({ ...s, project_id: e.target.value }))
                }
                className="w-full border rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Option</option>
                {listProjects.map((project, index) => (
                  <option key={index} value={project._id}>
                    {project.project_title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm" htmlFor="rfi_no">
                RFI No
              </label>
              <input
                type="text"
                value={formDate.rfi_no}
                onChange={(e) =>
                  setFormDate((s) => ({ ...s, rfi_no: e.target.value }))
                }
                className="w-full border rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm" htmlFor="date_of_rfi">
                Date of RFI
              </label>
              <input
                type="date"
                value={formDate.date_of_rfi}
                onChange={(e) =>
                  setFormDate((s) => ({ ...s, date_of_rfi: e.target.value }))
                }
                className="w-full border rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm" htmlFor="date_of_rfi">
                Previously Requested
              </label>
              <div className="flex gap-5">
                <label className="flex gap-1 font-medium text-sm items-center">
                  <input
                    type="radio"
                    className="cursor-pointer"
                    name="previously_requested"
                    value="yes"
                    checked={formDate.previously_requested === "yes"}
                    onChange={(e) =>
                      setFormDate((s) => ({
                        ...s,
                        previously_requested: e.target.value,
                      }))
                    }
                  />
                  Yes
                </label>
                <label className="flex gap-1 font-medium text-sm items-center">
                  <input
                    type="radio"
                    className="cursor-pointer"
                    name="previously_requested"
                    value="no"
                    checked={formDate.previously_requested === "no"}
                    onChange={(e) =>
                      setFormDate((s) => ({
                        ...s,
                        previously_requested: e.target.value,
                      }))
                    }
                  />
                  No
                </label>
              </div>
            </div>
            {formDate.previously_requested === "yes" && (
              <div className="space-y-1">
                <label className="text-sm" htmlFor="date_of_rfi">
                  Previous RFI No.
                </label>
                <input
                  type="text"
                  value={formDate.previous_rfi_no}
                  onChange={(e) =>
                    setFormDate((s) => ({
                      ...s,
                      previous_rfi_no: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm" htmlFor="date_of_rfi">
                Date of Inspection
              </label>
              <input
                type="date"
                value={formDate.date_of_inspection}
                onChange={(e) =>
                  setFormDate((s) => ({
                    ...s,
                    date_of_inspection: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm" htmlFor="date_of_rfi">
                Time of Inspection
              </label>
              <input
                type="time"
                value={formDate.time_of_inspection}
                onChange={(e) =>
                  setFormDate((s) => ({
                    ...s,
                    time_of_inspection: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm" htmlFor="date_of_rfi">
                Location
              </label>
              <input
                type="text"
                value={formDate.location}
                onChange={(e) =>
                  setFormDate((s) => ({ ...s, location: e.target.value }))
                }
                className="w-full border rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm" htmlFor="date_of_rfi">
                Type Of Activity
              </label>
              <input
                type="text"
                value={formDate.type_of_activity}
                onChange={(e) =>
                  setFormDate((s) => ({
                    ...s,
                    type_of_activity: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm" htmlFor="date_of_rfi">
                Bill No
              </label>
              <input
                type="text"
                value={formDate.bill_no}
                onChange={(e) =>
                  setFormDate((s) => ({ ...s, bill_no: e.target.value }))
                }
                className="w-full border rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm" htmlFor="date_of_rfi">
                BOQ Item No
              </label>
              <input
                type="text"
                value={formDate.boq_item_no}
                onChange={(e) =>
                  setFormDate((s) => ({ ...s, boq_item_no: e.target.value }))
                }
                className="w-full border rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm" htmlFor="date_of_rfi">
                Drawind Ref No
              </label>
              <input
                type="text"
                value={formDate.drawing_ref_no}
                onChange={(e) =>
                  setFormDate((s) => ({ ...s, drawing_ref_no: e.target.value }))
                }
                className="w-full border rounded px-3 py-1 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-500 p-2 rounded-md text-white font-medium cursor-pointer col-span-2">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KpisPage;
