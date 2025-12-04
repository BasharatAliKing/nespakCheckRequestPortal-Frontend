import { Briefcase, ClipboardEditIcon, FileEdit, FolderKanban, UserCheck, UserCircle, Users, Users2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getUserData } from '../utilities/auth';
const API_URL = import.meta.env.VITE_API_BASE_URL;

const KpisCardDashboard = () => {
     const [kpiData, setKpiData] = useState([]);
     const [kpiUser,setKpiUser]=useState([]);
     const [kpiClients,setKpiClients]=useState([]);
     const [kpiContractors,setKpiContractors]=useState([]);
     const [kpiConsultant,setKpiConsultant]=useState([]);
     const [kpiProjects,setKpiProjects]=useState([]);
     const [kpiMainForm,setKpiMainForm]=useState([]);
        const role = getUserData()?.role || 'Guest';
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
      label: "Received Requests",
      value: kpiData?.constractor?.received_request,
      link: "/contractor/received",
      bg: "from-green-500 to-green-700",
      icon: "📨",
    },
    {
      label: "Pending Requests",
      value: kpiData?.constractor?.pending_request,
      link: "/contractor/pending",
      bg: "from-yellow-500 to-yellow-700",
      icon: "⏳",
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
      label: "Received from Contractor",
      value: kpiData?.consultant?.consultant_received_from_contractor,
      link: "/consultant/received_from_contractor",
      bg: "from-green-500 to-green-700",
      icon: "📨",
    },
    {
      label: "Send to Contractor",
      value: kpiData?.consultant?.consultant_pending,
      link: "/consultant/pending",
      bg: "from-purple-500 to-purple-700",
      icon: "⏳",
    },
    {
      label: "Received from RE",
      value: kpiData?.consultant?.consultant_received_from_re,
      link: "/consultant/received_from_re",
      bg: "from-yellow-500 to-yellow-700",
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
      const getUsersData = async()=>{
        try{
          const res=await fetch(`${API_URL}/users`,{
            method:"GET",
            headers:{
                Authorization: `Bearer ${getToken()}`,
            },
          });  
          const data=await res.json();
          if(!res.ok) throw new Error("Failed to fetch Users data");
          setKpiUser(data.users || []);
        }catch(err){
           // console.log(err);
        }
      }
     //fetch clients data
      const getClientsData = async()=>{
        try{
          const res=await fetch(`${API_URL}/clients`,{
            method:"GET",
            headers:{
                Authorization: `Bearer ${getToken()}`,
            },
          });  
          const data=await res.json();
          if(!res.ok) throw new Error("Failed to fetch Clients data");
          setKpiClients(data.clients || []);
        }catch(err){
           // console.log(err);
        }
      }
      //fetch contractors data
      const getContractorsData = async()=>{
        try{
          const res=await fetch(`${API_URL}/contractors`,{
            method:"GET",
            headers:{
                Authorization: `Bearer ${getToken()}`,
            },
          });  
          const data=await res.json();
          if(!res.ok) throw new Error("Failed to fetch Contractors data");
          setKpiContractors(data.contractors || []);
        }catch(err){
           // console.log(err);
        }
      }
      //fetch consultant data
      const getConsultantsData = async()=>{
        try{
          const res=await fetch(`${API_URL}/consultants`,{
            method:"GET",
            headers:{
                Authorization: `Bearer ${getToken()}`,
            },
          });  
          const data=await res.json();
          if(!res.ok) throw new Error("Failed to fetch Consultants data");
          setKpiConsultant(data.consultants || []);
        }catch(err){
           // console.log(err);
        }
      }
      //fetch projects data
      const getProjectsData = async()=>{
        try{
          const res=await fetch(`${API_URL}/projects`,{
            method:"GET",
            headers:{
                Authorization: `Bearer ${getToken()}`,
            },
          });  
          const data=await res.json();
          if(!res.ok) throw new Error("Failed to fetch Projects data");
          setKpiProjects(data.projects || []);
        }catch(err){
           // console.log(err);
        }
      }
      //fetch main form data
      const getMainFormData = async()=>{
        try{
          const res=await fetch(`${API_URL}/main-form`,{
            method:"GET",
            headers:{
                Authorization: `Bearer ${getToken()}`,
            },
          });  
          const data=await res.json();
          if(!res.ok) throw new Error("Failed to fetch Main Form data");
          setKpiMainForm(data.contractorForms || []);
        }catch(err){
           // console.log(err);
        }
      }

      useEffect(()=>{
        getKpisData();
        getUsersData();
        getClientsData();
        getContractorsData();
        getConsultantsData();
        getProjectsData();
        getMainFormData();
      },[]);
  return (
 <>
    {/* Admin KPI Dashboard */}
   {
    // role === 'admin' ?
    // ( <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    //     {/* Users */}
    //     <Link to='/users' className="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-700 text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 backdrop-blur-md">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-base font-medium opacity-80">Total Users</p>
    //           <h2 className="text-4xl font-bold mt-2">{kpiUser.length}</h2>
    //         </div>
    //         <div className="bg-white/20 p-4 rounded-full backdrop-blur">
    //           <Users className="w-8 h-8 text-white" />
    //         </div>
    //       </div>
    //     </Link>
    //     {/* Clients */}
    //     <Link to='/clients' className="bg-gradient-to-r cursor-pointer from-pink-500 to-pink-700 text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 backdrop-blur-md">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-base font-medium opacity-80">Total Clients</p>
    //           <h2 className="text-4xl font-bold mt-2">{kpiClients.length}</h2>
    //         </div>
    //         <div className="bg-white/20 p-4 rounded-full backdrop-blur">
    //           <UserCircle className="w-8 h-8 text-white" />
    //         </div>
    //       </div>
    //     </Link>

    //     {/* Contractors */}
    //     <Link to='/contractors' className="bg-gradient-to-r cursor-pointer from-green-500 to-green-700 text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 backdrop-blur-md">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-base font-medium opacity-80">Contractors</p>
    //           <h2 className="text-4xl font-bold mt-2">{kpiContractors.length}</h2>
    //         </div>
    //         <div className="bg-white/20 p-4 rounded-full backdrop-blur">
    //           <Briefcase className="w-8 h-8 text-white" />
    //         </div>
    //       </div>
    //     </Link>

    //     {/* Consultants */}
    //     <Link to='/consultants' className="bg-gradient-to-r cursor-pointer from-purple-500 to-purple-700 text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 backdrop-blur-md">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-base font-medium opacity-80">Consultants</p>
    //           <h2 className="text-4xl font-bold mt-2">{kpiConsultant.length}</h2>
    //         </div>
    //         <div className="bg-white/20 p-4 rounded-full backdrop-blur">
    //           <UserCheck className="w-8 h-8 text-white" />
    //         </div>
    //       </div>
    //     </Link>

    //     {/* Projects */}
    //     <Link to='/projects' className="bg-gradient-to-r cursor-pointer from-orange-500 to-orange-700 text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 backdrop-blur-md">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-base font-medium opacity-80">Projects</p>
    //           <h2 className="text-4xl font-bold mt-2">{kpiProjects.length}</h2>
    //         </div>
    //         <div className="bg-white/20 p-4 rounded-full backdrop-blur">
    //           <FolderKanban className="w-8 h-8 text-white" />
    //         </div>
    //       </div>
    //     </Link>
    //     {/* Forms Submitted */}
    //     <Link to="/main-form" className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 backdrop-blur-md">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-base font-medium opacity-80">Forms Submitted</p>
    //           <h2 className="text-4xl font-bold mt-2">{kpiMainForm.length}</h2>
    //         </div>
    //         <div className="bg-white/20 p-4 rounded-full backdrop-blur">
    //           <FileEdit className="w-8 h-8 text-white" />
    //         </div>
    //       </div>
    //     </Link>
    //   </div>
    //   )
    // //   Contractor KPI's Dashboard
    //   : role ==='contractor_rep'?
    //   ( 
    //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    //     {/* Users */}
    //     <Link to='/users' className="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-700 text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 backdrop-blur-md">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-base font-medium opacity-80">Total Requests</p>
    //           <h2 className="text-4xl font-bold mt-2">{kpiData?.constractor?.total_request}</h2>
    //         </div>
    //         <div className="bg-white/20 p-4 rounded-full backdrop-blur">
    //           <Users className="w-8 h-8 text-white" />
    //         </div>
    //       </div>
    //     </Link>
    //     {/* Clients */}
    //     <Link to='/clients' className="bg-gradient-to-r cursor-pointer from-pink-500 to-pink-700 text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 backdrop-blur-md">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-base font-medium opacity-80">Received Requests</p>
    //           <h2 className="text-4xl font-bold mt-2">{kpiData?.constractor?.received_request}</h2>
    //         </div>
    //         <div className="bg-white/20 p-4 rounded-full backdrop-blur">
    //           <UserCircle className="w-8 h-8 text-white" />
    //         </div>
    //       </div>
    //     </Link>

    //     {/* Contractors */}
    //     <Link to='/contractors' className="bg-gradient-to-r cursor-pointer from-green-500 to-green-700 text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 backdrop-blur-md">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-base font-medium opacity-80">Pending Requests</p>
    //           <h2 className="text-4xl font-bold mt-2">{kpiData?.constractor?.pending_request}</h2>
    //         </div>
    //         <div className="bg-white/20 p-4 rounded-full backdrop-blur">
    //           <Briefcase className="w-8 h-8 text-white" />
    //         </div>
    //       </div>
    //     </Link>

    //     {/* Consultants */}
    //     <Link to='/consultants' className="bg-gradient-to-r cursor-pointer from-purple-500 to-purple-700 text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 backdrop-blur-md">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-base font-medium opacity-80">Approved</p>
    //           <h2 className="text-4xl font-bold mt-2">{kpiData?.constractor?.approved}</h2>
    //         </div>
    //         <div className="bg-white/20 p-4 rounded-full backdrop-blur">
    //           <UserCheck className="w-8 h-8 text-white" />
    //         </div>
    //       </div>
    //     </Link>

    //     {/* Projects */}
    //     <Link to='/projects' className="bg-gradient-to-r cursor-pointer from-orange-500 to-orange-700 text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 backdrop-blur-md">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-base font-medium opacity-80">Not Approved</p>
    //           <h2 className="text-4xl font-bold mt-2">{kpiData?.constractor?.not_approved}</h2>
    //         </div>
    //         <div className="bg-white/20 p-4 rounded-full backdrop-blur">
    //           <FolderKanban className="w-8 h-8 text-white" />
    //         </div>
    //       </div>
    //     </Link>
    //     {/* Forms Submitted */}
    //     <Link to="/main-form" className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 backdrop-blur-md">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <p className="text-base font-medium opacity-80">Expired</p>
    //           <h2 className="text-4xl font-bold mt-2">{kpiData?.constractor?.expired}</h2>
    //         </div>
    //         <div className="bg-white/20 p-4 rounded-full backdrop-blur">
    //           <FileEdit className="w-8 h-8 text-white" />
    //         </div>
    //       </div>
    //     </Link>
    //   </div>)
    //   :null
   }
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
       {
        kpisConfig[role]?.map((kpi, index)=>(
            <Link to={kpi.link} key={index} className={`bg-gradient-to-r cursor-pointer ${kpi.bg} text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-all duration-200 backdrop-blur-md`}>
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
        ))
       }      
      
       
      </div>
 </>
  )
}

export default KpisCardDashboard
