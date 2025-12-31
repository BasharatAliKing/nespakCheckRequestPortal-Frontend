import React, { useEffect, useState } from "react";
import { getUserData, getToken } from "../utilities/auth";
import KpisCardDashboard from "../components/KpisCardDashboard";
import MainFormPage from "./MainFormPage";
import ContractorForm from "../components/ContractorForm";
const API_URL = import.meta.env.VITE_API_URL;
const Dashboard = () => {
  const role = getUserData()?.role || "Guest";
  const [showMainForm, setShowMainForm] = useState(false);
  const [kpiRefreshKey, setKpiRefreshKey] = useState(0); // 🔥 NEW

  return (
    <>
      {/* Page Title */}
      <div className="flex  items-center justify-between ">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          <span className="capitalize">{role.replace("_rep", "")}</span>{" "}
          Dashboard
        </h1>
        {role === "contractor_rep" ? (
          <button
            onClick={() => {
              setShowMainForm(true);
            }}
            className="bg-gradient-to-r mb-auto  from-indigo-500 to-indigo-700 p-2 rounded-md cursor-pointer text-white font-medium"
          >
            Add Request
          </button>
        ) : null}
      </div>
      {showMainForm && (
        <ContractorForm
          mode="create"
          onClose={() => {
            setShowMainForm(false);
            // 🔥 trigger KPI reload
            setKpiRefreshKey((prev) => prev + 1);
          }}
        />
      )}
      {/* KPI Cards */}
      <KpisCardDashboard refresh={kpiRefreshKey} />
    </>
  );
};

export default Dashboard;
