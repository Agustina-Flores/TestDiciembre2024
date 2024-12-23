# Test Diciembre 2024

Este proyecto permite gestionar clientes mediante una API construida con ASP.NET Core
y un frontend en HTML, CSS y JavaScript.

## Requisitos

- **.NET SDK**: [Descargar aquí](https://dotnet.microsoft.com/download)
- **Visual Studio Code** o cualquier editor de texto.
- **Navegador web** para probar la interfaz.
- Newtonsoft.Json: Biblioteca para trabajar con JSON. 

## Instrucciones de instalación y ejecución

### Backend (API en ASP.NET Core)

1. Clona el repositorio:

   git clone https://github.com/Agustina-Flores/TestDiciembre2024.git

2 Directorio

   -cd TestDiciembre2024-master\TestDiciembre2024-master
   
   ### Instalar dependencias del backend:
 Restaurar dependencias de .NET
   
   -dotnet restore
   
 Newtonsoft.Json si no está presente en el proyecto:
   
   -dotnet add package Newtonsoft.Json
   
 Ejecutar la API
 
   -dotnet run
 
 
La API estará disponible en la siguiente URL :

Clientes: http://localhost:5029/api/customer
Nota: Si el puerto 5029 está ocupado, el proyecto podría utilizarse en un puerto diferente.


### Frontend (HTML, CSS y JavaScript)
El frontend se encuentra en index.html, que se puede acceder en el navegador en:
 
http://localhost:5029/index.html

(index.html esta en  la carpeta wwwroot.)

### Capturas de pantalla del proyecto

**Formulario para agregar/editar cliente:**
![image](https://github.com/user-attachments/assets/67b9ff8b-d534-4f1b-9bf5-8bcc581af149)

Agregar Nuevo Cliente 
![image](https://github.com/user-attachments/assets/48d0d7bf-21bd-4310-b75f-6e89c2e64eea)

Editar Cliente
![image](https://github.com/user-attachments/assets/2394815b-88bb-4d16-a122-a8e6c5b01a03)
Datos modificados
![image](https://github.com/user-attachments/assets/38aabaf4-9db7-4ecf-9bce-1563475c3479)

Delete
![image](https://github.com/user-attachments/assets/3a821d2c-ae25-48fc-a815-161f94af9940)

**Obtener Datos de un Cliente por ID:**
![image](https://github.com/user-attachments/assets/01339c2e-d0fd-4f2d-a852-3844d6396ffa)

**Listado de Clientes**
![image](https://github.com/user-attachments/assets/c706f195-869a-4b94-84d0-f5e40de045c9)
Paginación
![image](https://github.com/user-attachments/assets/b2e0b458-2c76-4376-bbcf-43202794f4f6)


**Cambio de orden en el encabezado**
![image](https://github.com/user-attachments/assets/17444e49-06d7-41a5-a3ff-56e909209704)




