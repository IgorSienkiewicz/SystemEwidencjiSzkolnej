namespace backend.Models
{
    public class AddClassroomRequest
    {
        public required int nr_sali { get; set; }
        public required int id_szkoly { get; set; }
    }
}