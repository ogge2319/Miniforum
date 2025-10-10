// Home.jsx – Startsidan med lista över inlägg (feed)
import { useEffect, useState } from "react";
import { getPosts, createPost, deletePost } from "../api/posts";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);   // <-- ändrat: posts
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
    loadPosts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createPost({ title, excerpt: body || "Ingen text" });
    setTitle("");
    setBody("");
    loadPosts();
  };

  const handleDelete = async (id) => {
    if (!confirm("Vill du verkligen ta bort inlägget?")) return;
    await deletePost(id);
    loadPosts();
  };

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
            <PostCard key={p.id} post={p} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
