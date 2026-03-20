using backend.Controllers;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Xunit;

namespace backend.Tests;

public class BackendControllerTests
{
    private static AppDbContext CreateContext(string? dbName = null)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(dbName ?? Guid.NewGuid().ToString())
            .Options;

        var context = new AppDbContext(options);
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
        return context;
    }

    private static async Task SeedRolesAndUsers(AppDbContext context)
    {
        context.Roles.AddRange(
            new Role { Id = 1, RoleName = "Admin" },
            new Role { Id = 2, RoleName = "Nauczyciel" },
            new Role { Id = 3, RoleName = "Magazynier" });

        context.Users.AddRange(
            new User { id = 1, imie = "Jan", nazwisko = "Kowalski", email = "jan@example.com", login = "jan", haslo = "pass", rola_id = 1 },
            new User { id = 2, imie = "Anna", nazwisko = "Nowak", email = "anna@example.com", login = "anna", haslo = "pass", rola_id = 2 });

        await context.SaveChangesAsync();
    }

    [Fact]
    public async Task UsersController_GetUsers_ReturnsUsersWithRoleNames()
    {
        using var db = CreateContext();
        await SeedRolesAndUsers(db);

        var controller = new UsersController(db);
        var result = await controller.GetUsers();

        var ok = Assert.IsType<OkObjectResult>(result);
        var actualList = Assert.IsAssignableFrom<IEnumerable<object>>(ok.Value);
        Assert.Equal(2, actualList.Count());

        var json = JsonSerializer.Serialize(actualList);
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;
        Assert.Equal(JsonValueKind.Array, root.ValueKind);
        Assert.Contains(root.EnumerateArray(), node => node.GetProperty("login").GetString() == "jan" && node.GetProperty("rola").GetString() == "Admin");
        Assert.Contains(root.EnumerateArray(), node => node.GetProperty("login").GetString() == "anna" && node.GetProperty("rola").GetString() == "Nauczyciel");
    }

    [Fact]
    public async Task UsersController_UpdateRola_ChangesRoleAndReturnsOk()
    {
        using var db = CreateContext();
        await SeedRolesAndUsers(db);

        var controller = new UsersController(db);
        var response = await controller.UpdateRola(1, new UpdateRolaRequest { RolaId = 2 });

        Assert.IsType<OkObjectResult>(response);
        var user = await db.Users.FindAsync(1);
        Assert.Equal(2, user!.rola_id);
    }

    [Fact]
    public async Task UsersController_UpdateRola_ReturnsNotFound_WhenUserMissing()
    {
        using var db = CreateContext();
        await SeedRolesAndUsers(db);

        var controller = new UsersController(db);
        var response = await controller.UpdateRola(999, new UpdateRolaRequest { RolaId = 2 });

        Assert.IsType<NotFoundResult>(response);
    }

    [Fact]
    public async Task RolesController_GetRoles_ReturnsAllRoles()
    {
        using var db = CreateContext();
        await SeedRolesAndUsers(db);

        var controller = new RolesController(db);
        var result = await controller.GetRoles();

        var ok = Assert.IsType<OkObjectResult>(result);
        var roles = Assert.IsAssignableFrom<IEnumerable<object>>(ok.Value);
        Assert.Equal(3, roles.Count());

        var json = JsonSerializer.Serialize(roles);
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;
        Assert.Contains(root.EnumerateArray(), r => r.GetProperty("RoleName").GetString() == "Admin");
        Assert.Contains(root.EnumerateArray(), r => r.GetProperty("RoleName").GetString() == "Nauczyciel");
    }

    [Fact]
    public async Task LocationController_GetLocations_ReturnsLocations()
    {
        using var db = CreateContext();
        db.Location.Add(new Location { id = 1, nazwa = "Szkoła 1", opis = "Opis" });
        await db.SaveChangesAsync();

        var controller = new LocationController(db);
        var result = await controller.GetLocations();

        var ok = Assert.IsType<OkObjectResult>(result);
        var loc = Assert.IsAssignableFrom<IEnumerable<object>>(ok.Value);
        Assert.Single(loc);

        var json = JsonSerializer.Serialize(loc);
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;
        Assert.Equal("Szkoła 1", root[0].GetProperty("nazwa").GetString());
    }

    [Fact]
    public async Task AuthController_Login_ReturnsOk_WhenCredentialsCorrect()
    {
        using var db = CreateContext();
        await SeedRolesAndUsers(db);
        db.Users.Add(new User { id = 3, imie = "Test", nazwisko = "User", email = "test@example.com", login = "test", haslo = "secret", rola_id = 2 });
        await db.SaveChangesAsync();

        var controller = new AuthController(db);
        var result = await controller.Login(new LoginRequest { Login = "test", Haslo = "secret" });

        var ok = Assert.IsType<OkObjectResult>(result);
        var json = JsonSerializer.Serialize(ok.Value);
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;
        Assert.Equal("Zalogowano pomyślnie!", root.GetProperty("message").GetString());
        Assert.Equal(3, root.GetProperty("id").GetInt32());
    }

    [Fact]
    public async Task AuthController_Login_ReturnsUnauthorized_WhenInvalid()
    {
        using var db = CreateContext();
        await SeedRolesAndUsers(db);

        var controller = new AuthController(db);
        var result = await controller.Login(new LoginRequest { Login = "nonexistent", Haslo = "x" });

        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task RegisterController_Register_AddsNewUser()
    {
        using var db = CreateContext();
        db.Roles.Add(new Role { Id = 2, RoleName = "Nauczyciel" });
        await db.SaveChangesAsync();

        var controller = new RegisterController(db);
        var result = await controller.Register(new RegisterRequest { Login = "newuser", Haslo = "pw", Imie = "Nowy", Nazwisko = "Użytkownik", Email = "new@example.com", RolaId = 2 });

        Assert.IsType<OkObjectResult>(result);
        var saved = await db.Users.FirstOrDefaultAsync(u => u.login == "newuser");
        Assert.NotNull(saved);
        Assert.Equal(2, saved!.rola_id);
    }

    [Fact]
    public async Task ClassroomController_GetTeachers_ReturnsNotFound_WithoutRole()
    {
        using var db = CreateContext();
        var controller = new ClassroomController(db);
        var result = await controller.GetTeachers();

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task ClassroomController_AssignAndUnassignTeacher_Workflow()
    {
        using var db = CreateContext();
        await SeedRolesAndUsers(db);
        db.Classrooms.Add(new Classroom { id = 10, nr_sali = 101, ilosc_komputerow = 10, id_szkoly = 1, id_nauczyciela = null });
        await db.SaveChangesAsync();

        var controller = new ClassroomController(db);
        var assignResult = await controller.AssignTeacher(10, 2);
        Assert.IsType<OkObjectResult>(assignResult);
        var classroom = await db.Classrooms.FindAsync(10);
        Assert.Equal(2, classroom!.id_nauczyciela);

        var unassignResult = await controller.UnassignTeacher(10);
        Assert.IsType<OkObjectResult>(unassignResult);
        classroom = await db.Classrooms.FindAsync(10);
        Assert.Null(classroom!.id_nauczyciela);
    }

    [Fact]
    public async Task ClassroomController_AddClassroom_DetectsDuplicate()
    {
        using var db = CreateContext();
        db.Location.Add(new Location { id = 1, nazwa = "Szkoła" });
        db.Classrooms.Add(new Classroom { id = 1, nr_sali = 1, id_szkoly = 1 });
        await db.SaveChangesAsync();

        var controller = new ClassroomController(db);
        var first = await controller.AddClassroom(new AddClassroomRequest { nr_sali = 2, id_szkoly = 1 });
        var second = await controller.AddClassroom(new AddClassroomRequest { nr_sali = 2, id_szkoly = 1 });

        Assert.IsType<OkObjectResult>(first);
        Assert.IsType<BadRequestObjectResult>(second);
    }

    [Fact]
    public async Task EquipmentWriteController_AddUpdateDelete_AndReadFlow()
    {
        using var db = CreateContext();
        db.Location.Add(new Location { id = 1, nazwa = "Magazyn" });
        await db.SaveChangesAsync();

        var writeController = new EquipmentWriteController(db);
        var add = await writeController.AddEquipment(new AddEquipmentRequest { Typ = "Laptop", Producent = "Dell", NumerSeryjny = "S123", Dostepny = true, LokalizacjaId = 1 });
        Assert.IsType<OkObjectResult>(add);

        var item = await db.Equipment.FirstOrDefaultAsync(e => e.numer_seryjny == "S123");
        Assert.NotNull(item);

        var update = await writeController.UpdateEquipment(item!.id, new UpdateEquipmentRequest { Typ = "Laptop", Producent = "Dell", NumerSeryjny = "S123", Dostepny = false, LokalizacjaId = 1 });
        Assert.IsType<OkObjectResult>(update);

        var readController = new EquipmentReadController(db);
        var get = await readController.GetById(item.id);
        Assert.IsType<OkObjectResult>(get);

        var delete = await writeController.DeleteEquipment(item.id);
        Assert.IsType<OkObjectResult>(delete);

        var notFound = await readController.GetById(item.id);
        Assert.IsType<NotFoundObjectResult>(notFound);
    }

    [Fact]
    public async Task ClassroomController_GetClassrooms_FiltersWork()
    {
        using var db = CreateContext();
        await SeedRolesAndUsers(db);
        db.Location.Add(new Location { id = 1, nazwa = "Szkoła" });
        db.Classrooms.AddRange(
            new Classroom { id = 1, nr_sali = 10, ilosc_komputerow = 2, id_szkoly = 1, id_nauczyciela = null },
            new Classroom { id = 2, nr_sali = 20, ilosc_komputerow = 3, id_szkoly = 1, id_nauczyciela = 2 });
        await db.SaveChangesAsync();

        var controller = new ClassroomController(db);

        var all = await controller.GetClassrooms("all");
        Assert.IsType<OkObjectResult>(all);

        var assigned = await controller.GetClassrooms("assigned");
        var assignedJson = JsonSerializer.Serialize(((OkObjectResult)assigned).Value);
        using var assignedDoc = JsonDocument.Parse(assignedJson);
        Assert.Equal(1, assignedDoc.RootElement.GetArrayLength());

        var unassigned = await controller.GetClassrooms("unassigned");
        var unassignedJson = JsonSerializer.Serialize(((OkObjectResult)unassigned).Value);
        using var unassignedDoc = JsonDocument.Parse(unassignedJson);
        Assert.Equal(1, unassignedDoc.RootElement.GetArrayLength());
    }

    [Fact]
    public async Task ClassroomController_GetByNauczyciel_ReturnsProperClassroom()
    {
        using var db = CreateContext();
        await SeedRolesAndUsers(db);
        db.Location.Add(new Location { id = 1, nazwa = "Szkoła" });
        db.Classrooms.Add(new Classroom { id = 1, nr_sali = 12, ilosc_komputerow = 5, id_szkoly = 1, id_nauczyciela = 2 });
        await db.SaveChangesAsync();

        var controller = new ClassroomController(db);
        var result = await controller.GetByNauczyciel(2);

        var ok = Assert.IsType<OkObjectResult>(result);
        var json = JsonSerializer.Serialize(ok.Value);
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;
        Assert.Equal(1, root.GetArrayLength());
        Assert.Equal(12, root[0].GetProperty("nr_sali").GetInt32());
    }

    [Fact]
    public async Task ClassroomController_GetTeachers_ReturnsTeachersIfRoleExists()
    {
        using var db = CreateContext();
        await SeedRolesAndUsers(db);

        var controller = new ClassroomController(db);
        var result = await controller.GetTeachers();

        var ok = Assert.IsType<OkObjectResult>(result);
        var json = JsonSerializer.Serialize(ok.Value);
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;
        Assert.Contains(root.EnumerateArray(), node => node.GetProperty("login").GetString() == "anna");
    }

    [Fact]
    public async Task EquipmentReadController_GetById_NotFound()
    {
        using var db = CreateContext();
        var controller = new EquipmentReadController(db);

        var result = await controller.GetById(123);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task EquipmentWriteController_UpdateAndDelete_NotFound()
    {
        using var db = CreateContext();
        var controller = new EquipmentWriteController(db);

        var update = await controller.UpdateEquipment(123, new UpdateEquipmentRequest { Typ = "x", Producent = "y", NumerSeryjny = "z", Dostepny = true });
        Assert.IsType<NotFoundResult>(update);

        var delete = await controller.DeleteEquipment(123);
        Assert.IsType<NotFoundObjectResult>(delete);
    }

    [Fact]
    public async Task EquipmentReadController_GetAll_ReturnsItemList()
    {
        using var db = CreateContext();
        db.Equipment.Add(new Equipment { id = 1, typ = "Monitor", producent = "LG", numer_seryjny = "M1", dostepny = true });
        await db.SaveChangesAsync();

        var controller = new EquipmentReadController(db);
        var result = await controller.GetAll();

        var ok = Assert.IsType<OkObjectResult>(result);
        var items = Assert.IsAssignableFrom<IEnumerable<object>>(ok.Value);
        Assert.Single(items);

        var json = JsonSerializer.Serialize(items);
        using var document = JsonDocument.Parse(json);
        var root = document.RootElement;
        Assert.Equal("M1", root[0].GetProperty("numer_seryjny").GetString());
    }
}

