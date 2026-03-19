import { useNavigate } from "react-router-dom"
import './MagazynierMainPage.css';

function MagazynierMainPage() {
    const navigate = useNavigate();

    const wyloguj = () => {
        localStorage.clear();
        navigate("/");
    }

    return (
        <div className="magazynier-container">
            <h1 className="magazynier-title">Panel magazyniera</h1>
            <div className="magazynier-buttons">
                <button className="magazynier-nav-button" onClick={() => navigate("/magazynier/ewidencjaSprzetu")}>
                    📋 Sprawdź aktualny stan sprzętu
                </button>
                <button className="magazynier-nav-button" onClick={() => navigate("/magazynier/addEquipment")}>
                    ➕ Dodaj sprzęt
                </button>
                <button className="magazynier-nav-button" onClick={() => navigate("/magazynier/deleteEquipment")}>
                    🗑️ Usuń sprzęt
                </button>
                <button className="magazynier-logout-button" onClick={wyloguj}>
                    🚪 Wyloguj się
                </button>
            </div>
        </div>
    )
}

export default MagazynierMainPage