using backend.Models;

namespace backend.Tests.Models
{
    public class ModelTests
    {
        [Fact] public void User_Defaults()     { var u = new User(); Assert.Equal(string.Empty, u.imie); Assert.Equal(string.Empty, u.login); Assert.Null(u.Rola); }
        [Fact] public void User_SetProps()     { var r = new Role { Id = 2, RoleName = "N" }; var u = new User { id = 5, imie = "X", nazwisko = "Y", email = "e", haslo = "h", login = "l", rola_id = 2, Rola = r }; Assert.Equal(5, u.id); Assert.Same(r, u.Rola); }
        [Fact] public void Role_Defaults()     { var r = new Role(); Assert.Equal(0, r.Id); Assert.Equal(string.Empty, r.RoleName); }
        [Fact] public void Role_SetProps()     { var r = new Role { Id = 3, RoleName = "M" }; Assert.Equal(3, r.Id); Assert.Equal("M", r.RoleName); }
        [Fact] public void Location_Defaults() { var l = new Location(); Assert.Equal(0, l.id); Assert.Equal(string.Empty, l.nazwa); Assert.Equal(string.Empty, l.opis); }
        [Fact] public void Location_SetProps() { var l = new Location { id = 7, nazwa = "H", opis = "D" }; Assert.Equal(7, l.id); Assert.Equal("H", l.nazwa); }
        [Fact] public void Equipment_Defaults() { var e = new Equipment(); Assert.Equal(string.Empty, e.typ); Assert.Null(e.lokalizacja_id); Assert.Null(e.Classroom); }
        [Fact] public void Equipment_SetProps() { var l = new Location{id=1,nazwa="A",opis=""}; var c = new Classroom{id=1,nr_sali=1,ilosc_komputerow=0,id_szkoly=1}; var e = new Equipment{id=10,typ="D",producent="HP",numer_seryjny="X",dostepny=true,lokalizacja_id=1,id_sali=1,Location=l,Classroom=c}; Assert.Equal(10,e.id); Assert.True(e.dostepny); Assert.Same(l,e.Location); }
        [Fact] public void Classroom_Defaults()  { var c = new Classroom(); Assert.Null(c.id_nauczyciela); Assert.NotNull(c.Equipment); Assert.Empty(c.Equipment); }
        [Fact] public void Classroom_SetProps()  { var l = new Location{id=2,nazwa="B",opis=""}; var u = new User{id=1,imie="J",nazwisko="K",email="",haslo="",login="",rola_id=2}; var c = new Classroom{id=5,nr_sali=202,ilosc_komputerow=10,id_szkoly=2,id_nauczyciela=1,Location=l,User=u}; Assert.Equal(5,c.id); Assert.Same(l,c.Location); Assert.Same(u,c.User); }
        [Fact] public void Classroom_Equipment() { var c = new Classroom(); c.Equipment.Add(new Equipment{id=1,typ="PC",producent="D",numer_seryjny="X",dostepny=true}); Assert.Single(c.Equipment); }
        [Fact] public void History_Defaults()    { var h = new EquipmentHistory(); Assert.Equal(string.Empty, h.akcja); Assert.Equal(default(DateTime), h.data); Assert.Null(h.User); }
        [Fact] public void History_SetProps()    { var u = new User{id=3,imie="A",nazwisko="S",email="",haslo="",login="",rola_id=1}; var now=DateTime.UtcNow; var h = new EquipmentHistory{id=1,akcja="E",data=now,user_id=3,User=u}; Assert.Equal(1,h.id); Assert.Equal(now,h.data); Assert.Same(u,h.User); }
        [Fact] public void LoginRequest_Defaults()          { var r = new LoginRequest(); Assert.Equal(string.Empty,r.Login); Assert.Equal(string.Empty,r.Haslo); }
        [Fact] public void LoginRequest_SetProps()          { var r = new LoginRequest{Login="u",Haslo="p"}; Assert.Equal("u",r.Login); }
        [Fact] public void RegisterRequest_Defaults()       { var r = new RegisterRequest{RolaId=1}; Assert.Equal(string.Empty,r.Login); Assert.Equal(1,r.RolaId); }
        [Fact] public void RegisterRequest_SetProps()       { var r = new RegisterRequest{Login="u",Haslo="p",Imie="J",Nazwisko="K",Email="e",RolaId=2}; Assert.Equal("J",r.Imie); Assert.Equal(2,r.RolaId); }
        [Fact] public void AddEquipmentRequest_Defaults()   { var r = new AddEquipmentRequest{Dostepny=true}; Assert.Equal(string.Empty,r.Typ); Assert.Null(r.LokalizacjaId); }
        [Fact] public void AddEquipmentRequest_SetProps()   { var r = new AddEquipmentRequest{Typ="PC",Producent="D",NumerSeryjny="S1",Dostepny=false,LokalizacjaId=5}; Assert.Equal("PC",r.Typ); Assert.Equal(5,r.LokalizacjaId); }
        [Fact] public void UpdateEquipmentRequest_Defaults(){ var r = new UpdateEquipmentRequest{Dostepny=true}; Assert.True(r.Dostepny); Assert.Null(r.LokalizacjaId); }
        [Fact] public void UpdateEquipmentRequest_SetProps(){ var r = new UpdateEquipmentRequest{Typ="M",Producent="L",NumerSeryjny="N",Dostepny=false,LokalizacjaId=3}; Assert.Equal("M",r.Typ); Assert.Equal(3,r.LokalizacjaId); }
        [Fact] public void AddClassroomRequest_SetProps()   { var r = new AddClassroomRequest{nr_sali=301,id_szkoly=2}; Assert.Equal(301,r.nr_sali); Assert.Equal(2,r.id_szkoly); }
        [Fact] public void UpdateRolaRequest_SetProp()      { var r = new UpdateRolaRequest{RolaId=3}; Assert.Equal(3,r.RolaId); }
    }
}
