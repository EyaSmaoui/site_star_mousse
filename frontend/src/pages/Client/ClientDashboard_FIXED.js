// VERSION CORRIGÉE - Bouton qui répond correctement
// Cette version corrige le problème du bouton qui ne répond pas

// Remplacez dans ClientDashboard.js la section Profile Tab par celle-ci:

{/* Profile Tab */}
{activeTab === 'profile' && (
  <div style={S.content}>
    <div style={S.profileCard}>
      <h2 style={S.profileTitle}>📋 Modifier mon profil</h2>
      <div style={S.formGrid}>
        <div style={S.formGroup}>
          <label style={S.label}>Nom d'utilisateur</label>
          <input
            type="text"
            name="username"
            value={editedProfile.username}
            onChange={handleProfileChange}
            style={S.input}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-card-border)'}
          />
        </div>

        <div style={S.formGroup}>
          <label style={S.label}>Email (non modifiable)</label>
          <input
            type="email"
            value={profile.email}
            disabled
            style={{ ...S.input, opacity: 0.6, cursor: 'not-allowed' }}
          />
        </div>

        <div style={S.formGroup}>
          <label style={S.label}>Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={editedProfile.phone}
            onChange={handleProfileChange}
            style={S.input}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-card-border)'}
          />
        </div>

        <div style={{ ...S.formGroup, gridColumn: '1 / -1' }}>
          <label style={S.label}>Adresse</label>
          <textarea
            name="address"
            value={editedProfile.address}
            onChange={handleProfileChange}
            style={{ ...S.input, minHeight: '100px', resize: 'vertical' }}
            rows="4"
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-card-border)'}
          />
        </div>
      </div>

      <div style={S.buttonGroup}>
        <button
          type="button"
          disabled={isSaving}
          onClick={async () => {
            console.log('🔘 BOUTON CLIQUÉ - Enregistrement en cours...');
            await handleSaveProfile();
          }}
          style={{
            ...S.submitButton,
            opacity: isSaving ? 0.6 : 1,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!isSaving) {
              e.target.style.background = 'linear-gradient(135deg, #667eea 20%, #764ba2 80%)';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          {isSaving ? '⏳ Enregistrement en cours...' : '💾 Enregistrer les modifications'}
        </button>
      </div>
    </div>
  </div>
)}
