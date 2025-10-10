// PostCard.jsx – Visar kort info om ett foruminlägg (titel, författare, datum)

import { Link } from "react-router-dom"
import { formatDate } from "../utils/formatDate"

export default function PostCard({ post, onDelete }) {
    return (
        <article className="surface card stack">
            <header className="flex space-between">
            <h2>{post.title}</h2>
            <small className="text-muted">{formatDate(post.createdAt)}</small>
            </header>
            <p>{post.excerpt}</p>

            <div style={{ display: "flex", gap: "8px"}}>
                <Link className="btn-secondary" to={`/posts/${post.id}`}>Öppna</Link>
                <button className="btn danger" onClick={() => onDelete(post.id)}>
                    Ta bort
                </button>
            </div>
        </article>
    );
}