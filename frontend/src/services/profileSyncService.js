export const PROFILE_CHANGED_EVENT = 'star-mousse:profile-changed';
export const PROFILE_SYNC_KEY = 'profileSync';

let profileListeners = [];

const readJson = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Erreur en lisant ${key}:`, error);
    return null;
  }
};

const normalizeProfile = (profile) => {
  if (!profile) return null;

  const currentUser = readJson('user');
  const id = profile.id || profile._id || currentUser?.id || currentUser?._id;

  return {
    ...(currentUser || {}),
    ...profile,
    id,
    _id: profile._id || id,
    name: profile.name || profile.username || currentUser?.name || '',
  };
};

const persistProfile = (profile) => {
  const normalizedProfile = normalizeProfile(profile);
  if (!normalizedProfile) return null;

  localStorage.setItem('profileData', JSON.stringify(normalizedProfile));
  localStorage.setItem('user', JSON.stringify(normalizedProfile));
  return normalizedProfile;
};

export const subscribeToProfileChanges = (callback) => {
  profileListeners.push(callback);

  return () => {
    profileListeners = profileListeners.filter((listener) => listener !== callback);
  };
};

export const notifyProfileChanged = (updatedProfile) => {
  const profile = persistProfile(updatedProfile);
  if (!profile) return;

  profileListeners.forEach((callback) => {
    try {
      callback(profile);
    } catch (error) {
      console.error('Erreur dans un listener de profil:', error);
    }
  });

  window.dispatchEvent(new CustomEvent(PROFILE_CHANGED_EVENT, { detail: profile }));
  window.dispatchEvent(new CustomEvent('user-logged-in', { detail: profile }));
  try {
    localStorage.setItem(PROFILE_SYNC_KEY, Date.now().toString());
  } catch (error) {
    console.error('Erreur en écrivant le signal de sync profil :', error);
  }
};

const handleStorageProfileSync = (event) => {
  if (!event?.key) return;
  if (event.key === PROFILE_SYNC_KEY) {
    const profile = getCachedProfile();
    if (!profile) return;

    profileListeners.forEach((callback) => {
      try {
        callback(profile);
      } catch (error) {
        console.error('Erreur dans un listener de profil lors du signal de sync:', error);
      }
    });

    window.dispatchEvent(new CustomEvent(PROFILE_CHANGED_EVENT, { detail: profile }));
    window.dispatchEvent(new CustomEvent('user-logged-in', { detail: profile }));
    return;
  }
  if (event.key !== 'profileData' && event.key !== 'user') return;
  if (!event.newValue) return;

  try {
    const storageProfile = JSON.parse(event.newValue);
    const normalizedProfile = normalizeProfile(storageProfile);
    if (!normalizedProfile) return;

    const currentProfile = getCachedProfile();
    if (JSON.stringify(currentProfile) === JSON.stringify(normalizedProfile)) return;

    const profile = persistProfile(normalizedProfile);
    if (!profile) return;

    profileListeners.forEach((callback) => {
      try {
        callback(profile);
      } catch (error) {
        console.error('Erreur dans un listener de profil lors de sync storage:', error);
      }
    });

    window.dispatchEvent(new CustomEvent(PROFILE_CHANGED_EVENT, { detail: profile }));
    window.dispatchEvent(new CustomEvent('user-logged-in', { detail: profile }));
  } catch (error) {
    console.error('Erreur lors de la synchronisation du profil via storage:', error);
  }
};

window.addEventListener('storage', handleStorageProfileSync);

export const getCachedProfile = () => readJson('profileData') || readJson('user');

export const clearProfileListeners = () => {
  profileListeners = [];
  localStorage.removeItem('profileData');
};
