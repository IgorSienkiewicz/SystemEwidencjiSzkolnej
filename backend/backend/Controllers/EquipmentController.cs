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
                e.status,
                lokalizacja = e.Location!.nazwa
            })
            .ToListAsync();

        return Ok(equipment);
    }
}