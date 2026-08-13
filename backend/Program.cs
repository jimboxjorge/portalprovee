var builder = WebApplication.CreateBuilder(args);

// Razor Pages
builder.Services.AddRazorPages();

// Controladores API
builder.Services.AddControllers();

// CORS para React
builder.Services.AddCors(options =>
{
    options.AddPolicy("React",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("React");

app.UseAuthorization();

app.MapControllers();

app.MapStaticAssets();

app.MapRazorPages()
   .WithStaticAssets();

app.Run();