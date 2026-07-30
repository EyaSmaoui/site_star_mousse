import React from 'react';
import Breadcrumbs from '@components/shared/Breadcrumbs';

const PrivacyPolicy = () => {

  return (
    <div style={styles.page}>
      <Breadcrumbs />
      
      <div style={styles.container}>
        <h1 style={styles.title}>Politique de ConfidentialitÃ©</h1>
        
        <div style={styles.lastUpdated}>
          <strong>DerniÃ¨re mise Ã  jour :</strong> 1er juin 2026
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Introduction</h2>
          <p>
            Star Mousse ("nous", "notre" ou "nos") exploite le site web <strong>site-star-mousse.vercel.app</strong> (le "Site").
          </p>
          <p>
            Cette page explique nos politiques concernant la collecte, l'utilisation et la divulgation de vos donnÃ©es 
            personnelles lorsque vous utilisez notre Site et les choix que vous avez en ce qui concerne vos donnÃ©es.
          </p>
          <p>
            <strong>Nous nous engageons Ã  protÃ©ger votre vie privÃ©e.</strong> Si vous avez des questions concernant 
            nos pratiques de confidentialite, veuillez utiliser le formulaire de contact.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Informations Que Nous Collectons</h2>
          
          <h3 style={styles.subTitle}>2.1 Informations Fournies Directement</h3>
          <p>Nous collectons les informations que vous nous fournissez directement, notamment :</p>
          <ul style={styles.list}>
            <li><strong>Formulaire de Contact :</strong> Nom, email, tÃ©lÃ©phone, sujet, message</li>
            <li><strong>Demandes de Devis :</strong> Informations de contact et spÃ©cifications de produit</li>
            <li><strong>Abonnement Newsletter :</strong> Adresse email (Ã  venir)</li>
            <li><strong>Appels/WhatsApp/Email :</strong> Communications client-showroom</li>
          </ul>

          <h3 style={styles.subTitle}>2.2 Informations CollectÃ©es Automatiquement</h3>
          <p>Nous utilisons les technologies suivantes pour collecter des informations automatiquement :</p>
          <ul style={styles.list}>
            <li><strong>Cookies :</strong> DonnÃ©es de prÃ©fÃ©rence, session, tracking</li>
            <li><strong>Google Analytics 4 :</strong> Pages visitÃ©es, temps passÃ©, source du trafic, appareils, conversions</li>
            <li><strong>Logs de Serveur :</strong> Adresse IP, navigateur, pays, systÃ¨me d'exploitation</li>
            <li><strong>Ã‰vÃ©nements de Suivi :</strong> Clics sur WhatsApp, appels tÃ©lÃ©phoniques, consultations de produits</li>
          </ul>

          <h3 style={styles.subTitle}>2.3 Informations de Tiers</h3>
          <p>
            Nous pouvons recevoir des informations sur vous de la part de tiers, tels que des partenaires publicitaires, 
            des prestataires d'analyse de donnÃ©es, des fournisseurs de services de paiement, et d'autres fournisseurs.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Comment Nous Utilisons Vos Informations</h2>
          <p>Nous utilisons les informations que nous collectons pour :</p>
          <ul style={styles.list}>
            <li>Fournir, maintenir et amÃ©liorer nos produits et services</li>
            <li>RÃ©pondre Ã  vos demandes de contact et questions</li>
            <li>Envoyer des communications marketing (si vous vous y Ãªtes abonnÃ©)</li>
            <li>Mesurer la performance du site et l'expÃ©rience utilisateur</li>
            <li>Optimiser nos campagnes publicitaires et contenu</li>
            <li>PrÃ©venir la fraude et assurer la sÃ©curitÃ© du site</li>
            <li>Respecter les obligations lÃ©gales et rÃ©glementaires</li>
            <li>AmÃ©liorer nos produits et services en fonction de votre retour</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Partage de Vos Informations</h2>
          <p>
            Nous ne vendons, n'Ã©changeons et ne partageons pas vos informations personnelles avec des tiers, 
            sauf dans les cas suivants :
          </p>
          <ul style={styles.list}>
            <li><strong>Prestataires de Services :</strong> HÃ©bergement (Vercel), Analytics (Google), CDN, etc.</li>
            <li><strong>Obligations LÃ©gales :</strong> Si la loi l'exige ou pour protÃ©ger les droits de Star Mousse</li>
            <li><strong>Consentement :</strong> Avec votre consentement explicite</li>
            <li><strong>Fusion/Acquisition :</strong> En cas de vente ou fusion de Star Mousse</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Cookies et Technologies de Suivi</h2>
          
          <h3 style={styles.subTitle}>5.1 Qu'est-ce Qu'un Cookie ?</h3>
          <p>
            Un cookie est un petit fichier texte stockÃ© sur votre appareil lorsque vous visitez un site web. 
            Les cookies aident les sites Ã  se souvenir de vos prÃ©fÃ©rences et de votre historique.
          </p>

          <h3 style={styles.subTitle}>5.2 Nos Cookies</h3>
          <ul style={styles.list}>
            <li><strong>Essentiels :</strong> NÃ©cessaires au fonctionnement du site (session, authentification)</li>
            <li><strong>Analytics :</strong> Google Analytics 4 (mesure du trafic, comportement utilisateur)</li>
            <li><strong>PrÃ©fÃ©rences :</strong> Langue, thÃ¨me, paramÃ¨tres utilisateur</li>
          </ul>

          <h3 style={styles.subTitle}>5.3 Comment GÃ©rer Vos Cookies</h3>
          <p>
            Vous pouvez contrÃ´ler et/ou supprimer les cookies comme vous le souhaitez. Pour plus d'informations, 
            visitez <strong>www.aboutcookies.org</strong>. 
          </p>
          <p>
            Vous pouvez supprimer tous les cookies dÃ©jÃ  prÃ©sents sur votre ordinateur et configurer la plupart 
            des navigateurs pour empÃªcher leur installation. Cependant, cela peut vous forcer Ã  ajuster manuellement 
            certaines prÃ©fÃ©rences Ã  chaque visite d'un site.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. SÃ©curitÃ© des DonnÃ©es</h2>
          <p>
            Nous mettons en Å“uvre des mesures de sÃ©curitÃ© appropriÃ©es pour protÃ©ger vos donnÃ©es personnelles 
            contre l'accÃ¨s, la modification, la divulgation ou la destruction non autorisÃ©e.
          </p>
          <p>
            <strong>Mesures de sÃ©curitÃ© :</strong>
          </p>
          <ul style={styles.list}>
            <li>Chiffrement SSL/HTTPS pour toutes les transmissions de donnÃ©es</li>
            <li>HÃ©bergement sÃ©curisÃ© sur Vercel avec conformitÃ© SOC 2</li>
            <li>Pas de stockage de donnÃ©es sensibles (mots de passe, numÃ©ros de carte)</li>
            <li>AccÃ¨s limitÃ© aux donnÃ©es personnelles (personnel autorisÃ© uniquement)</li>
            <li>ContrÃ´les d'accÃ¨s et authentification forte</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Vos Droits</h2>
          <p>
            En vertu du RÃ¨glement GÃ©nÃ©ral sur la Protection des DonnÃ©es (RGPD) et des lois tunisiennes sur la protection 
            des donnÃ©es, vous avez les droits suivants :
          </p>
          <ul style={styles.list}>
            <li><strong>Droit d'AccÃ¨s :</strong> Vous pouvez demander une copie de vos donnÃ©es personnelles</li>
            <li><strong>Droit de Rectification :</strong> Vous pouvez corriger vos donnÃ©es inexactes</li>
            <li><strong>Droit Ã  l'Oubli :</strong> Vous pouvez demander la suppression de vos donnÃ©es</li>
            <li><strong>Droit Ã  la Limitation :</strong> Vous pouvez restreindre le traitement de vos donnÃ©es</li>
            <li><strong>Droit Ã  la PortabilitÃ© :</strong> Vous pouvez recevoir vos donnÃ©es dans un format courant</li>
            <li><strong>Droit d'Opposition :</strong> Vous pouvez vous opposer au traitement de vos donnÃ©es</li>
            <li><strong>Retrait du Consentement :</strong> Vous pouvez retirer votre consentement Ã  tout moment</li>
          </ul>
          <p>
            <strong>Pour exercer ces droits, contactez-nous :</strong> formulaire de contact.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>8. RÃ©tention des DonnÃ©es</h2>
          <p>
            Nous ne conservons vos donnÃ©es personnelles que pour la durÃ©e nÃ©cessaire Ã  la finalitÃ© pour laquelle 
            elles ont Ã©tÃ© collectÃ©es, sauf si la loi exige une pÃ©riode de conservation plus longue.
          </p>
          <ul style={styles.list}>
            <li><strong>Formulaire de Contact :</strong> 1 an</li>
            <li><strong>Demandes de Devis :</strong> 2 ans (obligation lÃ©gale)</li>
            <li><strong>Logs de Serveur :</strong> 90 jours</li>
            <li><strong>Google Analytics :</strong> 38 mois (paramÃ¨tre GA4 standard)</li>
            <li><strong>DonnÃ©es de Newsletter :</strong> Jusqu'Ã  dÃ©sinscription</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>9. Modifications de Cette Politique</h2>
          <p>
            Nous pouvons mettre Ã  jour cette Politique de ConfidentialitÃ© Ã  tout moment. Nous vous notifierons 
            de tout changement matÃ©riel en affichant la nouvelle politique sur le Site et en mettant Ã  jour la 
            date de "DerniÃ¨re mise Ã  jour" en haut de cette page.
          </p>
          <p>
            Votre utilisation continue du Site aprÃ¨s les changements signifie que vous acceptez la Politique de 
            ConfidentialitÃ© mise Ã  jour.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>10. Nous Contacter</h2>
          <p>
            Si vous avez des questions ou des prÃ©occupations concernant cette Politique de ConfidentialitÃ© ou 
            nos pratiques de confidentialitÃ©, veuillez nous contacter :
          </p>
          <div style={styles.contactInfo}>
            <p>
              <strong>Star Mousse</strong><br/>
              Contact: formulaire de contact<br/>
              ðŸ“ž TÃ©lÃ©phone: +216 22 900 131<br/>
              ðŸ’¬ WhatsApp: +216 22 900 207<br/>
              ðŸ“ Adresse: Borj Chakir, Tunis, Tunisie
            </p>
          </div>
        </section>

        <div style={styles.footer}>
          <p>
            Â© 2026 Star Mousse. Tous droits rÃ©servÃ©s. | 
            <a href="/legal-terms" style={styles.link}>Mentions LÃ©gales</a> | 
            <a href="/privacy-policy" style={styles.link}>Politique de ConfidentialitÃ©</a>
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
    borderLeft: '4px solid #b78b3f'
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
    color: '#b78b3f',
    textDecoration: 'none',
    marginLeft: '10px'
  }
};

export default PrivacyPolicy;



