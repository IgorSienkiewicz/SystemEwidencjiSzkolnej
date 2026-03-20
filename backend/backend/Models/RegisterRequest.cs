namespace backend.Models
{
    public class RegisterRequest
    {
        public string Login { get; set; } = string.Empty;
        public string Haslo { get; set; } = string.Empty;
        public string Imie { get; set; } = string.Empty;
        public string Nazwisko { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public required int RolaId { get; set; }
    }
}