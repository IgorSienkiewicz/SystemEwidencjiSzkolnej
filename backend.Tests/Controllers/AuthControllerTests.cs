using backend.Controllers;
using backend.Models;
using backend.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace backend.Tests.Controllers
{
    public class AuthControllerTests
    {
        private static T P<T>(object o, string n) => (T)o.GetType().GetProperty(n)!.GetValue(o)!;

        [Fact]
        public async Task Login_Valid_ReturnsOkWithRoleAndId()
        {
            using var db = DbContextFactory.Create();
            var result = await new AuthController(db).Login(new LoginRequest { Login = "jkowalski", Haslo = "pass123" });
            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Nauczyciel", P<string>(ok.Value!, "rola"));
            Assert.Equal(1, P<int>(ok.Value!, "id"));
        }

        [Fact]
        public async Task Login_Valid_MessageCorrect()
        {
            using var db = DbContextFactory.Create();
            var result = await new AuthController(db).Login(new LoginRequest { Login = "admin", Haslo = "admin123" });
            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Zalogowano pomyślnie!", P<string>(ok.Value!, "message"));
        }

        [Fact]
        public async Task Login_Whitespace_TrimsAndSucceeds()
        {
            using var db = DbContextFactory.Create();
            var result = await new AuthController(db).Login(new LoginRequest { Login = " jkowalski ", Haslo = " pass123 " });
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Login_WrongPassword_ReturnsUnauthorized()
        {
            using var db = DbContextFactory.Create();
            var result = await new AuthController(db).Login(new LoginRequest { Login = "jkowalski", Haslo = "wrong" });
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Login_UnknownUser_ReturnsUnauthorized()
        {
            using var db = DbContextFactory.Create();
            Assert.IsType<UnauthorizedObjectResult>(
                await new AuthController(db).Login(new LoginRequest { Login = "nobody", Haslo = "x" }));
        }

        [Fact]
        public async Task Login_Empty_ReturnsUnauthorized()
        {
            using var db = DbContextFactory.Create();
            Assert.IsType<UnauthorizedObjectResult>(
                await new AuthController(db).Login(new LoginRequest { Login = "", Haslo = "" }));
        }
    }
}
