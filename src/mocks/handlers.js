import { http, HttpResponse } from "msw";

function loadState() {
  try {
    const p = JSON.parse(localStorage.getItem("mock_posts") || "null");
    const c = JSON.parse(localStorage.getItem("mock_comments") || "null");
    if (Array.isArray(p)) posts = p;
    if (c && typeof c === "object") commentByPost = c;
  } catch { }
}

function saveState() {
  try {
    localStorage.setItem("mock_posts", JSON.stringify(posts));
    localStorage.setItem("mock_comments", JSON.stringify(commentByPost));
  } catch { }
}

let posts = [
  { id: "1", title: "Välkommen till MiniForum!", excerpt: "Första testinlägget", createdAt: new Date().toISOString() },
  { id: "2", title: "GDPR Export", excerpt: "Så funkar export i appen", createdAt: new Date().toISOString() },
];

let commentByPost = {
  "1": [{ id: "c1", postId: "1", body: "Hej MiniForum!", createdAt: new Date().toISOString() }],
  "2": [],
};

loadState();

let me = {
  id: "u1",
  email: "demo@miniforum.dev",
  displayName: "Demo",
  roles: ["user"],
  consents: { essential: true, analytics: false },
};

export const handlers = [
  // ----- Forum
  http.get("/posts", () => HttpResponse.json(posts)),

  http.get("/posts/:id", ({ params }) => {
    const post = posts.find((p) => p.id === params.id);
    return post
      ? HttpResponse.json(post)
      : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  // ----- Kommentarer 
  http.get("/posts/:id/comments", ({ params }) => {
    return HttpResponse.json(commentByPost[params.id] || []);
  }),

  http.post("/posts/:id/comments", async ({ params, request }) => {
    const body = await request.json();
    const list = commentByPost[params.id] || [];
    const newComment = {
      id: "c" + (list.length + 1),
      postId: params.id,
      body: body?.body ?? "",
      createdAt: new Date().toISOString(),
    };
    commentByPost[params.id] = [newComment, ...list];
    saveState()
    return HttpResponse.json(newComment, { status: 201 });
  }),

  http.post("/posts", async ({ request }) => {
    const data = await request.json();
    const newPost = {
      id: String(posts.length + 1),
      createdAt: new Date().toISOString(),
      ...data,
    };
    posts.unshift(newPost);
    saveState()
    if (!commentByPost[newPost.id]) commentByPost[newPost.id] = [];
    return HttpResponse.json(newPost, { status: 201 });
  }),

  http.delete("/posts/:id", ({ params }) => {
    posts = posts.filter((p) => p.id !== params.id);
    delete commentByPost[params.id]; // valfritt: städa kommentarer
    saveState()
    return new HttpResponse(null, { status: 204 });
  }),

  // ----- Auth
  http.post("/auth/login", async ({ request }) => {
    const body = await request.json();
    me = { ...me, email: body.email };
    return HttpResponse.json({ user: me });
  }),

  http.post("/auth/logout", () => HttpResponse.json({ ok: true })),

  // ----- GDPR / Me
  http.get("/me/consents", () => HttpResponse.json(me.consents)),

  http.put("/me/consents", async ({ request }) => {
    const body = await request.json();
    me.consents = body;
    return HttpResponse.json(me.consents);
  }),

  http.post("/me/export", () => HttpResponse.json({ status: "export_requested" })),
  http.post("/me/delete", () => HttpResponse.json({ status: "erasure_requested" })),
];
