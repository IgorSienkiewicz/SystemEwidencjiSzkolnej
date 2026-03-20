using backend.Controllers;
using backend.Models;
using backend.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace backend.Tests.Controllers
{
    public class EquipmentWriteControllerTests
    {
        private static T P<T>(object o, string n) => (T)o.GetType().GetProperty(n)!.GetValue(o)!;

        [Fact]
        public async Task Add_Valid()
        {
            using var db = DbContextFactory.Create();
            var r = await new EquipmentWriteController(db).AddEquipment(new AddEquipmentRequest { Typ = "P", Producent = "E", NumerSeryjny = "S", Dostepny = true, LokalizacjaId = 1 });
            Assert.Equal("Dodano sprzet", P<string>(Assert.IsType<OkObjectResult>(r).Value!, "message"));
            Assert.Equal(4, db.Equipment.Count());
        }

        [Fact]
        public async Task Add_NullLokalizacja()
        {
            using var db = DbContextFactory.Create();
            await new EquipmentWriteController(db).AddEquipment(new AddEquipmentRequest { Typ = "K", Producent = "L", NumerSeryjny = "S", Dostepny = true, LokalizacjaId = null });
            Assert.Null(db.Equipment.OrderBy(e => e.id).Last().lokalizacja_id);
        }

        [Fact]
        public async Task Update_Valid()
        {
            using var db = DbContextFactory.Create();
            await new EquipmentWriteController(db).UpdateEquipment(1, new UpdateEquipmentRequest { Typ = "New", Producent = "D+", NumerSeryjny = "N", Dostepny = false, LokalizacjaId = 2 });
            var eq = await db.Equipment.FindAsync(1);
            Assert.Equal("New", eq!.typ); Assert.Equal(2, eq.lokalizacja_id);
        }

        [Fact]
        public async Task Update_NullLokalizacja_Keeps()
        {
            using var db = DbContextFactory.Create();
            var orig = (await db.Equipment.FindAsync(1))!.lokalizacja_id;
            await new EquipmentWriteController(db).UpdateEquipment(1, new UpdateEquipmentRequest { Typ = "X", Producent = "Y", NumerSeryjny = "Z", Dostepny = true, LokalizacjaId = null });
            Assert.Equal(orig, (await db.Equipment.FindAsync(1))!.lokalizacja_id);
        }

        [Fact] public async Task Update_Invalid() { using var db = DbContextFactory.Create(); Assert.IsType<NotFoundResult>(await new EquipmentWriteController(db).UpdateEquipment(999, new UpdateEquipmentRequest { Typ = "X", Producent = "Y", NumerSeryjny = "Z", Dostepny = true })); }

        [Fact]
        public async Task Delete_Valid()
        {
            using var db = DbContextFactory.Create();
            Assert.IsType<OkObjectResult>(await new EquipmentWriteController(db).DeleteEquipment(3));
            Assert.Equal(2, db.Equipment.Count());
        }

        [Fact] public async Task Delete_Invalid() { using var db = DbContextFactory.Create(); Assert.Equal("Nie znaleziono sprzetu", P<string>(Assert.IsType<NotFoundObjectResult>(await new EquipmentWriteController(db).DeleteEquipment(999)).Value!, "message")); }
    }
}
