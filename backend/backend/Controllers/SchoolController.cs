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
}