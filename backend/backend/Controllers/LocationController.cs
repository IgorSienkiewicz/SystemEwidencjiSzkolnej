using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/location")]
    public class LocationController : ControllerBase
    {
        private readonly AppDbContext _db;

        public LocationController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetLocations()
        {
            var locations = await _db.Location
                .Select(l => new { l.id, l.nazwa, l.opis })
                .ToListAsync();

            return Ok(locations);
        }
    }
}