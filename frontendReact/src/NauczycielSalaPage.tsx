import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from 'react';
import './NauczycielSalaPage.css';

function NauczycielSalaPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dane, setDane] = useState<any>(null);

    const pobierzDane = () => {
        fetch(`/api/classroom/${id}/sprzet`)
            .then(res => res.json())
            .then(data => setDane(data));
    };

    useEffect(() => {
        pobierzDane();
    }, [id]);

    const zwolnij = async (sprzetoId: number) => {
        const confirmed = window.confirm("Czy na pewno chcesz zwolnić ten sprzęt?");
        if (!confirmed) return;

        const response = await fetch(`/api/classroom/${id}/zwolnij/${sprzetoId}`, {
            method: "POST"
        });

        if (!response.ok) {
            const err = await response.json();
            alert(err.message);
            return;
        }

        const result = await response.json();
        alert(result.message);
        pobierzDane();
    };

    return (
        <div className="sala-container">
            <h1 className="sala-title">
                Sprzęt w sali {dane?.nr_sali}
            </h1>
            <div className="sala-table-wrapper">
                <table className="sala-table">
                    <thead>
                        <tr>
                            <th>Typ</th>
                            <th>Producent</th>
                            <th>Numer seryjny</th>
                            <th>Dostępność</th>
                            <th>Akcja</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dane?.sprzet?.map((s: any) => (
                            <tr key={s.id}>
                                <td>{s.typ}</td>
                                <td>{s.producent}</td>
                                <td>{s.numer_seryjny}</td>
                                <td>{s.dostepny ? "Dostępny" : "Niedostępny"}</td>
                                <td>
                                    <button className="zwolnij-button" onClick={() => zwolnij(s.id)}>
                                        Zwolnij
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {dane?.sprzet?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="sala-empty">
                                    Brak sprzętu w tej sali
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <button className="sala-back-button" onClick={() => navigate("/nauczyciel")}>
                ← Powrót
            </button>
        </div>
    )
}

export default NauczycielSalaPage