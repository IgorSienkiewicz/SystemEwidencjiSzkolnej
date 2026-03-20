import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import './AdminEquipmentManagement.css';

function AdminEquipmentManagement() {
    const navigate = useNavigate();
    const [dane, setDane] = useState<any[]>([]);
    const [edytowany, setEdytowany] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [availabilityFilter, setAvailabilityFilter] = useState<'all'|'available'|'unavailable'>('all');
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [classroomFilter, setClassroomFilter] = useState<string>("");

    useEffect(() => {
        fetch("/api/equipment")
            .then(res => res.json())
            .then(data => setDane(data));

        fetch("/api/classroom")
            .then(res => res.json())
            .then(data => setClassrooms(data));
    }, []);

    const zapiszEdycje = async () => {
        const response = await fetch(`/api/equipment/${edytowany.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                typ: edytowany.typ,
                producent: edytowany.producent,
                numerSeryjny: edytowany.numer_seryjny,
                dostepny: edytowany.dostepny,
                lokalizacjaId: edytowany.lokalizacjaId
            })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: 'Błąd serwera' }));
            alert(`Nie udało się zapisać zmian: ${err.message}`);
            return;
        }

        setDane(prev => prev.map(e => e.id === edytowany.id ? edytowany : e));
        setEdytowany(null);
    };

    const usunSprzet = async (id: number) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten sprzęt?")) return;
        const response = await fetch(`/api/equipment/${id}`, { method: "DELETE" });
        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: 'Błąd serwera' }));
            alert(`Nie udało się usunąć sprzętu: ${err.message}`);
            return;
        }
        setDane(prev => prev.filter(e => e.id !== id));
        alert('Sprzęt został usunięty.');
    };

    const filteredDane = dane
        .filter(e => {
            const q = searchQuery.toLowerCase().trim();
            if (!q) return true;
            return (
                String(e.typ || '').toLowerCase().includes(q) ||
                String(e.producent || '').toLowerCase().includes(q) ||
                String(e.numer_seryjny || '').toLowerCase().includes(q) ||
                String(e.lokalizacja || '').toLowerCase().includes(q)
            );
        })
        .filter(e => {
            if (availabilityFilter === 'all') return true;
            if (availabilityFilter === 'available') return e.dostepny;
            return !e.dostepny;
        });

    const filteredClassrooms = classrooms.filter(c => {
        const q = classroomFilter.toLowerCase().trim();
        if (!q) return true;
        return (
            String(c.nr_sali || '').toLowerCase().includes(q) ||
            String(c.lokalizacja || '').toLowerCase().includes(q)
        );
    });

    return (
        <div className="equipment-container">
            <h1 className="equipment-title">Lista sprzętu</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '18px' }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Szukaj typ / producent / nr seryjny / lokalizacja"
                    style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #999', background: '#1a1a2e', color: '#e2e8f0', width: '280px' }}
                />
                <select
                    value={availabilityFilter}
                    onChange={e => setAvailabilityFilter(e.target.value as any)}
                    style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #999', background: '#1a1a2e', color: '#e2e8f0' }}
                >
                    <option value="all">Wszystkie</option>
                    <option value="available">Dostępne</option>
                    <option value="unavailable">Niedostępne</option>
                </select>
                <span style={{ color: '#cbd5e1', fontSize: '13px' }}>
                    Wyniki: {filteredDane.length} / {dane.length}
                </span>
            </div>

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
                        <select className="role-select" value={edytowany.dostepny ? "true" : "false"}
                            onChange={e => setEdytowany({...edytowany, dostepny: e.target.value === "true"})}>
                            <option value="true">dostępny</option>
                            <option value="false">niedostępny</option>
                        </select>

                        <p className="register-label">Lokalizacja sali</p>
                        <input
                            className="register-input"
                            type="text"
                            value={classroomFilter}
                            onChange={e => setClassroomFilter(e.target.value)}
                            placeholder="Filtruj salę / lokalizację"
                        />
                        <select className="role-select" value={edytowany.lokalizacjaId ?? ""}
                            onChange={e => setEdytowany({...edytowany, lokalizacjaId: e.target.value ? Number(e.target.value) : null})}>
                            <option value="">-- brak --</option>
                            {filteredClassrooms.map(c => (
                                <option key={c.id} value={c.id}>
                                    Sala {c.nr_sali} ({c.lokalizacja})
                                </option>
                            ))}
                        </select>
                        <p style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '4px' }}>
                            {filteredClassrooms.length} z {classrooms.length} sal
                        </p>
                        <button
                            className="role-select"
                            style={{ marginTop: '8px' }}
                            onClick={() => {
                                const nowaSala = prompt('Podaj numer nowej sali (np. 101)');
                                if (!nowaSala) return;
                                const locationName = prompt('Podaj nazwę lokalizacji');
                                if (!locationName) return;
                                alert('Dodawanie nowej sali w backendzie nie jest dostępne w tym widoku. Zrób to ręcznie lub w panelu zarządzania salami.');
                            }}
                        >
                            Dodaj lokalizację sali
                        </button>
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
                        {filteredDane.map((equipment, index) => (
                            <tr key={equipment.id}>
                                <td>{index + 1}</td>
                                <td>{equipment.typ}</td>
                                <td>{equipment.producent}</td>
                                <td>{equipment.numer_seryjny}</td>
                                <td>
                                    <span className={`status-badge ${equipment.dostepny ? "sprawny" : "uszkodzony"}`}>
                                        {equipment.dostepny ? "dostępny" : "niedostępny"}
                                    </span>
                                </td>
                                <td>{equipment.lokalizacja}</td>
                                <td>
                                    <div className="row-actions">
                                        <button className="role-select" onClick={() => setEdytowany({
                                            ...equipment,
                                            lokalizacjaId: equipment.lokalizacjaId ?? undefined
                                        })}>
                                            Edytuj
                                        </button>
                                        <button
                                            className="cancel-button"
                                            onClick={() => usunSprzet(equipment.id)}
                                        >
                                            Usuń
                                        </button>
                                    </div>
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