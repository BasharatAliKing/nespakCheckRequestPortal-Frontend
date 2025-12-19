import { NavLink } from "react-router-dom";
import { getUserData } from "../utilities/auth";

const role = getUserData()?.role || "Guest";
const links =
  role === "admin"
    ? [
        { to: "/home", label: "Dashboard", icon: "📊" },
        { to: "/users", label: "Users", icon: "👥" },
        { to: "/clients", label: "Clients", icon: "🏢" },
        { to: "/contractors", label: "Contractors", icon: "🔨" },
        { to: "/consultants", label: "Consultants", icon: "💼" },
        { to: "/projects", label: "Projects", icon: "🗂️" },
        { to: "/main-form", label: "Main Form", icon: "📋" },
      ]
    : role === "contractor_rep"
    ? [
        { to: "/home", label: "Dashboard", icon: "📊" },
        // Total Requests
        { to: "/contractor/all", label: "Total Requests", icon: "🗂️" },
        // Request Status Categories
        { to: "/contractor/received", label: "Received", icon: "📨" }, // incoming mail
        {
          to: "/contractor/received_from_consultant",
          label: "Received from Consultant",
          icon: "📨",
        },
        { to: "/contractor/pending", label: "Pending", icon: "⏳" }, // hourglass
        { to: "/contractor/revert", label: "Revert", icon: "⏳" }, // hourglass
        { to: "/contractor/approved", label: "Approved", icon: "⏳" }, // hourglass
        { to: "/contractor/expired", label: "Expired", icon: "⌛" }, // time over
      ]
    : role === "consultant_rep"
    ? [
        { to: "/home", label: "Dashboard", icon: "📊" },
        // Total Requests
        { to: "/consultant/all", label: "Total Requests", icon: "🗂️" },
        // Request Status Categories
        { to: "/consultant/pending", label: "Pending", icon: "📨" }, // incoming mail
        {
          to: "/consultant/received_from_contractor",
          label: "Received from Contractor",
          icon: "📨",
        }, // incoming mail
        {
          to: "/consultant/send_to_contractor",
          label: "Send to Contractor",
          icon: "⏳",
        }, // hourglass
        {
          to: "/consultant/received_from_re",
          label: "Received from RE",
          icon: "✅",
        }, // approved
        { to: "/consultant/approved", label: "Approved", icon: "✅" },
        { to: "/consultant/revert", label: "Revert", icon: "⏳" },
        { to: "/consultant/expired", label: "Expired", icon: "⌛" }, // time over
      ]
    : role === "inspector"
    ? [
        { to: "/home", label: "Dashboard", icon: "📊" },
        // Total Requests
        { to: "/inspector/all", label: "Total Requests", icon: "🗂️" },
        // Request Status Categoriespo
        { to: "/inspector/okay", label: "Pass Requests", icon: "✅" }, // incoming mail
        { to: "/inspector/not_okay", label: "Fail Requests", icon: "📨" }, // incoming mail
        { to: "/inspector/pending", label: "Pending Requests", icon: "⏳" }, // approved
        { to: "/inspector/expired", label: "Expired", icon: "⌛" }, // time over
      ]
    : role === "surveyor"
    ? [
        { to: "/home", label: "Dashboard", icon: "📊" },
        // Total Requests
        { to: "/surveyor/all", label: "Total Requests", icon: "🗂️" },
        // Request Status Categoriespo
        { to: "/surveyor/okay", label: "Pass Requests", icon: "✅" }, // incoming mail
        { to: "/surveyor/not_okay", label: "Fail Requests", icon: "📨" }, // incoming mail
        { to: "/surveyor/pending", label: "Pending Requests", icon: "⏳" }, // approved
        { to: "/surveyor/expired", label: "Expired", icon: "⌛" }, // time over
      ]
    : role === "me"
    ? [
        { to: "/home", label: "Dashboard", icon: "📊" },
        // Total Requests
        { to: "/me/all", label: "Total Requests", icon: "🗂️" },
        // Request Status Categoriespo
        { to: "/me/okay", label: "Pass Requests", icon: "✅" }, // incoming mail
        { to: "/me/not_okay", label: "Fail Requests", icon: "📨" }, // incoming mail
        { to: "/me/pending", label: "Pending Requests", icon: "⏳" }, // approved
        { to: "/me/expired", label: "Expired", icon: "⌛" }, // time over
      ]
    : role === "are"
    ? [
        { to: "/home", label: "Dashboard", icon: "📊" },
        // Total Requests
        { to: "/are/all", label: "Total Requests", icon: "🗂️" },
        // Request Status Categoriespo
        { to: "/are/okay", label: "Pass Requests", icon: "✅" }, // incoming mail
        { to: "/are/not_okay", label: "Fail Requests", icon: "📨" }, // incoming mail
        { to: "/are/pending", label: "Pending Requests", icon: "⏳" }, // approved
        { to: "/are/expired", label: "Expired", icon: "⌛" }, // time over
      ]
    : role === "re"
    ? [
        { to: "/home", label: "Dashboard", icon: "📊" },
        // Total Requests
        { to: "/re/all", label: "Total Requests", icon: "🗂️" },
        // Request Status Categoriespo
        { to: "/re/okay", label: "Approved Requests", icon: "✅" }, // incoming mail
        { to: "/re/not_okay", label: "Not Approved Requests", icon: "📨" }, // incoming mail
        { to: "/re/pending", label: "Pending Requests", icon: "⏳" }, // approved
        { to: "/re/expired", label: "Expired", icon: "⌛" }, // time over
      ]
    : [];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white h-[calc(100vh-4rem)] overflow-y-auto p-4 shadow-lg border-r border-gray-100">
      <nav className="flex flex-col gap-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <span className="text-xl">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
