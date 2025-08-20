import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Row, Col } from 'react-bootstrap';


const API_BASE = process.env.REACT_APP_API_BASE;
console.log("API Base:", process.env.REACT_APP_API_BASE);

const MovieDetail = ({ movieId, show, onClose }) => {
    const [movie, setMovie] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null); // State for movie poster image

    useEffect(() => {
        const fetchData = async () => {
            if (show && movieId) {
                setLoading(true);
                setError(null);
                setMovie(null);
                setImage(null);
    
                try {
                    // Movie
                    const movieRes = await fetch(`${API_BASE}/api/movie/${movieId}`);
                    if (movieRes.status === 404) throw new Error('Movie not found');
                    const movieData = await movieRes.json();
                    setMovie(movieData);
    
                    // Ratings
                    const ratingRes = await fetch(`${API_BASE}/api/movie/ratings`);
                    const allRatings = await ratingRes.json();
                    setRatings(allRatings.filter(r => r.movieId === movieId));
    
                    // Image from TMDb
                    const linkRes = await fetch(`${API_BASE}/api/movie/links`);
                    const links = await linkRes.json();
                    const link = links.find(link => link.movieId === movieId);
                    if (link?.tmdbId) {
                        const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/${link.tmdbId}/images?api_key=4c620fef33a8c537afcbb68ca0a92e9a`);
                        const tmdbData = await tmdbRes.json();
                        const imagePath = tmdbData.posters?.[0]?.file_path;
                        if (imagePath) {
                            setImage(`https://image.tmdb.org/t/p/w500${imagePath}`);
                        }
                    }
                } catch (err) {
                    console.error(err);
                    setError(err.message);
                } finally {
                    setLoading(false); // ✅ รับรองว่าเรียกเสมอ
                }
            }
        };
    
        fetchData();
    }, [movieId, show]);
    
    // Calculate average rating
    const getAverageRating = () => {
        if (ratings.length === 0) return 0;
        const totalRating = ratings.reduce((acc, rating) => acc + rating.ratingValue, 0);
        return totalRating / ratings.length;
    };

    const averageRating = getAverageRating();

    return (
<Modal 
  show={show} 
  onHide={onClose} 
  centered 
  className="fade-in"
  style={{
    '--bs-modal-bg': 'rgba(0, 0, 0, 0.8)',
    animation: show ? 'modalSlideIn 0.3s ease-out' : 'modalSlideOut 0.3s ease-in'
  }}
>
  <Modal.Header 
    closeButton 
    className="bg-dark text-white border-0 position-relative overflow-hidden"
    style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderBottom: '1px solid #333'
    }}
  >
    <Modal.Title 
      className="text-white fw-bold d-flex align-items-center"
      style={{
        animation: loading ? 'pulse 1.5s infinite' : 'slideInLeft 0.5s ease-out',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
      }}
    >
      {loading ? (
        <span className="d-flex align-items-center">
          <div 
            className="spinner-border spinner-border-sm me-2 text-primary"
            style={{ animation: 'spin 1s linear infinite' }}
          ></div>
          Loading...
        </span>
      ) : movie?.title}
    </Modal.Title>
    <div 
      className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
      style={{
        background: 'linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.1) 50%, transparent 51%)',
        animation: 'shimmer 2s infinite'
      }}
    ></div>
  </Modal.Header>

  <Modal.Body 
    className="p-4 text-white"
    style={{
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      minHeight: '400px'
    }}
  >
    {loading ? (
      <div 
        className="text-center py-5"
        style={{ animation: 'fadeIn 0.5s ease-out' }}
      >
        <div 
          className="spinner-border text-primary mb-3"
          style={{ 
            width: '3rem', 
            height: '3rem',
            animation: 'spin 1s linear infinite, pulse 2s infinite'
          }}
        ></div>
        <p className="text-light">Loading movie details...</p>
      </div>
    ) : error ? (
      <div 
        className="text-center py-5"
        style={{ animation: 'shakeError 0.5s ease-out' }}
      >
        <i 
          className="bi bi-exclamation-triangle text-danger mb-3"
          style={{ fontSize: '3rem', animation: 'bounce 1s infinite' }}
        ></i>
        <p className="text-danger fw-bold">Error: {error}</p>
      </div>
    ) : !movie ? (
      <div 
        className="text-center py-5"
        style={{ animation: 'fadeIn 0.5s ease-out' }}
      >
        <i 
          className="bi bi-film text-secondary mb-3"
          style={{ fontSize: '3rem', opacity: '0.5' }}
        ></i>
        <p className="text-light">No movie found.</p>
      </div>
    ) : (
      <Row 
        className="g-4"
        style={{ animation: 'slideInUp 0.6s ease-out' }}
      >
        <Col md={4} className="d-flex justify-content-center align-items-center">
          <div 
            className="position-relative"
            style={{
              animation: 'zoomIn 0.8s ease-out',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {image ? (
              <img 
                src={image} 
                alt={movie.title} 
                className="img-fluid rounded shadow-lg"
                style={{
                  maxHeight: '400px',
                  objectFit: 'cover',
                  border: '3px solid #333',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                }}
              />
            ) : (
              <div 
                className="bg-secondary p-4 text-center rounded shadow"
                style={{
                  minHeight: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #333 0%, #555 100%)',
                  border: '2px dashed #666'
                }}
              >
                <div>
                  <i 
                    className="bi bi-image text-light mb-3"
                    style={{ fontSize: '3rem', opacity: '0.7' }}
                  ></i>
                  <p className="text-light">No Image Available</p>
                </div>
              </div>
            )}
          </div>
        </Col>

        <Col md={8}>
          <Card 
            className="border-0 h-100"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              backdropFilter: 'blur(10px)',
              animation: 'slideInRight 0.8s ease-out'
            }}
          >
            <Card.Body className="p-4">
              <Card.Title 
                className="text-primary mb-3 fw-bold"
                style={{
                  fontSize: '1.5rem',
                  animation: 'slideInLeft 0.6s ease-out',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                }}
              >
                {movie.title}
              </Card.Title>

              <Card.Text 
                className="mb-3"
                style={{ animation: 'fadeIn 0.8s ease-out 0.2s both' }}
              >
                <strong className="text-light">Genres:</strong>{' '}
                <div className="d-inline-flex flex-wrap gap-1 mt-1">
                  {movie.genres.split('|').map((genre, index) => (
                    <span 
                      key={index} 
                      className="badge bg-secondary px-2 py-1"
                      style={{
                        animation: `fadeInScale 0.5s ease-out ${index * 0.1}s both`,
                        transition: 'all 0.3s ease',
                        cursor: 'default'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.backgroundColor = '#6c757d';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.backgroundColor = '#6c757d';
                      }}
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </Card.Text>

              <Card.Text 
                className="mb-3"
                style={{ animation: 'fadeIn 0.8s ease-out 0.4s both' }}
              >
                <strong className="text-light">Rating:</strong>{' '}
                <span 
                  className="text-warning fw-bold"
                  style={{ fontSize: '1.1rem' }}
                >
                  {averageRating.toFixed(1)}
                </span>
                <i 
                  className="bi bi-star-fill text-warning ms-1"
                  style={{ 
                    animation: 'starGlow 2s infinite',
                    filter: 'drop-shadow(0 0 3px rgba(255, 193, 7, 0.5))'
                  }}
                />
              </Card.Text>

              <Card.Text 
                className="text-light lh-base"
                style={{
                  animation: 'fadeIn 0.8s ease-out 0.6s both',
                  textAlign: 'justify'
                }}
              >
                {movie.description}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    )}
  </Modal.Body>

  <Modal.Footer 
    className="bg-dark text-white border-0"
    style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderTop: '1px solid #333'
    }}
  >
    <Button 
      variant="outline-secondary" 
      onClick={onClose}
      className="px-4 py-2 fw-bold"
      style={{
        transition: 'all 0.3s ease',
        border: '2px solid #6c757d',
        color: '#fff'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#6c757d';
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 12px rgba(108, 117, 125, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'transparent';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }}
    >
      Close
    </Button>
  </Modal.Footer>

  <style jsx>{`
    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: scale(0.8) translateY(-50px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @keyframes modalSlideOut {
      from {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      to {
        opacity: 0;
        transform: scale(0.8) translateY(-50px);
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
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes zoomIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
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

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }

    @keyframes starGlow {
      0%, 100% {
        filter: drop-shadow(0 0 3px rgba(255, 193, 7, 0.5));
      }
      50% {
        filter: drop-shadow(0 0 8px rgba(255, 193, 7, 0.8));
      }
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    @keyframes shakeError {
      0%, 100% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(-10px);
      }
      75% {
        transform: translateX(10px);
      }
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `}</style>
</Modal>
    );
};

export default MovieDetail;
