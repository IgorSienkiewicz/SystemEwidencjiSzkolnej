import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rejestracja.css';

function Rejestracja() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [imie, setImie] = useState('');
    const [nazwisko, setNazwisko] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const Register = async () => {
        if (password !== repeatPassword) {
            alert("Hasła nie są identyczne");
            return;
        }

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, haslo: password, imie, nazwisko, email })
            });

            const text = await response.text();
            const data = text ? JSON.parse(text) : {};

            if (response.ok) {
                alert("Zarejestrowano pomyślnie");
                navigate('/');
            } else {
                alert(data.message || "Nie zarejestrowano");
            }
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-box">
                <h1 className="register-title">Zarejestruj się</h1>
                <p className="register-label">Imię</p>
                <input className="register-input" type="text" onChange={(e) => setImie(e.target.value)} />
                <p className="register-label">Nazwisko</p>
                <input className="register-input" type="text" onChange={(e) => setNazwisko(e.target.value)} />
                <p className="register-label">Email</p>
                <input className="register-input" type="email" onChange={(e) => setEmail(e.target.value)} />
                <p className="register-label">Login</p>
                <input className="register-input" type="text" onChange={(e) => setLogin(e.target.value)} />
                <p className="register-label">Hasło</p>
                <input className="register-input" type="password" onChange={(e) => setPassword(e.target.value)} />
                <p className="register-label">Powtórz hasło</p>
                <input className="register-input" type="password" onChange={(e) => setRepeatPassword(e.target.value)} />
                <button className="register-button" onClick={Register}>Zarejestruj się!</button>
                <button className="back-link" onClick={() => navigate('/')}>Masz już konto? Zaloguj się</button>
            </div>
        </div>
    );
}

export default Rejestracja;