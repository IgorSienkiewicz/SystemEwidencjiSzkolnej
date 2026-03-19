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
            .Include(c => c.Equipment)
            .Include(c => c.Location)
            .Select(c => new {
                c.id,
                c.nr_sali,
                c.ilosc_komputerow,
                lokalizacja = c.Location!.nazwa,
                sprzet = c.Equipment!.typ
            })
            .ToListAsync();

        return Ok(classrooms);
    }

    [HttpGet("nauczyciel/{nauczycielId}")]
    public async Task<IActionResult> GetByNauczyciel(int nauczycielId)
    {
        var classrooms = await _db.Classrooms
            .Include(c => c.Equipment)
            .Include(c => c.Location)
            .Where(c => c.id_nauczyciela == nauczycielId)
            .Select(c => new {
                c.id,
                c.nr_sali,
                c.ilosc_komputerow,
                lokalizacja = c.Location!.nazwa,
                sprzet = c.Equipment!.typ
            })
            .ToListAsync();

        return Ok(classrooms);
    }

    [HttpGet("{id}/sprzet")]
    public async Task<IActionResult> GetSprzet(int id)
    {
        var classroom = await _db.Classrooms
            .Include(c => c.Equipment)
            .Where(c => c.id == id)
            .Select(c => new {
                c.id,
                c.nr_sali,
                sprzet = new {
                    c.Equipment!.id,
                    c.Equipment.typ,
                    c.Equipment.producent,
                    c.Equipment.numer_seryjny,
                    c.Equipment.status
                }
            })
            .FirstOrDefaultAsync();

        if (classroom == null) return NotFound();
        return Ok(classroom);
    }
}