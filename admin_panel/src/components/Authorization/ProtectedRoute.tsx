import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";


export default function ProtectedRoute() {
    const {user, isLoading} = useAuth();

    if (isLoading) return <p>Ładowanie...</p>

    return user ? <Outlet/> : <Navigate to="/signin" replace />;
}