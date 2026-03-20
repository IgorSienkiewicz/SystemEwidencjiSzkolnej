import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminClassroomAssignment.css';

interface Classroom {
    id: number;
    nr_sali: number;
    ilosc_komputerow: number;
    lokalizacja: string;
    nauczyciel: string | null;
    nauczycielId: number | null;
    iloscSprzetu: number;
}

interface Teacher {
    id: number;
    imie: string;
    nazwisko: string;
    email: string;
    login: string;
}

function AdminClassroomAssignment() {
    const navigate = useNavigate();
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [selectedClassroom, setSelectedClassroom] = useState<string>('');
    const [selectedTeacher, setSelectedTeacher] = useState<string>('');
    const [classroomFilter, setClassroomFilter] = useState<'all'|'assigned'|'unassigned'>('all');
    const [newClassroomNumber, setNewClassroomNumber] = useState<number>(0);
    const [newClassroomLocation, setNewClassroomLocation] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>('');

    const fetchData = async () => {
        const [classroomsRes, teachersRes, locationsRes] = await Promise.all([
            fetch(`/api/classroom?filter=${classroomFilter}`),
            fetch('/api/classroom/teachers'),
            fetch('/api/location')
        ]);

        if (classroomsRes.ok && teachersRes.ok && locationsRes.ok) {
            const [classroomsData, teachersData, locationsData] = await Promise.all([
                classroomsRes.json(),
                teachersRes.json(),
                locationsRes.json()
            ]);
            setClassrooms(classroomsData);
            setTeachers(teachersData);
            setLocations(locationsData);
            if (!newClassroomLocation && locationsData.length > 0) {
                setNewClassroomLocation(String(locationsData[0].id));
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [classroomFilter]);

    const assignTeacher = async () => {
        if (!selectedClassroom || !selectedTeacher) {
            setMessage('Wybierz salę i nauczyciela.');
            return;
        }
        setLoading(true);
        setMessage('');

        const response = await fetch(`/api/classroom/${selectedClassroom}/przypisz/${selectedTeacher}`, {
            method: 'PUT'
        });

        const result = await response.json();
        if (!response.ok) {
            setMessage(result.message || 'Błąd przypisania.');
            setLoading(false);
            return;
        }

        setMessage(result.message || 'Przypisano nauczyciela.');
        await fetchData();
        setLoading(false);
    };

    const unassignTeacher = async (classroomId: number) => {
        setLoading(true);
        setMessage('');

        const response = await fetch(`/api/classroom/${classroomId}/odpisz`, {
            method: 'PUT'
        });

        const result = await response.json();
        if (!response.ok) {
            setMessage(result.message || 'Błąd odpięcia.');
            setLoading(false);
            return;
        }

        setMessage(result.message || 'Usunięto przypisanie.');
        await fetchData();
        setLoading(false);
    };

    const addClassroom = async () => {
        if (!newClassroomNumber || !newClassroomLocation) {
            setMessage('Wypełnij numer sali i lokalizację.');
            return;
        }

        setLoading(true);
        setMessage('');

        const response = await fetch('/api/classroom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nr_sali: newClassroomNumber,
                id_szkoly: Number(newClassroomLocation)
            })
        });

        const result = await response.json();
        if (!response.ok) {
            setMessage(result.message || 'Błąd dodawania sali.');
            setLoading(false);
            return;
        }

        setMessage(result.message || 'Sala dodana.');
        setNewClassroomNumber(0);
        if (locations.length > 0) setNewClassroomLocation(String(locations[0].id));
        await fetchData();
        setLoading(false);
    };

    return (
        <div className="assign-container">
            <h1 className="assign-title">Przypisz salę nauczycielowi</h1>

            <div className="assign-card">
                <div className="assign-row">
                    <label htmlFor="classroom-filter">Filtr sal</label>
                    <select
                        id="classroom-filter"
                        value={classroomFilter}
                        onChange={e => setClassroomFilter(e.target.value as 'all'|'assigned'|'unassigned')}
                    >
                        <option value="all">Wszystkie</option>
                        <option value="assigned">Przypisane do nauczyciela</option>
                        <option value="unassigned">Wolne (bez nauczyciela)</option>
                    </select>
                </div>

                <div className="assign-row">
                    <label htmlFor="select-classroom">Wybierz salę</label>
                    <select
                        id="select-classroom"
                        value={selectedClassroom}
                        onChange={e => setSelectedClassroom(e.target.value)}
                    >
                        <option value="">-- Wybierz salę --</option>
                        {classrooms.map(c => (
                            <option key={c.id} value={c.id}>
                                Sala {c.nr_sali} ({c.lokalizacja})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="assign-row">
                    <label htmlFor="select-teacher">Wybierz nauczyciela</label>
                    <select
                        id="select-teacher"
                        value={selectedTeacher}
                        onChange={e => setSelectedTeacher(e.target.value)}
                    >
                        <option value="">-- Wybierz nauczyciela --</option>
                        {teachers.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.imie} {t.nazwisko} ({t.login})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="assign-actions">
                    <button onClick={assignTeacher} disabled={loading || !selectedClassroom || !selectedTeacher}>
                        {loading ? 'Przypisywanie...' : 'Przypisz'}
                    </button>
                    <button onClick={() => navigate('/admin')} className="back-button">
                        Powrót
                    </button>
                </div>
                {message && <div className="assign-message">{message}</div>}

                <div className="assign-row" style={{ marginTop: '20px', borderTop: '1px solid rgba(129, 140, 248, 0.25)', paddingTop: '14px' }}>
                    <h3 style={{ color: '#e2e8f0' }}>Dodaj nową salę</h3>
                </div>

                <div className="assign-row">
                    <label htmlFor="new-classroom-number">Numer sali</label>
                    <input
                        id="new-classroom-number"
                        type="number"
                        value={newClassroomNumber}
                        onChange={e => setNewClassroomNumber(Number(e.target.value))}
                        className="assign-input"
                    />
                </div>

                <div className="assign-row">
                    <label htmlFor="new-classroom-location">Lokalizacja</label>
                    <select
                        id="new-classroom-location"
                        value={newClassroomLocation}
                        onChange={e => setNewClassroomLocation(e.target.value)}
                    >
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                                {loc.nazwa}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="assign-actions" style={{ marginTop: '10px' }}>
                    <button onClick={addClassroom} disabled={loading || !newClassroomNumber || !newClassroomLocation}>
                        {loading ? 'Dodawanie...' : 'Dodaj salę'}
                    </button>
                </div>
            </div>

            <div className="assign-table-wrapper">
                <table className="assign-table">
                    <thead>
                        <tr>
                            <th>Sala</th>
                            <th>Lokalizacja</th>
                            <th>Nauczyciel</th>
                            <th>Sprzęt</th>
                            <th>Akcja</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classrooms.map((c) => (
                            <tr key={c.id}>
                                <td>{c.nr_sali}</td>
                                <td>{c.lokalizacja}</td>
                                <td>{c.nauczyciel ?? '-'}</td>
                                <td>{c.iloscSprzetu}</td>
                                <td>
                                    <button
                                        className="unassign-button"
                                        onClick={() => unassignTeacher(c.id)}
                                        disabled={loading || !c.nauczycielId}
                                    >
                                        Odłącz nauczyciela
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminClassroomAssignment;