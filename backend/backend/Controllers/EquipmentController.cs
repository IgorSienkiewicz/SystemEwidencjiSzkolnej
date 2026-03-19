using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class EquipmentController : ControllerBase
{
    private readonly AppDbContext _db;

    public EquipmentController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetEquipment()
    {
        var equipment = await _db.Equipment
            .Include(e => e.Location)
            .Select(e => new {
                e.id,
                e.typ,
                e.producent,
                e.numer_seryjny,
                e.dostepny,
                lokalizacja = e.Location != null ? e.Location.nazwa : "Brak lokalizacji"
            })
            .ToListAsync();

        return Ok(equipment);
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
        equipment.lokalizacja_id = request.LokalizacjaId;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Zaktualizowano sprzet" });
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
