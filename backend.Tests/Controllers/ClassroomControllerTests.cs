using backend.Controllers;
using backend.Models;
using backend.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.Controllers
{
    public class ClassroomControllerTests
    {
        private static T P<T>(object o, string n) => (T)o.GetType().GetProperty(n)!.GetValue(o)!;
        private static IEnumerable<object> List(object v) => (IEnumerable<object>)v;

        [Fact] public async Task GetClassrooms_All()        { using var db = DbContextFactory.Create(); Assert.Equal(2, List(Assert.IsType<OkObjectResult>(await new ClassroomController(db).GetClassrooms("all")).Value!).Count()); }
        [Fact] public async Task GetClassrooms_Assigned()   { using var db = DbContextFactory.Create(); Assert.Single(List(Assert.IsType<OkObjectResult>(await new ClassroomController(db).GetClassrooms("assigned")).Value!)); }
        [Fact] public async Task GetClassrooms_Unassigned() { using var db = DbContextFactory.Create(); Assert.Single(List(Assert.IsType<OkObjectResult>(await new ClassroomController(db).GetClassrooms("unassigned")).Value!)); }
        [Fact] public async Task GetClassrooms_Default()    { using var db = DbContextFactory.Create(); Assert.Equal(2, List(Assert.IsType<OkObjectResult>(await new ClassroomController(db).GetClassrooms()).Value!).Count()); }

        [Fact]
        public async Task GetTeachers_ReturnsTwo()
        {
            using var db = DbContextFactory.Create();
            Assert.Equal(2, List(Assert.IsType<OkObjectResult>(await new ClassroomController(db).GetTeachers()).Value!).Count());
        }

        [Fact]
        public async Task GetTeachers_NoRole_NotFound()
        {
            using var db = new backend.Data.AppDbContext(new DbContextOptionsBuilder<backend.Data.AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
            Assert.Equal("Brak roli Nauczyciel", P<string>(Assert.IsType<NotFoundObjectResult>(await new ClassroomController(db).GetTeachers()).Value!, "message"));
        }

        [Fact]
        public async Task AssignTeacher_Valid()
        {
            using var db = DbContextFactory.Create();
            var r = await new ClassroomController(db).AssignTeacher(2, 2);
            Assert.Equal("Przypisano nauczyciela do sali", P<string>(Assert.IsType<OkObjectResult>(r).Value!, "message"));
            Assert.Equal(2, (await db.Classrooms.FindAsync(2))!.id_nauczyciela);
        }

        [Fact] public async Task AssignTeacher_NoRoom()         { using var db = DbContextFactory.Create(); Assert.Equal("Nie znaleziono sali",              P<string>(Assert.IsType<NotFoundObjectResult>  (await new ClassroomController(db).AssignTeacher(999, 1)).Value!, "message")); }
        [Fact] public async Task AssignTeacher_NoTeacher()      { using var db = DbContextFactory.Create(); Assert.Equal("Nie znaleziono nauczyciela",        P<string>(Assert.IsType<NotFoundObjectResult>  (await new ClassroomController(db).AssignTeacher(2, 999)).Value!, "message")); }
        [Fact] public async Task AssignTeacher_NotTeacherRole() { using var db = DbContextFactory.Create(); Assert.Equal("Użytkownik nie jest nauczycielem",  P<string>(Assert.IsType<BadRequestObjectResult>(await new ClassroomController(db).AssignTeacher(2, 3)).Value!, "message")); }

        [Fact]
        public async Task AssignTeacher_NauczycielRoleMissing_BadRequest()
        {
            using var db = new backend.Data.AppDbContext(new DbContextOptionsBuilder<backend.Data.AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
            db.Roles.Add(new Role { Id = 1, RoleName = "Admin" });
            db.Classrooms.Add(new Classroom { id = 1, nr_sali = 1, ilosc_komputerow = 0, id_szkoly = 1 });
            db.Users.Add(new User { id = 1, imie = "X", nazwisko = "Y", email = "x@y.com", login = "xy", haslo = "p", rola_id = 1 });
            await db.SaveChangesAsync();
            Assert.IsType<BadRequestObjectResult>(await new ClassroomController(db).AssignTeacher(1, 1));
        }

        [Fact]
        public async Task UnassignTeacher_Valid()
        {
            using var db = DbContextFactory.Create();
            var r = await new ClassroomController(db).UnassignTeacher(1);
            Assert.Equal("Usunięto przypisanie nauczyciela", P<string>(Assert.IsType<OkObjectResult>(r).Value!, "message"));
            Assert.Null((await db.Classrooms.FindAsync(1))!.id_nauczyciela);
        }

        [Fact] public async Task UnassignTeacher_NotFound() { using var db = DbContextFactory.Create(); Assert.IsType<NotFoundObjectResult>(await new ClassroomController(db).UnassignTeacher(999)); }

        [Fact]
        public async Task AddClassroom_Valid()
        {
            using var db = DbContextFactory.Create();
            var r = await new ClassroomController(db).AddClassroom(new AddClassroomRequest { nr_sali = 200, id_szkoly = 1 });
            Assert.Equal("Dodano salę", P<string>(Assert.IsType<OkObjectResult>(r).Value!, "message"));
            Assert.Equal(3, db.Classrooms.Count());
        }

        [Fact] public async Task AddClassroom_NoLocation() { using var db = DbContextFactory.Create(); Assert.Equal("Nie znaleziono lokalizacji",                       P<string>(Assert.IsType<NotFoundObjectResult>  (await new ClassroomController(db).AddClassroom(new AddClassroomRequest { nr_sali = 300, id_szkoly = 999 })).Value!, "message")); }
        [Fact] public async Task AddClassroom_Duplicate()  { using var db = DbContextFactory.Create(); Assert.Equal("Sala o tym numerze w tej lokalizacji już istnieje", P<string>(Assert.IsType<BadRequestObjectResult>(await new ClassroomController(db).AddClassroom(new AddClassroomRequest { nr_sali = 101, id_szkoly = 1   })).Value!, "message")); }

        [Fact] public async Task GetByNauczyciel_ReturnsRooms() { using var db = DbContextFactory.Create(); Assert.Single(List(Assert.IsType<OkObjectResult>(await new ClassroomController(db).GetByNauczyciel(1)).Value!)); }
        [Fact] public async Task GetByNauczyciel_Empty()        { using var db = DbContextFactory.Create(); Assert.Empty (List(Assert.IsType<OkObjectResult>(await new ClassroomController(db).GetByNauczyciel(999)).Value!)); }
    }
}
