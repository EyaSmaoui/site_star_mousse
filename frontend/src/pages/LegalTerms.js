import React from 'react';
import Breadcrumbs from '.@@components/shared/Breadcrumbs';

const LegalTerms = () => {

  return (
    <div style={styles.page}>
      <Breadcrumbs />
      
      <div style={styles.container}>
        <h1 style={styles.title}>Mentions LÃ©gales & Conditions GÃ©nÃ©rales</h1>
        
        <div style={styles.lastUpdated}>
          <strong>DerniÃ¨re mise Ã  jour :</strong> 1er juin 2026
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Identification de l'Entreprise</h2>
          <div style={styles.contactInfo}>
            <p>
              <strong>Raison Sociale :</strong> Star Mousse<br/>
              <strong>Forme Juridique :</strong> Entreprise Individuelle<br/>
              <strong>Adresse :</strong> Borj Chakir, Tunis, Tunisie<br/>
              <strong>TÃ©lÃ©phone :</strong> +216 22 900 131<br/>
              <strong>Contact :</strong> formulaire de contact<br/>
              <strong>Site Web :</strong> site-star-mousse.vercel.app
            </p>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. PropriÃ©tÃ© Intellectuelle</h2>
          <p>
            Tous les contenus du Site, y compris mais non limitÃ©s au texte, aux images, aux vidÃ©os, 
            aux logiciels, Ã  la musique et aux conceptions, sont la propriÃ©tÃ© exclusive de Star Mousse 
            ou de ses fournisseurs de contenu et sont protÃ©gÃ©s par les lois tunisiennes et internationales 
            sur le droit d'auteur.
          </p>
          <p>
            <strong>Vous n'Ãªtes pas autorisÃ© Ã  :</strong>
          </p>
          <ul style={styles.list}>
            <li>Reproduire, distribuer ou transmettre le contenu du Site sans permission Ã©crite</li>
            <li>Modifier, adapter ou crÃ©er des Å“uvres dÃ©rivÃ©es basÃ©es sur le contenu du Site</li>
            <li>Utiliser le contenu Ã  des fins commerciales sans accord prÃ©alable</li>
            <li>Supprimer ou modifier les avis de droits d'auteur ou de propriÃ©tÃ© intellectuelle</li>
            <li>AccÃ©der au Site via des moyens automatisÃ©s ou non autorisÃ©s (bots, scrapers, etc.)</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. ResponsabilitÃ© du Site</h2>
          <p>
            Star Mousse fait tous les efforts raisonnables pour assurer que les informations sur le Site 
            sont exactes et Ã  jour. Cependant, nous ne garantissons pas l'exactitude, l'exhaustivitÃ© ou 
            l'actualitÃ© de toutes les informations.
          </p>
          <p>
            <strong>Le Site est fourni "tel quel" sans garantie d'aucune sorte.</strong>
          </p>
          <p>
            Star Mousse ne sera pas responsable de :
          </p>
          <ul style={styles.list}>
            <li>Les erreurs ou omissions dans le contenu du Site</li>
            <li>Les dommages indirects ou accessoires dÃ©coulant de l'utilisation du Site</li>
            <li>L'indisponibilitÃ© temporaire du Site</li>
            <li>Les dommages causÃ©s par des virus ou programmes malveillants</li>
            <li>La perte de donnÃ©es ou d'informations</li>
            <li>Les actions ou omissions de tiers</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Conditions GÃ©nÃ©rales d'Utilisation</h2>
          
          <h3 style={styles.subTitle}>4.1 AccÃ¨s au Site</h3>
          <p>
            En accÃ©dant au Site, vous acceptez que Star Mousse et ses fournisseurs ne soient pas responsables 
            de l'indisponibilitÃ© temporaire du Site ou de la perte de donnÃ©es due Ã  des circonstances indÃ©pendantes 
            de sa volontÃ©.
          </p>

          <h3 style={styles.subTitle}>4.2 Utilisation Acceptable</h3>
          <p>
            Vous acceptez d'utiliser le Site uniquement Ã  des fins lÃ©gales et d'une maniÃ¨re qui ne viole pas 
            les droits d'autrui ou ne restreint pas leur utilisation ou leur jouissance du Site.
          </p>
          <p>
            Les comportements prohibÃ©s incluent :
          </p>
          <ul style={styles.list}>
            <li>Harceler ou causer du tort Ã  d'autres utilisateurs</li>
            <li>Poster du contenu illÃ©gal, offensant ou discriminatoire</li>
            <li>Tenter d'accÃ©der sans autorisation Ã  des zones sÃ©curisÃ©es</li>
            <li>Utiliser des langage abusif ou menaÃ§ant</li>
            <li>Spam ou sollicitation excessive</li>
            <li>Publier des informations privÃ©es d'autres personnes</li>
          </ul>

          <h3 style={styles.subTitle}>4.3 Comptes Utilisateur</h3>
          <p>
            Si vous crÃ©ez un compte sur le Site, vous Ãªtes responsable de maintenir la confidentialitÃ© 
            de votre mot de passe et de votre login. Vous acceptez de tous les engagements pris en votre nom 
            via votre compte.
          </p>

          <h3 style={styles.subTitle}>4.4 Modifications du Site</h3>
          <p>
            Star Mousse se rÃ©serve le droit de modifier ou d'interrompre le Site Ã  tout moment sans prÃ©avis. 
            Nous ne serons pas responsables de toute modification, suspension ou interruption du Site.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Politique de Retour et Garantie</h2>
          
          <h3 style={styles.subTitle}>5.1 Garantie des Produits</h3>
          <p>
            Tous les matelas Star Mousse sont garantis <strong>10 ans</strong> contre les dÃ©fauts de fabrication 
            et les dÃ©fauts matÃ©riels.
          </p>

          <h3 style={styles.subTitle}>5.2 Conditions de Garantie</h3>
          <p>
            La garantie s'applique uniquement :
          </p>
          <ul style={styles.list}>
            <li>Ã€ l'acheteur original du produit</li>
            <li>Aux dÃ©fauts de fabrication et de matÃ©riaux</li>
            <li>En cas d'utilisation normale du produit</li>
            <li>Avec preuve d'achat (facture ou reÃ§u)</li>
          </ul>

          <h3 style={styles.subTitle}>5.3 Exclusions de Garantie</h3>
          <p>
            La garantie ne couvre pas :
          </p>
          <ul style={styles.list}>
            <li>Les dommages dus Ã  une mauvaise utilisation ou Ã  une utilisation anormale</li>
            <li>L'usure normale du produit</li>
            <li>Les dÃ©gÃ¢ts dus Ã  l'humiditÃ©, aux taches ou aux accidents</li>
            <li>Les modifications non autorisÃ©es du produit</li>
            <li>Les dommages du transport ou du stockage</li>
            <li>Les dÃ©fauts dus Ã  une exposition directe au soleil</li>
          </ul>

          <h3 style={styles.subTitle}>5.4 ProcÃ©dure de RÃ©clamation</h3>
          <p>
            Pour soumettre une rÃ©clamation sous garantie, veuillez :
          </p>
          <ol style={styles.list}>
            <li>Contacter Star Mousse par tÃ©lÃ©phone ou email dans les 30 jours suivant l'apparition du dÃ©faut</li>
            <li>Fournir une preuve d'achat</li>
            <li>Fournir une description dÃ©taillÃ©e du dÃ©faut</li>
            <li>Fournir des photos du dÃ©faut si possible</li>
          </ol>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Livraison et Paiement</h2>
          
          <h3 style={styles.subTitle}>6.1 Livraison</h3>
          <p>
            <strong>Livraison gratuite partout en Tunisie.</strong> Les dÃ©lais de livraison estimÃ©s sont :
          </p>
          <ul style={styles.list}>
            <li><strong>Tunis et Ariana :</strong> 2-3 jours ouvrables</li>
            <li><strong>Autres rÃ©gions :</strong> 3-5 jours ouvrables</li>
            <li><strong>ÃŽle de Djerba :</strong> 5-7 jours ouvrables</li>
          </ul>

          <h3 style={styles.subTitle}>6.2 Paiement</h3>
          <p>
            <strong>Paiement Ã  la livraison.</strong> Aucun paiement n'est exigÃ© Ã  la commande. 
            Vous paierez le prix complet au livreur lors de la rÃ©ception du produit.
          </p>
          <p>
            Nous acceptons les paiements en espÃ¨ces uniquement lors de la livraison.
          </p>

          <h3 style={styles.subTitle}>6.3 Conditions de Livraison</h3>
          <p>
            Star Mousse se rÃ©serve le droit de refuser une livraison si :
          </p>
          <ul style={styles.list}>
            <li>L'adresse fournie est inexacte ou incomplÃ¨te</li>
            <li>Le client n'est pas disponible pour rÃ©ceptionner la commande</li>
            <li>Il y a un doute sur l'identitÃ© du client</li>
            <li>Il y a une raison de sÃ©curitÃ© ou de sÃ»retÃ©</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Limitation de ResponsabilitÃ©</h2>
          <p>
            <strong>SAUF DISPOSITIONS CONTRAIRES DE LA LOI, EN AUCUN CAS STAR MOUSSE NE SERA RESPONSABLE 
            DE DOMMAGES INDIRECTS, SPÃ‰CIAUX, ACCIDENTELS OU PUNITIFS DÃ‰COULANT DE VOTRE UTILISATION 
            DU SITE OU DES PRODUITS, MÃŠME SI NOUS AVONS Ã‰TÃ‰ AVISÃ‰S DE LA POSSIBILITÃ‰ DE TELS DOMMAGES.</strong>
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Liens Externes</h2>
          <p>
            Le Site peut contenir des liens vers d'autres sites web. Star Mousse n'est pas responsable du contenu, 
            de l'exactitude ou des pratiques de ces sites externes. L'accÃ¨s Ã  ces sites est Ã  vos risques et pÃ©rils.
          </p>
          <p>
            Nous vous encourageons Ã  consulter les politiques de confidentialitÃ© de ces sites tiers avant 
            de partager vos informations personnelles.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>9. ConformitÃ© LÃ©gale</h2>
          
          <h3 style={styles.subTitle}>9.1 Loi Applicable</h3>
          <p>
            Ces Mentions LÃ©gales et Conditions GÃ©nÃ©rales sont rÃ©gies par et interprÃ©tÃ©es conformÃ©ment aux lois 
            de la Tunisie. Vous acceptez de soumettre irrÃ©vocablement Ã  la compÃ©tence exclusive des tribunaux 
            de Tunis.
          </p>

          <h3 style={styles.subTitle}>9.2 ConformitÃ© RGPD</h3>
          <p>
            Nous conformons Ã  la compÃ©tence applicable en matiÃ¨re de protection des donnÃ©es, y compris le 
            RÃ¨glement GÃ©nÃ©ral sur la Protection des DonnÃ©es (RGPD) et les lois tunisiennes sur la protection 
            des donnÃ©es personnelles.
          </p>

          <h3 style={styles.subTitle}>9.3 ConformitÃ© E-Commerce</h3>
          <p>
            Nous respectons les dispositions de la Loi sur le Commerce Ã‰lectronique et les pratiques commerciales 
            Ã©quitables en Tunisie.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>10. RÃ©solution des Litiges</h2>
          <p>
            En cas de litige concernant le Site ou les produits, nous vous encourageons Ã  nous contacter en premier 
            lieu pour rÃ©soudre la question Ã  l'amiable.
          </p>
          <p>
            Si un accord Ã  l'amiable ne peut Ãªtre atteint, le litige sera soumis aux tribunaux compÃ©tents de Tunis.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>11. Contact pour les Questions LÃ©gales</h2>
          <p>
            Si vous avez des questions concernant ces Mentions LÃ©gales ou Conditions GÃ©nÃ©rales, veuillez nous contacter :
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

export default LegalTerms;


