using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("equipment")]
    public class Equipment
    {
        [Key]
        [Column("id")]
        public int id { get; set; }
        public string typ { get; set; } = string.Empty;
        public string producent { get; set; } = string.Empty;
        public string numer_seryjny { get; set; } = string.Empty;
        public bool dostepny { get; set; }
        public int? lokalizacja_id { get; set; }
        public int? id_sali { get; set; }

        [ForeignKey("lokalizacja_id")]
        public Location? Location { get; set; }

        [ForeignKey("id_sali")]
        public Classroom? Classroom { get; set; }
    }
}