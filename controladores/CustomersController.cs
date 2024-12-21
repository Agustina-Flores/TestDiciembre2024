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
        private readonly string _jsonFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Json", "data.json");

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
                // Maneja cualquier error en la deserialización
                Console.WriteLine($"Error al deserializar JSON: {ex.Message}");
                return new List<Customer>();  // Retorna una lista vacía si la deserialización falla
            }
        }

        //Newtonsoft.Json: de objeto .net a cadena json 
        private void SaveCustomersInJson(List<Customer> customers)
        {
            var jsonData = JsonConvert.SerializeObject(customers, Formatting.Indented);
            System.IO.File.WriteAllText(_jsonFilePath, jsonData);
        }

        //GET api/customer
        [HttpGet]
        public ActionResult<IEnumerable<Customer>> GetCustomers()
        {
            var customers = LoadCustomers();
            return Ok(customers);
        }

        // GET api/customer/{id} - Obtener un cliente específico por su ID
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
            newCustomer.Id = customers.Any() ? customers.Max(c => c.Id) + 1 : 1; // Asignar un ID único
            customers.Add(newCustomer);
            SaveCustomersInJson(customers);

            return CreatedAtAction(nameof(GetCustomer), new { id = newCustomer.Id }, newCustomer);
        }

        // PUT api/customer/{id} - Actualizar un cliente por su ID
        [HttpPut("{id}")]
        public ActionResult UpdateCustomer(int id, [FromBody] Customer updatedCustomer)
        {
            var customers = LoadCustomers();
            var existingCustomer = customers.FirstOrDefault(c => c.Id == id);

            if (existingCustomer == null)
            {
                return NotFound();
            }

            // Actualizar los datos del cliente
            existingCustomer.FirstName = updatedCustomer.FirstName;
            existingCustomer.LastName = updatedCustomer.LastName;
            existingCustomer.Email = updatedCustomer.Email;
            existingCustomer.Gender = updatedCustomer.Gender;
            existingCustomer.IpAddress = updatedCustomer.IpAddress;

            SaveCustomersInJson(customers);

            return NoContent(); // 204 No Content
        }

        // DELETE api/customer/{id} - Eliminar un cliente por su ID
        [HttpDelete("{id}")]
        public ActionResult DeleteCustomer(int id)
        {
            var customers = LoadCustomers();
            var customerToDelete = customers.FirstOrDefault(c => c.Id == id);

            if (customerToDelete == null)
            {
                return NotFound();
            }

            customers.Remove(customerToDelete);
            SaveCustomersInJson(customers);

            return NoContent(); // 204 No Content
        }

    }
}