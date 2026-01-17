import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
      const type = localStorage.getItem("type");

  if (token) {
    if(type === "student"){
        return <Navigate to="/student-dashboard" replace />;
    }else{
        return <Navigate to="/admin-dashboard" replace />;
    }
  }

  return children;
};

export default PublicRoute;
