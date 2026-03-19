namespace backend.Models
{
    public class UpdateEquipmentRequest
    {
        public string Typ { get; set; } = null!;
        public string Producent { get; set; } = null!;
        public string NumerSeryjny { get; set; } = null!;
        public bool Dostepny { get; set; }
        public int? LokalizacjaId { get; set; }   // <- nullable
    }
}
