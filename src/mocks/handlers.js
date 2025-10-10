import { http, HttpResponse } from "msw"

let posts = [
    { id: "1", title: "Välkommen till MiniForum!", excerpt: "Första testinlägget", createdAt: new Date().toISOString() },
    { id: "2", title: "GDPR Export", excerpt: "Så funkar export i appen", createdAt: new Date().toISOString() },

];

let me = {
    id: "u1",
    email: "demo@miniforum.dev",
    displayName: "Demo",
    roles: ["user"],
    consents: { essential: true, analytics: false},
};

export const handlers = [
    //Forum
    http.get("/posts", () => HttpResponse.json(posts)),
    http.get("/posts/:id", ({ params }) => {
        const post = posts.find(p => p.id === params.id);
        return post ? HttpResponse.json(post) : HttpResponse.json({ messages: "Not found" }, { status: 404});
    }),
    http.post("/posts", async ({ request }) =>{
        const data = await request.json();
        const newPost = { id: String(posts.length + 1), createdAt: new Date().toISOString(), ...data}
        posts.unshift(newPost);
        return HttpResponse.json(newPost, { status: 201});
    }),

    //Auth
    http.post("/auth/login", async ({ request }) => {
        me = {  ...me, email: body.email };
        return HttpResponse.json({ user : me });
    }),
    http.post("/auth/logout", () => HttpResponse.json({ ok: true })),

    //GDPR / Me
    http.get("/me/consents", () => HttpResponse.json(me.consents)),
    http.put("me/consents", async ({ request }) => {
        const body = await request.json();
        me.consents = body; 
        return HttpResponse.json(me.consents);
    }),
    http.post("me/export", () => HttpResponse.json({status: "export_requested" })),
    http.post("/me/delete", () => HttpResponse.json({ status: "erasure_requested" })),
];