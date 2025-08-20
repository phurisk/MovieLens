using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.FileProviders;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

// เพิ่มการตั้งค่า CORS เพื่ออนุญาตให้ React Frontend เรียก API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("http://localhost:3000","https://movie-lens-phudev.vercel.app") // ที่อยู่ของ React (Frontend)
               .AllowAnyMethod()   // อนุญาตทุก HTTP method
               .AllowAnyHeader();  // อนุญาตทุก Header
    });
});

// เพิ่มบริการสำหรับ API Controllers
builder.Services.AddControllers(); // เพิ่มการสนับสนุน API Controllers

var app = builder.Build();

//### เพิ่ม ###
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port) && int.TryParse(port, out var portNumber))
{
    app.Urls.Clear();
    app.Urls.Add($"http://*:{portNumber}");
}

//### เพิ่ม ###
var dataPath = Path.Combine(Directory.GetCurrentDirectory(), "Data");
if (Directory.Exists(dataPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(dataPath),
        RequestPath = "/Data"
    });
}


// ให้บริการไฟล์ Static (ไฟล์ CSV)
app.UseStaticFiles(); // ให้บริการไฟล์ static ทั่วไป


// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Data")),
//     RequestPath = "/Data"
// });



// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// เปิดใช้งาน CORS
app.UseCors("AllowReactApp");

app.UseRouting();

// ใช้งาน API Controllers
app.MapControllers(); // ใช้ MapControllers สำหรับ API

app.UseAuthorization();

// ใช้งาน Razor Pages
app.MapRazorPages(); // ถ้าคุณต้องการ Razor Pages ด้วย
app.Run();
