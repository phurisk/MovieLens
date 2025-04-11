import React, { useState, useEffect } from 'react';
import MovieDetail from './MovieDetail';



const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [filter, setFilter] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [minRating, setMinRating] = useState(0);
    const [movieLinks, setMovieLinks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // State สำหรับหน้าเพจปัจจุบัน
    const itemsPerPage = 12; // จำนวนรายการต่อหน้า
    const [posterUrls, setPosterUrls] = useState({});


    useEffect(() => {
        // ดึงข้อมูลหนังทั้งหมด
        fetch('http://localhost:5246/api/movie')
            .then(response => response.json())
            .then(data => {
                // ตั้งค่าหนังทั้งหมด
                setMovies(data);
                setFilteredMovies(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

        // ดึงข้อมูล links (tmdbId) สำหรับแต่ละหนัง
        fetch('http://localhost:5246/api/movie/links')
            .then(response => response.json())
            .then(data => {
                setMovieLinks(data);  // เก็บข้อมูล links ไว้ใน state
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation for links:', error);
            });
    }, []);

    const handleFilterChange = (event) => {
        const value = event.target.value.toLowerCase();
        setFilter(value);
        const filtered = movies.filter(movie => movie.title.toLowerCase().includes(value) || movie.genres.toLowerCase().includes(value));
        setFilteredMovies(filtered);
    };

    const handleMovieClick = (movieId) => {
        setSelectedMovieId(movieId);
        setShowDetail(true);
    };

    const handleCloseModal = () => {
        setShowDetail(false);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // เปลี่ยนหมายเลขหน้า
    };

    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage); // คำนวณจำนวนหน้า

    const getPaginatedMovies = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredMovies.slice(startIndex, startIndex + itemsPerPage);
    };

    // ฟังก์ชันในการเลือก Genre
    const handleGenreSelect = (event) => {
        setSelectedGenre(event.target.value);
    };


    // ฟังก์ชันในการเลือก Rating
    const handleRatingSelect = (event) => {
        setMinRating(event.target.value);
        recommendByRating(event.target.value); // เรียกฟังก์ชันแนะนำหนังจาก rating ที่เลือก
    };

    const recommendMovies = (genre) => {
        const recommended = movies.filter(movie => movie.genres.toLowerCase().includes(genre.toLowerCase()));
        setRecommendedMovies(recommended);
    };

    const recommendByRating = (rating) => {
        const recommended = movies.filter(movie => movie.rating >= rating);
        setRecommendedMovies(recommended);
    };


    // สร้างเลขหน้าที่จะโชว์ โดยแสดงเฉพาะบางหน้า
    const getPaginationItems = () => {
        let pages = [];
        const range = 2; // จำนวนหน้าใกล้เคียงที่จะแสดง (เช่น 2 หน้าก่อนหน้าและ 2 หน้าหลัง)
        let startPage = Math.max(1, currentPage - range); // หน้าตั้งต้น
        let endPage = Math.min(totalPages, currentPage + range); // หน้าสุดท้ายที่จะแสดง

        // ถ้ามีหน้ารวมเกินกำหนด ให้แสดง '...' แสดงระหว่างหน้า
        if (startPage > 1) {
            pages.push(1); // หน้าแรก
            if (startPage > 2) pages.push('...'); // '...'
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push('...'); // '...'
            pages.push(totalPages); // หน้าสุดท้าย
        }
        return pages;
    };


    useEffect(() => {
        const loadPosters = async () => {
            const currentMovies = getPaginatedMovies();
            const newPosters = {};
    
            console.log('Current Movies:', currentMovies);
    
            await Promise.all(currentMovies.map(async (movie) => {
                const link = movieLinks.find(link => link.movieId === movie.movieId);
                console.log(`Link for ${movie.movieId}:`, link);
    
                if (link?.tmdbId) {
                    try {
                        const res = await fetch(`https://api.themoviedb.org/3/movie/${link.tmdbId}/images?api_key=4c620fef33a8c537afcbb68ca0a92e9a`);
                        const data = await res.json();
                        console.log(`TMDB Data for ${link.tmdbId}:`, data);
    
                        const imagePath = data.posters?.[0]?.file_path;
                        if (imagePath) {
                            newPosters[movie.movieId] = `https://image.tmdb.org/t/p/w500${imagePath}`;
                        }
                    } catch (e) {
                        console.error("Error loading poster:", e);
                    }
                }
            }));
    
            console.log("Final newPosters:", newPosters);
            setPosterUrls(prev => ({ ...prev, ...newPosters }));
        };
    
        if (movieLinks.length > 0) {
            loadPosters();
        }
    }, [currentPage, movieLinks, filteredMovies]);

    useEffect(() => {
        let filtered = movies;
    
        if (filter) {
            filtered = filtered.filter(movie =>
                movie.title.toLowerCase().includes(filter) ||
                movie.genres.toLowerCase().includes(filter)
            );
        }
    
        if (selectedGenre) {
            filtered = filtered.filter(movie =>
                movie.genres.includes(selectedGenre)
            );
        }
    
        setFilteredMovies(filtered);
        setCurrentPage(1); // รีเซ็ตไปหน้าแรกเมื่อ filter เปลี่ยน
    }, [movies, filter, selectedGenre]);
    



    return (
        <div className="container-fluid bg-dark text-light p-4">
        <div className="row mb-4">
            <div className="col-md-12">
            <input
                id="search-input"
                type="text"
                placeholder="Search by title or genre"
                value={filter}
                onChange={handleFilterChange}
                className="form-control form-control-lg mb-4 border-0 rounded-pill shadow-sm"
                style={{ backgroundColor: '#2c3e50', color: 'white'}}
            />
            </div>
        </div>

        {/* Genre Selection */}
        <div className="row mb-4">
            <div className="col-md-12">
            <select
                onChange={handleGenreSelect}
                className="form-control form-control-lg mb-4 border-0 rounded-pill shadow-sm"
                style={{ backgroundColor: '#2c3e50', color: 'white' }}
            >
                <option value="">Select Genre</option>
                {['Action', 'Comedy', 'Drama', 'Romance', 'Thriller', 'Adventure'].map(genre => (
                <option key={genre} value={genre}>{genre}</option>
                ))}
            </select>
            </div>
        </div>

        {/* Rating Selection
        <div className="row mb-4">
            <div className="col-md-12">
            <input
                type="number"
                min="0"
                max="5"
                value={minRating}
                onChange={handleRatingSelect}
                className="form-control form-control-lg mb-4 border-0 rounded-pill shadow-sm"
                style={{ backgroundColor: '#2c3e50', color: 'white' }}
                placeholder="Min Rating (0-5)"
            />
            </div>
        </div> */}

        {/* Recommended Movies
        <div className="mb-4">
            <h3 className="text-primary">Recommended Movies:</h3>
            <div className="row">
            {recommendedMovies.map(movie => (
                <div key={movie.movieId} className="col-md-3 mb-4" onClick={() => handleMovieClick(movie.movieId)}>
                <div className="card bg-secondary text-light rounded-lg shadow-sm">
                    <img 
                    src={posterUrls[movie.movieId] || 'fallback.jpg'} 
                    alt={movie.title} 
                    className="card-img-top rounded-top"
                    />
                    <div className="card-body">
                    <h5 className="card-title text-white">{movie.title}</h5>
                    <p className="card-text">
                    {movie.genres.split('|').map((genre, index) => (
                        <span key={index} className="badge bg-light text-dark me-1">{genre}</span>
                    ))}
                    </p>
                    

                    </div>
                </div>
                </div>
            ))}
            </div>
        </div> */}
            
        {/* Filtered Movies */}
        <div className="row">
    {getPaginatedMovies().map(movie => (
      <div key={movie.movieId} className="col-md-3 mb-4" onClick={() => handleMovieClick(movie.movieId)}>
        <div className="card bg-secondary text-light rounded-lg shadow-sm" style={{ minHeight: '350px' }}>
          <img 
            src={posterUrls[movie.movieId] || 'fallback.jpg'} 
            alt={movie.title} 
            className="card-img-top rounded-top" 
            style={{ maxHeight: '200px', objectFit: 'cover' }} 
          />
          <div className="card-body">
            <h5 className="card-title text-white">{movie.title}</h5>
            <p className="card-text">
            {movie.genres.split('|').map((genre, index) => (
                <span key={index} className="badge bg-light text-dark me-1">{genre}</span>
            ))}
            </p>

          </div>
        </div>
      </div>
    ))}
  </div>



        {/* Pagination */}
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} style={{ backgroundColor: '#2c3e50', color: 'white' }}>Previous</button>
            </li>
            {getPaginationItems().map((page, index) => (
                <li key={index} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => page !== '...' && handlePageChange(page)} style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                    {page}
                </button>
                </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} style={{ backgroundColor: '#2c3e50', color: 'white' }}>Next</button>
            </li>
            </ul>
        </nav>
            
        {/* Modal for Movie Details */}
        <MovieDetail movieId={selectedMovieId} show={showDetail} onClose={handleCloseModal} />
        </div>
    );
};

export default MovieList;


