import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h1>Zarejestruj się</h1>
            <p>Imie</p>
            <input type="text" onChange={(e) => setImie(e.target.value)} />
            <p>Nazwisko</p>
            <input type="text" onChange={(e) => setNazwisko(e.target.value)} />
            <p>Email</p>
            <input type="mail" onChange={(e) => setEmail(e.target.value)} />
            <p>Login</p>
            <input type="text" onChange={(e) => setLogin(e.target.value)} />
            <p>Podaj hasło</p>
            <input type="password" onChange={(e) => setPassword(e.target.value)} />
            <p>Powtórz hasło</p>
            <input type="password" onChange={(e) => setRepeatPassword(e.target.value)} />
            <button onClick={Register}>Zarejestruj się!</button>
        </div>
    );
}

export default Rejestracja;