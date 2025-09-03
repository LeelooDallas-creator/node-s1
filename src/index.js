const http = require("http");
const fs = require("fs");
const path = require("path");
const {
  homePage,
  userDetail,
  formPage,
  addUser,
  editForm,
  updateUser,
  deleteUser,
  notFound
} = require("./controller/controller");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/" && req.method === "GET") {
    homePage(res);
  } else if (url.pathname === "/user" && req.method === "GET") {
    userDetail(res, url.searchParams.get("id"));
  } else if (url.pathname === "/form" && req.method === "GET") {
    formPage(res);
  } else if (url.pathname === "/add" && req.method === "POST") {
    addUser(req, res);
  } else if (url.pathname === "/edit" && req.method === "GET") {
    editForm(res, url.searchParams.get("id"));
  } else if (url.pathname === "/update" && req.method === "POST") {
    updateUser(req, res, url.searchParams.get("id"));
  } else if (url.pathname === "/delete" && req.method === "POST") {
    deleteUser(req, res, url.searchParams.get("id"));
  } else if (url.pathname === "/style.css") {
    const cssPath = path.join(__dirname, "styles/style.css");
    res.writeHead(200, { "Content-Type": "text/css" });
    fs.createReadStream(cssPath).pipe(res);
  } else {
    notFound(res);
  }
});

server.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});
