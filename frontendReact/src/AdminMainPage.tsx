import { Route, useNavigate } from "react-router-dom";
import AdminRoleChange from "./AdminRoleChange";

function AdminMainPage(){
    const navigate = useNavigate();
    return(
        <div>
            <button onClick={() => navigate("/admin/RoleChange")}>Zmiana Roli</button>
            <button onClick={() => navigate("/admin/equipmentManagement")}>Zarządzanie bazą danych sprzętu (do zrobienia)</button>
            <button onClick={() => navigate("/")}>Wyloguj się</button>
        </div>
    )
}

export default AdminMainPage;