import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NauczycielReserveEquipment.css';

interface Sala {
    id: number;
    nr_sali: number;
    lokalizacja: string;
}

interface Sprzet {
    id: number;
    typ: string;
    producent: string;
    numer_seryjny: string;
}

function NauczycielReserveEquipment() {
    const [sale, setSale] = useState<Sala[]>([]);
    const [sprzet, setSprzet] = useState<Sprzet[]>([]);
    const [selectedSala, setSelectedSala] = useState<string>("");
    const [selectedSprzet, setSelectedSprzet] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const pobierzSprzet = () => {
        fetch("/api/equipment")
            .then(res => res.json())
            .then(data => setSprzet(data.filter((e: any) => e.dostepny)));
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        fetch(`/api/classroom/nauczyciel/${user.id}`)
            .then(res => res.json())
            .then(data => setSale(data));

        pobierzSprzet();
    }, []);

    const zarezerwuj = async () => {
        if (!selectedSala || !selectedSprzet) {
            alert("Wybierz salę i sprzęt");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/classroom/${selectedSala}/zarezerwuj/${selectedSprzet}`, {
                method: "POST"
            });

            if (!response.ok) {
                const err = await response.json();
                alert(err.message);
                return;
            }

            const result = await response.json();
            alert(result.message);
            setSelectedSala("");
            setSelectedSprzet("");
            pobierzSprzet();
        } catch (err) {
            alert("Błąd połączenia z serwerem");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reserve-container">
            <h1 className="reserve-title">Zarezerwuj sprzęt</h1>

            <div className="reserve-card">
                <div className="reserve-field">
                    <label className="reserve-label">Wybierz salę</label>
                    <select
                        className="reserve-select"
                        value={selectedSala}
                        onChange={(e) => setSelectedSala(e.target.value)}
                    >
                        <option value="">-- Wybierz salę --</option>
                        {sale.map((s) => (
                            <option key={s.id} value={s.id}>
                                Sala {s.nr_sali} | {s.lokalizacja}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="reserve-field">
                    <label className="reserve-label">Wybierz sprzęt</label>
                    <select
                        className="reserve-select"
                        value={selectedSprzet}
                        onChange={(e) => setSelectedSprzet(e.target.value)}
                    >
                        <option value="">-- Wybierz sprzęt --</option>
                        {sprzet.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.typ} | {e.producent} | {e.numer_seryjny}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className="reserve-button"
                    onClick={zarezerwuj}
                    disabled={loading || !selectedSala || !selectedSprzet}
                >
                    {loading ? "Rezerwowanie..." : "Zarezerwuj"}
                </button>
            </div>

            <button className="reserve-back-button" onClick={() => navigate("/nauczyciel")}>
                ← Powrót do strony głównej
            </button>
        </div>
    );
}

export default NauczycielReserveEquipment;