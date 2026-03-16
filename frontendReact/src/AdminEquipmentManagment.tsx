import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import './AdminEquipmentManagement.css';

function AdminEquipmentManagement() {
    const navigate = useNavigate();
    const [dane, setDane] = useState<any[]>([]);
    const [edytowany, setEdytowany] = useState<any>(null);

    useEffect(() => {
        fetch("/api/equipment")
            .then(res => res.json())
            .then(data => setDane(data))
    }, []);

    const zapiszEdycje = async () => {
        await fetch(`/api/equipment/${edytowany.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                typ: edytowany.typ,
                producent: edytowany.producent,
                numerSeryjny: edytowany.numer_seryjny,
                status: edytowany.status,
                lokalizacjaId: edytowany.lokalizacja_id
            })
        });

        setDane(prev => prev.map(e => e.id === edytowany.id ? edytowany : e));
        setEdytowany(null);
    };

    return (
        <div className="equipment-container">
            <h1 className="equipment-title">Lista sprzętu</h1>

            {edytowany && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2 className="modal-title">Edytuj sprzęt #{edytowany.id}</h2>
                        <p className="register-label">Typ</p>
                        <input className="register-input" value={edytowany.typ}
                            onChange={e => setEdytowany({...edytowany, typ: e.target.value})} />
                        <p className="register-label">Producent</p>
                        <input className="register-input" value={edytowany.producent}
                            onChange={e => setEdytowany({...edytowany, producent: e.target.value})} />
                        <p className="register-label">Numer seryjny</p>
                        <input className="register-input" value={edytowany.numer_seryjny}
                            onChange={e => setEdytowany({...edytowany, numer_seryjny: e.target.value})} />
                        <p className="register-label">Status</p>
                        <select className="role-select" value={edytowany.status}
                            onChange={e => setEdytowany({...edytowany, status: e.target.value})}>
                            <option value="dostępny">dostępny</option>
                            <option value="niedostępny">niedostępny</option>
                            <option value="naprawa">naprawa</option>
                        </select>
                        <div className="modal-buttons">
                            <button className="back-button" onClick={zapiszEdycje}>Zapisz</button>
                            <button className="cancel-button" onClick={() => setEdytowany(null)}>Anuluj</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="table-wrapper">
                <table className="equipment-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Typ</th>
                            <th>Producent</th>
                            <th>Numer Seryjny</th>
                            <th>Status</th>
                            <th>Lokalizacja</th>
                            <th>Akcje</th>
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
                                    <span className={`status-badge ${equipment.status.toLowerCase()}`}>
                                        {equipment.status}
                                    </span>
                                </td>
                                <td>{equipment.lokalizacja}</td>
                                <td>
                                    <button className="role-select" onClick={() => setEdytowany(equipment)}>
                                        Edytuj
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="back-button" onClick={() => navigate("/admin")}>
                ← Powrót do strony głównej
            </button>
        </div>
    )
}

export default AdminEquipmentManagement