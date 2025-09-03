const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/data.json");

function readUsers() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

function writeUsers(users) {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
}

function renderPage(title, content) {
  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <link rel="stylesheet" href="/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Poppins:wght@300;500&display=swap" rel="stylesheet">
  </head>
  <body>
    <header>
      <h1>${title}</h1>
      <nav>
        <a href="/" class="btn">Accueil</a>
        <a href="/form" class="btn">Ajouter un utilisateur</a>
      </nav>
    </header>
    <main>
      ${content}
    </main>
  </body>
  </html>
  `;
}

module.exports = { readUsers, writeUsers, renderPage };
