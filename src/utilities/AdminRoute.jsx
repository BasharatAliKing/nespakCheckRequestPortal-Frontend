// import { Navigate, useLocation } from 'react-router-dom'
// import { isAuthenticated, getUserRole } from './auth'

// export default function AdminRoute({ children }) {
//   const location = useLocation()
  
//   if (!isAuthenticated()) {
//     return <Navigate to="/login" replace state={{ from: location }} />
//   }
//   const role = getUserRole()
//   if (role !== 'admin') {
//     return <Navigate to="/" replace />
//   }
  
//   return children
// }
import { Navigate } from "react-router-dom";
import { getUserRole } from "./auth";

export default function AdminRoute({ children }) {
  const role = getUserRole();

  if (role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
}
