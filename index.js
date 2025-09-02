const { extractArg } = require("./utils/utils");
const { list, find, more, commands } = require("./controller/controller");

process.stdin.on("data", (chunk) => {
  const data = chunk.toString().trim().replace("\r\n", "");
  let arg;

  switch (true) {
    case data === "list":
      console.group("Liste des élèves :");
      list();
      console.groupEnd();
      break;

    case /^find /.test(data):
      arg = extractArg(data);
      find(arg);
      break;

    case /^more /.test(data):
      arg = extractArg(data);
      more(arg);
      break;

    default:
      console.group("Commande inconnue, voici la liste des commandes disponibles :");
      console.table(commands);
      console.groupEnd();
  }
});
