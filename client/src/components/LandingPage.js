import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/landing.css';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="fashion-landing">
      {/* Navigation */}
      <nav className="fashion-nav">
        <div className="nav-container">
          <Link to="/" className="brand">
            <span className="brand-icon">✨</span>
            LUNEVIA
          </Link>
          <div className="nav-menu">
            <a href="#collections">Collections</a>
            <a href="#trending">Trending</a>
            <a href="#about">About</a>
            <div className="auth-buttons">
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/signup" className="nav-link signup">Join Us</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              Elevate Your Style
              <span className="accent">Define Your Future</span>
            </h1>
            <p className="hero-subtitle">
              Discover the latest trends in luxury fashion. Join our exclusive community 
              of fashion enthusiasts and get early access to new collections.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="cta-button primary">Start Shopping</Link>
              <Link to="/collections" className="cta-button secondary">View Collections</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="fashion-card">
              
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="trending-section" id="trending">
        <h2 className="section-title">Trending Now</h2>
        <div className="trend-grid">
          <div className="trend-card">
            <div className="trend-image summer"></div>
            <h3>Summer Collection</h3>
            <p>Light & Breezy Styles</p>
          </div>
          <div className="trend-card">
            <div className="trend-image accessories"></div>
            <h3> Accessories</h3>
            <p>Complete Your Look</p>
          </div>
          <div className="trend-card">
            <div className="trend-image designer"></div>
            <h3>Designer Picks</h3>
            <p>Exclusive Selection</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature">
            <span className="feature-icon">🌟</span>
            <h3>Premium Quality</h3>
            <p>Handcrafted with finest materials</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🚚</span>
            <h3>Global Shipping</h3>
            <p>Free delivery worldwide</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💎</span>
            <h3>Exclusive Designs</h3>
            <p>Limited edition pieces</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🔄</span>
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
        </div>
      </section>

      {/* Collection Preview */}
      <section className="collection-preview" id="collections">
        <h2 className="section-title">Latest Collections</h2>
        <div className="collection-grid">
          <div className="collection-card large">
            <div className="collection-content">
              <h3>Summer '25</h3>
              <p>Discover the essence of summer</p>
              <Link to="/collection/summer" className="collection-link">
                Explore →
              </Link>
            </div>
          </div>
          <div className="collection-card1">
            <div className="collection-content">
              <h3>Essentials</h3>
              <p>Timeless pieces</p>
              <Link to="/collection/essentials" className="collection-link">
                Shop Now →
              </Link>
            </div>
          </div>
          <div className="collection-card2">
            <div className="collection-content">
              <h3>Jewelry Accessories</h3>
              <p>Complete your look</p>
              <Link to="/collection/accessories" className="collection-link">
                Discover →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Join the Fashion Revolution</h2>
          <p>Get exclusive offers, inspiration, and fashion tips delivered to your inbox</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="fashion-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>LUNEVIA</h3>
            <p>Redefining luxury fashion</p>
            
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>Shop</h4>
              <ul>
                <li><a href="#new">New Arrivals</a></li>
                <li><a href="#bestsellers">Bestsellers</a></li>
                <li><a href="#sale">Sale</a></li>
                <li><a href="#collections">Collections</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Help</h4>
              <ul>
                <li><a href="#shipping">Shipping</a></li>
                <li><a href="#returns">Returns</a></li>
                <li><a href="#sizing">Sizing</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>About</h4>
              <ul>
                <li><a href="#story">Our Story</a></li>
                <li><a href="#sustainability">Sustainability</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#press">Press</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 LUNEVIA. All rights reserved.</p>
          <div className="legal-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;