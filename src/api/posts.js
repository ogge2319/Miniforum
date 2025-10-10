// posts.js – API-anrop för att hämta, skapa, uppdatera och ta bort foruminlägg


import { api } from "./client"

//Hämta alla inlägg
export const getPosts = async () => {
    const res = await api.get("/posts");
    return res.data;
};

//Skapa nytt inlägg
export const createPost = async () => {
    const res = await api.post("/posts", data);
    return res.data;
};

//Ta bort inlägg
export const deletePost = async () => {
    await api.delete(`/posts/${id}`);
}