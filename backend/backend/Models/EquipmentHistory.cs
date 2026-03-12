using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Net.Http.Headers;

namespace backend.Models
{
    [Table("equipmentHistory")]
    public class EquipmentHistory
    {
        [Key]
        [Column("id")]
        public int id {get; set;}
        public string akcja {get; set; } = String.Empty;
        public DateTime data {get; set;}
        public int user_id{get; set;}

        [ForeignKey("user_id")]
        public User? User {get; set;}
    }
}
