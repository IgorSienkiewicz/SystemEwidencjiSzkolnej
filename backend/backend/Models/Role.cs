using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Roles")]
    public class Role
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }
}