import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log(auth.role);
    
    console.log("Allowed Roles:", allowedRoles);
    // 1. Not logged in → redirect to login
    if (!auth?.userRole) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Logged in but role not allowed → unauthorized
    if (!allowedRoles.includes(auth.userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }
    
    // 3. Valid → allow page
    return <Outlet />;



        // auth?.roles?.find(role => allowedRoles?.includes(role))
        
        //     ? <Outlet />
        //     : auth?.adminID
        //         ? <Navigate to="/unauthorized" state={{ from: location }} replace />
        //         : <Navigate to="/login" state={{ from: location }} replace />

}

export default RequireAuth;