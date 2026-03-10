namespace backend.Models
{
    public class LoginRequest
    {
        public string Login { get; set; } = string.Empty;
        public string Haslo { get; set; } = string.Empty;
    }
}