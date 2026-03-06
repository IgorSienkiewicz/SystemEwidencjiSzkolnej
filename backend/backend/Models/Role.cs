using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Roles")]
    public class Role
    {
        [Key]
        public int id { get; set; }
        public string nazwa { get; set; } = string.Empty;
    }
}