import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import './MagazynierEquipmentPage.css';

function MagazynierEquipmentPage() {
    const navigate = useNavigate();
    const [dane, setDane] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/equipment")
            .then(res => res.json())
            .then(data => setDane(data));
    }, []);

    return (
        <div className="equipment-container">
            <h1 className="equipment-title">Lista sprzętu</h1>
            <div className="table-wrapper">
                <table className="equipment-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Typ</th>
                            <th>Producent</th>
                            <th>Numer Seryjny</th>
                            <th>Dostępność</th>
                            <th>Lokalizacja</th>
                            <th>Sala</th>
                            <th>Nauczyciel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dane.map((equipment, index) => (
                            <tr key={equipment.id}>
                                <td>{index + 1}</td>
                                <td>{equipment.typ}</td>
                                <td>{equipment.producent}</td>
                                <td>{equipment.numer_seryjny}</td>
                                <td>
                                    <span className={`status-badge ${equipment.dostepny ? "sprawny" : "uszkodzony"}`}>
                                        {equipment.dostepny ? "Dostępny" : "Niedostępny"}
                                    </span>
                                </td>
                                <td>{equipment.lokalizacja}</td>
                                <td>{equipment.sala ?? "-"}</td>
                                <td>{equipment.nauczyciel ?? "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="back-button" onClick={() => navigate("/magazynier")}>
                ← Powrót do strony głównej
            </button>
        </div>
    )
}

export default MagazynierEquipmentPage