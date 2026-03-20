using backend.Controllers;
using backend.Models;
using backend.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.Controllers
{
    public class EquipmentReadControllerTests
    {
        private static T P<T>(object o, string n) => (T)o.GetType().GetProperty(n)!.GetValue(o)!;

        [Fact] public async Task GetAll_Count() { using var db = DbContextFactory.Create(); Assert.Equal(3, ((IEnumerable<object>)Assert.IsType<OkObjectResult>(await new EquipmentReadController(db).GetAll()).Value!).Count()); }

        [Fact]
        public async Task GetAll_NauczycielForEq2()
        {
            using var db = DbContextFactory.Create();
            var list = ((IEnumerable<object>)Assert.IsType<OkObjectResult>(await new EquipmentReadController(db).GetAll()).Value!).ToList();
            Assert.Equal("Jan Kowalski", P<string?>(list.First(e => P<int>(e, "id") == 2), "nauczyciel"));
        }

        [Fact]
        public async Task GetAll_NoRoom_NauczycielNull()
        {
            using var db = DbContextFactory.Create();
            var list = ((IEnumerable<object>)Assert.IsType<OkObjectResult>(await new EquipmentReadController(db).GetAll()).Value!).ToList();
            var eq1 = list.First(e => P<int>(e, "id") == 1);
            Assert.Null(eq1.GetType().GetProperty("nauczyciel")!.GetValue(eq1));
        }

        [Fact]
        public async Task GetAll_LocationName()
        {
            using var db = DbContextFactory.Create();
            var list = ((IEnumerable<object>)Assert.IsType<OkObjectResult>(await new EquipmentReadController(db).GetAll()).Value!).ToList();
            Assert.Equal("Budynek A", P<string>(list.First(e => P<int>(e, "id") == 1), "lokalizacja"));
        }

        [Fact]
        public async Task GetById_Valid()
        {
            using var db = DbContextFactory.Create();
            var ok = Assert.IsType<OkObjectResult>(await new EquipmentReadController(db).GetById(1));
            Assert.Equal(1, P<int>(ok.Value!, "id")); Assert.Equal("Komputer", P<string>(ok.Value!, "typ"));
        }

        [Fact] public async Task GetById_Invalid() { using var db = DbContextFactory.Create(); Assert.Equal("Nie znaleziono sprzetu", P<string>(Assert.IsType<NotFoundObjectResult>(await new EquipmentReadController(db).GetById(999)).Value!, "message")); }

        [Fact]
        public async Task GetById_SalaNumber()
        {
            using var db = DbContextFactory.Create();
            var ok = Assert.IsType<OkObjectResult>(await new EquipmentReadController(db).GetById(2));
            Assert.Equal(101, ok.Value!.GetType().GetProperty("sala")!.GetValue(ok.Value));
        }

        [Fact]
        public async Task GetById_NoLocation_BrakLokalizacji()
        {
            using var db = new backend.Data.AppDbContext(new DbContextOptionsBuilder<backend.Data.AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
            db.Equipment.Add(new Equipment { id = 10, typ = "T", producent = "S", numer_seryjny = "X", dostepny = true, lokalizacja_id = null });
            await db.SaveChangesAsync();
            var ok = Assert.IsType<OkObjectResult>(await new EquipmentReadController(db).GetById(10));
            Assert.Equal("Brak lokalizacji", P<string>(ok.Value!, "lokalizacja"));
        }
    }
}
