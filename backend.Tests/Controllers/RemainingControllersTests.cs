using backend.Controllers;
using backend.Models;
using backend.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.Controllers
{
    public class LocationControllerTests
    {
        private static T P<T>(object o, string n) => (T)o.GetType().GetProperty(n)!.GetValue(o)!;
        [Fact] public async Task GetAll()  { using var db = DbContextFactory.Create(); Assert.Equal(2, ((IEnumerable<object>)Assert.IsType<OkObjectResult>(await new LocationController(db).GetLocations()).Value!).Count()); }
        [Fact] public async Task Shape()   { using var db = DbContextFactory.Create(); var l = ((IEnumerable<object>)Assert.IsType<OkObjectResult>(await new LocationController(db).GetLocations()).Value!).ToList(); Assert.Equal("Budynek A", P<string>(l.First(x => P<int>(x, "id") == 1), "nazwa")); }
        [Fact] public async Task Empty()   { using var db = new backend.Data.AppDbContext(new DbContextOptionsBuilder<backend.Data.AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options); Assert.Empty((IEnumerable<object>)Assert.IsType<OkObjectResult>(await new LocationController(db).GetLocations()).Value!); }
    }

    public class RolesControllerTests
    {
        private static T P<T>(object o, string n) => (T)o.GetType().GetProperty(n)!.GetValue(o)!;
        [Fact] public async Task GetAll() { using var db = DbContextFactory.Create(); Assert.Equal(3, ((IEnumerable<object>)Assert.IsType<OkObjectResult>(await new RolesController(db).GetRoles()).Value!).Count()); }
        [Fact] public async Task Shape()  { using var db = DbContextFactory.Create(); var l = ((IEnumerable<object>)Assert.IsType<OkObjectResult>(await new RolesController(db).GetRoles()).Value!).ToList(); Assert.Equal("Admin", P<string>(l.First(x => P<int>(x, "Id") == 1), "RoleName")); }
        [Fact] public async Task Empty()  { using var db = new backend.Data.AppDbContext(new DbContextOptionsBuilder<backend.Data.AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options); Assert.Empty((IEnumerable<object>)Assert.IsType<OkObjectResult>(await new RolesController(db).GetRoles()).Value!); }
    }

    public class RegisterControllerTests
    {
        private static T P<T>(object o, string n) => (T)o.GetType().GetProperty(n)!.GetValue(o)!;

        [Fact]
        public async Task Register_Valid()
        {
            using var db = DbContextFactory.Create();
            var r = await new RegisterController(db).Register(new RegisterRequest { Login = "u", Haslo = "p", Imie = "J", Nazwisko = "K", Email = "j@k.com", RolaId = 3 });
            Assert.Equal("Zarejestrowano pomyślnie!", P<string>(Assert.IsType<OkObjectResult>(r).Value!, "message"));
            Assert.Equal(4, db.Users.Count());
        }

        [Fact] public async Task Register_RolaAlways2() { using var db = DbContextFactory.Create(); await new RegisterController(db).Register(new RegisterRequest { Login = "t", Haslo = "t", Imie = "T", Nazwisko = "T", Email = "t@t.com", RolaId = 99 }); Assert.Equal(2, db.Users.OrderBy(u => u.id).Last().rola_id); }

        [Fact]
        public async Task Register_Fields()
        {
            using var db = DbContextFactory.Create();
            await new RegisterController(db).Register(new RegisterRequest { Login = "marek", Haslo = "pass", Imie = "Marek", Nazwisko = "Z", Email = "m@z.com", RolaId = 2 });
            var s = db.Users.OrderBy(u => u.id).Last();
            Assert.Equal("marek", s.login); Assert.Equal("Marek", s.imie);
        }
    }

    public class UsersControllerTests
    {
        private static T P<T>(object o, string n) => (T)o.GetType().GetProperty(n)!.GetValue(o)!;
        [Fact] public async Task GetAll()   { using var db = DbContextFactory.Create(); Assert.Equal(3, ((IEnumerable<object>)Assert.IsType<OkObjectResult>(await new UsersController(db).GetUsers()).Value!).Count()); }
        [Fact] public async Task RoleName() { using var db = DbContextFactory.Create(); var l = ((IEnumerable<object>)Assert.IsType<OkObjectResult>(await new UsersController(db).GetUsers()).Value!).ToList(); Assert.Equal("Nauczyciel", P<string>(l.First(u => P<int>(u, "id") == 1), "rola")); }

        [Fact]
        public async Task UpdateRola_Valid()
        {
            using var db = DbContextFactory.Create();
            var r = await new UsersController(db).UpdateRola(2, new UpdateRolaRequest { RolaId = 1 });
            Assert.Equal("Rola zaktualizowana", P<string>(Assert.IsType<OkObjectResult>(r).Value!, "message"));
            Assert.Equal(1, (await db.Users.FindAsync(2))!.rola_id);
        }

        [Fact] public async Task UpdateRola_Invalid() { using var db = DbContextFactory.Create(); Assert.IsType<NotFoundResult>(await new UsersController(db).UpdateRola(999, new UpdateRolaRequest { RolaId = 1 })); }
    }
}
