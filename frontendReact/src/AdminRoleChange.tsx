import { useState, useEffect } from 'react';
import './AdminRoleChange.css';
import { useNavigate } from 'react-router-dom';

function AdminRoleChange() {
    const navigate = useNavigate();
    const [dane, setDane] = useState<any[]>([]);
    const [role, setRole] = useState<any[]>([]);

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
                            <th>Lp.</th>
                            <th>Imię</th>
                            <th>Nazwisko</th>
                            <th>Email</th>
                            <th>Login</th>
                            <th>Rola</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dane.map((user, index) => (
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