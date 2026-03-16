import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import './MagazynierEquipmentPage.css';

function NauczycielMainPage() {
    const navigate = useNavigate();
    const [dane, setDane] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/classroom")
            .then(res => res.json())
            .then(data => setDane(data));
    }, []);

    return (
        <div className="equipment-container">
            <h1 className="equipment-title">Lista sal</h1>
            <div className="table-wrapper">
                <table className="equipment-table">
                    <thead>
                      <tr>
                          <th>Id</th>
                          <th>Nr sali</th>
                          <th>Ilość komputerów</th>
                          <th>Lokalizacja</th>
                          <th>Sprzęt</th>
                      </tr>
                  </thead>
                  <tbody>
                      {dane.map((classroom,index) => (
                          <tr key={classroom.id}>
                              <td>{index+1}</td>
                              <td>{classroom.nr_sali}</td>
                              <td>{classroom.ilosc_komputerow}</td>
                              <td>{classroom.lokalizacja}</td>
                              <td>{classroom.sprzet}</td>
                          </tr>
                      ))}
                  </tbody>
                </table>
            </div>
            <button className="back-button" onClick={() => navigate("/")}>
                Wyloguj się
            </button>
        </div>
    )
}

export default NauczycielMainPage