using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("classroom")]
    public class Classroom
    {
        [Key]
        [Column("id")]
        public int id {get; set;}
        public int nr_sali { get; set;}
        public int ilosc_komputerow {get; set;}
        public int id_szkoly { get; set;}
        public int id_sprzetu { get; set;}
        [ForeignKey("id_sprzetu")]
        public Equipment? Equipment {get; set;}
        [ForeignKey("id_szkoly")]
        public Location? Location {get; set;}
    }
}