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
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [availability, setAvailability] = useState<'all' | 'available' | 'unavailable'>('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        const response = await fetch("/api/equipment");
        const data = await response.json();
        setEquipment(data);
    };

    const filteredEquipment = equipment.filter((item) => {
        const text = `${item.typ} ${item.producent} ${item.numer_seryjny} ${item.lokalizacja}`.toLowerCase();
        const matchesText = text.includes(searchQuery.toLowerCase());

        if (!matchesText) return false;

        if (availability === 'available') return item.dostepny;
        if (availability === 'unavailable') return !item.dostepny;

        return true;
    });

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
                <div className="filter-row">
                    <div>
                        <label htmlFor="search-query" className="delete-label">Szukaj</label>
                        <input
                            id="search-query"
                            className="delete-input"
                            type="text"
                            placeholder="typ / producent / nr seryjny / lokalizacja"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="availability-filter" className="delete-label">Status dostępności</label>
                        <select
                            id="availability-filter"
                            className="delete-select"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value as 'all' | 'available' | 'unavailable')}
                        >
                            <option value="all">Wszystkie</option>
                            <option value="available">Dostępny</option>
                            <option value="unavailable">Niedostępny</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="select-equipment" className="delete-label">Wybierz sprzęt</label>
                    <select
                        id="select-equipment"
                        className="delete-select"
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                    >
                        <option value="">-- Wybierz sprzęt --</option>
                        {filteredEquipment.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.typ} | {e.producent} | {e.numer_seryjny} | {e.dostepny ? "Dostępny" : "Niedostępny"} | {e.lokalizacja}
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