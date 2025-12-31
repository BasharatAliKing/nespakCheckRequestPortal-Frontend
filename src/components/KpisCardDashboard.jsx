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
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const statusData = [
  { name: "Revert", value: 5.9, color: "#3b82f6" },
  { name: "InProgress", value: 52.9, color: "#22c55e" },
  { name: "Pending", value: 17.6, color: "#facc15" },
  { name: "Expired", value: 2.9, color: "#ef4444" },
  { name: "Rejected", value: 14.7, color: "#6b7280" },
  { name: "Completed", value: 11.8, color: "#14b8a6" },
];

const monthlyData = [
  { month: "Jan", approval: 5 },
  { month: "Feb", approval: 9 },
  { month: "Mar", approval: 7 },
  { month: "Apr", approval: 11 },
  { month: "May", approval: 27 },
  { month: "Jun", approval: 29 },
  { month: "Jul", approval: 28 },
  { month: "Aug", approval: 35 },
  { month: "Sep", approval: 40 },
];

const recentRequests = [
  { id: "REQ-1023", type: "Electrical", status: "Pending", date: "22 Apr" },
  { id: "REQ-1019", type: "HVAC", status: "Pending", date: "16 Apr" },
  { id: "REQ-1018", type: "Civil", status: "Approved", date: "04 Apr" },
];

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
      const url =
        role === 'consultant_rep'
          ? `${API_URL}/main-form/contractorkpis`
          : `${API_URL}/main-form/contractorkpis/${role === 'contractor_rep' ? 'contractor': role}/${getUserData()._id}/`;
      const res = await fetch(url, {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
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

      <div className=" py-6 space-y-6 min-h-screen">
        {/* TOP GRID */}
        <div className="flex gap-6">
          {/* STATUS OVERVIEW */}
          <div className="bg-white w-[40%] rounded-xl shadow p-4">
            <h3 className="font-semibold mb-4">Requests Status Overview</h3>

            <div className="flex items-center gap-6">
              <PieChart width={180} height={180}>
                <Pie
                  data={statusData}
                  dataKey="value"
                  innerRadius={40}
                  outerRadius={80}
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>

              <div className="space-y-2 text-sm">
                {statusData.map((s, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: s.color }}
                      />
                      {s.name}
                    </span>
                    <span>{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* MONTHLY TREND */}
          <div className="bg-white w-[60%] rounded-xl shadow p-4">
            <h3 className="font-semibold mb-4">Monthly Requests Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="approval"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Recent Activity</h3>
            <div className="space-x-2">
              <button className="px-3 py-1 text-sm border rounded">View</button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                Edit
              </button>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-2">Request ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((r) => (
                <tr key={r.id} className="border-b last:border-none">
                  <td className="py-2 font-medium">#{r.id}</td>
                  <td>{r.type}</td>
                  <td
                    className={`font-medium ${
                      r.status === "Pending"
                        ? "text-yellow-500"
                        : "text-green-600"
                    }`}
                  >
                    {r.status}
                  </td>
                  <td>{r.date}</td>
                  <td>
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default KpisCardDashboard;
