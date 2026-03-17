import { useState, useEffect } from "react";

interface Equipment {
    id: number;
    typ: string;
    producent: string;
    numer_seryjny: string;
    status: string;
    lokalizacja: string;
}

function MagazynierDeleteEquipment() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [loading, setLoading] = useState(false);

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

        const response = await fetch(`/api/equipment/${selectedId}`, {
            method: "DELETE",
        });

        const result = await response.json();
        alert(result.message);

        setSelectedId("");
        await fetchEquipment();
        setLoading(false);
    };

    return (
        <div>
            <h2>Usuń sprzęt</h2>

            <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
            >
                <option value="">-- Wybierz sprzęt --</option>
                {equipment.map((e) => (
                    <option key={e.id} value={e.id}>
                        {e.typ} | {e.producent} | {e.numer_seryjny} | {e.lokalizacja}
                    </option>
                ))}
            </select>

            <button onClick={handleDelete} disabled={loading || !selectedId}>
                {loading ? "Usuwanie..." : "Usuń"}
            </button>
        </div>
    );
}

export default MagazynierDeleteEquipment;