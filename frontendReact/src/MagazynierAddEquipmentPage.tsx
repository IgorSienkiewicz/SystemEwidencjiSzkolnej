import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MagazynierAddEquipment() {
    const [typ, setTyp] = useState("");
    const [producent, setProducent] = useState("");
    const [numerSeryjny, setNumerSeryjny] = useState("");
    const [dostepny, setDostepny] = useState(true);
    const [lokalizacjaId, setLokalizacjaId] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            typ,
            producent,
            numerSeryjny,
            dostepny,
            lokalizacjaId: parseInt(lokalizacjaId)
        };

        const response = await fetch("/api/equipment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(result.message);
    };

    return (
        <div>
            <h2>Dodaj sprzęt</h2>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Typ"
                    value={typ}
                    onChange={(e) => setTyp(e.target.value)}
                />
                <input
                    placeholder="Producent"
                    value={producent}
                    onChange={(e) => setProducent(e.target.value)}
                />
                <input
                    placeholder="Numer seryjny"
                    value={numerSeryjny}
                    onChange={(e) => setNumerSeryjny(e.target.value)}
                />
                <label>
                    Dostępny:
                    <input
                        type="checkbox"
                        checked={dostepny}
                        onChange={(e) => setDostepny(e.target.checked)}
                    />
                </label>
                <input
                    placeholder="ID lokalizacji"
                    type="number"
                    value={lokalizacjaId}
                    onChange={(e) => setLokalizacjaId(e.target.value)}
                />
                <button type="submit">Dodaj</button>
                <button type="button" onClick={() => navigate("/magazynier")}>Powrót</button>
            </form>
        </div>
    );
}

export default MagazynierAddEquipment;