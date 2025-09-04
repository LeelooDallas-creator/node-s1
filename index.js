import path from "path";
import fs from "fs";
import http from "http";
import { parse } from "querystring";
import pug from "pug";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cwd = process.cwd();
const viewPath = path.join(cwd, "view");

const menuItems = [
  { path: "/", title: "Home" },
  { path: "/about-me", title: "About" },
  { path: "/references", title: "References" },
  { path: "/contact-me", title: "Contact" },
];

function getMenu(activePath) {
  return menuItems.map((item) => ({
    ...item,
    isActive: item.path === activePath,
  }));
}

function render(res, template, options = {}) {
  try {
    const html = pug.renderFile(path.join(viewPath, template), {
      ...options,
      pretty: true,
    });
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Erreur serveur : " + err.message);
  }
}

function saveContact(email, message) {
  const filePath = path.join(cwd, "contacts.json");
  const contact = {
    email,
    message,
    date: new Date().toISOString(),
  };

  let data = [];
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  data.push(contact);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname.startsWith("/styles/")) {
    const filePath = path.join(cwd, url.pathname);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      let type = "text/plain";

      if (ext === ".css") type = "text/css";
      else if (ext === ".js") type = "application/javascript";
      else if (ext === ".png") type = "image/png";
      else if (ext === ".jpg" || ext === ".jpeg") type = "image/jpeg";
      else if (ext === ".gif") type = "image/gif";

      res.writeHead(200, { "Content-Type": type });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Fichier non trouvé");
    }
    return;
  }


  if (req.method === "GET") {
    if (url.pathname === "/") {
      const success = url.searchParams.get("success");
      render(res, "home.pug", { menuItems: getMenu("/"), success });
    } else if (url.pathname === "/contact-me") {
      render(res, "contact.pug", { menuItems: getMenu("/contact-me") });
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Page not found");
    }
  }


  else if (req.method === "POST" && url.pathname === "/contact-me") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const parsed = parse(body);
      saveContact(parsed.email, parsed.message);
      res.writeHead(302, { Location: "/?success=1" });
      res.end();
    });
  }
});

server.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
