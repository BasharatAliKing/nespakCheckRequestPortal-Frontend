import { NavLink } from "react-router-dom";
import { getUserData } from "../utilities/auth";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CircleX,
  ClipboardClockIcon,
  FolderDown,
  FolderInput,
  FolderOpen,
  Hammer,
  LoaderPinwheel,
  Shield,
  ShieldOff,
  Undo2,
  UserIcon,
  Users2,
  UsersIcon,
} from "lucide-react";
import { MdDashboard } from "react-icons/md";

export default function Sidebar() {
  const role = getUserData()?.role || "Guest";
  const links =
    role === "admin"
      ? [
          { to: "/home", label: "Dashboard", icon: MdDashboard },
          { to: "/users", label: "Users", icon: UsersIcon },
          { to: "/clients", label: "Clients", icon: Users2 },
          { to: "/contractors", label: "Contractors", icon: Hammer },
          { to: "/consultants", label: "Consultants", icon: BriefcaseBusiness },
          { to: "/projects", label: "Projects", icon: FolderOpen },
          { to: "/main-form", label: "Check Requests", icon: FolderDown },
        ]
      : role === "contractor_rep"
      ? [
          { to: "/home", label: "Dashboard", icon: MdDashboard },
          // Total Requests
          { to: "/contractor/all", label: "Total Requests", icon: Users2 },
          // Request Status Categories
          {
            to: "/contractor/pending",
            label: "Pending Requests",
            icon: ClipboardClockIcon,
          }, // hourglass
          {
            to: "/contractor/received_from_consultant",
            label: "Received from Consultant",
            icon: FolderDown,
          },
          {
            to: "/contractor/received",
            label: "In Progress Requests",
            icon: LoaderPinwheel,
          }, // hourglass
          {
            to: "/contractor/approved",
            label: "Approved Requests",
            icon: BadgeCheck,
          }, // hourglass
          { to: "/contractor/revert", label: "Revert Requests", icon: Undo2 }, // hourglass
          {
            to: "/contractor/expired",
            label: "Expired Requests",
            icon: ShieldOff,
          }, // time over
        ]
      : role === "consultant_rep"
      ? [
          { to: "/home", label: "Dashboard", icon: MdDashboard },
          // Total Requests
          { to: "/consultant/all", label: "Total Requests", icon: Users2 },
          // Request Status Categories
          {
            to: "/consultant/pending",
            label: "Pending",
            icon: ClipboardClockIcon,
          }, // incoming mail
          {
            to: "/consultant/received_from_contractor",
            label: "In Progress",
            icon: FolderDown,
          }, // incoming mail
          {
            to: "/consultant/received_from_re",
            label: "Received from RE",
            icon: FolderDown,
          }, // approved
          { to: "/consultant/approved", label: "Approved", icon: BadgeCheck },
          { to: "/consultant/revert", label: "Revert", icon: Undo2 },
          { to: "/consultant/expired", label: "Expired", icon: ShieldOff }, // time over
        ]
      : role === "inspector"
      ? [
          { to: "/home", label: "Dashboard", icon: MdDashboard },
          // Total Requests
          { to: "/inspector/all", label: "Total Requests", icon: Users2 },
          // Request Status Categoriespo
          { to: "/inspector/okay", label: "Pass Requests", icon: BadgeCheck }, // incoming mail
          { to: "/inspector/not_okay", label: "Fail Requests", icon: CircleX }, // incoming mail
          {
            to: "/inspector/pending",
            label: "Pending Requests",
            icon: ClipboardClockIcon,
          }, // approved
          { to: "/inspector/expired", label: "Expired", icon: ShieldOff }, // time over
        ]
      : role === "surveyor"
      ? [
          { to: "/home", label: "Dashboard", icon: MdDashboard },
          // Total Requests
          { to: "/surveyor/all", label: "Total Requests", icon: Users2 },
          // Request Status Categoriespo
          { to: "/surveyor/okay", label: "Pass Requests", icon: BadgeCheck }, // incoming mail
          { to: "/surveyor/not_okay", label: "Fail Requests", icon: CircleX }, // incoming mail
          {
            to: "/surveyor/pending",
            label: "Pending Requests",
            icon: ClipboardClockIcon,
          }, // approved
          { to: "/surveyor/expired", label: "Expired", icon: ShieldOff }, // time over
        ]
      : role === "me"
      ? [
          { to: "/home", label: "Dashboard", icon: MdDashboard },
          // Total Requests
          { to: "/me/all", label: "Total Requests", icon: Users2 },
          // Request Status Categoriespo
          { to: "/me/okay", label: "Pass Requests", icon: BadgeCheck }, // incoming mail
          { to: "/me/not_okay", label: "Fail Requests", icon: CircleX }, // incoming mail
          {
            to: "/me/pending",
            label: "Pending Requests",
            icon: ClipboardClockIcon,
          }, // approved
          { to: "/me/expired", label: "Expired", icon: ShieldOff }, // time over
        ]
      : role === "are"
      ? [
          { to: "/home", label: "Dashboard", icon: MdDashboard },
          // Total Requests
          { to: "/are/all", label: "Total Requests", icon: Users2 },
          // Request Status Categoriespo
          { to: "/are/okay", label: "Pass Requests", icon: BadgeCheck }, // incoming mail
          { to: "/are/not_okay", label: "Fail Requests", icon: CircleX }, // incoming mail
          {
            to: "/are/pending",
            label: "Pending Requests",
            icon: ClipboardClockIcon,
          }, // approved
          { to: "/are/expired", label: "Expired", icon: ShieldOff }, // time over
        ]
      : role === "re"
      ? [
          { to: "/home", label: "Dashboard", icon: MdDashboard },
          // Total Requests
          { to: "/re/all", label: "Total Requests", icon: Users2 },
          // Request Status Categoriespo
          { to: "/re/okay", label: "Approved Requests", icon: BadgeCheck }, // incoming mail
          { to: "/re/not_okay", label: "Not Approved Requests", icon: CircleX }, // incoming mail
          {
            to: "/re/pending",
            label: "Pending Requests",
            icon: ClipboardClockIcon,
          }, // approved
          { to: "/re/expired", label: "Expired", icon: ShieldOff }, // time over
        ]
      : [];
  return (
    <aside className="w-64 bg-white h-[calc(100vh-4rem)] overflow-y-auto p-4 shadow-lg border-r border-gray-100">
      <nav className="flex flex-col gap-2">
        {links.map((l) => {
          const Icon = l.icon;
          return (
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
              <Icon className="w-6 h-6" />
              <span>{l.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
