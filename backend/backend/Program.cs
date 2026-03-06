using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Po³¹czenie z PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Dodaj kontrolery
builder.Services.AddControllers();

// W³¹cz CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Strona b³êdów (widoczna w logach przy HTTP 500)
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Tworzenie bazy jeœli nie istnieje
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// CORS musi byæ przed MapControllers
app.UseCors("AllowReact");

app.MapControllers();

app.Run();