import React from "react";
import { getUserData } from "../utilities/auth";

const MainPageDesing = ({ viewingRow }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toDateString(); // Returns format like "Wed Nov 19 2025"
  };

  return (
    <div className=" flex items-center w-full justify-center">
      {/* Printable Content */}
      <div className=" w-full" id="printable-form">
        <style>{`
                  @media print {
                    body * { visibility: hidden; }
                    #printable-form, #printable-form * { visibility: visible; }
                    #printable-form { position: absolute; left: 0; top: 0; width: 100%; }
                    .print\\:hidden { display: none !important; }
                    @page { 
                      margin: 0.5cm;
                      size: A4;
                    }
                    /* Force background colors to print */
                    * {
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                      color-adjust: exact !important;
                    }
                  }
                  .print-table { border-collapse: collapse; width: 100%; }
                  .print-table td, .print-table th { border: 1px solid black; padding: 4px 8px; font-size: 10px; }
                  .print-table .header-cell { background-color: #e5e7eb; font-weight: 600; }
                  /* Ensure colors show in print */
                  .bg-blue-500 {
                    background-color: #3b82f6 !important;
                  }
                  .bg-\\[\\#861517\\] {
                    background-color: #861517 !important;
                  }
                `}</style>

        {/* Header Section */}
        <table className="print-table mb-2">
          <tbody>
            <tr>
              <td colSpan="3" className="text-center font-bold bg-gray-100 ">
                <h1 className="text-base">REQUEST FOR INSPECTION (RFI)</h1>
              </td>
            </tr>
          </tbody>
        </table>
        {/* Main Form Table */}
        <table className="print-table mb-2">
          <tbody>
            {/* RFI Basic Info */}
            <tr>
              <td className="header-cell" style={{ width: "20%" }}>
                RFI No.
              </td>
              <td style={{ width: "30%" }}>{viewingRow.rfi_no}</td>
              <td className="header-cell" style={{ width: "20%" }}>
                Date of RFI
              </td>
              <td style={{ width: "30%" }}>
                {formatDate(viewingRow.date_of_rfi)}
              </td>
            </tr>
            <tr>
              <td className="header-cell">Previously Requested</td>
              <td>
                [ {viewingRow.previously_requested === "no" ? "No" : "  "} ] | [{" "}
                {viewingRow.previously_requested === "yes" ? "Yes" : "  "} ]
              </td>
              <td className="header-cell">Previous RFI No.</td>
              <td>{viewingRow.previous_rfi_no || ""}</td>
            </tr>
            <tr>
              <td className="header-cell">Date of Inspection:</td>
              <td>{formatDate(viewingRow.date_of_inspection)}</td>
              <td className="header-cell">Time of Inspection:</td>
              <td>{viewingRow.time_of_inspection}</td>
            </tr>
            <tr>
              <td className="header-cell">Location</td>
              <td>{viewingRow.location}</td>
              <td className="header-cell">Type of Work Activity</td>
              <td>{viewingRow.type_of_activity}</td>
            </tr>
            <tr>
              <td className="header-cell">Bill No.</td>
              <td>{viewingRow.bill_no}</td>
              <td className="header-cell">BOQ Item No.</td>
              <td>{viewingRow.boq_item_no}</td>
            </tr>
            <tr>
              <td className="header-cell">Drawing Ref No.</td>
              <td colSpan="3">{viewingRow.drawing_ref_no}</td>
            </tr>

            {/* Contractor Section */}
            <tr>
              <td colSpan="2" className="bg-blue-500 text-white">
                Requested by <strong>Contractor's</strong> Authorized
                Representative
              </td>
              <td colSpan="2" className="bg-[#861517] text-white">
                Received by <strong>Consultant's</strong> Authorized
                Representative
              </td>
            </tr>
            <tr>
              <td className="header-cell" style={{ width: "15%" }}>
                Signature:
              </td>
              <td style={{ height: "20px" }}></td>
              <td className="header-cell" style={{ width: "15%" }}>
                Signature:
              </td>
              <td style={{ height: "20px" }}></td>
            </tr>
            <tr>
              <td className="header-cell">Name:</td>
              <td>{viewingRow.contractor_name}</td>
              <td className="header-cell">Name:</td>
              <td>{viewingRow.consultant_name}</td>
            </tr>
            <tr>
              <td className="header-cell">Date:</td>
              <td>{formatDate(viewingRow.contractor_submit_date)}</td>
              <td className="header-cell">Date:</td>
              <td>{viewingRow.consultant_update_date}</td>
            </tr>
            <tr>
              <td className="header-cell">Time:</td>
              <td>{viewingRow.contractor_submit_time}</td>
              <td className="header-cell">Time:</td>
              <td>{viewingRow.consultant_update_time}</td>
            </tr>

            {/* Inspection Notes */}
            {getUserData().role === "inspector" ||
            getUserData().role === "surveyor" ||
            getUserData().role === "me" ? (
              ""
            ) : (
              <>
                <tr>
                  <td
                    colSpan="4"
                    className="text-center font-bold bg-[#861517] text-white"
                  >
                    Inspection Notes by Inspectors and Key Staff
                  </td>
                </tr>

                {/* Inspector Section */}

                <strong className="whitespace-nowrap text-xs">
                  Inspector:
                </strong>
                <tr>
                  <td className="header-cell">Name:</td>
                  <td>{viewingRow.inspector_name}</td>
                  <td className="header-cell">Status:</td>
                  <td>
                    <strong>
                      {viewingRow.inspector_status === "okay" ? "Pass" : "Fail"}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td className="header-cell">Date:</td>
                  <td>{viewingRow.inspector_update_date}</td>
                  <td className="header-cell">Time:</td>
                  <td>{viewingRow.inspector_update_time}</td>
                </tr>
                <tr>
                  <td colSpan="4" className="header-cell">
                    <strong>Remarks:</strong> {viewingRow.inspector_remarks}
                  </td>
                </tr>
              </>
            )}
            {/* Surveyor Section */}
            {getUserData().role === "inspector" ||
            getUserData().role === "surveyor" ||
            getUserData().role === "me" ? (
              ""
            ) : (
              <>
                <tr>
                  <strong className="whitespace-nowrap text-xs">
                    Surveyor:
                  </strong>
                </tr>
                <tr>
                  <td className="header-cell">Name:</td>
                  <td>{viewingRow.surveyor_name}</td>
                  <td className="header-cell">Status:</td>
                  <td>
                    {" "}
                    <strong>
                      {viewingRow.surveyor_status === "okay"
                        ? "Pass"
                        : viewingRow.surveyor_status === "not_okay"
                        ? "Fail"
                        : ""}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td className="header-cell">Date:</td>
                  <td>{viewingRow.surveyor_update_date}</td>
                  <td className="header-cell">Time:</td>
                  <td>{viewingRow.surveyor_update_time}</td>
                </tr>
                <tr>
                  <td colSpan="4" className="header-cell">
                    <strong>Remarks:</strong> {viewingRow.surveyor_remarks}
                  </td>
                </tr>
              </>
            )}
            {/* Material Engineer (ME) Section */}
            {getUserData().role === "inspector" ||
            getUserData().role === "surveyor" ||
            getUserData().role === "me" ? (
              ""
            ) : (
              <>
                <tr>
                  <strong className="whitespace-nowrap text-xs">
                    Material Engineer (ME):
                  </strong>
                </tr>
                <tr>
                  <td className="header-cell">Name:</td>
                  <td>{viewingRow.me_name}</td>
                  <td className="header-cell">Status:</td>
                  <td>
                    {" "}
                    <strong>
                      {viewingRow.me_status === "okay"
                        ? "Pass"
                        : viewingRow.me_status === "not_okay"
                        ? "Fail"
                        : ""}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td className="header-cell">Date:</td>
                  <td>{viewingRow.me_update_date}</td>
                  <td className="header-cell">Time:</td>
                  <td>{viewingRow.me_update_time}</td>
                </tr>
                <tr>
                  <td colSpan="4" className="header-cell">
                    <strong>Remarks:</strong> {viewingRow.me_remarks}
                  </td>
                </tr>
              </>
            )}
            {/* Assistant Resident Engineer (ARE) Section */}
            {getUserData().role === "contractor_rep" && (
              <>
                <tr>
                  <strong className="whitespace-nowrap text-xs">
                    Assistant Resident Engineer (ARE):
                  </strong>
                </tr>
                <tr>
                  <td className="header-cell">Name:</td>
                  <td>{viewingRow.are_name}</td>
                  <td className="header-cell">Status:</td>
                  <td>
                    {" "}
                    <strong>
                      {viewingRow.are_status === "okay"
                        ? "Pass"
                        : viewingRow.are_status === "not_okay"
                        ? "Fail"
                        : ""}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td className="header-cell">Date:</td>
                  <td>{viewingRow.are_update_date}</td>
                  <td className="header-cell">Time:</td>
                  <td>{viewingRow.are_update_time}</td>
                </tr>
                <tr>
                  <td colSpan="4" className="header-cell">
                    <strong>Remarks:</strong> {viewingRow.are_remarks}
                  </td>
                </tr>
              </>
            )}
            {/* Assistant Resident Engineer (ARE) Section */}
            {getUserData().role === "re" && (
              <>
                <tr>
                  <strong className="whitespace-nowrap text-xs">
                    Assistant Resident Engineer (ARE):
                  </strong>
                </tr>
                <tr>
                  <td className="header-cell">Name:</td>
                  <td>{viewingRow.are_name}</td>
                  <td className="header-cell">Status:</td>
                  <td>
                    {" "}
                    <strong>
                      {viewingRow.are_status === "okay"
                        ? "Pass"
                        : viewingRow.are_status === "not_okay"
                        ? "Fail"
                        : ""}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td className="header-cell">Date:</td>
                  <td>{viewingRow.are_update_date}</td>
                  <td className="header-cell">Time:</td>
                  <td>{viewingRow.are_update_time}</td>
                </tr>
                <tr>
                  <td colSpan="4" className="header-cell">
                    <strong>Remarks:</strong> {viewingRow.are_remarks}
                  </td>
                </tr>
              </>
            )}
            {/* Assistant Resident Engineer (ARE) Section */}
            {getUserData().role === "consultant_rep" && (
              <>
                <tr>
                  <strong className="whitespace-nowrap text-xs">
                    Assistant Resident Engineer (ARE):
                  </strong>
                </tr>
                <tr>
                  <td className="header-cell">Name:</td>
                  <td>{viewingRow.are_name}</td>
                  <td className="header-cell">Status:</td>
                  <td>
                    {" "}
                    <strong>
                      {viewingRow.are_status === "okay"
                        ? "Pass"
                        : viewingRow.are_status === "not_okay"
                        ? "Fail"
                        : ""}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td className="header-cell">Date:</td>
                  <td>{viewingRow.are_update_date}</td>
                  <td className="header-cell">Time:</td>
                  <td>{viewingRow.are_update_time}</td>
                </tr>
                <tr>
                  <td colSpan="4" className="header-cell">
                    <strong>Remarks:</strong> {viewingRow.are_remarks}
                  </td>
                </tr>
              </>
            )}
            {/* RE Section */}
            {getUserData().role === "contractor_rep" && (
              <>
                <tr>
                  <td
                    colSpan="4"
                    className="text-center font-bold bg-[#861517] text-white"
                  >
                    Resident Engineer's Remarks
                  </td>
                </tr>
                <tr>
                  <td className="header-cell">Name:</td>
                  <td>{viewingRow.re_name}</td>
                  <td className="header-cell">Date:</td>
                  <td>{viewingRow.re_update_date}</td>
                </tr>
                <tr>
                  <td className="header-cell" style={{ width: "15%" }}>
                    Approved
                  </td>
                  <td style={{ width: "10%" }}>
                    {viewingRow.re_status === "okay" ? "✓" : ""}
                  </td>
                  <td className="header-cell" style={{ width: "15%" }}>
                    Not Approved
                  </td>
                  <td style={{ width: "10%" }}>
                    {viewingRow.re_status === "not_okay" ? "✓" : ""}
                  </td>
                </tr>
                <td colSpan="4" className="header-cell">
                  <strong>Remarks:</strong> {viewingRow.re_remarks}
                </td>
                <tr>
                  <td className="header-cell">Signature:</td>
                  <td colSpan="3" style={{ height: "20px" }}></td>
                </tr>
              </>
            )}
            {/* RE Section */}
            {getUserData().role === "consultant_rep" && (
              <>
                <tr>
                  <td
                    colSpan="4"
                    className="text-center font-bold bg-[#861517] text-white"
                  >
                    Resident Engineer's Remarks
                  </td>
                </tr>
                <tr>
                  <td className="header-cell">Name:</td>
                  <td>{viewingRow.re_name}</td>
                  <td className="header-cell">Date:</td>
                  <td>{viewingRow.re_update_date}</td>
                </tr>
                <tr>
                  <td className="header-cell" style={{ width: "15%" }}>
                    Approved
                  </td>
                  <td style={{ width: "10%" }}>
                    {viewingRow.re_status === "okay" ? "✓" : ""}
                  </td>
                  <td className="header-cell" style={{ width: "15%" }}>
                    Not Approved
                  </td>
                  <td style={{ width: "10%" }}>
                    {viewingRow.re_status === "not_okay" ? "✓" : ""}
                  </td>
                </tr>
                <td colSpan="4" className="header-cell">
                  <strong>Remarks:</strong> {viewingRow.re_remarks}
                </td>
                <tr>
                  <td className="header-cell">Signature:</td>
                  <td colSpan="3" style={{ height: "20px" }}></td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainPageDesing;
