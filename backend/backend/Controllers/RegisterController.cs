using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class RegisterController : ControllerBase
{
    private readonly AppDbContext _db;

    public RegisterController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)  
    {
        var user = new User
        {
            login = request.Login,
            haslo = request.Haslo,
            imie = request.Imie,
            nazwisko = request.Nazwisko,
            email = request.Email,
            rola_id = 3
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Zarejestrowano pomyślnie!" });
    }
}