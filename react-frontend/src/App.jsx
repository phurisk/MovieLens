import React from 'react';
import MovieList from './components/MovieList';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
    return (
<div 
  className="App text-white min-vh-100 position-relative overflow-hidden"
  style={{
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 75%, #0f0f23 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite'
  }}
>
  {/* Animated Background Elements */}
  <div 
    className="position-absolute w-100 h-100"
    style={{
      background: 'radial-gradient(circle at 20% 50%, rgba(52, 152, 219, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(231, 76, 60, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(155, 89, 182, 0.1) 0%, transparent 50%)',
      animation: 'backgroundFloat 20s ease-in-out infinite'
    }}
  />
  
  {/* Floating Particles */}
  <div className="position-absolute w-100 h-100 overflow-hidden">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="position-absolute rounded-circle"
        style={{
          width: `${Math.random() * 6 + 4}px`,
          height: `${Math.random() * 6 + 4}px`,
          backgroundColor: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ))}
  </div>

  <div className="container py-4 position-relative">
    {/* Header Section */}
    <header 
      className="text-center mb-5"
      style={{ animation: 'slideInDown 1s ease-out' }}
    >
      <div className="position-relative d-inline-block">
        <h1 
          className="mb-4 fw-bold position-relative"
          style={{
            fontSize: '3.5rem',
            background: 'linear-gradient(45deg, #3498db, #e74c3c, #f39c12, #9b59b6)',
            backgroundSize: '400% 400%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradientText 8s ease infinite, titlePulse 4s ease-in-out infinite',
            textShadow: '0 0 30px rgba(52, 152, 219, 0.5)',
            letterSpacing: '2px',
            
          }}
        >
          🎬 MovieLens
        </h1>
        
        {/* Glowing underline */}
        <div 
          className="position-absolute w-100"
          style={{
            height: '1px',
            bottom: '-36px',
            left: '0',
            background: 'linear-gradient(90deg, transparent, #3498db, transparent)',
            animation: 'underlineGlow 3s ease-in-out infinite',
           
          }}
        />
        
        {/* Sparkle effects */}
        <div className="position-absolute w-100 h-100 top-0 start-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="position-absolute"
              style={{
                width: '4px',
                height: '4px',
                backgroundColor: '#f39c12',
                borderRadius: '50%',
                left: `${20 + i * 20}%`,
                top: `${Math.random() * 100}%`,
                animation: `sparkle 2s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Subtitle */}
      <p 
        className="text-light mb-0 fs-5 opacity-75"
        style={{
          animation: 'fadeIn 1.5s ease-out 0.5s both',
          fontWeight: '300',
          letterSpacing: '1px'
        }}
      >
        Discover Your Next Favorite Movie
      </p>
      
      {/* Decorative line */}
      <div className="d-flex justify-content-center align-items-center mt-4">
        <div 
          className="bg-secondary"
          style={{
            width: '50px',
            height: '1px',
            animation: 'expandLine 1s ease-out 1s both'
          }}
        />
        <div 
          className="mx-3 text-info"
          style={{
            animation: 'fadeIn 1s ease-out 1.2s both'
          }}
        >
          ★
        </div>
        <div 
          className="bg-secondary"
          style={{
            width: '50px',
            height: '1px',
            animation: 'expandLine 1s ease-out 1s both'
          }}
        />
      </div>
    </header>

    {/* Main Content */}
    <main 
      style={{ 
        animation: 'slideInUp 1s ease-out 0.8s both',
        position: 'relative',
        zIndex: 2,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px'
      }}
    >
      <MovieList />
    </main>
  </div>

  {/* Scroll indicator */}
  <div 
    className="position-fixed bottom-0 end-0 p-4"
    style={{
      animation: 'fadeIn 2s ease-out 2s both',
      zIndex: 1000
    }}
  >
    <div 
      className="d-flex align-items-center text-secondary"
      style={{
        fontSize: '0.9rem',
        animation: 'bounce 2s ease-in-out infinite'
      }}
    >
      <span className="me-2">Scroll to explore</span>
      <i className="bi bi-arrow-down"></i>
    </div>
  </div>

  <style jsx>{`
    @keyframes gradientShift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    @keyframes backgroundFloat {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      25% {
        transform: translateY(-20px) rotate(5deg);
      }
      50% {
        transform: translateY(-10px) rotate(-5deg);
      }
      75% {
        transform: translateY(-30px) rotate(3deg);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) translateX(0px);
      }
      25% {
        transform: translateY(-20px) translateX(10px);
      }
      50% {
        transform: translateY(-10px) translateX(-5px);
      }
      75% {
        transform: translateY(-30px) translateX(5px);
      }
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
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

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes gradientText {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    @keyframes titlePulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.02);
      }
    }

    @keyframes underlineGlow {
      0%, 100% {
        opacity: 0.3;
        transform: scaleX(0.8);
      }
      50% {
        opacity: 1;
        transform: scaleX(1.2);
      }
    }

    @keyframes sparkle {
      0%, 100% {
        opacity: 0;
        transform: scale(0);
      }
      50% {
        opacity: 1;
        transform: scale(1.5);
      }
    }

    @keyframes expandLine {
      from {
        width: 0;
      }
      to {
        width: 50px;
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

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .App h1 {
        font-size: 2.5rem !important;
      }
    }

    @media (max-width: 576px) {
      .App h1 {
        font-size: 2rem !important;
      }
    }

    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #1a1a2e;
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #3498db, #e74c3c);
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #2980b9, #c0392b);
    }
  `}</style>
</div>
    );
}

export default App;
