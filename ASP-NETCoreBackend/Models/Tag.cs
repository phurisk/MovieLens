using System;

namespace RazorBackend.Models
{
    public class Tag
    {
        public int userId { get; set; }
        public int movieId { get; set; }
        public string tag { get; set; } = string.Empty;  // ให้ค่าเริ่มต้นเป็น string.Empty เพื่อหลีกเลี่ยงค่า null

        // เปลี่ยน timestamp เป็น long แทน DateTime
        public long timestamp { get; set; }

        // ฟังก์ชันในการแปลง Unix Timestamp เป็น DateTime
        public DateTime GetTimestampAsDateTime()
        {
            var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            return epoch.AddSeconds(timestamp).ToLocalTime();
        }

        // เพิ่มการประกาศ tagValue ถ้าหาก MovieController.cs ต้องการ
        public string TagValue => tag;
    }
}
