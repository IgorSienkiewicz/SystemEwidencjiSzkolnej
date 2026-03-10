import { useState } from 'react';
import './Logowanie.css';
import { useNavigate } from "react-router-dom";

function Logowanie() {
    const [login, setLogin] = useState('');
    const [haslo, setHaslo] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const Login = async () => {
        setError('');
        try {
            const response = await fetch("http://localhost:5164/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, haslo })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Zalogowano pomyślnie:", data.message);
                navigate('/main');
            } else {
                setError(data.message || "Błąd logowania");
            }
        } catch (err) {
            setError("Błąd połączenia z serwerem");
            console.error(err);
        }
    };

    return (
        <div id="login">
            <h2>Zaloguj się</h2>
            <h3>Login</h3>
            <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />
            <h3>Hasło</h3>
            <input
                type="password"
                value={haslo}
                onChange={(e) => setHaslo(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button id="loguj" onClick={Login}>Zaloguj się</button>
        </div>
    );
}

export default Logowanie;