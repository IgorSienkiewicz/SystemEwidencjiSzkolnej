import { useState, useEffect } from 'react';
import './AdminPage.css';

function AdminPage() {
    const [dane, setDane] = useState<any[]>([]);
    const [role, setRole] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/users")
            .then(res => res.json())
            .then(data => setDane(data));

        fetch("/api/roles")
            .then(res => res.json())
            .then(data => setRole(data));
    }, []);

    const zmienRole = async (userId: number, nowaRolaId: number) => {
        await fetch(`/api/users/${userId}/rola`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rolaId: nowaRolaId })
        });

        setDane(prev => prev.map(u =>
            u.id === userId ? { ...u, rola_id: nowaRolaId } : u
        ));
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Zarządzanie użytkownikami</h1>
            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imię</th>
                            <th>Nazwisko</th>
                            <th>Email</th>
                            <th>Login</th>
                            <th>Rola</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dane.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.imie}</td>
                                <td>{user.nazwisko}</td>
                                <td>{user.email}</td>
                                <td>{user.login}</td>
                                <td>
                                    <select
                                        className="role-select"
                                        defaultValue={user.rola_id}
                                        onChange={(e) => zmienRole(user.id, Number(e.target.value))}
                                    >
                                        {role.map(r => (
                                            <option key={r.id} value={r.id}>
                                                {r.nazwa}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminPage;