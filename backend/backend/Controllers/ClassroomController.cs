using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ClassroomController : ControllerBase
{
    private readonly AppDbContext _db;

    public ClassroomController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetClassrooms()
    {
        var classrooms = await _db.Classrooms
            .Include(c => c.Location)
            .Include(c => c.Equipment)
            .Select(c => new {
                c.id,
                c.nr_sali,
                c.ilosc_komputerow,
                lokalizacja = c.Location!.nazwa,
                iloscSprzetu = c.Equipment.Count()
            })
            .ToListAsync();
        return Ok(classrooms);
    }

    [HttpGet("nauczyciel/{nauczycielId}")]
    public async Task<IActionResult> GetByNauczyciel(int nauczycielId)
    {
        var classrooms = await _db.Classrooms
            .Include(c => c.Location)
            .Include(c => c.Equipment)
            .Where(c => c.id_nauczyciela == nauczycielId)
            .Select(c => new {
                c.id,
                c.nr_sali,
                c.ilosc_komputerow,
                lokalizacja = c.Location!.nazwa,
                iloscSprzetu = c.Equipment.Count()
            })
            .ToListAsync();
        return Ok(classrooms);
    }

    [HttpGet("{id}/sprzet")]
    public async Task<IActionResult> GetSprzet(int id)
    {
        var classroom = await _db.Classrooms
            .Where(c => c.id == id)
            .Select(c => new {
                c.id,
                c.nr_sali,
                sprzet = c.Equipment.Select(e => new {
                    e.id,
                    e.typ,
                    e.producent,
                    e.numer_seryjny,
                    e.dostepny
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (classroom == null) return NotFound(new { message = "Nie znaleziono sali" });
        return Ok(classroom);
    }

    [HttpPost("{salaId}/zarezerwuj/{sprzetoId}")]
    public async Task<IActionResult> ZarezerwujSprzet(int salaId, int sprzetoId)
    {
        var sala = await _db.Classrooms.FindAsync(salaId);
        if (sala == null) return NotFound(new { message = "Nie znaleziono sali" });

        var sprzet = await _db.Equipment.FindAsync(sprzetoId);
        if (sprzet == null) return NotFound(new { message = "Nie znaleziono sprzetu" });

        if (!sprzet.dostepny) return BadRequest(new { message = "Sprzet jest juz niedostepny" });

        sprzet.id_sali = salaId;
        sprzet.dostepny = false; 

        await _db.SaveChangesAsync();
        return Ok(new { message = "Zarezerwowano sprzet" });
    }
    
    [HttpPost("{salaId}/zwolnij/{sprzetoId}")]
    public async Task<IActionResult> ZwolnijSprzet(int salaId, int sprzetoId)
    {
        var sprzet = await _db.Equipment.FindAsync(sprzetoId);
        if (sprzet == null) return NotFound(new { message = "Nie znaleziono sprzetu" });

        if (sprzet.id_sali != salaId) return BadRequest(new { message = "Sprzet nie jest przypisany do tej sali" });

        sprzet.id_sali = null;
        sprzet.dostepny = true;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Zwolniono sprzet" });
    }
}