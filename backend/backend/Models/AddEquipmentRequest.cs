using System.Text.Json.Serialization;

namespace backend.Models
{
    public class AddEquipmentRequest
    {
        [JsonPropertyName("typ")]
        public string Typ { get; set; } = string.Empty;

        [JsonPropertyName("producent")]
        public string Producent { get; set; } = string.Empty;

        [JsonPropertyName("numerSeryjny")]
        public string NumerSeryjny { get; set; } = string.Empty;

        [JsonPropertyName("dostepny")]
        public bool Dostepny { get; set; }

        [JsonPropertyName("lokalizacjaId")]
        public int LokalizacjaId { get; set; }
    }
}