using Microsoft.AspNetCore.Mvc;
using Customers.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;

namespace Customers.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {

        //ruta del archivo json
        private readonly string _jsonFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Json", "data.json");

        private List<Customer> LoadCustomers()
        {
            try
            {
                var jsonData = System.IO.File.ReadAllText(_jsonFilePath);
                var customers = JsonConvert.DeserializeObject<List<Customer>>(jsonData);
                return customers;
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"Error al deserializar JSON: {ex.Message}");
                return new List<Customer>();
            }
        }

        //Newtonsoft.Json: de objeto .net a cadena json 
        private void SaveCustomersInJson(List<Customer> customers)
        {
            var jsonData = JsonConvert.SerializeObject(customers, Formatting.Indented);
            var jsonDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Json");
            if (!Directory.Exists(jsonDirectory))
            {
                Directory.CreateDirectory(jsonDirectory);
            }

            System.IO.File.WriteAllText(_jsonFilePath, jsonData);
        }

        //GET api/customer
        [HttpGet]
        public ActionResult<IEnumerable<Customer>> GetCustomers()
        {
            var customers = LoadCustomers();
            return Ok(customers);
        }

        // GET api/customer/{id} 
        [HttpGet("{id}")]
        public ActionResult<Customer> GetCustomer(int id)
        {
            var customers = LoadCustomers();
            var customer = customers.FirstOrDefault(c => c.Id == id);
            if (customer == null)
            {
                return NotFound();
            }
            return Ok(customer);
        }

        // POST api/customer 
        [HttpPost]
        public ActionResult<Customer> CreateCustomer([FromBody] Customer newCustomer)
        {
            var customers = LoadCustomers();
            newCustomer.Id = customers.Any() ? customers.Max(c => c.Id) + 1 : 1;
            customers.Add(newCustomer);
            SaveCustomersInJson(customers);

            return CreatedAtAction(nameof(GetCustomer), new { id = newCustomer.Id }, newCustomer);
        }

        // PUT api/customer/{id} 
        [HttpPut("{id}")]
        public ActionResult UpdateCustomer(int id, [FromBody] Customer updatedCustomer)
        {
            var customers = LoadCustomers();
            var currentCustomer = customers.FirstOrDefault(c => c.Id == id);

            if (currentCustomer == null)
            {
                return NotFound();
            }

            currentCustomer.FirstName = updatedCustomer.FirstName;
            currentCustomer.LastName = updatedCustomer.LastName;
            currentCustomer.Email = updatedCustomer.Email;
            currentCustomer.Gender = updatedCustomer.Gender;
            currentCustomer.IpAddress = updatedCustomer.IpAddress;
            currentCustomer.Country = updatedCustomer.Country;

            SaveCustomersInJson(customers);

            return NoContent();
        }

        // DELETE api/customer/{id}  
        [HttpDelete("{id}")]
        public ActionResult DeleteCustomer(int id)
        {
            var customers = LoadCustomers();
            var customerToDelete = customers.FirstOrDefault(c => c.Id == id);

            if (customerToDelete == null)
            {
                return NotFound(new { message = $"Cliente con ID {id} no encontrado." });
            }

            customers.Remove(customerToDelete);
            SaveCustomersInJson(customers);


            // Devuelve una respuesta con mensaje de éxito
            return Ok(new { message = $"Cliente con ID {id} eliminado exitosamente." });
        }

    }
}