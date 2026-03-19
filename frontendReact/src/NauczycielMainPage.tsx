import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import './NauczycielMainPage.css';

function NauczycielMainPage() {
    const navigate = useNavigate();
    const [dane, setDane] = useState<any[]>([]);

    const wyloguj = () => {
        localStorage.clear();
        navigate("/");
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        fetch(`/api/classroom/nauczyciel/${user.id}`)
            .then(res => res.json())
            .then(data => setDane(data));
    }, []);

    return (
        <div className="nauczyciel-container">
            <h1 className="nauczyciel-title">Moje sale</h1>
            <div className="nauczyciel-table-wrapper">
                <table className="nauczyciel-table">
                    <thead>
                        <tr>
                            <th>Lp.</th>
                            <th>Nr sali</th>
                            <th>Ilość komputerów</th>
                            <th>Lokalizacja</th>
                            <th>Ilość sprzętu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dane.map((classroom, index) => (
                            <tr
                                key={classroom.id}
                                onClick={() => navigate(`/nauczyciel/sala/${classroom.id}`)}
                            >
                                <td>{index + 1}</td>
                                <td>{classroom.nr_sali}</td>
                                <td>{classroom.ilosc_komputerow}</td>
                                <td>{classroom.lokalizacja}</td>
                                <td>{classroom.iloscSprzetu}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="nauczyciel-buttons">
                <button className="nauczyciel-reserve-button" onClick={() => navigate("/nauczyciel/rezerwacja")}>
                    Zarezerwuj sprzęt
                </button>
                <button className="nauczyciel-logout-button" onClick={wyloguj}>
                    Wyloguj się
                </button>
            </div>
        </div>
    )
}

export default NauczycielMainPage