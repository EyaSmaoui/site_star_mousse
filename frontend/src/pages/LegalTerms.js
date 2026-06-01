import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const LegalTerms = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <Breadcrumbs />
      
      <div style={styles.container}>
        <h1 style={styles.title}>Mentions Légales & Conditions Générales</h1>
        
        <div style={styles.lastUpdated}>
          <strong>Dernière mise à jour :</strong> 1er juin 2026
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Identification de l'Entreprise</h2>
          <div style={styles.contactInfo}>
            <p>
              <strong>Raison Sociale :</strong> Star Mousse<br/>
              <strong>Forme Juridique :</strong> Entreprise Individuelle<br/>
              <strong>Adresse :</strong> Borj Chakir, Tunis, Tunisie<br/>
              <strong>Téléphone :</strong> +216 22 900 131<br/>
              <strong>Contact :</strong> formulaire de contact<br/>
              <strong>Site Web :</strong> site-star-mousse.vercel.app
            </p>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Propriété Intellectuelle</h2>
          <p>
            Tous les contenus du Site, y compris mais non limités au texte, aux images, aux vidéos, 
            aux logiciels, à la musique et aux conceptions, sont la propriété exclusive de Star Mousse 
            ou de ses fournisseurs de contenu et sont protégés par les lois tunisiennes et internationales 
            sur le droit d'auteur.
          </p>
          <p>
            <strong>Vous n'êtes pas autorisé à :</strong>
          </p>
          <ul style={styles.list}>
            <li>Reproduire, distribuer ou transmettre le contenu du Site sans permission écrite</li>
            <li>Modifier, adapter ou créer des œuvres dérivées basées sur le contenu du Site</li>
            <li>Utiliser le contenu à des fins commerciales sans accord préalable</li>
            <li>Supprimer ou modifier les avis de droits d'auteur ou de propriété intellectuelle</li>
            <li>Accéder au Site via des moyens automatisés ou non autorisés (bots, scrapers, etc.)</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Responsabilité du Site</h2>
          <p>
            Star Mousse fait tous les efforts raisonnables pour assurer que les informations sur le Site 
            sont exactes et à jour. Cependant, nous ne garantissons pas l'exactitude, l'exhaustivité ou 
            l'actualité de toutes les informations.
          </p>
          <p>
            <strong>Le Site est fourni "tel quel" sans garantie d'aucune sorte.</strong>
          </p>
          <p>
            Star Mousse ne sera pas responsable de :
          </p>
          <ul style={styles.list}>
            <li>Les erreurs ou omissions dans le contenu du Site</li>
            <li>Les dommages indirects ou accessoires découlant de l'utilisation du Site</li>
            <li>L'indisponibilité temporaire du Site</li>
            <li>Les dommages causés par des virus ou programmes malveillants</li>
            <li>La perte de données ou d'informations</li>
            <li>Les actions ou omissions de tiers</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Conditions Générales d'Utilisation</h2>
          
          <h3 style={styles.subTitle}>4.1 Accès au Site</h3>
          <p>
            En accédant au Site, vous acceptez que Star Mousse et ses fournisseurs ne soient pas responsables 
            de l'indisponibilité temporaire du Site ou de la perte de données due à des circonstances indépendantes 
            de sa volonté.
          </p>

          <h3 style={styles.subTitle}>4.2 Utilisation Acceptable</h3>
          <p>
            Vous acceptez d'utiliser le Site uniquement à des fins légales et d'une manière qui ne viole pas 
            les droits d'autrui ou ne restreint pas leur utilisation ou leur jouissance du Site.
          </p>
          <p>
            Les comportements prohibés incluent :
          </p>
          <ul style={styles.list}>
            <li>Harceler ou causer du tort à d'autres utilisateurs</li>
            <li>Poster du contenu illégal, offensant ou discriminatoire</li>
            <li>Tenter d'accéder sans autorisation à des zones sécurisées</li>
            <li>Utiliser des langage abusif ou menaçant</li>
            <li>Spam ou sollicitation excessive</li>
            <li>Publier des informations privées d'autres personnes</li>
          </ul>

          <h3 style={styles.subTitle}>4.3 Comptes Utilisateur</h3>
          <p>
            Si vous créez un compte sur le Site, vous êtes responsable de maintenir la confidentialité 
            de votre mot de passe et de votre login. Vous acceptez de tous les engagements pris en votre nom 
            via votre compte.
          </p>

          <h3 style={styles.subTitle}>4.4 Modifications du Site</h3>
          <p>
            Star Mousse se réserve le droit de modifier ou d'interrompre le Site à tout moment sans préavis. 
            Nous ne serons pas responsables de toute modification, suspension ou interruption du Site.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Politique de Retour et Garantie</h2>
          
          <h3 style={styles.subTitle}>5.1 Garantie des Produits</h3>
          <p>
            Tous les matelas Star Mousse sont garantis <strong>10 ans</strong> contre les défauts de fabrication 
            et les défauts matériels.
          </p>

          <h3 style={styles.subTitle}>5.2 Conditions de Garantie</h3>
          <p>
            La garantie s'applique uniquement :
          </p>
          <ul style={styles.list}>
            <li>À l'acheteur original du produit</li>
            <li>Aux défauts de fabrication et de matériaux</li>
            <li>En cas d'utilisation normale du produit</li>
            <li>Avec preuve d'achat (facture ou reçu)</li>
          </ul>

          <h3 style={styles.subTitle}>5.3 Exclusions de Garantie</h3>
          <p>
            La garantie ne couvre pas :
          </p>
          <ul style={styles.list}>
            <li>Les dommages dus à une mauvaise utilisation ou à une utilisation anormale</li>
            <li>L'usure normale du produit</li>
            <li>Les dégâts dus à l'humidité, aux taches ou aux accidents</li>
            <li>Les modifications non autorisées du produit</li>
            <li>Les dommages du transport ou du stockage</li>
            <li>Les défauts dus à une exposition directe au soleil</li>
          </ul>

          <h3 style={styles.subTitle}>5.4 Procédure de Réclamation</h3>
          <p>
            Pour soumettre une réclamation sous garantie, veuillez :
          </p>
          <ol style={styles.list}>
            <li>Contacter Star Mousse par téléphone ou email dans les 30 jours suivant l'apparition du défaut</li>
            <li>Fournir une preuve d'achat</li>
            <li>Fournir une description détaillée du défaut</li>
            <li>Fournir des photos du défaut si possible</li>
          </ol>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Livraison et Paiement</h2>
          
          <h3 style={styles.subTitle}>6.1 Livraison</h3>
          <p>
            <strong>Livraison gratuite partout en Tunisie.</strong> Les délais de livraison estimés sont :
          </p>
          <ul style={styles.list}>
            <li><strong>Tunis et Ariana :</strong> 2-3 jours ouvrables</li>
            <li><strong>Autres régions :</strong> 3-5 jours ouvrables</li>
            <li><strong>Île de Djerba :</strong> 5-7 jours ouvrables</li>
          </ul>

          <h3 style={styles.subTitle}>6.2 Paiement</h3>
          <p>
            <strong>Paiement à la livraison.</strong> Aucun paiement n'est exigé à la commande. 
            Vous paierez le prix complet au livreur lors de la réception du produit.
          </p>
          <p>
            Nous acceptons les paiements en espèces uniquement lors de la livraison.
          </p>

          <h3 style={styles.subTitle}>6.3 Conditions de Livraison</h3>
          <p>
            Star Mousse se réserve le droit de refuser une livraison si :
          </p>
          <ul style={styles.list}>
            <li>L'adresse fournie est inexacte ou incomplète</li>
            <li>Le client n'est pas disponible pour réceptionner la commande</li>
            <li>Il y a un doute sur l'identité du client</li>
            <li>Il y a une raison de sécurité ou de sûreté</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Limitation de Responsabilité</h2>
          <p>
            <strong>SAUF DISPOSITIONS CONTRAIRES DE LA LOI, EN AUCUN CAS STAR MOUSSE NE SERA RESPONSABLE 
            DE DOMMAGES INDIRECTS, SPÉCIAUX, ACCIDENTELS OU PUNITIFS DÉCOULANT DE VOTRE UTILISATION 
            DU SITE OU DES PRODUITS, MÊME SI NOUS AVONS ÉTÉ AVISÉS DE LA POSSIBILITÉ DE TELS DOMMAGES.</strong>
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Liens Externes</h2>
          <p>
            Le Site peut contenir des liens vers d'autres sites web. Star Mousse n'est pas responsable du contenu, 
            de l'exactitude ou des pratiques de ces sites externes. L'accès à ces sites est à vos risques et périls.
          </p>
          <p>
            Nous vous encourageons à consulter les politiques de confidentialité de ces sites tiers avant 
            de partager vos informations personnelles.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>9. Conformité Légale</h2>
          
          <h3 style={styles.subTitle}>9.1 Loi Applicable</h3>
          <p>
            Ces Mentions Légales et Conditions Générales sont régies par et interprétées conformément aux lois 
            de la Tunisie. Vous acceptez de soumettre irrévocablement à la compétence exclusive des tribunaux 
            de Tunis.
          </p>

          <h3 style={styles.subTitle}>9.2 Conformité RGPD</h3>
          <p>
            Nous conformons à la compétence applicable en matière de protection des données, y compris le 
            Règlement Général sur la Protection des Données (RGPD) et les lois tunisiennes sur la protection 
            des données personnelles.
          </p>

          <h3 style={styles.subTitle}>9.3 Conformité E-Commerce</h3>
          <p>
            Nous respectons les dispositions de la Loi sur le Commerce Électronique et les pratiques commerciales 
            équitables en Tunisie.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>10. Résolution des Litiges</h2>
          <p>
            En cas de litige concernant le Site ou les produits, nous vous encourageons à nous contacter en premier 
            lieu pour résoudre la question à l'amiable.
          </p>
          <p>
            Si un accord à l'amiable ne peut être atteint, le litige sera soumis aux tribunaux compétents de Tunis.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>11. Contact pour les Questions Légales</h2>
          <p>
            Si vous avez des questions concernant ces Mentions Légales ou Conditions Générales, veuillez nous contacter :
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

export default LegalTerms;
