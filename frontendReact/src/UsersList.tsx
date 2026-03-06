import { useState } from 'react';

interface Role {
  id: number;
  roleName: string;
}

function RolesList() {
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:5164/api/roles');
      if (!response.ok) throw new Error('Błąd serwera');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Błąd pobierania danych:', error);
      alert('Nie udało się pobrać danych. Sprawdź konsolę (F12).');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={fetchRoles}>Pobierz role</button>
      <table border={1} style={{ marginTop: '20px', width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Rola</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.roleName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RolesList;