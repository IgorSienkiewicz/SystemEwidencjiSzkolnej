import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from 'react';
import './MagazynierEquipmentPage.css';

function NauczycielSalaPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dane, setDane] = useState<any>(null);

    useEffect(() => {
        fetch(`/api/classroom/${id}/sprzet`)
            .then(res => res.json())
            .then(data => setDane(data));
    }, [id]);

    return (
        <div className="equipment-container">
            <h1 className="equipment-title">
                Sprzęt w sali {dane?.nr_sali}
            </h1>
            <div className="table-wrapper">
                <table className="equipment-table">
                    <thead>
                        <tr>
                            <th>Typ</th>
                            <th>Producent</th>
                            <th>Numer seryjny</th>
                            <th>Dostępność</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dane?.sprzet && (
                            <tr>
                                <td>{dane.sprzet.typ}</td>
                                <td>{dane.sprzet.producent}</td>
                                <td>{dane.sprzet.numer_seryjny}</td>
                                <td>{dane.sprzet.dostepny ? "Dostępny" : "Niedostępny"}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <button className="back-button" onClick={() => navigate("/nauczyciel")}>
                Powrót
            </button>
        </div>
    )
}

export default NauczycielSalaPage