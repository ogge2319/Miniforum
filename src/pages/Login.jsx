import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/forms.css';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      // Efter lyckad login kan du t.ex. navigera till Home
      // navigate('/');
    } catch (err) {
      setError(err.message || 'Något gick fel');
    }
  };

  return (
    <div className="form-container">
      <h2>Logga in</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          E-post
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Lösenord
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Logga in</button>
      </form>
    </div>
  );
}
