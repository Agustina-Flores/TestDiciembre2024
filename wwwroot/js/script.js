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
        
        function filterCustomers() {

            const idFilter = document.getElementById("idFilter").value?.trim() ?? ''; 
            const nameFilter = document.getElementById("nameFilter").value?.trim() ?? '';
            const lastnameFilter = document.getElementById("lastnameFilter").value?.trim() ?? '';
            const emailFilter = document.getElementById("emailFilter").value?.trim() ?? '';
            const genderFilter = document.getElementById("genderFilter").value?.trim() ?? '';
            const addressFilter = document.getElementById("addressFilter").value?.trim() ?? '';
            const countryFilter = document.getElementById("countryFilter").value?.trim() ?? '';
            
               copyCustomers = customers.filter(customer => 
                `${customer.id}`.includes(idFilter) &&
                customer.gender.toLowerCase().includes(genderFilter) &&
                customer.firstName.toLowerCase().includes(nameFilter) &&
                customer.lastName.toLowerCase().includes(lastnameFilter) &&
                customer.email.toLowerCase().includes(emailFilter) &&
                customer.ipAddress.toLowerCase().includes(addressFilter) &&
                customer.country.toLowerCase().includes(countryFilter)
            );

            currentPage = 1;
            showCustomers();//  clientes filtrados
        
        }  

        async function getCustomerById() {

            const customerId = document.getElementById("customerIdInput").value;
            if (!customerId) {
                alert("Please enter a valid customer ID.");
                return;
            }
        
            const url = `${apiUrl}/${customerId}`;    
        
            try {
                const response = await fetch(url);
        
                if (response.ok) {
                    const customer = await response.json();
                    showCustomerInfo(customer);  
                } else {
                    alert("Customer not found.");
                }
            } catch (error) {
                console.error("Error fetching customer:", error);
            }
        }

        function showCustomerInfo(customer) {

            const customerDiv = document.getElementById("customerDetails");
            customerDiv.innerHTML = `
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
         
        async function deleteCustomer(id) {

            const confirmation = confirm("Are you sure you want to delete this customer?");
            if (!confirmation) return;

            try {
                const response = await fetch(`${apiUrl}/${id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("Customer deleted successfully!");
                    loadCustomers(); 
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
                    // Si hay actualiza
                    response = await fetch(`${apiUrl}/${customerId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(customerData)
                    });
                } else {
                    // Si no, se crea
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
                    loadCustomers(); 
                    clearForm();
                } else {
                    alert("Failed to save customer.");
                }
            } catch (error) {
                console.error("Error saving customer:", error);
            }
        }

        function handleCustomerForm(customerId) {
            
            const customer = customers.find(c => c.id === customerId);
        
            if (customer) {
                
                document.getElementById("customerId").value = customer.id;
                document.getElementById("firstName").value = customer.firstName;
                document.getElementById("lastName").value = customer.lastName;
                document.getElementById("email").value = customer.email;
                document.getElementById("gender").value = customer.gender;
                document.getElementById("ipAddress").value = customer.ipAddress;
                document.getElementById("country").value = customer.country;
                      
                document.getElementById("formTitle").textContent = "Update Customer";
            }
        }
        
        function clearForm() {
            
            document.getElementById("customerForm").reset();
            document.getElementById("formTitle").textContent = "Add New Customer";
            document.getElementById("customerId").value = ""; 
        }

        function showCustomers() {

        const tableBody = document.querySelector("#customerTable tbody");
        tableBody.innerHTML = "";

        const start = (actualPage - 1) * limitPage;
        const end = start + limitPage; 
        const customersActualPage = copyCustomers.slice(start, end);
        const totalPages = Math.ceil(copyCustomers.length / limitPage)
        
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
                <img src="images/edit.jpg"  style="width: 30px; height: 30px;">
                </button>
                <button onclick="deleteCustomer(${customer.id})">
                <img src="images/delete.jpg" style="width: 30px; height: 30px;">
                </button>
                </td>`;
            tableBody.appendChild(row);
        });
        
        document.getElementById("pageNumber").textContent = `Page ${actualPage}`;
        document.getElementById("prevBtn").disabled = actualPage === 1;
        document.getElementById("nextBtn").disabled = actualPage * limitPage >= copyCustomers.length; 

        if (copyCustomers.length > 0) {
            document.getElementById("pageNumber").innerHTML = `Page ${actualPage} - Page ${totalPages}`;
            document.getElementById("pageNumber").style.visibility = 'visible';
            document.getElementById("prevBtn").style.visibility = 'visible';
            document.getElementById("nextBtn").style.visibility = 'visible';
        } else {
            document.getElementById("pageNumber").style.visibility = 'hidden';
            document.getElementById("prevBtn").style.visibility = 'hidden';
            document.getElementById("nextBtn").style.visibility = 'hidden';
        }
        } 
         
        function changePage(direction) { 
            actualPage += direction;
            showCustomers();
        } 
   
        function changeColumnOrder(index1, index2) {

            const table = document.querySelector("table");
            const rows = Array.from(table.rows); 
         
            [rows[0].cells[index1].innerHTML, rows[0].cells[index2].innerHTML] =
            [rows[0].cells[index2].innerHTML, rows[0].cells[index1].innerHTML];
         
            for (let i = 1; i < rows.length; i++) {
                [rows[i].cells[index1].innerHTML, rows[i].cells[index2].innerHTML] =
                [rows[i].cells[index2].innerHTML, rows[i].cells[index1].innerHTML];
            }
        } 

        //add 
        document.getElementById("customerForm").addEventListener("submit", addOrEditCustomer);