using System;

namespace RazorBackend.Models
{
    public class Rating
    {
        public int userId { get; set; }
        public int movieId { get; set; }
        public float rating { get; set; }
        
        // เปลี่ยน timestamp เป็น long แทน DateTime
        public long timestamp { get; set; }

        // ฟังก์ชันในการแปลง Unix Timestamp เป็น DateTime
        public DateTime GetTimestampAsDateTime()
        {
            var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            return epoch.AddSeconds(timestamp).ToLocalTime();
        }

        // เพิ่มการประกาศ ratingValue ถ้าหาก MovieController.cs ต้องการ
        public float RatingValue => rating;
    }
}
