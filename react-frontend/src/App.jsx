import React from 'react';
import MovieList from './components/MovieList';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
    return (
        <div className="App bg-dark text-white min-vh-100">
            <div className="container py-4">
                <h1 className="mb-4 text-info">🎬 MovieLens</h1>
                <MovieList />
            </div>
        </div>
    );
}

export default App;
