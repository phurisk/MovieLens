import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Row, Col } from 'react-bootstrap';

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
                    const movieRes = await fetch(`http://localhost:5246/api/movie/${movieId}`);
                    if (movieRes.status === 404) throw new Error('Movie not found');
                    const movieData = await movieRes.json();
                    setMovie(movieData);
    
                    // Ratings
                    const ratingRes = await fetch(`http://localhost:5246/api/movie/ratings`);
                    const allRatings = await ratingRes.json();
                    setRatings(allRatings.filter(r => r.movieId === movieId));
    
                    // Image from TMDb
                    const linkRes = await fetch(`http://localhost:5246/api/movie/links`);
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
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton className="bg-dark text-white ">
                <Modal.Title>{loading ? 'Loading...' : movie?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4 ">
                {loading ? (
                    <div className="text-center">
                        <p>Loading...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-danger">
                        <p>Error: {error}</p>
                    </div>
                ) : !movie ? (
                    <div className="text-center">
                        <p>No movie found.</p>
                    </div>
                ) : (
                    <Row>
                        <Col md={4} className="d-flex justify-content-center align-items-center">
                            {image ? (
                                <img src={image} alt={movie.title} className="img-fluid rounded" />
                            ) : (
                                <div className="bg-light p-3 text-center rounded">
                                    <p>No Image Available</p>
                                </div>
                            )}
                        </Col>
                        <Col md={8}>
                            <Card className="border-0 ">
                                <Card.Body>
                                    <Card.Title className="text-primary">{movie.title}</Card.Title>
                                    <Card.Text>
                                        <strong>Genres:</strong>{' '}
                                        {movie.genres.split('|').map((genre, index) => (
                                            <span key={index} className="badge bg-secondary me-1">{genre}</span>
                                        ))}
                                    </Card.Text>

                                    <Card.Text>
                                        <strong>Rating:</strong> {averageRating.toFixed(1)}{' '}
                                        <i className="bi bi-star-fill text-warning" />
                                    </Card.Text>
                                    <Card.Text>{movie.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Modal.Body>
            <Modal.Footer className="bg-dark text-white">
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MovieDetail;
