import React, { useEffect, useState } from "react";
import { getUserData , getToken } from "../utilities/auth";
import KpisCardDashboard from "../components/KpisCardDashboard";
const API_URL = import.meta.env.VITE_API_URL;
const Dashboard = () => {
    const role = getUserData()?.role || 'Guest';
     
  return (
    <>
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
         <span className="capitalize">{role.replace('_rep', '')}</span> Dashboard
      </h1>
      {/* KPI Cards */}
     <KpisCardDashboard  />
    </>
  );
};

export default Dashboard;
