using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("equipment")]
    public class Equipment
    {
        [Key]
        [Column("id")]
        public int id {get; set;}
        public string typ {get; set;} = String.Empty;
        public string producent {get; set;} = String.Empty;
        public string numer_seryjny {get; set;} = String.Empty;
        public string status {get; set;} = String.Empty;
        public int lokalizacja_id {get; set;}
        [ForeignKey("lokalizacja_id")]
        public Location? Location {get; set;}
    }
}