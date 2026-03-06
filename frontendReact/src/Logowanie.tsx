import { useState } from 'react';
import './Logowanie.css'

function Logowanie(){
    const [login, setLogin] = useState('')
    const [haslo, setHaslo] = useState('')

    const Login = async () => {
        try {
            const response = await fetch("http://localhost:5164/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, haslo })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("✅ Zalogowano pomyślnie:", data.message);
            } else {
                console.log("❌ Błąd logowania:", data.message);
            }
        } catch (err) {
            console.error("❌ Błąd połączenia z serwerem:", err);
        }
    }

    return(
        <div id="login">
            <h2>Zaloguj się (Tu ma być strona logowania)</h2>
            <h3>Login</h3>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)}/>
            <h3>Hasło</h3>
            <input type="password" value={haslo} onChange={(e) => setHaslo(e.target.value)}/>
            <button id="loguj" onClick={Login}>Zaloguj się</button>
        </div>
    )
}

export default Logowanie;