
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/api/search?q=${encodeURIComponent(query)}`, { withCredentials: true });
            setResults(res.data);
        } catch (err) {
            setError('Något gick fel vid sökning.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-search">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Sök användare..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <button type="submit" disabled={loading}>Sök</button>
            </form>
            {loading && <p>Söker...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {results.map(user => (
                    <li key={user._id}>
                        <Link
                            to={`/profile/${user._id}`}
                            style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}
                            onClick={() => {
                                setResults([]);
                                setQuery("");
                            }}
                        >
                            {user.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserSearch;
