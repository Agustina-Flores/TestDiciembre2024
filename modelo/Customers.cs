using Newtonsoft.Json;

namespace Customers.Models
{
    public class Customer
    {
        public int Id { get; set; }
        [JsonProperty("first_name")]
        public string? FirstName { get; set; }
        [JsonProperty("last_name")]
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Gender { get; set; }
        [JsonProperty("ip_address")] //Nombre en json
        public string? IpAddress { get; set; }
        public string? Country { get; set; }
    }
}