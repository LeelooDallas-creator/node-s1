const { readUsers, writeUsers, renderPage } = require("../utils/utils");

function homePage(res) {
  const users = readUsers();
  const list = users
    .map(
      (u, i) =>
        `<li><a href="/user?id=${i}">${u.nom} (${u.role})</a></li>`
    )
    .join("");
  res.end(renderPage("Accueil", `<ul>${list}</ul>`));
}

function userDetail(res, id) {
  const users = readUsers();
  const user = users[id];
  if (!user) {
    return notFound(res);
  }
  const content = `
    <p><strong>Nom :</strong> ${user.nom}</p>
    <p><strong>Email :</strong> ${user.email}</p>
    <p><strong>Rôle :</strong> ${user.role}</p>
    <a href="/edit?id=${id}" class="btn">✏ Modifier</a>
    <form method="POST" action="/delete?id=${id}" style="display:inline;">
      <button type="submit" class="btn">🗑 Supprimer</button>
    </form>
    <br><br>
    <a href="/" class="btn">⬅ Retour à l'accueil</a>
  `;
  res.end(renderPage("Détail utilisateur", content));
}

function formPage(res) {
  const form = `
    <form method="POST" action="/add">
      <label>Nom : <input type="text" name="nom" required></label><br>
      <label>Email : <input type="email" name="email" required></label><br>
      <button type="submit" class="btn">Ajouter</button>
    </form>
  `;
  res.end(renderPage("Ajouter un utilisateur", form));
}

function addUser(req, res) {
  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    const params = new URLSearchParams(body);
    const nom = params.get("nom");
    const email = params.get("email");

    if (nom && email) {
      const users = readUsers();
      users.push({ nom, email, role: "utilisateur" });
      writeUsers(users);
    }
    res.writeHead(302, { Location: "/" });
    res.end();
  });
}

// --- MODIFIER ---
function editForm(res, id) {
  const users = readUsers();
  const user = users[id];
  if (!user) {
    return notFound(res);
  }
  const form = `
    <form method="POST" action="/update?id=${id}">
      <label>Nom : <input type="text" name="nom" value="${user.nom}" required></label><br>
      <label>Email : <input type="email" name="email" value="${user.email}" required></label><br>
      <button type="submit" class="btn">Mettre à jour</button>
    </form>
    <br><a href="/user?id=${id}" class="btn">⬅ Annuler</a>
  `;
  res.end(renderPage("Modifier un utilisateur", form));
}

function updateUser(req, res, id) {
  const users = readUsers();
  if (!users[id]) {
    return notFound(res);
  }

  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    const params = new URLSearchParams(body);
    const nom = params.get("nom");
    const email = params.get("email");

    if (nom && email) {
      users[id].nom = nom;
      users[id].email = email;
      writeUsers(users);
    }
    res.writeHead(302, { Location: `/user?id=${id}` });
    res.end();
  });
}

// --- SUPPRIMER ---
function deleteUser(req, res, id) {
  const users = readUsers();
  if (!users[id]) {
    return notFound(res);
  }
  users.splice(id, 1);
  writeUsers(users);
  res.writeHead(302, { Location: "/" });
  res.end();
}

// --- NOT FOUND ---
function notFound(res) {
  const content = `
    <h2>Oups ! Page introuvable 😢</h2>
    <p>Il semble que tu sois perdue dans les paillettes ✨</p>
    <a href="/" class="btn">⬅ Retour à l'accueil</a>
  `;
  res.statusCode = 404;
  res.end(renderPage("404 - Not Found", content));
}

module.exports = {
  homePage,
  userDetail,
  formPage,
  addUser,
  editForm,
  updateUser,
  deleteUser,
  notFound
};
