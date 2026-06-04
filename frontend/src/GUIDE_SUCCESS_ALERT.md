/**
 * GUIDE: Utiliser SuccessModal dans tous les formulaires
 * 
 * Chaque page avec ajout/modification/suppression doit afficher l'alerte Success!
 */

// ============ ÉTAPE 1: Importer dans votre composant ============

import { useSuccessAlert } from '../../hooks/useSuccessAlert';
import SuccessModal from '../../components/SuccessModal';

// ============ ÉTAPE 2: Initialiser le hook ============

const MyComponent = () => {
  const { isOpen, message, title, showSuccess, closeSuccess } = useSuccessAlert();
  
  // ... rest of your code
};

// ============ ÉTAPE 3: Ajouter le SuccessModal dans le JSX ============

return (
  <div>
    <SuccessModal 
      isOpen={isOpen} 
      title={title} 
      message={message}
      onClose={closeSuccess}
    />
    {/* ... rest of your JSX */}
  </div>
);

// ============ ÉTAPE 4: Appeler showSuccess() sur succès ============

try {
  await createSomething(data);
  showSuccess('Objet créé avec succès!', 'Succès!');
  // reset form
} catch (error) {
  toast.error(error.message);
}

// ============ EXEMPLES DE MESSAGES ============

// Pour CREATE (Créer)
showSuccess('L\'employé Mohamed a été créé avec succès!', 'Employé Créé!');
showSuccess('Le produit Matelas Premium a été ajouté!', 'Produit Ajouté!');

// Pour UPDATE (Modifier)
showSuccess('Votre profil a été mis à jour!', 'Profil Mis à Jour!');
showSuccess('Le stock a été modifié!', 'Stock Modifié!');

// Pour DELETE (Supprimer)
showSuccess('L\'employé a été supprimé!', 'Employé Supprimé!');
showSuccess('La commande a été annulée!', 'Commande Annulée!');

// Pour STATUT
showSuccess('Statut changé en "Actif"!', 'Statut Mis à Jour!');
