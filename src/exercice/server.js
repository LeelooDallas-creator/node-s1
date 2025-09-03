import http from "node:http";
import { shuffle } from "../utils/utils.js";

const hostname = "localhost";
const port = "8080";

const users = [
    'Alan',
    'Sophie',
    'Bernard',
    'Elie'
];

const server = http.createServer((req, res) => {
    const url = req.url.replace("/", "");
    
    // Gérer la requête pour le favicon.ico
    if (url === "favicon.ico") {
        res.writeHead(200, {
            "Content-Type": "image/x-icon"
        });
        res.end();
        return;
    }
    
    // Route /shuffle pour mélanger les utilisateurs
    if (url === "shuffle") {
        shuffle(users); // On mélange directement le tableau `users`
        res.writeHead(302, { 'Location': '/' }); // Redirection vers la page d'accueil
        res.end();
        return;
    }

    // Route par défaut (racine) pour afficher la liste des utilisateurs
    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
    });
    
    // On génère la liste HTML à partir du tableau `users`
    const userListHtml = users.map(user => `<li>${user}</li>`).join('');

    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
        <title>Liste des utilisateurs</title>
        <meta charset="utf-8" />
        </head>
        <body>
            <h1>Liste des utilisateurs</h1>
            <ul>
                ${userListHtml}
            </ul>
            <br>
            <a href="/shuffle">Mélanger les utilisateurs</a>
        </body>
        </html>
    `);
});

server.listen(port, hostname, () => {
    console.log(`Server listening at http://${hostname}:${port}`);
});