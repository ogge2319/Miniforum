import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/forms.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Visa meddelande från registrering
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Efter lyckad login, navigera till home
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Felaktigt email eller lösenord');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Logga in</h2>

      {successMessage && (
        <p style={{
          backgroundColor: '#d1fae5',
          color: '#065f46',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {successMessage}
        </p>
      )}

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          E-post
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </label>
        <label>
          Lösenord
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Loggar in...' : 'Logga in'}
        </button>
      </form>
    </div>
  );
}
