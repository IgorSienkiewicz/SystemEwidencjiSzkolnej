using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Tests.Data
{
    public class AppDbContextTests
    {
        private static AppDbContext Make() => new AppDbContext(
            new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);

        [Fact] public void CanBeConstructed()              { using var db = Make(); Assert.NotNull(db); }
        [Fact] public void UsersDbSet_NotNull()            { using var db = Make(); Assert.NotNull(db.Users); }
        [Fact] public void RolesDbSet_NotNull()            { using var db = Make(); Assert.NotNull(db.Roles); }
        [Fact] public void EquipmentDbSet_NotNull()        { using var db = Make(); Assert.NotNull(db.Equipment); }
        [Fact] public void EquipmentHistoryDbSet_NotNull() { using var db = Make(); Assert.NotNull(db.EquipmentHistory); }
        [Fact] public void LocationDbSet_NotNull()         { using var db = Make(); Assert.NotNull(db.Location); }
        [Fact] public void ClassroomsDbSet_NotNull()       { using var db = Make(); Assert.NotNull(db.Classrooms); }
        [Fact] public async Task Crud_Role()      { using var db = Make(); db.Roles.Add(new Role{Id=1,RoleName="T"}); await db.SaveChangesAsync(); Assert.Equal("T",(await db.Roles.FindAsync(1))!.RoleName); }
        [Fact] public async Task Crud_User()      { using var db = Make(); db.Users.Add(new User{id=1,imie="T",nazwisko="U",email="t@u.com",haslo="p",login="tu",rola_id=1}); await db.SaveChangesAsync(); Assert.Equal("T",(await db.Users.FindAsync(1))!.imie); }
        [Fact] public async Task Crud_Location()  { using var db = Make(); db.Location.Add(new Location{id=1,nazwa="L",opis="D"}); await db.SaveChangesAsync(); Assert.Equal("L",(await db.Location.FindAsync(1))!.nazwa); }
        [Fact] public async Task Crud_Equipment() { using var db = Make(); db.Equipment.Add(new Equipment{id=1,typ="PC",producent="D",numer_seryjny="S",dostepny=true}); await db.SaveChangesAsync(); Assert.Equal("PC",(await db.Equipment.FindAsync(1))!.typ); }
        [Fact] public async Task Crud_History()   { using var db = Make(); var now=DateTime.UtcNow; db.EquipmentHistory.Add(new EquipmentHistory{id=1,akcja="A",data=now,user_id=1}); await db.SaveChangesAsync(); Assert.Equal("A",(await db.EquipmentHistory.FindAsync(1))!.akcja); }
        [Fact] public async Task Crud_Classroom() { using var db = Make(); db.Classrooms.Add(new Classroom{id=1,nr_sali=101,ilosc_komputerow=10,id_szkoly=1}); await db.SaveChangesAsync(); Assert.Equal(101,(await db.Classrooms.FindAsync(1))!.nr_sali); }
    }
}
