        const apiUrl = "http://localhost:5029/api/customer";
        let customers = []; 
        const limitPage = 10;
        let actualPage = 1;
        let copyCustomers = [];
        let editingCustomerId = null;       
        
        async function loadCustomers() {
            const response = await fetch(apiUrl);
            customers = await response.json();  
            copyCustomers = [...customers]; 
            showCustomers(); 
        } 
    
        
        // Filtra los clientes por los valores de los filtros
        function filterCustomers() {

            //filtro por 
            const idFilter = parseInt(document.getElementById("idFilter").value); 
            const nameFilter = document.getElementById("nameFilter").value.toLowerCase();
            const lastnameFilter = document.getElementById("lastnameFilter").value.toLowerCase();
            const emailFilter = document.getElementById("emailFilter").value.toLowerCase();
            const genderFilter = document.getElementById("genderFilter").value.toLowerCase();
            const addressFilter = document.getElementById("addressFilter").value.toLowerCase();
            const countryFilter = document.getElementById("countryFilter").value.toLowerCase();
            
            
            //filtrar segun el filtro aplicado
            copyCustomers = customers.filter(customer => {
                const idActual = isNaN(idFilter) || customer.id === idFilter; 
                const genderActual = genderFilter === "" || 
                customer.gender.toLowerCase() === genderFilter;

                return  idActual &&
                customer.firstName.toLowerCase().includes(nameFilter) &&
                customer.lastName.toLowerCase().includes(lastnameFilter) &&
                customer.email.toLowerCase().includes(emailFilter) &&
                genderActual &&
                (customer.gender.toLowerCase() === "male" ||
                customer.gender.toLowerCase() === "female" ||
                customer.gender.toLowerCase() === "bigender") &&
                customer.ipAddress.toLowerCase().includes(addressFilter) &&
                customer.country.toLowerCase().includes(countryFilter)
            });

            currentPage = 1; // Reiniciar pag  
            showCustomers();//  clientes filtrados
        
        }  

        async function getCustomerById() {
            const customerId = document.getElementById("customerIdInput").value; // Obtener el ID ingresado
            if (!customerId) {
                alert("Please enter a valid customer ID.");
                return;
            }
        
            const url = `${apiUrl}/${customerId}`; // Construir la URL con el ID
        
            try {
                const response = await fetch(url);
        
                if (response.ok) {
                    const customer = await response.json();
                    displayCustomerDetails(customer);  
                } else {
                    alert("Customer not found.");
                }
            } catch (error) {
                console.error("Error fetching customer:", error);
            }
        }
        function displayCustomerDetails(customer) {
            const customerDetailsDiv = document.getElementById("customerDetails");
            customerDetailsDiv.innerHTML = `
                <h3>Customer Details</h3>
                <p><strong>ID:</strong> ${customer.id}</p>
                <p><strong>First Name:</strong> ${customer.firstName}</p>
                <p><strong>Last Name:</strong> ${customer.lastName}</p>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Gender:</strong> ${customer.gender}</p>
                <p><strong>IP Address:</strong> ${customer.ipAddress}</p>
                <p><strong>Country:</strong> ${customer.country}</p>
            `;
        }
         // Función para eliminar un cliente (DELETE)
        async function deleteCustomer(id) {
            const confirmation = confirm("Are you sure you want to delete this customer?");
            if (!confirmation) return;

            try {
                const response = await fetch(`${apiUrl}/${id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("Customer deleted successfully!");
                    loadCustomers(); // Recargar la lista de clientes después de eliminar
                } else {
                    alert("Failed to delete customer.");
                }
            } catch (error) {
                console.error("Error deleting customer:", error);
            }
        }
        async function addOrEditCustomer(event) {
            event.preventDefault();
        
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const email = document.getElementById("email").value;
            const gender = document.getElementById("gender").value;
            const ipAddress = document.getElementById("ipAddress").value;
            const country = document.getElementById("country").value;
            const customerId = document.getElementById("customerId").value;
        
            const customerData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                gender: gender,
                ipAddress: ipAddress,
                country: country
            };
        
            try {
                let response;
                if (customerId) {
                    // Si hay un customerId, se actualizará un cliente
                    response = await fetch(`${apiUrl}/${customerId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(customerData)
                    });
                } else {
                    // Si no hay customerId, se creará un nuevo cliente
                    response = await fetch(apiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(customerData)
                    });
                }
        
                if (response.ok) {
                    alert(customerId ? "Customer updated successfully!" : "Customer added successfully!");
                    loadCustomers(); // Recargar la lista de clientes
                    clearForm(); // Limpiar el formulario
                } else {
                    alert("Failed to save customer.");
                }
            } catch (error) {
                console.error("Error saving customer:", error);
            }
        }
        function handleCustomerForm(customerId) {
            // Buscar al cliente por ID
            const customer = customers.find(c => c.id === customerId);
        
            if (customer) {
                // Rellenar el formulario con los datos del cliente
                document.getElementById("customerId").value = customer.id;
                document.getElementById("firstName").value = customer.firstName;
                document.getElementById("lastName").value = customer.lastName;
                document.getElementById("email").value = customer.email;
                document.getElementById("gender").value = customer.gender;
                document.getElementById("ipAddress").value = customer.ipAddress;
                document.getElementById("country").value = customer.country;
        
                // Cambiar el título del formulario
                document.getElementById("formTitle").textContent = "Update Customer";
            }
        }

        
        function clearForm() {
            document.getElementById("customerForm").reset();
            document.getElementById("formTitle").textContent = "Add New Customer";
            document.getElementById("customerId").value = ""; // Limpiar el campo del ID
        }
        function showCustomers() {

        const tableBody = document.querySelector("#customerTable tbody");
        tableBody.innerHTML = "";

        const start = (actualPage - 1) * limitPage;
        const end = start + limitPage; 
        const customersActualPage = copyCustomers.slice(start, end);

        customersActualPage.forEach(customer => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.firstName}</td>
                <td>${customer.lastName}</td>
                <td>${customer.email}</td>
                <td>${customer.gender}</td>
                <td>${customer.ipAddress}</td>
                <td>${customer.country}</td>
                <td>
                <button onclick="handleCustomerForm(${customer.id})">
                <img src="edit.jpg"  style="width: 30px; height: 30px;">
                </button>
                <button onclick="deleteCustomer(${customer.id})">
                <img src="delete.jpg" style="width: 30px; height: 30px;">
                </button>
                </td>`;
            tableBody.appendChild(row);
        });
        // Actualizar los controles de paginación
        document.getElementById("pageNumber").textContent = `Page ${actualPage}`;
        document.getElementById("prevBtn").disabled = actualPage === 1; // Deshabilitar si estamos en la primera página
        document.getElementById("nextBtn").disabled = actualPage * limitPage >= copyCustomers.length; // Deshabilitar si estamos en la última página
        } 
              
        // Cambia la página actual
        function changePage(direction) { 
            actualPage += direction;
            showCustomers();
        } 
  

        function changeColumnOrder(index1, index2) {
            const table = document.querySelector("table");
            const rows = table.querySelectorAll("tr");
            
            // Intercambiar las celdas de los encabezados
            const th1 = rows[0].children[index1];
            const th2 = rows[0].children[index2];
            
            // Intercambiar contenido de las celdas
            const temp = th1.innerHTML;
            th1.innerHTML = th2.innerHTML;
            th2.innerHTML = temp;
            
            // Intercambiar las celdas de los datos
            for (let i = 1; i < rows.length; i++) {
                const td1 = rows[i].children[index1];
                const td2 = rows[i].children[index2];
                const tempData = td1.innerHTML;
                td1.innerHTML = td2.innerHTML;
                td2.innerHTML = tempData;
            }
        }

        document.getElementById("customerForm").addEventListener("submit", addOrEditCustomer);