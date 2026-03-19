namespace backend.Models
{
    public class UpdateEquipmentRequest
    {
        public string Typ { get; set; } = string.Empty;
        public string Producent { get; set; } = string.Empty;
        public string NumerSeryjny { get; set; } = string.Empty;
        public bool Dostepny { get; set; }
        public int LokalizacjaId { get; set; }
    }
}
