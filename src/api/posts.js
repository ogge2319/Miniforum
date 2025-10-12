// src/api/posts.js
import { api } from "./client";

// LISTA INLÄGG
export const getPosts = async () => {
  const res = await api.get("/posts");
  return res.data;
};

// HÄMTA ETT INLÄGG
export const getPostById = async (id) => {
  const res = await api.get(`/posts/${id}`);
  return res.data;
};

// SKAPA INLÄGG
export const createPost = async (data) => {
  const res = await api.post("/posts", data);
  return res.data;
};

// TA BORT INLÄGG
export const deletePost = async (id) => {
  await api.delete(`/posts/${id}`);
};

// KOMMENTARER: LISTA
export const getComments = async (postId) => {
  const res = await api.get(`/posts/${postId}/comments`);
  return res.data;
};

// KOMMENTARER: SKAPA
export const createComment = async (postId, data) => {
  const res = await api.post(`/posts/${postId}/comments`, data);
  return res.data;
};
