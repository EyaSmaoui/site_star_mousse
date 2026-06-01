import React from 'react';

const Testimonials = () => {
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

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>⭐ Ce que disent nos clients</h2>
          <p style={styles.subtitle}>Plus de 500 clients satisfaits en Tunisie • Note moyenne : 4.9/5</p>
        </div>

        {/* Testimonials Grid */}
        <div style={styles.grid}>
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              style={styles.card}
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
        <div style={styles.badges}>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '50px'
  },
  card: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
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
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #b52f2f, #8f2424)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.2em'
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
    fontSize: '0.95em',
    color: '#333',
    lineHeight: '1.6',
    margin: '16px 0',
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
  }
};

export default Testimonials;
