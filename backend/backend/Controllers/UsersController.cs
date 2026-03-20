using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UsersController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _db.Users
                .Include(u => u.Rola)
                .Select(u => new {
                    u.id,
                    u.imie,
                    u.nazwisko,
                    u.email,
                    u.login,
                    rola = u.Rola!.RoleName,
                    u.rola_id
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPut("{id}/rola")]
        public async Task<IActionResult> UpdateRola(int id, [FromBody] UpdateRolaRequest request)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.rola_id = request.RolaId;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Rola zaktualizowana" });
        }
    }
}