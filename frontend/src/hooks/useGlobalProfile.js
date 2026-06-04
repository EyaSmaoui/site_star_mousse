/**
 * Hook custom pour écouter les changements globaux du profil
 * À utiliser dans n'importe quel composant pour synchroniser le profil
 */

import { useEffect, useState } from 'react';
import { subscribeToProfileChanges, getCachedProfile } from '../services/profileSyncService';

export const useGlobalProfile = () => {
  const [profile, setProfile] = useState(() => getCachedProfile());

  useEffect(() => {
    // S'abonner aux changements de profil
    const unsubscribe = subscribeToProfileChanges((updatedProfile) => {
      console.log('🔄 Hook useGlobalProfile: Profil mis à jour globalement', updatedProfile);
      setProfile(updatedProfile);
    });

    // Se désabonner au démontage
    return () => unsubscribe();
  }, []);

  return profile;
};

export default useGlobalProfile;
