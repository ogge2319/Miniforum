import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import styles from "./PostCard.module.css";

export default function PostCard({ post, onDelete }) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h2>{post.title}</h2>
        <small className={styles.date}>{formatDate(post.createdAt)}</small>
      </header>

      <p className={styles.excerpt}>{post.excerpt}</p>

      <div className={styles.actions}>
        <Link className={`${styles.btn} ${styles.btnSecondary}`} to={`/posts/${post.id}`}>
          Öppna
        </Link>
        <button className={styles.btn} onClick={() => onDelete(post.id)}>
          Ta bort
        </button>
      </div>
    </article>
  );
}
