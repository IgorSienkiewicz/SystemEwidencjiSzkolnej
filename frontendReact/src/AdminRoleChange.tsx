import { useState, useEffect } from 'react';
import './AdminRoleChange.css';
import { useNavigate } from 'react-router-dom';

function AdminRoleChange() {
    const navigate = useNavigate();
    const [dane, setDane] = useState<any[]>([]);
    const [role, setRole] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        fetch("/api/users")
            .then(res => res.json())
            .then(data => {
                console.log("users:", data);
                setDane(data);
            });

        fetch("/api/roles")
            .then(res => res.json())
            .then(data => {
                console.log("roles:", data);
                setRole(data);
            });
    }, []);

    const zmienRole = async (userId: number, nowaRolaId: number) => {
        const currentUser = dane.find(u => u.id === userId);
        if (!currentUser) return;

        const response = await fetch(`/api/users/${userId}/rola`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rolaId: nowaRolaId })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: "Błąd serwera" }));
            alert(`Nie udało się zmienić roli: ${err.message}`);
            setDane(prev => prev.map(u =>
                u.id === userId ? { ...u, rola_id: currentUser.rola_id } : u
            ));
            return;
        }

        setDane(prev => prev.map(u =>
            u.id === userId ? { ...u, rola_id: nowaRolaId } : u
        ));
        alert("Rola użytkownika została zaktualizowana");
    };

    const filteredDane = dane.filter(u => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        return [u.imie, u.nazwisko, u.email, u.login]
            .some((value: string) => String(value || "").toLowerCase().includes(q));
    });

    return (
        <div className="admin-container">
            <h1 className="admin-title">Zarządzanie użytkownikami</h1>
            <div style={{ marginBottom: '14px' }}>
                <input
                    type="text"
                    placeholder="Szukaj po imieniu, nazwisku, email lub loginie"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        maxWidth: '480px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(129, 140, 248, 0.5)',
                        background: '#1a1a2e',
                        color: '#e2e8f0',
                        outline: 'none'
                    }}
                />
            </div>
            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Lp.</th>
                            <th>Imię</th>
                            <th>Nazwisko</th>
                            <th>Email</th>
                            <th>Login</th>
                            <th>Rola</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDane.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.imie}</td>
                                <td>{user.nazwisko}</td>
                                <td>{user.email}</td>
                                <td>{user.login}</td>
                                <td>
                                    <select
                                        className="role-select"
                                        value={user.rola_id}
                                        onChange={(e) => zmienRole(user.id, Number(e.target.value))}
                                    >
                                        {role.map(r => (
                                            <option key={r.id} value={r.id}>
                                                {r.roleName}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="back-button" onClick={() => navigate("/admin")}>
                    ← Powrót do strony głównej
                </button>
            </div>
        </div>
    );
}

export default AdminRoleChange;