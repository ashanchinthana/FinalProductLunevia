import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  // Generate background particles
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.2
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x: (x - 0.5) * 20, y: (y - 0.5) * 20 });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password || formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');
    try {
      await signup(formData.email, formData.password);
      setMessage('Account created! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMessage('Signup failed: ' + (err.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  
    const styles = {
      container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      },
      
      backgroundShapes: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      },
      
      floatingShape: {
        position: 'absolute',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        animation: 'float 6s ease-in-out infinite',
        transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
      },
      
      loginCard: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '40px',
        minWidth: '400px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        zIndex: 10,
        transform: `perspective(1000px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg) translateZ(0)`,
        transition: 'all 0.3s ease-out'
      },
      
      title: {
        fontSize: '2.5rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
        marginBottom: '10px',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
      },
      
      subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '30px',
        fontSize: '1rem'
      },
      
      inputGroup: {
        position: 'relative',
        marginBottom: '25px'
      },
      
      input: {
        width: '100%',
        padding: '15px 20px',
        border: '2px solid #e1e8ed',
        borderRadius: '12px',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        outline: 'none',
        boxSizing: 'border-box'
      },
      
      inputFocused: {
        borderColor: '#667eea',
        boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)',
        transform: 'translateY(-2px)'
      },
      
      label: {
        position: 'absolute',
        left: '20px',
        top: '15px',
        color: '#999',
        fontSize: '16px',
        pointerEvents: 'none',
        transition: 'all 0.3s ease',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '0 8px'
      },
      
      labelFloating: {
        top: '-10px',
        fontSize: '12px',
        color: '#667eea',
        fontWeight: '600'
      },
      
      submitButton: {
        width: '100%',
        padding: '15px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      },
      
      submitButtonHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)'
      },
      
      linkContainer: {
        textAlign: 'center',
        marginTop: '25px'
      },
      
      link: {
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: '600',
        transition: 'all 0.3s ease'
      },
      
      linkHover: {
        color: '#764ba2',
        textShadow: '0 2px 4px rgba(102, 126, 234, 0.3)'
      },
      
      message: {
        textAlign: 'center',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontWeight: '600'
      },
      
      successMessage: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        color: '#4caf50',
        border: '1px solid rgba(76, 175, 80, 0.3)'
      },
      
      errorMessage: {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        color: '#f44336',
        border: '1px solid rgba(244, 67, 54, 0.3)'
      },
      
      decorativeElement: {
        position: 'absolute',
        width: '100px',
        height: '100px',
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3))',
        borderRadius: '50%',
        top: '-50px',
        right: '-50px',
        animation: 'pulse 4s ease-in-out infinite'
      },
      
      glowOrb: {
        position: 'absolute',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
        transition: 'transform 0.3s ease-out',
        pointerEvents: 'none'
      }
    
    
  };

  const keyframes = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-30px) rotate(120deg); }
      66% { transform: translateY(-20px) rotate(240deg); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div ref={containerRef} style={styles.container}>
        <div style={styles.backgroundShapes}>
          {particles.map(p => (
            <div
              key={p.id}
              style={{
                ...styles.floatingShape,
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                animationDelay: `${p.id * 0.1}s`,
                animationDuration: `${6 + p.speed}s`
              }}
            />
          ))}
        </div>

        <div style={styles.glowOrb} />

        <div ref={cardRef} style={styles.loginCard}>
          <div style={styles.decorativeElement} />

          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join us today!</p>

          {message && (
            <div style={{
              ...styles.message,
              ...(message.includes('created') ? styles.successMessage : styles.errorMessage)
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {['name', 'email', 'password', 'confirmPassword'].map(field => (
              <div key={field} style={styles.inputGroup}>
                <input
                  type={field.includes('password') ? 'password' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  style={{
                    ...styles.input,
                    ...(formData[field] ? styles.inputFocused : {})
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 20px rgba(102,126,234,0.3)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onBlur={(e) => {
                    if (!formData[field]) {
                      e.target.style.borderColor = '#e1e8ed';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                />
                <label style={{
                  ...styles.label,
                  ...(formData[field] ? styles.labelFloating : {})
                }}>
                  {field === 'confirmPassword' ? 'Confirm Password' :
                   field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 25px rgba(102,126,234,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div style={styles.linkContainer}>
            <Link 
              to="/login" 
              style={styles.link}
              onMouseEnter={(e) => {
                e.target.style.color = '#764ba2';
                e.target.style.textShadow = '0 2px 4px rgba(102,126,234,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#667eea';
                e.target.style.textShadow = 'none';
              }}
            >
              Already have an account? Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
