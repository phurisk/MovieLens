namespace RazorBackend.Models
{
    public class Movie
    {
        public int movieId { get; set; }
        public string title { get; set; } = string.Empty;  // กำหนดค่าเริ่มต้นเพื่อหลีกเลี่ยง null
        public string genres { get; set; } = string.Empty; // กำหนดค่าเริ่มต้นเพื่อหลีกเลี่ยง null
    }
}
