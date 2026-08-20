import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import './LandingPage.css';

export function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [fadeIntro, setFadeIntro] = useState(false);

  useEffect(() => {
    // Start fading out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeIntro(true);
    }, 2500);

    // Remove intro from DOM after fade completes (0.5s transition)
    const removeTimer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <div className="landing-wrapper">
      
      {/* Intro Sequence Overlay */}
      {showIntro && (
        <div className={`intro-overlay ${fadeIntro ? 'fade-out' : ''}`}>
          <div className="intro-logo">
            <img src="/logo.png" alt="Way to scam Logo" style={{ height: '150px', objectFit: 'contain' }} />
          </div>
        </div>
      )}

      {/* Full-screen Local Video Background */}
      <div className="video-background-container">
        <video 
          className="video-background-element"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay to ensure text remains readable over the video */}
        <div className="video-overlay" />
      </div>

      {/* Main UI Overlay */}
      <div className="landing-content">
        <header className="landing-header">
          <Link to="/">
            <img src="/logo.png" alt="Way to scam Logo" style={{ height: '50px', objectFit: 'contain' }} />
          </Link>
          <nav className="landing-nav">
            <Link to="/apply" className="nav-link">Apply</Link>
            <Link to="/manager" className="nav-link">Manager</Link>
          </nav>
        </header>
        
        <main className="landing-main">
          <div className="hero-card">
            <h2 className="hero-title">Money moves fast.<br/>Loan decisions shouldn't be reckless.</h2>
            <p className="hero-subtitle">
              Traditional financial decision-making meets intelligent modern risk assessment.
            </p>
            <div className="hero-actions">
              <Link to="/apply" style={{ flex: 1 }}>
                <Button size="lg" variant="primary" fullWidth style={{ backgroundColor: 'var(--color-vintage-accent)', color: '#000' }}>
                  Start Application
                </Button>
              </Link>
              <Link to="/manager" style={{ flex: 1 }}>
                <Button size="lg" variant="secondary" fullWidth style={{ backgroundColor: 'var(--color-vintage-surface)', color: 'var(--color-vintage-text)', borderColor: 'var(--color-vintage-border)' }}>
                  Manager Login
                </Button>
              </Link>
            </div>
          </div>
        </main>
        
        <footer className="landing-footer">
          <p>&copy; 2026 Way to scam System.</p>
        </footer>
      </div>
    </div>
  );
}
