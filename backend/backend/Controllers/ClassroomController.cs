using backend.Data;
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
}