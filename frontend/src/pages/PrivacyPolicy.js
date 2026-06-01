import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <Breadcrumbs />
      
      <div style={styles.container}>
        <h1 style={styles.title}>Politique de Confidentialité</h1>
        
        <div style={styles.lastUpdated}>
          <strong>Dernière mise à jour :</strong> 1er juin 2026
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Introduction</h2>
          <p>
            Star Mousse ("nous", "notre" ou "nos") exploite le site web <strong>site-star-mousse.vercel.app</strong> (le "Site").
          </p>
          <p>
            Cette page explique nos politiques concernant la collecte, l'utilisation et la divulgation de vos données 
            personnelles lorsque vous utilisez notre Site et les choix que vous avez en ce qui concerne vos données.
          </p>
          <p>
            <strong>Nous nous engageons à protéger votre vie privée.</strong> Si vous avez des questions concernant 
            nos pratiques de confidentialite, veuillez utiliser le formulaire de contact.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Informations Que Nous Collectons</h2>
          
          <h3 style={styles.subTitle}>2.1 Informations Fournies Directement</h3>
          <p>Nous collectons les informations que vous nous fournissez directement, notamment :</p>
          <ul style={styles.list}>
            <li><strong>Formulaire de Contact :</strong> Nom, email, téléphone, sujet, message</li>
            <li><strong>Demandes de Devis :</strong> Informations de contact et spécifications de produit</li>
            <li><strong>Abonnement Newsletter :</strong> Adresse email (à venir)</li>
            <li><strong>Appels/WhatsApp/Email :</strong> Communications client-showroom</li>
          </ul>

          <h3 style={styles.subTitle}>2.2 Informations Collectées Automatiquement</h3>
          <p>Nous utilisons les technologies suivantes pour collecter des informations automatiquement :</p>
          <ul style={styles.list}>
            <li><strong>Cookies :</strong> Données de préférence, session, tracking</li>
            <li><strong>Google Analytics 4 :</strong> Pages visitées, temps passé, source du trafic, appareils, conversions</li>
            <li><strong>Logs de Serveur :</strong> Adresse IP, navigateur, pays, système d'exploitation</li>
            <li><strong>Événements de Suivi :</strong> Clics sur WhatsApp, appels téléphoniques, consultations de produits</li>
          </ul>

          <h3 style={styles.subTitle}>2.3 Informations de Tiers</h3>
          <p>
            Nous pouvons recevoir des informations sur vous de la part de tiers, tels que des partenaires publicitaires, 
            des prestataires d'analyse de données, des fournisseurs de services de paiement, et d'autres fournisseurs.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Comment Nous Utilisons Vos Informations</h2>
          <p>Nous utilisons les informations que nous collectons pour :</p>
          <ul style={styles.list}>
            <li>Fournir, maintenir et améliorer nos produits et services</li>
            <li>Répondre à vos demandes de contact et questions</li>
            <li>Envoyer des communications marketing (si vous vous y êtes abonné)</li>
            <li>Mesurer la performance du site et l'expérience utilisateur</li>
            <li>Optimiser nos campagnes publicitaires et contenu</li>
            <li>Prévenir la fraude et assurer la sécurité du site</li>
            <li>Respecter les obligations légales et réglementaires</li>
            <li>Améliorer nos produits et services en fonction de votre retour</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Partage de Vos Informations</h2>
          <p>
            Nous ne vendons, n'échangeons et ne partageons pas vos informations personnelles avec des tiers, 
            sauf dans les cas suivants :
          </p>
          <ul style={styles.list}>
            <li><strong>Prestataires de Services :</strong> Hébergement (Vercel), Analytics (Google), CDN, etc.</li>
            <li><strong>Obligations Légales :</strong> Si la loi l'exige ou pour protéger les droits de Star Mousse</li>
            <li><strong>Consentement :</strong> Avec votre consentement explicite</li>
            <li><strong>Fusion/Acquisition :</strong> En cas de vente ou fusion de Star Mousse</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Cookies et Technologies de Suivi</h2>
          
          <h3 style={styles.subTitle}>5.1 Qu'est-ce Qu'un Cookie ?</h3>
          <p>
            Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. 
            Les cookies aident les sites à se souvenir de vos préférences et de votre historique.
          </p>

          <h3 style={styles.subTitle}>5.2 Nos Cookies</h3>
          <ul style={styles.list}>
            <li><strong>Essentiels :</strong> Nécessaires au fonctionnement du site (session, authentification)</li>
            <li><strong>Analytics :</strong> Google Analytics 4 (mesure du trafic, comportement utilisateur)</li>
            <li><strong>Préférences :</strong> Langue, thème, paramètres utilisateur</li>
          </ul>

          <h3 style={styles.subTitle}>5.3 Comment Gérer Vos Cookies</h3>
          <p>
            Vous pouvez contrôler et/ou supprimer les cookies comme vous le souhaitez. Pour plus d'informations, 
            visitez <strong>www.aboutcookies.org</strong>. 
          </p>
          <p>
            Vous pouvez supprimer tous les cookies déjà présents sur votre ordinateur et configurer la plupart 
            des navigateurs pour empêcher leur installation. Cependant, cela peut vous forcer à ajuster manuellement 
            certaines préférences à chaque visite d'un site.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Sécurité des Données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles 
            contre l'accès, la modification, la divulgation ou la destruction non autorisée.
          </p>
          <p>
            <strong>Mesures de sécurité :</strong>
          </p>
          <ul style={styles.list}>
            <li>Chiffrement SSL/HTTPS pour toutes les transmissions de données</li>
            <li>Hébergement sécurisé sur Vercel avec conformité SOC 2</li>
            <li>Pas de stockage de données sensibles (mots de passe, numéros de carte)</li>
            <li>Accès limité aux données personnelles (personnel autorisé uniquement)</li>
            <li>Contrôles d'accès et authentification forte</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Vos Droits</h2>
          <p>
            En vertu du Règlement Général sur la Protection des Données (RGPD) et des lois tunisiennes sur la protection 
            des données, vous avez les droits suivants :
          </p>
          <ul style={styles.list}>
            <li><strong>Droit d'Accès :</strong> Vous pouvez demander une copie de vos données personnelles</li>
            <li><strong>Droit de Rectification :</strong> Vous pouvez corriger vos données inexactes</li>
            <li><strong>Droit à l'Oubli :</strong> Vous pouvez demander la suppression de vos données</li>
            <li><strong>Droit à la Limitation :</strong> Vous pouvez restreindre le traitement de vos données</li>
            <li><strong>Droit à la Portabilité :</strong> Vous pouvez recevoir vos données dans un format courant</li>
            <li><strong>Droit d'Opposition :</strong> Vous pouvez vous opposer au traitement de vos données</li>
            <li><strong>Retrait du Consentement :</strong> Vous pouvez retirer votre consentement à tout moment</li>
          </ul>
          <p>
            <strong>Pour exercer ces droits, contactez-nous :</strong> formulaire de contact.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Rétention des Données</h2>
          <p>
            Nous ne conservons vos données personnelles que pour la durée nécessaire à la finalité pour laquelle 
            elles ont été collectées, sauf si la loi exige une période de conservation plus longue.
          </p>
          <ul style={styles.list}>
            <li><strong>Formulaire de Contact :</strong> 1 an</li>
            <li><strong>Demandes de Devis :</strong> 2 ans (obligation légale)</li>
            <li><strong>Logs de Serveur :</strong> 90 jours</li>
            <li><strong>Google Analytics :</strong> 38 mois (paramètre GA4 standard)</li>
            <li><strong>Données de Newsletter :</strong> Jusqu'à désinscription</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>9. Modifications de Cette Politique</h2>
          <p>
            Nous pouvons mettre à jour cette Politique de Confidentialité à tout moment. Nous vous notifierons 
            de tout changement matériel en affichant la nouvelle politique sur le Site et en mettant à jour la 
            date de "Dernière mise à jour" en haut de cette page.
          </p>
          <p>
            Votre utilisation continue du Site après les changements signifie que vous acceptez la Politique de 
            Confidentialité mise à jour.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>10. Nous Contacter</h2>
          <p>
            Si vous avez des questions ou des préoccupations concernant cette Politique de Confidentialité ou 
            nos pratiques de confidentialité, veuillez nous contacter :
          </p>
          <div style={styles.contactInfo}>
            <p>
              <strong>Star Mousse</strong><br/>
              Contact: formulaire de contact<br/>
              📞 Téléphone: +216 22 900 131<br/>
              💬 WhatsApp: +216 22 900 207<br/>
              📍 Adresse: Borj Chakir, Tunis, Tunisie
            </p>
          </div>
        </section>

        <div style={styles.footer}>
          <p>
            © 2026 Star Mousse. Tous droits réservés. | 
            <a href="/legal-terms" style={styles.link}>Mentions Légales</a> | 
            <a href="/privacy-policy" style={styles.link}>Politique de Confidentialité</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: '#fbfaf8',
    minHeight: '100vh',
    paddingTop: '20px',
    paddingBottom: '40px',
    fontFamily: 'DM Sans, sans-serif'
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    lineHeight: '1.7'
  },
  title: {
    fontSize: '2.5em',
    color: '#151522',
    marginBottom: '10px',
    fontWeight: '700'
  },
  lastUpdated: {
    color: '#999',
    fontSize: '0.9em',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee'
  },
  section: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '1.5em',
    color: '#151522',
    marginBottom: '15px',
    fontWeight: '600',
    paddingTop: '20px'
  },
  subTitle: {
    fontSize: '1.15em',
    color: '#333',
    marginTop: '20px',
    marginBottom: '10px',
    fontWeight: '600'
  },
  list: {
    marginLeft: '20px',
    marginTop: '10px'
  },
  contactInfo: {
    background: '#fbfaf8',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '15px',
    borderLeft: '4px solid #b52f2f'
  },
  footer: {
    marginTop: '50px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
    textAlign: 'center',
    color: '#999',
    fontSize: '0.9em'
  },
  link: {
    color: '#b52f2f',
    textDecoration: 'none',
    marginLeft: '10px'
  }
};

export default PrivacyPolicy;
