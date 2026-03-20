using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AuthController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _db.Users
                .Include(u => u.Rola)
                .FirstOrDefaultAsync(u => u.login.Trim() == request.Login.Trim() && u.haslo.Trim() == request.Haslo.Trim());

            if (user == null)
                return Unauthorized(new { message = "Błędny login lub hasło" });

            return Ok(new { message = "Zalogowano pomyślnie!", rola = user.Rola!.RoleName, id = user.id });
        }
    }
}