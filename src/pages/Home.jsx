// Home.jsx – Startsidan med lista över inlägg (feed)
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { getPosts, createPost, deletePost } from "../api/posts";
import PostCard from "../components/PostCard";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { socket, isConnected } = useSocket();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);                       // <-- lagt till
    } catch (err) {
      console.error("Fel vid hämtning av inlägg:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ladda endast posts om användaren är inloggad
    if (user) {
      loadPosts();
    }
  }, [user]);

  // Socket.IO real-time updates
  useEffect(() => {
    if (!socket) return;

    // Lyssna på nya posts
    socket.on('newPost', (newPost) => {
      console.log('📢 New post received:', newPost);
      setPosts(prevPosts => [newPost, ...prevPosts]);
    });

    // Lyssna på post updates (likes)
    socket.on('postUpdated', (updatedPost) => {
      console.log('📝 Post updated:', updatedPost);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === updatedPost._id ? { ...post, ...updatedPost } : post
        )
      );
    });

    // Lyssna på raderade posts
    socket.on('postDeleted', (postId) => {
      console.log('🗑️ Post deleted:', postId);
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    });

    // Cleanup
    return () => {
      socket.off('newPost');
      socket.off('postUpdated');
      socket.off('postDeleted');
    };
  }, [socket]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createPost({ title, content: body || "Ingen text" });
    setTitle("");
    setBody("");
    loadPosts();
  };

  const handleDelete = async (id) => {
    if (!confirm("Vill du verkligen ta bort inlägget?")) return;
    await deletePost(id);
    loadPosts();
  };

  // Visa loading medan auth kontrolleras
  if (authLoading) {
    return (
      <section className="stack">
        <p>Laddar...</p>
      </section>
    );
  }

  // Om inte inloggad, visa välkomstmeddelande
  if (!user) {
    return (
      <section className="stack" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h1>Välkommen till MiniForum</h1>
        <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>
          Du måste vara inloggad för att se och skapa inlägg.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link to="/login" className="btn" style={{ textDecoration: 'none' }}>
            Logga in
          </Link>
          <Link to="/register" className="btn" style={{ textDecoration: 'none', backgroundColor: 'var(--accent)' }}>
            Registrera
          </Link>
        </div>
      </section>
    );
  }

  // Om inloggad, visa forumet
  return (
    <section className="stack">
      <h1>Forumfeed</h1>

      {/* Skapa nytt inlägg */}
      <form className="form surface card" onSubmit={handleCreate}>
        <label className="label">Titel</label>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel på ditt inlägg"
        />
        <label className="label">Text (valfritt)</label>
        <textarea
          className="input"
          rows="3"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Skriv något..."
        />
        <button className="btn" type="submit">Publicera</button>
      </form>

      {/* Visa inlägg */}
      {loading ? (
        <p>Laddar inlägg...</p>
      ) : posts.length === 0 ? (
        <p>Inga inlägg än — bli först med att skriva något!</p>
      ) : (
        <div className="grid">
          {posts.map((p) => (
            <PostCard key={p._id} post={p} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
