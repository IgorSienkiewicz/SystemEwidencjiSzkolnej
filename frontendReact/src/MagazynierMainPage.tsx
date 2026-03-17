import { useNavigate } from "react-router-dom"

function MagazynierMainPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Strona główna</h1>
      <button onClick={() => navigate("/magazynier/ewidencjaSprzetu")}>Sprawdź aktualny stan sprzętu</button>
      <button onClick={() => navigate("/")}>Wyloguj</button>
      <button className="back-button" onClick={() => navigate("/magazynier/addEquipment")}>Dodaj sprzęt</button>
    </div>
  )
}

export default MagazynierMainPage