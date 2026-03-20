import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './MagazynierAddEquipment.css';

function MagazynierAddEquipment() {
    const [typ, setTyp] = useState("");
    const [producent, setProducent] = useState("");
    const [numerSeryjny, setNumerSeryjny] = useState("");
    const [dostepny, setDostepny] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = { typ, producent, numerSeryjny, dostepny };

        const response = await fetch("/api/equipment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(result.message);
    };

    return (
        <div className="add-container">
            <h2 className="add-title">Dodaj sprzęt</h2>
            <form onSubmit={handleSubmit}>
                <div className="add-card">
                    <div className="add-field">
                        <label htmlFor="typ" className="add-label">Typ</label>
                        <input
                            id="typ"
                            className="add-input"
                            placeholder="np. Laptop"
                            value={typ}
                            onChange={(e) => setTyp(e.target.value)}
                        />
                    </div>
                    <div className="add-field">
                        <label htmlFor="producent" className="add-label">Producent</label>
                        <input
                            id="producent"
                            className="add-input"
                            placeholder="np. Dell"
                            value={producent}
                            onChange={(e) => setProducent(e.target.value)}
                        />
                    </div>
                    <div className="add-field">
                        <label htmlFor="numer-seryjny" className="add-label">Numer seryjny</label>
                        <input
                            id="numer-seryjny"
                            className="add-input"
                            placeholder="np. SN-001"
                            value={numerSeryjny}
                            onChange={(e) => setNumerSeryjny(e.target.value)}
                        />
                    </div>
                    <label htmlFor="dostepny" className="add-checkbox-field">
                        <input
                            id="dostepny"
                            type="checkbox"
                            checked={dostepny}
                            onChange={(e) => setDostepny(e.target.checked)}
                        />
                        <span className="add-checkbox-label">Dostępny</span>
                    </label>
                    <div className="add-buttons">
                        <button type="submit" className="add-submit-button">
                            ➕ Dodaj
                        </button>
                        <button type="button" className="add-back-button" onClick={() => navigate("/magazynier")}>
                            ← Powrót
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default MagazynierAddEquipment;