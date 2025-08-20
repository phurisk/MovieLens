import React, { useState, useEffect } from 'react';
import MovieDetail from './MovieDetail';


const API_BASE = process.env.REACT_APP_API_BASE;

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
        fetch(`${API_BASE}/api/movie`)
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
        fetch(`${API_BASE}/api/movie/links`)
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
<div 
  className="container-fluid text-light p-4"
  style={{
    minHeight: '100vh'
  }}
>
  {/* Search Input */}
  <div className="row mb-4">
    <div className="col-md-12">
      <div 
        className="position-relative"
        style={{ animation: 'fadeInDown 0.8s ease-out' }}
      >
        <input
          id="search-input"
          type="text"
          placeholder="Search by title or genre..."
          value={filter}
          onChange={handleFilterChange}
          className="form-control form-control-lg mb-4 border-0 rounded-pill shadow-lg"
          style={{ 
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: 'white',
            paddingLeft: '50px',
            paddingRight: '20px',
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            border: '2px solid transparent'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3498db';
            e.target.style.boxShadow = '0 0 20px rgba(52, 152, 219, 0.3)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'transparent';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            e.target.style.transform = 'translateY(0)';
          }}
        />
        <i 
          className="bi bi-search position-absolute text-secondary"
          style={{
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.2rem',
            zIndex: 10
          }}
        />
      </div>
    </div>
  </div>

  {/* Genre Selection */}
  <div className="row mb-4">
    <div className="col-md-12">
      <div 
        className="position-relative"
        style={{ animation: 'fadeInDown 0.8s ease-out 0.2s both' }}
      >
        <select
          onChange={handleGenreSelect}
          className="form-control form-control-lg mb-4 border-0 rounded-pill shadow-lg"
          style={{ 
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: 'white',
            fontSize: '1.1rem',
            paddingLeft: '50px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            border: '2px solid transparent',
            cursor: 'pointer'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#e74c3c';
            e.target.style.boxShadow = '0 0 20px rgba(231, 76, 60, 0.3)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'transparent';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <option value="" style={{ backgroundColor: '#2c3e50', color: 'white' }}>Select Genre</option>
          {['Action', 'Comedy', 'Drama', 'Romance', 'Thriller', 'Adventure'].map(genre => (
            <option 
              key={genre} 
              value={genre}
              style={{ backgroundColor: '#2c3e50', color: 'white' }}
            >
              {genre}
            </option>
          ))}
        </select>
        <i 
          className="bi bi-funnel position-absolute text-secondary"
          style={{
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.2rem',
            zIndex: 10
          }}
        />
      </div>
    </div>
  </div>

  {/* Filtered Movies */}
  <div className="row">
    {getPaginatedMovies().map((movie, index) => (
      <div 
        key={movie.movieId} 
        className="col-md-3 mb-4" 
        onClick={() => handleMovieClick(movie.movieId)}
        style={{ 
          animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
          cursor: 'pointer'
        }}
      >
        <div 
          className="card text-light rounded-lg shadow-lg h-100"
          style={{ 
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.4s ease',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            e.currentTarget.style.borderColor = 'rgba(52, 152, 219, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <div className="position-relative overflow-hidden">
            <img
              src={posterUrls[movie.movieId] || 'fallback.jpg'}
              alt={movie.title}
              className="card-img-top"
              style={{ 
                height: '250px', 
                objectFit: 'cover',
                transition: 'transform 0.4s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            />
            <div 
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '0';
              }}
            />
          </div>
          
          <div className="card-body p-3">
            <h5 
              className="card-title text-white fw-bold mb-3"
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.3',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              {movie.title}
            </h5>
            <div className="d-flex flex-wrap gap-1">
              {movie.genres.split('|').map((genre, genreIndex) => (
                <span 
                  key={genreIndex} 
                  className="badge text-dark"
                  style={{
                    background: 'linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%)',
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    animation: `fadeInScale 0.5s ease-out ${genreIndex * 0.1}s both`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%)';
                    e.target.style.color = '#2c3e50';
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Pagination */}
  <nav 
    aria-label="Page navigation" 
    className="mt-5"
    style={{ animation: 'fadeIn 1s ease-out 0.8s both' }}
  >
    <ul className="pagination justify-content-center">
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button 
          className="page-link border-0 rounded-pill me-2"
          onClick={() => handlePageChange(currentPage - 1)}
          style={{ 
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: 'white',
            padding: '10px 20px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.target.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.target.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          <i className="bi bi-chevron-left me-1"></i>
          Previous
        </button>
      </li>
      
      {getPaginationItems().map((page, index) => (
        <li key={index} className={`page-item ${currentPage === page ? 'active' : ''}`}>
          <button 
            className="page-link border-0 rounded-circle me-2"
            onClick={() => page !== '...' && handlePageChange(page)}
            style={{ 
              background: currentPage === page 
                ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
                : 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
              color: 'white',
              width: '45px',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              fontWeight: currentPage === page ? 'bold' : 'normal'
            }}
            onMouseEnter={(e) => {
              if (page !== '...' && currentPage !== page) {
                e.target.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
                e.target.style.transform = 'translateY(-2px) scale(1.1)';
                e.target.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (page !== '...' && currentPage !== page) {
                e.target.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {page}
          </button>
        </li>
      ))}
      
      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button 
          className="page-link border-0 rounded-pill"
          onClick={() => handlePageChange(currentPage + 1)}
          style={{ 
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: 'white',
            padding: '10px 20px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          Next
          <i className="bi bi-chevron-right ms-1"></i>
        </button>
      </li>
    </ul>
  </nav>

  {/* Modal for Movie Details */}
  <MovieDetail movieId={selectedMovieId} show={showDetail} onClose={handleCloseModal} />

  <style jsx>{`
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .form-control::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .page-item.disabled .page-link {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-item.disabled .page-link:hover {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
      transform: none !important;
      box-shadow: none !important;
    }

    .card:hover .card-img-top {
      transform: scale(1.1);
    }

    .pagination .page-link {
      margin: 0 2px;
    }

    select option {
      background-color: #2c3e50 !important;
      color: white !important;
    }

    select option:hover {
      background-color: #34495e !important;
    }
  `}</style>
</div>
    );
};

export default MovieList;


