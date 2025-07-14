import React from 'react';
import MovieList from '../components/MovieList';
import MovieLinks from '../components/MovieLinks';

const Home = () => {
  return (
    <div className="home-page">
      <MovieList />
      <MovieLinks />
    </div>
  );
};

export default Home;
