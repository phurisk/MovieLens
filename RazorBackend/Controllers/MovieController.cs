using Microsoft.AspNetCore.Mvc;
using RazorBackend.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace RazorBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieController : ControllerBase
    {
        private readonly string _moviesFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "movies.csv");
        private readonly string _linksFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "links.csv");
        private readonly string _ratingsFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "ratings.csv");
        private readonly string _tagsFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "tags.csv");

        // GET: api/movie
        [HttpGet]
        public IActionResult GetMovies()
        {
            var movies = new List<Movie>();
            if (System.IO.File.Exists(_moviesFilePath))
            {
                var lines = System.IO.File.ReadAllLines(_moviesFilePath).Skip(1); // Skip header
                foreach (var line in lines)
                {
                    var columns = line.Split(',');
                    if (columns.Length == 3)
                    {
                        var movie = new Movie
                        {
                            movieId = int.Parse(columns[0]),
                            title = columns[1],
                            genres = columns[2]
                        };
                        movies.Add(movie);
                    }
                }
            }
            return Ok(movies); // ส่งกลับข้อมูลในรูปแบบ JSON
        }

        // GET: api/movie/{movieId}
        [HttpGet("{movieId}")]
        public IActionResult GetMovieById(int movieId)
        {
            var movies = new List<Movie>();
            if (System.IO.File.Exists(_moviesFilePath))
            {
                var lines = System.IO.File.ReadAllLines(_moviesFilePath).Skip(1); // Skip header
                foreach (var line in lines)
                {
                    var columns = line.Split(',');
                    if (columns.Length == 3)
                    {
                        var movie = new Movie
                        {
                            movieId = int.Parse(columns[0]),
                            title = columns[1],
                            genres = columns[2]
                        };

                        // ตรวจสอบว่า movieId ตรงกับที่ต้องการหรือไม่
                        if (movie.movieId == movieId)
                        {
                            Console.WriteLine($"Found movie: {movie.title} with ID: {movie.movieId}");
                            return Ok(movie); // ส่งกลับภาพยนตร์ที่ตรงกับ movieId
                        }
                    }
                }
            }

            Console.WriteLine($"Movie with ID {movieId} not found.");
            return NotFound(); // หากไม่พบข้อมูล
        }



        // GET: api/links
        [HttpGet("links")]
        public IActionResult GetLinks()
        {
            var links = new List<Link>();
            if (System.IO.File.Exists(_linksFilePath))
            {
                var lines = System.IO.File.ReadAllLines(_linksFilePath).Skip(1); // Skip header
                foreach (var line in lines)
                {
                    var columns = line.Split(',');
                    if (columns.Length == 3)
                    {
                        var link = new Link();

                        // ตรวจสอบและแปลงค่าจาก string เป็น int ด้วย TryParse
                        if (int.TryParse(columns[0], out int movieId))
                        {
                            link.movieId = movieId;
                        }
                        else
                        {
                            // ถ้าค่าไม่สามารถแปลงได้ ก็ข้ามแถวนี้หรือกำหนดค่าเริ่มต้น
                            continue;  // หรือสามารถกำหนด link.movieId = 0 หรือค่าอื่นๆ ตามที่ต้องการ
                        }

                        link.imdbId = columns[1];

                        // ตรวจสอบและแปลงค่าจาก string เป็น int สำหรับ tmdbId
                        if (int.TryParse(columns[2], out int tmdbId))
                        {
                            link.tmdbId = tmdbId;
                        }
                        else
                        {
                            link.tmdbId = null; // ถ้าไม่สามารถแปลงได้ กำหนดให้เป็น null
                        }

                        links.Add(link);
                    }
                }
            }
            return Ok(links);
        }


        // GET: api/ratings
        [HttpGet("ratings")]
        public IActionResult GetRatings()
        {
            var ratings = new List<Rating>();
            if (System.IO.File.Exists(_ratingsFilePath))
            {
                var lines = System.IO.File.ReadAllLines(_ratingsFilePath).Skip(1); // Skip header
                foreach (var line in lines)
                {
                    var columns = line.Split(',');
                    if (columns.Length == 4)
                    {
                        var rating = new Rating
                        {
                            userId = int.Parse(columns[0]),
                            movieId = int.Parse(columns[1]),
                            rating = float.Parse(columns[2]),
                            // แปลง timestamp จาก Unix timestamp เป็น DateTime
                            timestamp = long.Parse(columns[3])
                        };
                        ratings.Add(rating);
                    }
                }
            }
            return Ok(ratings);
        }

        // GET: api/tags
        [HttpGet("tags")]
        public IActionResult GetTags()
        {
            var tags = new List<Tag>();
            if (System.IO.File.Exists(_tagsFilePath))
            {
                var lines = System.IO.File.ReadAllLines(_tagsFilePath).Skip(1); // Skip header
                foreach (var line in lines)
                {
                    var columns = line.Split(',');
                    if (columns.Length == 4)
                    {
                        var tag = new Tag
                        {
                            userId = int.Parse(columns[0]),
                            movieId = int.Parse(columns[1]),
                            tag = columns[2],
                            // แปลง timestamp จาก Unix timestamp เป็น DateTime
                            timestamp = long.Parse(columns[3])
                        };
                        tags.Add(tag);
                    }
                }
            }
            return Ok(tags);
        }
    }
}
