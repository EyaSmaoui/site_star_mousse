import React, { useState } from 'react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Fatma K.",
      location: "Tunis Centre",
      rating: 5,
      text: "Excellent qualité ! Le matelas Relax Plus est super confortable. Livraison rapide et gratuite. Je recommande fortement !",
      initials: "FK",
      product: "Relax Plus",
      date: "Mai 2026"
    },
    {
      id: 2,
      name: "Mohamed B.",
      location: "Ariana",
      rating: 5,
      text: "Meilleur rapport qualité/prix en Tunisie. Matelas Medico Plus soulage vraiment mes douleurs dorsales. Service impeccable !",
      initials: "MB",
      product: "Medico Plus",
      date: "Avril 2026"
    },
    {
      id: 3,
      name: "Leila M.",
      location: "La Marsa",
      rating: 5,
      text: "Mon mari et moi adorons le Tendresse. Super moelleux et très confortable. Le prix est très raisonnable. Merci Star Mousse !",
      initials: "LM",
      product: "Tendresse",
      date: "Avril 2026"
    },
    {
      id: 4,
      name: "Khaled R.",
      location: "Ben Arous",
      rating: 5,
      text: "Garantie 10 ans, c'est rare ! Venise Plus est vraiment premium. Très satisfait de mon achat. À recommander sans hésiter.",
      initials: "KR",
      product: "Venise Plus",
      date: "Mars 2026"
    },
    {
      id: 5,
      name: "Nadia S.",
      location: "Sfax",
      rating: 5,
      text: "Livraison gratuite jusqu'à Sfax ! Qualité incroyable. Le service client est très réactif et professionnel. Merci beaucoup !",
      initials: "NS",
      product: "Relax Plus",
      date: "Mars 2026"
    }
  ];

  const openGoogleReviews = () => {
    window.open('https://www.google.com/search?q=Star+Mousse+Borj+Chakir', '_blank');
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const displayTestimonials = isMobile ? [testimonials[currentIndex]] : testimonials;

  return (
    <>
      <style>{`
        .testimonials-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
          gap: 16px !important;
        }
        @media (max-width: 1024px) {
          .testimonials-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .testimonials-grid {
            display: flex !important;
            gap: 0 !important;
            position: relative;
            overflow: hidden;
          }
          .testimonials-carousel-container {
            position: relative;
            width: 100%;
          }
          .testimonials-card {
            flex: 0 0 100%;
            min-width: 100%;
            animation: slideIn 0.4s ease-in-out;
          }
          @keyframes slideIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .carousel-nav {
            display: flex !important;
            justify-content: center;
            align-items: center;
            gap: 12px;
            margin-top: 24px;
          }
          .carousel-btn {
            background: #b52f2f;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }
          .carousel-btn:hover {
            background: #8f2424;
            transform: scale(1.1);
          }
          .carousel-dots {
            display: flex !important;
            gap: 8px;
            justify-content: center;
            flex-wrap: wrap;
          }
          .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ddd;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .dot.active {
            background: #b52f2f;
            width: 28px;
            border-radius: 5px;
          }
        }
        @media (max-width: 480px) {
          .testimonials-section {
            padding: 40px 16px !important;
          }
          .testimonials-card {
            padding: 14px !important;
          }
          .testimonials-badges {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .carousel-btn {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }
        }
      `}</style>
      <section style={styles.section} className="testimonials-section">
        <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>⭐ Ce que disent nos clients</h2>
          <p style={styles.subtitle}>Plus de 500 clients satisfaits en Tunisie • Note moyenne : 4.9/5</p>
        </div>

        {/* Testimonials Grid / Carousel */}
        <div style={isMobile ? styles.carouselContainer : styles.gridContainer} className="testimonials-carousel-container">
          <div style={styles.grid} className="testimonials-grid">
            {displayTestimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              style={styles.card}
              className="testimonials-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(181, 47, 47, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              }}
            >
              {/* Stars & Avatar */}
              <div style={styles.cardTop}>
                <div style={styles.avatar}>
                  <span style={styles.avatarText}>{testimonial.initials}</span>
                </div>
                <div style={styles.stars}>
                  {'⭐'.repeat(testimonial.rating)}
                </div>
              </div>
              
              {/* Testimonial Text */}
              <p style={styles.text}>"{testimonial.text}"</p>
              
              {/* Name & Location */}
              <div style={styles.footer}>
                <div>
                  <strong style={styles.name}>{testimonial.name}</strong>
                  <div style={styles.location}>📍 {testimonial.location}</div>
                </div>
                <div style={styles.date}>{testimonial.date}</div>
              </div>
              
              {/* Product Badge */}
              <div style={styles.productBadge}>
                {testimonial.product}
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Carousel Navigation (Mobile Only) */}
        {isMobile && (
          <div style={styles.carouselNav} className="carousel-nav">
            <button 
              className="carousel-btn"
              onClick={prevSlide}
              style={styles.carouselBtn}
              onMouseEnter={(e) => e.currentTarget.style.background = '#8f2424'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#b52f2f'}
            >
              ‹
            </button>
            <div style={styles.dotsContainer} className="carousel-dots">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  style={{
                    ...styles.dot,
                    ...(index === currentIndex ? styles.dotActive : {})
                  }}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
            <button 
              className="carousel-btn"
              onClick={nextSlide}
              style={styles.carouselBtn}
              onMouseEnter={(e) => e.currentTarget.style.background = '#8f2424'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#b52f2f'}
            >
              ›
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div style={styles.ctaSection}>
          <h3 style={styles.ctaTitle}>Vous aussi, vous avez aimé ?</h3>
          <p style={styles.ctaText}>
            Votre avis nous aide à nous améliorer et à bâtir la confiance avec d'autres clients.
          </p>
          <button 
            onClick={openGoogleReviews}
            style={styles.ctaButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#8f2424';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#b52f2f';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ⭐ Laisser un avis Google
          </button>
        </div>

        {/* Trust Badges */}
        <div style={styles.badges} className="testimonials-badges">
          <div style={styles.badge}>
            <span style={styles.badgeIcon}>✓</span>
            <div style={styles.badgeText}>
              <strong>Garantie 10 ans</strong>
              <div style={styles.badgeSubtext}>Protection complète</div>
            </div>
          </div>
          <div style={styles.badge}>
            <span style={styles.badgeIcon}>🚚</span>
            <div style={styles.badgeText}>
              <strong>Livraison gratuite</strong>
              <div style={styles.badgeSubtext}>Partout en Tunisie</div>
            </div>
          </div>
          <div style={styles.badge}>
            <span style={styles.badgeIcon}>💳</span>
            <div style={styles.badgeText}>
              <strong>Paiement à la livraison</strong>
              <div style={styles.badgeSubtext}>Sans frais supplémentaires</div>
            </div>
          </div>
          <div style={styles.badge}>
            <span style={styles.badgeIcon}>👥</span>
            <div style={styles.badgeText}>
              <strong>+500 clients satisfaits</strong>
              <div style={styles.badgeSubtext}>Depuis 2014</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

const styles = {
  section: {
    background: 'linear-gradient(135deg, #fbfaf8 0%, #f5f4f2 100%)',
    padding: '60px 20px',
    marginTop: '40px',
    borderTop: '1px solid #e0ddd8'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px'
  },
  title: {
    fontSize: '2.5em',
    color: '#151522',
    marginBottom: '10px',
    fontWeight: '700',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '1.1em',
    color: '#666',
    margin: '0'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '40px'
  },
  card: {
    background: 'white',
    padding: '18px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #eee'
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #b52f2f, #8f2424)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1em',
    flexShrink: 0
  },
  avatarText: {
    color: 'white'
  },
  stars: {
    color: '#FFB800',
    fontSize: '1.1em',
    letterSpacing: '2px'
  },
  text: {
    fontSize: '0.9em',
    color: '#333',
    lineHeight: '1.5',
    margin: '12px 0',
    fontStyle: 'italic',
    flex: '1'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #eee'
  },
  name: {
    color: '#151522',
    fontSize: '0.95em',
    display: 'block',
    marginBottom: '4px'
  },
  location: {
    color: '#999',
    fontSize: '0.85em'
  },
  date: {
    color: '#ccc',
    fontSize: '0.8em',
    whiteSpace: 'nowrap'
  },
  productBadge: {
    display: 'inline-block',
    background: '#b52f2f',
    color: 'white',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.8em',
    marginTop: '12px',
    fontWeight: 'bold'
  },
  ctaSection: {
    background: 'white',
    padding: '50px 40px',
    borderRadius: '12px',
    border: '2px solid #b52f2f',
    textAlign: 'center',
    marginBottom: '50px',
    maxWidth: '600px',
    margin: '50px auto'
  },
  ctaTitle: {
    color: '#151522',
    marginBottom: '12px',
    fontSize: '1.5em',
    margin: '0 0 12px 0'
  },
  ctaText: {
    color: '#666',
    margin: '0 0 24px 0',
    lineHeight: '1.6'
  },
  ctaButton: {
    background: '#b52f2f',
    color: 'white',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '8px',
    fontSize: '1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(181, 47, 47, 0.3)'
  },
  badges: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginTop: '40px'
  },
  badge: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
  },
  badgeIcon: {
    fontSize: '2em',
    lineHeight: '1'
  },
  badgeText: {
    flex: '1'
  },
  badgeSubtext: {
    color: '#999',
    fontSize: '0.85em',
    marginTop: '4px'
  },
  carouselContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: '40px'
  },
  gridContainer: {
    marginBottom: '40px'
  },
  carouselNav: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '24px',
    marginBottom: '40px'
  },
  carouselBtn: {
    background: '#b52f2f',
    color: 'white',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    padding: '0',
    lineHeight: '1'
  },
  dotsContainer: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#ddd',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    padding: '0'
  },
  dotActive: {
    background: '#b52f2f',
    width: '28px',
    borderRadius: '5px'
  }
};

export default Testimonials;
