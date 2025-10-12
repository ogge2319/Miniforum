// PostDetail.jsx – Visar ett specifikt inlägg och dess kommentarer
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById, getComments, createComment } from "../api/posts";
import { formatDate } from "../utils/formatDate";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    try {
      const [p, c] = await Promise.all([getPostById(id), getComments(id)]);
      setPost(p);
      setComments(Array.isArray(c) ? c : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function onSubmit(e) {
    e.preventDefault();

    if (!text.trim()) return;
    const optimistic = {
      id: "tmp-" + Date.now(),
      postId: id,
      body: text,
      createdAt: new Date().toISOString(),
    };
    setComments(prev => [optimistic, ...prev]);
    setText("");
    try {
      const saved = await createComment(id, { body: optimistic.body });
      setComments(prev => [saved, ...prev.filter(c => c.id !== optimistic.id)]);
    } catch {
      setComments(prev => prev.filter(c => c.id !== optimistic.id));
      alert("Kunde inte spara kommentaren");
    }
  }

  if (loading) return <p>Laddar...</p>
  if (!post) return <p>Inlägget hittades inte.</p>

  return (
    <section className="stack">
      <article className="surface card stack">
        <h1>{post.title}</h1>
        {post.excerpt && <p className="text-muted"></p>}
        <small className="text-muted">{formatDate(post.createdAt)}</small>
      </article>

      <form className="form surface card" onSubmit={onSubmit}>
        <label className="label">Ny kommentar</label>
        <textarea
          className="input"
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Skriv en kommentar"
        />
        <button className="btn">Skicka</button>
      </form>
      <div className="stack">
        {comments.length === 0 ? (
          <p>Inga kommentarer än</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="surface card">
              <p>{c.body}</p>
              <small className="text-muted">{formatDate(c.createdAt)}</small>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
