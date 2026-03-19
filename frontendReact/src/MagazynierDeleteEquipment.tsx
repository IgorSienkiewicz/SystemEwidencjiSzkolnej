import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './MagazynierDeleteEquipment.css';

interface Equipment {
    id: number;
    typ: string;
    producent: string;
    numer_seryjny: string;
    dostepny: boolean;
    lokalizacja: string;
}

function MagazynierDeleteEquipment() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        const response = await fetch("/api/equipment");
        const data = await response.json();
        setEquipment(data);
    };

    const handleDelete = async () => {
        if (!selectedId) {
            alert("Wybierz sprzęt do usunięcia");
            return;
        }

        const confirmed = window.confirm("Czy na pewno chcesz usunąć ten sprzęt?");
        if (!confirmed) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/equipment/${selectedId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                alert(`Błąd serwera: ${response.status} ${response.statusText}`);
                return;
            }

            const result = await response.json();
            alert(result.message);
            setSelectedId("");
            await fetchEquipment();
        } catch (err) {
            alert("Wystąpił błąd połączenia z serwerem");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="delete-container">
            <h2 className="delete-title">Usuń sprzęt</h2>
            <div className="delete-card">
                <div>
                    <label className="delete-label">Wybierz sprzęt</label>
                    <select
                        className="delete-select"
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                    >
                        <option value="">-- Wybierz sprzęt --</option>
                        {equipment.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.typ} | {e.producent} | {e.numer_seryjny} | {e.dostepny ? "Dostępny" : "Niedostępny"}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="delete-buttons">
                    <button
                        className="delete-confirm-button"
                        onClick={handleDelete}
                        disabled={loading || !selectedId}
                    >
                        {loading ? "Usuwanie..." : "🗑️ Usuń"}
                    </button>
                    <button className="delete-back-button" onClick={() => navigate("/magazynier")}>
                        ← Powrót
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MagazynierDeleteEquipment;