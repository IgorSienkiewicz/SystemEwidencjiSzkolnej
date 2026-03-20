import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import './MagazynierEquipmentPage.css';

function MagazynierEquipmentPage() {
    const navigate = useNavigate();
    const [dane, setDane] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [availability, setAvailability] = useState<'all'|'available'|'unavailable'>('all');

    useEffect(() => {
        fetch("/api/equipment")
            .then(res => res.json())
            .then(data => setDane(data));
    }, []);

    const filteredDane = dane
        .filter(item => {
            const q = searchQuery.toLowerCase().trim();
            if (!q) return true;
            return (
                item.typ.toLowerCase().includes(q) ||
                item.producent.toLowerCase().includes(q) ||
                item.numer_seryjny.toLowerCase().includes(q) ||
                String(item.lokalizacja || '').toLowerCase().includes(q)
            );
        })
        .filter(item => {
            if (availability === 'all') return true;
            if (availability === 'available') return item.dostepny;
            return !item.dostepny;
        });

    return (
        <div className="equipment-container">
            <h1 className="equipment-title">Lista sprzętu</h1>
            <div className="filter-row" style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Wyszukaj typ / producent / nr seryjny / lokalizacja"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #7289da', background: '#1e2740', color: '#f0f4ff', minWidth: '270px' }}
                />
                <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #7289da', background: '#1e2740', color: '#f0f4ff' }}
                >
                    <option value="all">Wszystkie</option>
                    <option value="available">Dostępne</option>
                    <option value="unavailable">Niedostępne</option>
                </select>
                <div style={{ color: '#cbd5e1', alignSelf: 'center' }}>
                    {filteredDane.length} / {dane.length} wyników
                </div>
            </div>
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
                        {filteredDane.map((equipment, index) => (
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