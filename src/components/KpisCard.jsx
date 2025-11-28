import React, { useState } from "react";
import { CiFileOn } from "react-icons/ci";
import { FaFile } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";

const KpisCard = ({ handleRfiFormOpen, kpiscontractor, value }) => {
     const [showContractortable, setShowContractorForm]=useState(false);
     
  return (
    <>
        <div className="border border-gray-200 relative w-full grid grid-cols-2 gap-2  p-4 rounded-lg shadow-md">
      {value === "contractor" ? (
          <>
          <div onClick={()=>setShowContractorForm(true)} className="cursor-pointer bg-green-500 flex flex-col relative col-span-2 p-2 rounded-md  text-white">
            <h1 className="text-3xl font-medium">
              {kpiscontractor?.total_request || 0}
            </h1>
            <p className="text-sm">Total Requests</p>
            <CiFileOn className="absolute text-5xl text-white right-2 top-0 h-full" />
          </div>
          <div className="bg-yellow-500 flex flex-col relative p-2 rounded-md text-white">
            <h1 className="text-3xl font-medium">
              {kpiscontractor?.pending_request || 0}
            </h1>
            <p className="text-sm">Pending</p>
            <CiFileOn className="absolute text-3xl text-white right-2 top-0 h-full" />
          </div>
          <div className="bg-green-900 flex flex-col relative p-2 rounded-md text-white">
            <h1 className="text-3xl font-medium">
              {kpiscontractor?.received_request || 0}
            </h1>
            <p className="text-sm">Received</p>
            <CiFileOn className="absolute text-3xl text-white right-2 top-0 h-full" />
          </div>
          <div className="bg-green-700 flex flex-col relative p-2 rounded-md text-white">
            <h1 className="text-3xl font-medium">
              {kpiscontractor?.approved || 0}
            </h1>
            <p className="text-sm">Approved</p>
            <CiFileOn className="absolute text-3xl text-white right-2 top-0 h-full" />
          </div>
          <div className="bg-red-400 flex flex-col relative p-2 rounded-md text-white">
            <h1 className="text-3xl font-medium">
              {kpiscontractor?.not_approved || 0}
            </h1>
            <p className="text-sm">Not Approved</p>
            <CiFileOn className="absolute text-3xl text-white right-2 top-0 h-full" />
          </div>
          <div className="bg-red-500 flex flex-col relative p-2 rounded-md text-white">
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
      ) : null}
      </div>
       {showContractortable && (
              <div onClick={()=> setShowContractorForm(false)} className="fixed inset-0 bg-[#00000076] grid place-items-center p-4">
             <div className="overflow-auto max-h-[80vh] bg-white p-5 rounded-md">
  <table className="min-w-full border border-gray-300 rounded-lg">
    <thead>
      <tr className="bg-gray-100 border-b">
        <th className="px-4 py-2 text-left font-semibold text-gray-700">RFI No.</th>
        <th className="px-4 py-2 text-left font-semibold text-gray-700">Project Name</th>
        <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b hover:bg-gray-50">
        <td className="px-4 py-2">RFI-001</td>
        <td className="px-4 py-2">ABC Tower Construction</td>
        <td className="px-4 py-2">
          <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-700">
            Completed
          </span>
        </td>
      </tr>
      <tr className="border-b hover:bg-gray-50">
        <td className="px-4 py-2">RFI-002</td>
        <td className="px-4 py-2">Shopping Mall Project</td>
        <td className="px-4 py-2">
          <span className="px-2 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
              </div>
            )}
    </>
  );
};

export default KpisCard;
