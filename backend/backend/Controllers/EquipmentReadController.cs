using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/equipment")]
    public class EquipmentReadController : ControllerBase
    {
        private readonly AppDbContext _db;

        public EquipmentReadController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var equipment = await (
                from e in _db.Equipment
                join c in _db.Classrooms on e.id_sali equals c.id into cc
                from c in cc.DefaultIfEmpty()
                join u in _db.Users on c.id_nauczyciela equals u.id into uu
                from u in uu.DefaultIfEmpty()
                select new {
                    e.id,
                    e.typ,
                    e.producent,
                    e.numer_seryjny,
                    e.dostepny,
                    lokalizacjaId = e.lokalizacja_id,
                    sala = c != null ? c.nr_sali : (int?)null,
                    lokalizacja = e.Location != null ? e.Location.nazwa : "Brak lokalizacji",
                    nauczyciel = u != null ? $"{u.imie} {u.nazwisko}" : null
                }
            ).ToListAsync();

            return Ok(equipment);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await (
                from e in _db.Equipment
                where e.id == id
                join c in _db.Classrooms on e.id_sali equals c.id into cc
                from c in cc.DefaultIfEmpty()
                join u in _db.Users on c.id_nauczyciela equals u.id into uu
                from u in uu.DefaultIfEmpty()
                select new {
                    e.id,
                    e.typ,
                    e.producent,
                    e.numer_seryjny,
                    e.dostepny,
                    lokalizacjaId = e.lokalizacja_id,
                    sala = c != null ? c.nr_sali : (int?)null,
                    lokalizacja = e.Location != null ? e.Location.nazwa : "Brak lokalizacji",
                    nauczyciel = u != null ? $"{u.imie} {u.nazwisko}" : null
                }
            ).FirstOrDefaultAsync();

            if (item == null) return NotFound(new { message = "Nie znaleziono sprzetu" });
            return Ok(item);
        }
    }
}