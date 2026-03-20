using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.Helpers
{
    public static class DbContextFactory
    {
        public static AppDbContext Create(string? dbName = null)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(dbName ?? Guid.NewGuid().ToString())
                .Options;
            var context = new AppDbContext(options);
            Seed(context);
            return context;
        }

        private static void Seed(AppDbContext db)
        {
            db.Roles.AddRange(
                new Role { Id = 1, RoleName = "Admin" },
                new Role { Id = 2, RoleName = "Nauczyciel" },
                new Role { Id = 3, RoleName = "User" });
            db.Location.AddRange(
                new Location { id = 1, nazwa = "Budynek A", opis = "Glowny budynek" },
                new Location { id = 2, nazwa = "Budynek B", opis = "Drugi budynek" });
            db.Users.AddRange(
                new User { id = 1, imie = "Jan",   nazwisko = "Kowalski", email = "jan@test.com",   login = "jkowalski", haslo = "pass123",  rola_id = 2 },
                new User { id = 2, imie = "Anna",  nazwisko = "Nowak",    email = "anna@test.com",  login = "anowak",    haslo = "pass456",  rola_id = 2 },
                new User { id = 3, imie = "Admin", nazwisko = "System",   email = "admin@test.com", login = "admin",     haslo = "admin123", rola_id = 1 });
            db.Classrooms.AddRange(
                new Classroom { id = 1, nr_sali = 101, ilosc_komputerow = 20, id_szkoly = 1, id_nauczyciela = 1 },
                new Classroom { id = 2, nr_sali = 102, ilosc_komputerow = 15, id_szkoly = 1, id_nauczyciela = null });
            db.Equipment.AddRange(
                new Equipment { id = 1, typ = "Komputer", producent = "Dell", numer_seryjny = "SN001", dostepny = true,  lokalizacja_id = 1, id_sali = null },
                new Equipment { id = 2, typ = "Monitor",  producent = "LG",   numer_seryjny = "SN002", dostepny = false, lokalizacja_id = 1, id_sali = 1 },
                new Equipment { id = 3, typ = "Laptop",   producent = "HP",   numer_seryjny = "SN003", dostepny = true,  lokalizacja_id = 2, id_sali = null });
            db.EquipmentHistory.Add(
                new EquipmentHistory { id = 1, akcja = "Dodano", data = DateTime.UtcNow.AddDays(-1), user_id = 3 });
            db.SaveChanges();
        }
    }
}
