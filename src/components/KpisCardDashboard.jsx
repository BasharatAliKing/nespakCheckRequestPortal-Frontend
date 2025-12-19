import {
  Briefcase,
  ClipboardEditIcon,
  FileEdit,
  FolderKanban,
  UserCheck,
  UserCircle,
  Users,
  Users2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken, getUserData } from "../utilities/auth";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const KpisCardDashboard = ({ refresh }) => {
  const [kpiData, setKpiData] = useState([]);
  const [kpiUser, setKpiUser] = useState([]);
  const [kpiClients, setKpiClients] = useState([]);
  const [kpiContractors, setKpiContractors] = useState([]);
  const [kpiConsultant, setKpiConsultant] = useState([]);
  const [kpiProjects, setKpiProjects] = useState([]);
  const [kpiMainForm, setKpiMainForm] = useState([]);
  const role = getUserData()?.role || "Guest";
  const kpisConfig = {
    admin: [
      {
        label: "Total Users",
        value: kpiUser.length,
        link: "/users",
        bg: "from-blue-500 to-blue-700",
        icon: "👥",
      },
      {
        label: "Total Clients",
        value: kpiClients.length,
        link: "/clients",
        bg: "from-teal-500 to-cyan-600",
        icon: "🏢",
      },
      {
        label: "Total Contractors",
        value: kpiContractors.length,
        link: "/contractors",
        bg: "from-green-500 to-green-700",
        icon: "🔨",
      },
      {
        label: "Total Consultants",
        value: kpiConsultant.length,
        link: "/consultants",
        bg: "from-purple-500 to-purple-700",
        icon: "💼",
      },
      {
        label: "Total Projects",
        value: kpiProjects.length,
        link: "/projects",
        bg: "from-orange-500 to-orange-700",
        icon: "🗂️",
      },
      {
        label: "Forms Submitted",
        value: kpiMainForm.length,
        link: "/main-form",
        bg: "from-red-500 to-red-700",
        icon: "📋",
      },
    ],
    contractor_rep: [
      {
        label: "Total Requests",
        value: kpiData?.constractor?.total_request,
        link: "/contractor/all",
        bg: "from-indigo-500 to-indigo-700",
        icon: "📁",
      },
       {
        label: "Pending Requests",
        value: kpiData?.constractor?.pending_request,
        link: "/contractor/pending",
        bg: "from-yellow-500 to-yellow-700",
        icon: "⏳",
      },
       {
        label: "Received From Consultant",
        value: kpiData?.constractor?.received_from_consultant,
        link: "/contractor/received_from_consultant",
        bg: "from-gray-500 to-gray-700",
        icon: "🔄",
      },
      {
        label: "InProgress Requests",
        value: kpiData?.constractor?.received_request,
        link: "/contractor/received",
        bg: "from-green-500 to-green-700",
        icon: "📨",
      },
      {
        label: "Approved Requests",
        value: kpiData?.constractor?.approved,
        link: "/contractor/approved",
        bg: "from-pink-500 to-pink-700",
        icon: "🔄",
      },
      {
        label: "Revert Requests",
        value: kpiData?.constractor?.revert,
        link: "/contractor/revert",
        bg: "from-purple-500 to-purple-700",
        icon: "🔄",
      },
     
      {
        label: "Expired",
        value: kpiData?.constractor?.expired,
        link: "/contractor/expired",
        bg: "from-red-500 to-red-700",
        icon: "📋",
      },
    ],
    consultant_rep: [
      {
        label: "Total Requests",
        value: kpiData?.consultant?.consultant_total,
        link: "/consultant/all",
        bg: "from-indigo-500 to-indigo-700",
        icon: "📁",
      },
      {
        label: "Pending Requests",
        value: kpiData?.consultant?.consultant_pending,
        link: "/consultant/pending",
        bg: "from-teal-500 to-cyan-600",
        icon: "📁",
      },
      {
        label: "Received from Cont...",
        value: kpiData?.consultant?.consultant_received_from_contractor,
        link: "/consultant/received_from_contractor",
        bg: "from-green-500 to-green-700",
        icon: "📨",
      },
      // {
      //   label: "Send to Contractor",
      //   value: kpiData?.consultant?.consultant_send_to_contractor,
      //   link: "/consultant/consultant_send_to_contractor",
      //   bg: "from-purple-500 to-purple-700",
      //   icon: "⏳",
      // },
      {
        label: "Received from RE",
        value: kpiData?.consultant?.consultant_received_from_re,
        link: "/consultant/received_from_re",
        bg: "from-yellow-500 to-yellow-700",
        icon: "⏳",
      },
      {
        label: "Revert Requests",
        value: kpiData?.consultant?.consultant_revert,
        link: "/consultant/revert",
        bg: "from-orange-500 to-orange-700",
        icon: "⏳",
      },
      {
        label: "Approved Requests",
        value: kpiData?.consultant?.consultant_approved,
        link: "/consultant/approved",
        bg: "from-pink-500 to-pink-700",
        icon: "⏳",
      },
      {
        label: "Expired",
        value: kpiData?.consultant?.consultant_expired,
        link: "/consultant/expired",
        bg: "from-red-500 to-red-700",
        icon: "📋",
      },
    ],
    inspector: [
      {
        label: "Total Requests",
        value: kpiData?.inspector?.inspector_total,
        link: "/inspector/all",
        bg: "from-indigo-500 to-indigo-700",
        icon: "📁",
      },
      {
        label: "Pass Requests",
        value: kpiData?.inspector?.inspector_okay,
        link: "/inspector/okay",
        bg: "from-teal-500 to-cyan-600",
        icon: "📁",
      },
      {
        label: "Fail Requests",
        value: kpiData?.inspector?.inspector_not_okay,
        link: "/inspector/not_okay",
        bg: "from-green-500 to-green-700",
        icon: "📨",
      },
      {
        label: "Pending Requests",
        value: kpiData?.inspector?.inspector_pending,
        link: "/inspector/pending",
        bg: "from-purple-500 to-purple-700",
        icon: "⏳",
      },
      {
        label: "Expired",
        value: kpiData?.inspector?.inspector_expired,
        link: "/inspector/expired",
        bg: "from-yellow-500 to-yellow-700",
        icon: "⏳",
      },
    ],
    surveyor: [
      {
        label: "Total Requests",
        value: kpiData?.surveyor?.surveyor_total,
        link: "/surveyor/all",
        bg: "from-indigo-500 to-indigo-700",
        icon: "📁",
      },
      {
        label: "Pass Requests",
        value: kpiData?.surveyor?.surveyor_okay,
        link: "/surveyor/okay",
        bg: "from-teal-500 to-cyan-600",
        icon: "📁",
      },
      {
        label: "Fail Requests",
        value: kpiData?.surveyor?.surveyor_not_okay,
        link: "/surveyor/not_okay",
        bg: "from-green-500 to-green-700",
        icon: "📨",
      },
      {
        label: "Pending Requests",
        value: kpiData?.surveyor?.surveyor_pending,
        link: "/surveyor/pending",
        bg: "from-purple-500 to-purple-700",
        icon: "⏳",
      },
      {
        label: "Expired",
        value: kpiData?.surveyor?.surveyor_expired,
        link: "/surveyor/expired",
        bg: "from-yellow-500 to-yellow-700",
        icon: "⏳",
      },
    ],
    me: [
      {
        label: "Total Requests",
        value: kpiData?.me?.me_total,
        link: "/me/all",
        bg: "from-indigo-500 to-indigo-700",
        icon: "📁",
      },
      {
        label: "Pass Requests",
        value: kpiData?.me?.me_okay,
        link: "/me/okay",
        bg: "from-teal-500 to-cyan-600",
        icon: "📁",
      },
      {
        label: "Fail Requests",
        value: kpiData?.me?.me_not_okay,
        link: "/me/not_okay",
        bg: "from-green-500 to-green-700",
        icon: "📨",
      },
      {
        label: "Pending Requests",
        value: kpiData?.me?.me_pending,
        link: "/me/pending",
        bg: "from-purple-500 to-purple-700",
        icon: "⏳",
      },
      {
        label: "Expired",
        value: kpiData?.me?.me_expired,
        link: "/me/expired",
        bg: "from-yellow-500 to-yellow-700",
        icon: "⏳",
      },
    ],
    are: [
      {
        label: "Total Requests",
        value: kpiData?.are?.are_total,
        link: "/are/all",
        bg: "from-indigo-500 to-indigo-700",
        icon: "📁",
      },
      {
        label: "Pass Requests",
        value: kpiData?.are?.are_okay,
        link: "/are/okay",
        bg: "from-teal-500 to-cyan-600",
        icon: "📁",
      },
      {
        label: "Fail Requests",
        value: kpiData?.are?.are_not_okay,
        link: "/are/not_okay",
        bg: "from-green-500 to-green-700",
        icon: "📨",
      },
      {
        label: "Pending Requests",
        value: kpiData?.are?.are_pending,
        link: "/are/pending",
        bg: "from-purple-500 to-purple-700",
        icon: "⏳",
      },
      {
        label: "Expired",
        value: kpiData?.are?.are_expired,
        link: "/are/expired",
        bg: "from-yellow-500 to-yellow-700",
        icon: "⏳",
      },
    ],
    re: [
      {
        label: "Total Requests",
        value: kpiData?.re?.re_total,
        link: "/re/all",
        bg: "from-indigo-500 to-indigo-700",
        icon: "📁",
      },
      {
        label: "Approved Requests",
        value: kpiData?.re?.re_approved,
        link: "/re/okay",
        bg: "from-teal-500 to-cyan-600",
        icon: "📁",
      },
      {
        label: "Not Approved Requests",
        value: kpiData?.re?.re_not_approved,
        link: "/re/not_okay",
        bg: "from-green-500 to-green-700",
        icon: "📨",
      },
      {
        label: "Pending Requests",
        value: kpiData?.re?.re_pending,
        link: "/re/pending",
        bg: "from-purple-500 to-purple-700",
        icon: "⏳",
      },
      {
        label: "Expired",
        value: kpiData?.re?.re_expired,
        link: "/re/expired",
        bg: "from-yellow-500 to-yellow-700",
        icon: "⏳",
      },
    ],
  };
  const getKpisData = async () => {
    try {
      const res = await fetch(`${API_URL}/main-form/contractorkpis/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch KPI data");
      setKpiData(data.kpiData || []);
    } catch (err) {
      // console.log(err);
    }
  };
  // Fetch Users Data
  const getUsersData = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch Users data");
      setKpiUser(data.users || []);
    } catch (err) {
      // console.log(err);
    }
  };
  //fetch clients data
  const getClientsData = async () => {
    try {
      const res = await fetch(`${API_URL}/clients`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch Clients data");
      setKpiClients(data.clients || []);
    } catch (err) {
      // console.log(err);
    }
  };
  //fetch contractors data
  const getContractorsData = async () => {
    try {
      const res = await fetch(`${API_URL}/contractors`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch Contractors data");
      setKpiContractors(data.contractors || []);
    } catch (err) {
      // console.log(err);
    }
  };
  //fetch consultant data
  const getConsultantsData = async () => {
    try {
      const res = await fetch(`${API_URL}/consultants`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch Consultants data");
      setKpiConsultant(data.consultants || []);
    } catch (err) {
      // console.log(err);
    }
  };
  //fetch projects data
  const getProjectsData = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch Projects data");
      setKpiProjects(data.projects || []);
    } catch (err) {
      // console.log(err);
    }
  };
  //fetch main form data
  const getMainFormData = async () => {
    try {
      const res = await fetch(`${API_URL}/main-form`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch Main Form data");
      setKpiMainForm(data.contractorForms || []);
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    getKpisData();
    getUsersData();
    getClientsData();
    getContractorsData();
    getConsultantsData();
    getProjectsData();
    getMainFormData();
  }, [refresh]); // 🔥 runs again when contractor submits
  return (
    <>
      {/* Admin KPI Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpisConfig[role]?.map((kpi, index) => (
          <Link
            to={kpi.link}
            key={index}
            className={`bg-gradient-to-r cursor-pointer ${kpi.bg} text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 backdrop-blur-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium opacity-80">{kpi.label}</p>
                <h2 className="text-4xl font-bold mt-2">{kpi.value}</h2>
              </div>
              <div className="bg-white/20 p-4 rounded-full backdrop-blur">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default KpisCardDashboard;
