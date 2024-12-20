using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Configura el puerto explícitamente
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(5029); // Cambia el puerto si es necesario
});

// Agregar servicios al contenedor
builder.Services.AddControllers();


// Configure CORS policy to allow any origin, method, and header.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()   // Allow any origin
               .AllowAnyMethod()   // Allow any HTTP method (GET, POST, etc.)
               .AllowAnyHeader();  // Allow any headers
    });
});

var app = builder.Build();

// Usar archivos estáticos (esto sirve el `index.html` y otros archivos en wwwroot)
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors("AllowAll");  // Apply the CORS policy globally

app.UseRouting();

// Configurar la canalización de solicitud HTTP
app.MapControllers();

app.Run();