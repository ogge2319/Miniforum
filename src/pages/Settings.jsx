// Settings.jsx – Sida för profil, samtycken, export och radering av konto
import { useState, useEffect } from 'react';
import {
  getConsents,
  updateConsents,
  exportData,
  deleteAccount
} from '../api/auth';
import { authApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/forms.css';

export default function Settings() {
  const [consents, setConsents] = useState({
    marketing: false,
    analytics: false
  });

  const { logout, user, setUser } = useAuth();


  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    profilePicture: ''
  });
  // Ingen filuppladdning, profilePicture är bara text
  const [deletePassword, setDeletePassword] = useState('');
  // Redirect immediately if user is null
  if (!user) return <Navigate to="/login" replace />;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');


  const navigate = useNavigate();

  useEffect(() => {
    loadConsents();
    loadProfile();
  }, [user]);

  const loadConsents = async () => {
    try {
      const data = await getConsents();
      setConsents(data.consents);
    } catch (error) {
      console.error('Failed to load consents:', error);
    }
  };


  const loadProfile = () => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || ''
      });
    }
  };

  const handleConsentChange = async (type) => {
    const newConsents = {
      ...consents,
      [type]: !consents[type]
    };
    setConsents(newConsents);

    try {
      await updateConsents(newConsents.marketing, newConsents.analytics);
      setMessage(`${type === 'marketing' ? 'Marketing' : 'Analytics'} samtycke uppdaterat`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Kunde inte uppdatera samtycke');
    }
  };


  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.put('/profile', {
        name: profileData.name,
        bio: profileData.bio,
        profilePicture: profileData.profilePicture
      });
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      setMessage('Profil uppdaterad!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Kunde inte uppdatera profil');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      await exportData();
      setMessage('Data exporterad framgångsrikt');
    } catch (error) {
      setMessage('Kunde inte exportera data');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm('Är du säker? Denna åtgärd kan inte ångras!')) {
      return;
    }

    setLoading(true);
    try {
      await deleteAccount(deletePassword);
      setUser(null); // Nollställ användaren direkt
      navigate('/login'); // Navigera till login-sidan
    } catch (error) {
      setMessage('Kunde inte radera konto. Kontrollera ditt lösenord.');
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="form-container">
      <h1>Privacy & Inställningar</h1>

      {message && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#dbeafe',
          borderRadius: '4px',
          color: '#1e40af'
        }}>
          {message}
        </div>
      )}

      <section style={{ marginBottom: '2rem' }}>
        <h2>Redigera Profil</h2>
        <form onSubmit={handleProfileUpdate}>
          <label style={{ display: 'block', marginBottom: '1rem' }}>
            <span style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Namn</span>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '1rem' }}>
            <span style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Bio</span>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              disabled={loading}
              rows={4}
              placeholder="Berätta något om dig själv..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '1rem' }}>
            <span style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Profilbild (text/URL)</span>
            <input
              type="text"
              value={profileData.profilePicture}
              onChange={e => setProfileData({ ...profileData, profilePicture: e.target.value })}
              placeholder="Länk eller text till profilbild"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              fontWeight: '500'
            }}
          >
            {loading ? 'Sparar...' : 'Spara Profil'}
          </button>
        </form>
      </section>


      <section style={{ marginBottom: '2rem' }}>
        <h2>Cookie Samtycken</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={consents.marketing}
              onChange={() => handleConsentChange('marketing')}
            />
            <span>Marketing Cookies</span>
          </label>
          <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: '#536471' }}>
            Ta emot uppdateringar om nya funktioner och erbjudanden
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={consents.analytics}
              onChange={() => handleConsentChange('analytics')}
            />
            <span>Analytics Cookies</span>
          </label>
          <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: '#536471' }}>
            Hjälp oss förbättra genom att dela anonym användningsdata
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Din Data</h2>
        <p>Ladda ner all din data i JSON-format (Dataportabilitet)</p>
        <button
          onClick={handleExport}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1d9bf0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Exporterar...' : 'Ladda ner min data'}
        </button>
      </section>

      <section style={{
        marginBottom: '2rem',
        padding: '1rem',
        border: '2px solid #ef4444',
        borderRadius: '4px'
      }}>
        <h2 style={{ color: '#ef4444' }}>Radera Konto</h2>
        <p>Radera permanent ditt konto och all associerad data</p>
        <form onSubmit={handleDelete}>
          <input
            type="password"
            placeholder="Ange lösenord för att bekräfta"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Raderar...' : 'Radera mitt konto'}
          </button>
        </form>
      </section>
    </div>
  );
}
