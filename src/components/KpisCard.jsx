import React, { useEffect, useState } from "react";
import { CiFileOn } from "react-icons/ci";
import { FaFile } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import Select from "react-select";
import { getToken, getUserData } from "../utilities/auth";
const API_URL = import.meta.env.VITE_API_BASE_URL;
const KpisCard = ({
  handleRfiFormOpen,
  kpiscontractor,
  value,
  projects,
  option,
  setOption,
}) => {
  const [showContractortable, setShowContractorForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedBox, setSelectedBox] = useState("all");
  const [statusData, setStatusData] = useState([]);
  const options = [
    { value: "", label: "All Project" }, // 👈 null option
    ...projects.map((project) => ({
      value: project._id,
      label: project.project_title,
    })),
  ];
  const userRole = getUserData()?.role;
  const role = userRole?.replace("_rep", "");
  const getTableData = async () => {
    try {
      const res = await fetch(option?.value
  ? `${API_URL}/main-form/status/${option.value}/${role}/${selectedBox}`
  : `${API_URL}/main-form/status/${role}/${selectedBox}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (!res.ok) {
        console.log("Failed to Fetch Data by Status.");
      }
      const data = await res.json();
      console.log(data);
      setStatusData(data.data);
    }catch(err){
      console.log(err);
    }
  };
  useEffect(() => {
    getTableData();
  }, [selectedBox,setOption,option]);
  return (
    <>
      <div className="border border-gray-200 relative w-full grid grid-cols-2 gap-2  p-4 rounded-lg shadow-md">
        <div className="col-span-2 cursor-pointer">
          <Select
            placeholder="Select Project"
            value={option}
            options={options}
            onChange={setOption}
            classNames={{
              control: ({ isFocused }) =>
                `cursor-pointer p-0 border text-sm rounded-md 
          `,
            }}
          />
        </div>
        {value === "contractor" ? (
          <>
            <div
              onClick={() => {
                setShowContractorForm(true);
                setSelectedBox("all");
              }}
              className="cursor-pointer bg-green-500 flex flex-col relative col-span-2 p-2 rounded-md  text-white"
            >
              <h1 className="text-3xl font-medium">
                { role ==='contractor' ? kpiscontractor?.total_request : kpiscontractor?.consultant_total || 0}
              </h1>
              <p className="text-sm">Total Requests</p>
              <CiFileOn className="absolute text-5xl text-white right-2 top-0 h-full" />
            </div>
           {
            role === 'contractor' ?(
              <>
               <div
              onClick={() => {
                setSelectedBox("pending");
                setShowContractorForm(true);
              }}
              className="cursor-pointer bg-yellow-500 flex flex-col relative p-2 rounded-md text-white"
            >
              <h1 className="text-3xl font-medium">
                {kpiscontractor?.pending_request || 0}
              </h1>
              <p className="text-sm">Pending</p>
              <CiFileOn className="absolute text-3xl text-white right-2 top-0 h-full" />
            </div>
            <div
              onClick={() => {
                setSelectedBox("received");
                setShowContractorForm(true);
              }}
              className="cursor-pointer bg-green-900 flex flex-col relative p-2 rounded-md text-white"
            >
              <h1 className="text-3xl font-medium">
                {kpiscontractor?.received_request || 0}
              </h1>
              <p className="text-sm">Received</p>
              <CiFileOn className="absolute text-3xl text-white right-2 top-0 h-full" />
            </div>
            <div
              onClick={() => {
                setSelectedBox("approved");
                setShowContractorForm(true);
              }}
              className="cursor-pointer bg-green-700 flex flex-col relative p-2 rounded-md text-white"
            >
              <h1 className="text-3xl font-medium">
                {kpiscontractor?.approved || 0}
              </h1>
              <p className="text-sm">Approved</p>
              <CiFileOn className="absolute text-3xl text-white right-2 top-0 h-full" />
            </div>
            <div
              onClick={() => {
                setSelectedBox("not_approved");
                setShowContractorForm(true);
              }}
              className="cursor-pointer bg-red-400 flex flex-col relative p-2 rounded-md text-white"
            >
              <h1 className="text-3xl font-medium">
                {kpiscontractor?.not_approved || 0}
              </h1>
              <p className="text-sm">Not Approved</p>
              <CiFileOn className="absolute text-3xl text-white right-2 top-0 h-full" />
            </div>
            <div
              onClick={() => {
                setSelectedBox("expired");
                setShowContractorForm(true);
              }}
              className="cursor-pointer bg-red-500 flex flex-col relative p-2 rounded-md text-white"
            >
              <h1 className="text-3xl font-medium">
                {kpiscontractor?.expired || 0}
              </h1>
              <p className="text-sm">Expired</p>
              <CiFileOn className="absolute text-3xl text-white right-2 top-0 h-full" />
            </div>
            <div title="Add New RFI" onClick={() => handleRfiFormOpen(true)}>
              {" "}
              <IoMdAdd className="absolute text-2xl bg-green-500 text-white right-3 bottom-3 rounded-md p-[2px] h-7 w-7 cursor-pointer" />
            </div>
              </>
            ):(
              <>
               <div
              onClick={() => {
                setSelectedBox("pending");
                setShowContractorForm(true);
              }}
              className="cursor-pointer bg-green-900 flex flex-col relative p-2 rounded-md text-white"
            >
              <h1 className="text-3xl font-medium">
                {kpiscontractor?.consultant_pending || 0}
              </h1>
              <p className="text-sm">Pending</p>
              <CiFileOn className="absolute text-3xl text-white right-2 top-0 h-full" />
            </div>
               <div
              onClick={() => {
                setSelectedBox("pending");
                setShowContractorForm(true);
              }}
              className="cursor-pointer bg-yellow-600 flex flex-col relative p-2 rounded-md text-white"
            >
              <h1 className="text-3xl font-medium">
                {kpiscontractor?.consultant_received_from_contractor || 0}
              </h1>
              <p className="text-sm">Received Contractor</p>
              <CiFileOn className="absolute text-3xl text-white right-2 top-0 h-full" />
            </div>
               <div
              onClick={() => {
                setSelectedBox("pending");
                setShowContractorForm(true);
              }}
              className="cursor-pointer bg-pink-900 flex flex-col relative p-2 rounded-md text-white"
            >
              <h1 className="text-3xl font-medium">
                {kpiscontractor?.consultant_send_to_contractor || 0}
              </h1>
              <p className="text-sm">Sent To Contractor</p>
              <CiFileOn className="absolute text-3xl text-white right-2 top-0 h-full" />
            </div>
          
               <div
              onClick={() => {
                setSelectedBox("pending");
                setShowContractorForm(true);
              }}
              className="cursor-pointer bg-purple-700 flex flex-col relative p-2 rounded-md text-white"
            >
              <h1 className="text-3xl font-medium">
                {kpiscontractor?.consultant_received_from_re || 0}
              </h1>
              <p className="text-sm">Received from RE</p>
              <CiFileOn className="absolute text-3xl text-white right-2 top-0 h-full" />
            </div>
               <div
              onClick={() => {
                setSelectedBox("expired");
                setShowContractorForm(true);
              }}
              className="cursor-pointer bg-red-600 flex flex-col relative p-2 rounded-md text-white"
            >
              <h1 className="text-3xl font-medium">
                {kpiscontractor?.consultant_expired || 0}
              </h1>
              <p className="text-sm">Expired</p>
              <CiFileOn className="absolute text-3xl text-white right-2 top-0 h-full" />
            </div>
            </>
            )
           }
          </>
        ) : null}
      </div>
      {/* table code here */}
      {showContractortable && (
        <div
          onClick={() => setShowContractorForm(false)}
          className="fixed inset-0 bg-[#00000076] grid place-items-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="overflow-auto max-h-[80vh] bg-white p-5 rounded-md"
          >
            <h1 className="text-xl font-medium my-2">
              Requests <span className="capitalize">{selectedBox}</span>{" "}
            </h1>
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    #
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    RFI No.
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Project Name
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {statusData.length === 0 ? (
    <tr>
      <td colSpan="3" className="text-center py-4 text-gray-500">
        No records found
      </td>
    </tr>
  ) : (
    statusData.map((item, index) => (
      <tr key={index} className="border-b hover:bg-gray-50">
        <td className="px-4 py-2">{index +1}</td>
        <td className="px-4 py-2">{item.rfi_no || "No RFI No"}</td>

        <td className="px-4 py-2">
          {projects.find((p) => p._id === item.project_id)?.project_title ||
            "Unknown Project"}
        </td>

        <td className="px-4 py-2">
          <span className="px-2 py-1 capitalize text-sm rounded-full bg-green-100 text-green-700">
            {item[`${role}_status`] || "No Status"}
          </span>
        </td>
      </tr>
    ))
  )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default KpisCard;
