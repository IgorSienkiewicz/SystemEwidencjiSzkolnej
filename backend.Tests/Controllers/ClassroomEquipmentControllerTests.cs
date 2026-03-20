using backend.Controllers;
using backend.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace backend.Tests.Controllers
{
    public class ClassroomEquipmentControllerTests
    {
        private static T P<T>(object o, string n) => (T)o.GetType().GetProperty(n)!.GetValue(o)!;

        [Fact]
        public async Task GetSprzet_Valid()
        {
            using var db = DbContextFactory.Create();
            var ok = Assert.IsType<OkObjectResult>(await new ClassroomEquipmentController(db).GetSprzet(1));
            Assert.Equal(1, P<int>(ok.Value!, "id")); Assert.Equal(101, P<int>(ok.Value!, "nr_sali"));
        }

        [Fact] public async Task GetSprzet_NotFound()    { using var db = DbContextFactory.Create(); Assert.Equal("Nie znaleziono sali",              P<string>(Assert.IsType<NotFoundObjectResult>  (await new ClassroomEquipmentController(db).GetSprzet(999)).Value!, "message")); }
        [Fact] public async Task Zarezerwuj_NoRoom()     { using var db = DbContextFactory.Create(); Assert.Equal("Nie znaleziono sali",              P<string>(Assert.IsType<NotFoundObjectResult>  (await new ClassroomEquipmentController(db).ZarezerwujSprzet(999, 1)).Value!, "message")); }
        [Fact] public async Task Zarezerwuj_NoEquip()    { using var db = DbContextFactory.Create(); Assert.Equal("Nie znaleziono sprzetu",           P<string>(Assert.IsType<NotFoundObjectResult>  (await new ClassroomEquipmentController(db).ZarezerwujSprzet(1, 999)).Value!, "message")); }
        [Fact] public async Task Zarezerwuj_Unavail()    { using var db = DbContextFactory.Create(); Assert.Equal("Sprzet jest juz niedostepny",      P<string>(Assert.IsType<BadRequestObjectResult>(await new ClassroomEquipmentController(db).ZarezerwujSprzet(1, 2)).Value!, "message")); }
        [Fact] public async Task Zwolnij_NotFound()      { using var db = DbContextFactory.Create(); Assert.IsType<NotFoundObjectResult>             (await new ClassroomEquipmentController(db).ZwolnijSprzet(1, 999)); }
        [Fact] public async Task Zwolnij_WrongRoom()     { using var db = DbContextFactory.Create(); Assert.Equal("Sprzet nie jest przypisany do tej sali", P<string>(Assert.IsType<BadRequestObjectResult>(await new ClassroomEquipmentController(db).ZwolnijSprzet(2, 2)).Value!, "message")); }

        [Fact]
        public async Task Zarezerwuj_Valid()
        {
            using var db = DbContextFactory.Create();
            var r = await new ClassroomEquipmentController(db).ZarezerwujSprzet(2, 1);
            Assert.Equal("Zarezerwowano sprzet", P<string>(Assert.IsType<OkObjectResult>(r).Value!, "message"));
            var eq = await db.Equipment.FindAsync(1);
            Assert.False(eq!.dostepny); Assert.Equal(2, eq.id_sali);
        }

        [Fact]
        public async Task Zwolnij_Valid()
        {
            using var db = DbContextFactory.Create();
            var r = await new ClassroomEquipmentController(db).ZwolnijSprzet(1, 2);
            Assert.Equal("Zwolniono sprzet", P<string>(Assert.IsType<OkObjectResult>(r).Value!, "message"));
            var eq = await db.Equipment.FindAsync(2);
            Assert.Null(eq!.id_sali); Assert.True(eq.dostepny);
        }
    }
}
