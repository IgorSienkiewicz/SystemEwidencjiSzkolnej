import { useState } from 'react';
import './Logowanie.css'


function Logowanie(){
    const [login, setLogin] = useState('')
    const [haslo, setHaslo] = useState('')
    const Login = () => {
        console.log(login, haslo);
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