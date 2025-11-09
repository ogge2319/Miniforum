import { Link } from "react-router-dom";
import { useState } from "react";
import { Heart, Trash2, ExternalLink, Share2 } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { toggleLike } from "../api/posts";
import styles from "./PostCard.module.css";

export default function PostCard({ post, onDelete, onLike }) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = async () => {
    if (loading) return;

    setLoading(true);
    const previousLiked = isLiked;
    const previousCount = likeCount;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      const result = await toggleLike(post._id);
      setIsLiked(result.liked);
      setLikeCount(result.likes);
      if (onLike) onLike(post._id, result);
    } catch (error) {
      // Revert på error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      console.error('Like failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/posts/${post._id}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Kunde inte kopiera länken');
    }
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h2>{post.title}</h2>
        <small className={styles.date}>{formatDate(post.createdAt)}</small>
      </header>

      <p className={styles.excerpt}>{post.content}</p>

      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${isLiked ? styles.btnLiked : styles.btnSecondary}`}
          onClick={handleLike}
          disabled={loading}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{likeCount}</span>
        </button>

        <button
          className={`${styles.btn} ${copied ? styles.btnSuccess : styles.btnSecondary}`}
          onClick={handleShare}
          title="Kopiera länk"
        >
          <Share2 size={16} />
          {copied ? 'Kopierad!' : 'Dela'}
        </button>

        <Link className={`${styles.btn} ${styles.btnSecondary}`} to={`/posts/${post._id}`}>
          <ExternalLink size={16} />
          Öppna
        </Link>

        <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => onDelete(post._id)}>
          <Trash2 size={16} />
          Ta bort
        </button>
      </div>
    </article>
  );
}
