import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import '../styles/forms.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.name
      );

      // REDIRECT till login efter lyckad registrering
      navigate('/login', {
        state: { message: 'Registrering lyckades! Logga in.' }
      });

    } catch (err) {

      // Hantera olika error typer
      if (err.response?.status === 409) {
        setError('Email finns redan registrerad');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Registrering misslyckades. Försök igen.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Registrera</h2>

      {error && (
        <p className="error" style={{
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Namn
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </label>

        <label>
          E-post
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </label>

        <label>
          Lösenord
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            disabled={loading}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registrerar...' : 'Registrera'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Har redan konto? <Link to="/login">Logga in</Link>
      </p>
    </div>
  );
}
