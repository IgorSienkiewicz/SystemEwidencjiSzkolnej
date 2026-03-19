import { useNavigate } from "react-router-dom";
import './AdminMainPage.css';

function AdminMainPage() {
    const navigate = useNavigate();
    const wyloguj = () => {
        localStorage.clear();
        navigate("/");
    }
    return (
        <div className="main-container">
            <h1 className="main-title">Panel Administratora</h1>
            <div className="main-buttons">
                <button className="main-button" onClick={() => navigate("/admin/RoleChange")}>
                    👥 Zmiana Roli
                </button>
                <button className="main-button" onClick={() => navigate("/admin/EquipmentManagement")}>
                    🖥️ Zarządzanie sprzętem
                </button>
                <button className="main-button logout" onClick={wyloguj}>
                    🚪 Wyloguj się
                </button>
            </div>
        </div>
    )
}

export default AdminMainPage;