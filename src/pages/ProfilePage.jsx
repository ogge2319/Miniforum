// ProfilePage.jsx - Visa användarprofil och deras inlägg
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserPlus, UserMinus } from 'lucide-react';
import { authApi, domainApi } from '../api/client';
import { toggleFollow } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import '../styles/forms.css';

export default function ProfilePage() {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, [userId]);

    const loadProfile = async () => {
        setLoading(true);
        setError('');

        try {
            // Hämta användarinfo
            const userResponse = await authApi.get(`/users/${userId}`);
            const userData = userResponse.data;
            setUser(userData);
            setIsFollowing(userData.isFollowing || false);
            setFollowersCount(userData.followersCount || 0);
            setFollowingCount(userData.followingCount || 0);

            // Hämta användarens posts
            const postsResponse = await domainApi.get(`/posts/user/${userId}`);

            // Om tom array returneras = privat profil
            if (Array.isArray(postsResponse.data) && postsResponse.data.length === 0) {
                setIsPrivate(true);
                setPosts([]);
            } else {
                setPosts(postsResponse.data);
                setIsPrivate(false);
            }

        } catch (err) {
            console.error('Profile load error:', err);
            if (err.response?.status === 403) {
                setIsPrivate(true);
            } else {
                setError('Kunde inte ladda profil');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        if (followLoading || !currentUser) return;

        setFollowLoading(true);
        const wasFollowing = isFollowing;
        const prevCount = followersCount;

        // Optimistic update
        setIsFollowing(!isFollowing);
        setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);

        try {
            const result = await toggleFollow(userId);
            setIsFollowing(result.following);
            setFollowersCount(result.followersCount);
        } catch (error) {
            // Revert on error
            setIsFollowing(wasFollowing);
            setFollowersCount(prevCount);
            console.error('Follow failed:', error);
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="form-container">
                <p>Laddar profil...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="form-container">
                <p className="error">{error}</p>
                <Link to="/">Tillbaka till hem</Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Profil Header */}
            <div style={{
                backgroundColor: 'var(--card-bg)',
                padding: '2rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                borderLeft: '4px solid var(--accent)'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            color: 'white',
                            fontWeight: 'bold'
                        }}>
                            {user?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                            <h1 style={{ margin: 0 }}>{user?.name || 'Okänd användare'}</h1>
                            <p style={{ margin: '0.5rem 0', color: 'var(--text)' }}>
                                {user?.email || 'Ingen email'}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)' }}>
                                Medlem sedan {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('sv-SE') : 'Okänt'}
                            </p>
                            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem' }}>
                                <span><strong>{followersCount}</strong> Följare</span>
                                <span><strong>{followingCount}</strong> Följer</span>
                            </div>
                        </div>
                    </div>

                    {/* Follow Button - endast visa om inte din egen profil */}
                    {currentUser && currentUser._id !== userId && (
                        <button
                            onClick={handleFollow}
                            disabled={followLoading}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '9999px',
                                border: 'none',
                                fontWeight: '600',
                                cursor: followLoading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backgroundColor: isFollowing ? 'transparent' : 'var(--accent)',
                                color: isFollowing ? 'var(--accent)' : 'white',
                                border: isFollowing ? '1px solid var(--accent)' : 'none'
                            }}
                        >
                            {isFollowing ? <UserMinus size={18} /> : <UserPlus size={18} />}
                            {followLoading ? 'Laddar...' : isFollowing ? 'Sluta följa' : 'Följ'}
                        </button>
                    )}
                </div>
            </div>

            {/* Inlägg sektion */}
            <div>
                <h2 style={{ marginBottom: '1rem' }}>Inlägg av {user?.name}</h2>

                {isPrivate ? (
                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        padding: '3rem 2rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: '2px dashed var(--border)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                        <h3>This profile is private</h3>
                        <p style={{ color: 'var(--text)', marginTop: '0.5rem' }}>
                            Denna användare har valt att hålla sin profil privat.
                        </p>
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        padding: '2rem',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <p>Inga inlägg att visa ännu.</p>
                    </div>
                ) : (
                    <div className="grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {posts.map((post) => (
                            <PostCard key={post._id} post={post} onDelete={() => { }} />
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '2rem' }}>
                <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                    ← Tillbaka till forum
                </Link>
            </div>
        </div>
    );
}
