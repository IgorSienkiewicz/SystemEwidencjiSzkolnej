using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("location")]
    public class Location
    {
        [Key]
        [Column("id")]
        public int id {get; set;}
        public string nazwa {get; set; } = String.Empty;
        public string opis {get; set; } = String.Empty;
    }
}