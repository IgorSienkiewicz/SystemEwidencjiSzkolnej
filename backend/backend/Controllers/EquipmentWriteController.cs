using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/equipment")]
public class EquipmentWriteController : ControllerBase
{
    private readonly AppDbContext _db;

    public EquipmentWriteController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> AddEquipment([FromBody] AddEquipmentRequest request)
    {
        var equipment = new Equipment
        {
            typ = request.Typ,
            producent = request.Producent,
            numer_seryjny = request.NumerSeryjny,
            dostepny = request.Dostepny,
            lokalizacja_id = request.LokalizacjaId
        };

        _db.Equipment.Add(equipment);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Dodano sprzet" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEquipment(int id, [FromBody] UpdateEquipmentRequest request)
    {
        var equipment = await _db.Equipment.FindAsync(id);
        if (equipment == null) return NotFound();

        equipment.typ = request.Typ;
        equipment.producent = request.Producent;
        equipment.numer_seryjny = request.NumerSeryjny;
        equipment.dostepny = request.Dostepny;

        if (request.LokalizacjaId.HasValue)
            equipment.lokalizacja_id = request.LokalizacjaId.Value;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Zaktualizowano sprzet" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEquipment(int id)
    {
        var equipment = await _db.Equipment.FindAsync(id);
        if (equipment == null)
            return NotFound(new { message = "Nie znaleziono sprzetu" });

        _db.Equipment.Remove(equipment);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Usunieto sprzet" });
    }
}