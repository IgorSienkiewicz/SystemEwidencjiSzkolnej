using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/classroom")]
    public class ClassroomEquipmentController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ClassroomEquipmentController(AppDbContext db)
        {
            _db = db;
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

        [HttpPost("{lokalizacjaId}/zarezerwuj/{sprzetoId}")]
        public async Task<IActionResult> ZarezerwujSprzet(int lokalizacjaId, int sprzetoId)
        {
            var sala = await _db.Classrooms.FindAsync(lokalizacjaId);
            if (sala == null) return NotFound(new { message = "Nie znaleziono sali" });

            var sprzet = await _db.Equipment.FindAsync(sprzetoId);
            if (sprzet == null) return NotFound(new { message = "Nie znaleziono sprzetu" });

            if (!sprzet.dostepny) return BadRequest(new { message = "Sprzet jest juz niedostepny" });

            sprzet.id_sali = lokalizacjaId;
            sprzet.dostepny = false;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Zarezerwowano sprzet" });
        }

        [HttpPost("{lokalizacjaId}/zwolnij/{sprzetoId}")]
        public async Task<IActionResult> ZwolnijSprzet(int lokalizacjaId, int sprzetoId)
        {
            var sprzet = await _db.Equipment.FindAsync(sprzetoId);
            if (sprzet == null) return NotFound(new { message = "Nie znaleziono sprzetu" });

            if (sprzet.id_sali != lokalizacjaId)
                return BadRequest(new { message = "Sprzet nie jest przypisany do tej sali" });

            sprzet.id_sali = null;
            sprzet.dostepny = true;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Zwolniono sprzet" });
        }
    }
}