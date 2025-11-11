// HÄMTA INLÄGG FÖR EN ANVÄNDARE
export const getUserPosts = async (userId) => {
  const res = await domainApi.get(`/posts/user/${userId}`);
  return res.data;
};

// HÄMTA FEED (egna + följda)
export const getFeedPosts = async () => {
  const res = await domainApi.get('/posts/feed');
  return res.data;
};
// src/api/posts.js
import { domainApi } from "./client";

// LISTA INLÄGG
export const getPosts = async () => {
  const res = await domainApi.get("/posts");
  return res.data;
};

// HÄMTA ETT INLÄGG
export const getPostById = async (id) => {
  const res = await domainApi.get(`/posts/${id}`);
  return res.data;
};

// SKAPA INLÄGG
export const createPost = async (data) => {
  const res = await domainApi.post("/posts", data);
  return res.data;
};

// TA BORT INLÄGG
export const deletePost = async (id) => {
  await domainApi.delete(`/posts/${id}`);
};

// KOMMENTARER: LISTA
export const getComments = async (postId) => {
  const res = await domainApi.get(`/posts/${postId}/comments`);
  return res.data;
};

// KOMMENTARER: SKAPA
export const createComment = async (postId, data) => {
  const res = await domainApi.post(`/posts/${postId}/comments`, data);
  return res.data;
};

// LIKE: TOGGLE
export const toggleLike = async (postId) => {
  const res = await domainApi.post(`/posts/${postId}/like`);
  return res.data;
};
