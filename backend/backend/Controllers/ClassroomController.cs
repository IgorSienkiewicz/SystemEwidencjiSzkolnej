using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
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
        public async Task<IActionResult> GetClassrooms([FromQuery] string? filter = "all")
        {
            var classroomsQuery = _db.Classrooms
                .Include(c => c.Location)
                .Include(c => c.Equipment)
                .Include(c => c.User)
                .AsQueryable();

            if (filter == "assigned")
                classroomsQuery = classroomsQuery.Where(c => c.id_nauczyciela != null);
            else if (filter == "unassigned")
                classroomsQuery = classroomsQuery.Where(c => c.id_nauczyciela == null);

            var classrooms = await classroomsQuery
                .Select(c => new {
                    c.id,
                    c.nr_sali,
                    c.ilosc_komputerow,
                    lokalizacja = c.Location != null ? c.Location.nazwa : "",
                    nauczyciel = c.User != null ? $"{c.User.imie} {c.User.nazwisko}" : null,
                    nauczycielId = c.id_nauczyciela,
                    iloscSprzetu = c.Equipment.Count
                })
                .ToListAsync();
            return Ok(classrooms);
        }

        [HttpGet("teachers")]
        public async Task<IActionResult> GetTeachers()
        {
            var nauczycielRole = await _db.Roles.FirstOrDefaultAsync(r => r.RoleName == "Nauczyciel");
            if (nauczycielRole == null) return NotFound(new { message = "Brak roli Nauczyciel" });

            var teachers = await _db.Users
                .Where(u => u.rola_id == nauczycielRole.Id)
                .Select(u => new {
                    u.id,
                    u.imie,
                    u.nazwisko,
                    u.email,
                    u.login
                })
                .ToListAsync();

            return Ok(teachers);
        }

        [HttpPut("{classroomId}/przypisz/{teacherId}")]
        public async Task<IActionResult> AssignTeacher(int classroomId, int teacherId)
        {
            var classroom = await _db.Classrooms.FindAsync(classroomId);
            if (classroom == null) return NotFound(new { message = "Nie znaleziono sali" });

            var teacher = await _db.Users.FindAsync(teacherId);
            if (teacher == null) return NotFound(new { message = "Nie znaleziono nauczyciela" });

            var teacherRole = await _db.Roles.FirstOrDefaultAsync(r => r.RoleName == "Nauczyciel");
            if (teacherRole == null || teacher.rola_id != teacherRole.Id)
                return BadRequest(new { message = "Użytkownik nie jest nauczycielem" });

            classroom.id_nauczyciela = teacherId;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Przypisano nauczyciela do sali" });
        }

        [HttpPut("{classroomId}/odpisz")]
        public async Task<IActionResult> UnassignTeacher(int classroomId)
        {
            var classroom = await _db.Classrooms.FindAsync(classroomId);
            if (classroom == null) return NotFound(new { message = "Nie znaleziono sali" });

            classroom.id_nauczyciela = null;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Usunięto przypisanie nauczyciela" });
        }

        [HttpPost]
        public async Task<IActionResult> AddClassroom([FromBody] AddClassroomRequest request)
        {
            var location = await _db.Location.FindAsync(request.id_szkoly);
            if (location == null) return NotFound(new { message = "Nie znaleziono lokalizacji" });

            var existing = await _db.Classrooms.AnyAsync(c => c.nr_sali == request.nr_sali && c.id_szkoly == request.id_szkoly);
            if (existing) return BadRequest(new { message = "Sala o tym numerze w tej lokalizacji już istnieje" });

            var classroom = new Classroom
            {
                nr_sali = request.nr_sali,
                ilosc_komputerow = 0,
                id_szkoly = request.id_szkoly,
                id_nauczyciela = null
            };

            _db.Classrooms.Add(classroom);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Dodano salę" });
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
                    iloscSprzetu = c.Equipment.Count
                })
                .ToListAsync();
            return Ok(classrooms);
        }
    }
}