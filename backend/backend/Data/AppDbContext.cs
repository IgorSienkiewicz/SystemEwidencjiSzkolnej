using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Equipment> Equipment { get; set; }
        public DbSet<EquipmentHistory> EquipmentHistory { get; set; }
        public DbSet<Location> Location { get; set; }
        public DbSet<Classroom> Classrooms { get; set; }
    }
}