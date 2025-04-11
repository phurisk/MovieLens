public class Link
{
    public int movieId { get; set; }
    public string imdbId { get; set; } = string.Empty;  // กำหนดค่าเริ่มต้นเพื่อหลีกเลี่ยง null
    public int? tmdbId { get; set; }  // ใช้ Nullable<int> (int?)
}
