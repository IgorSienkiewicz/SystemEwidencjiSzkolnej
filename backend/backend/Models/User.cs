using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        public int id { get; set; }
        public string imie { get; set; } = string.Empty;
        public string nazwisko { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string haslo { get; set; } = string.Empty;
        public int rola_id { get; set; }
        public string login {get; set; } = string.Empty;

        [ForeignKey("rola_id")]
        public Role? Rola {get; set;}
    }
}