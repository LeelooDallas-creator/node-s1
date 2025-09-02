const fs = require("node:fs");
const path = require("node:path");

const filePath = path.join(__dirname, "..", "data", "student.txt");

let students;

try {
  students = JSON.parse(fs.readFileSync(filePath, "utf8"));
} catch (e) {
  console.error(e);
  process.exit(0);
}

const commands = [
  {
    name: "list",
    description: "Liste tous les élèves",
  },
  {
    name: "find <string>",
    description: "Cherche puis affiche les infos d'un élève s'il existe",
  },
  {
    name: "more <number>",
    description: "Filtre les élèves en fonction de leur moyenne",
  },
];

function list() {
  const names = students.map((s) => s.name);
  console.log(names.join("\n"));
}

function find(name) {
  const student = students.find(
    (s) => s.name.trim().toLowerCase() === name.trim().toLowerCase()
  );
  if (!student) {
    console.log(`L'élève ${name} n'existe pas.`);
    return;
  }
  console.table(student);
}

function more(num) {
  num = Number(num);
  if (isNaN(num) || num < 0 || num > 20) {
    console.log("Merci de saisir une moyenne valide (entre 0 et 20)");
    return;
  }

  const filterStudent = students.filter((s) => {
    return (
      s.notes.reduce((acc, curr) => acc + curr, 0) / s.notes.length > num
    );
  });

  if (filterStudent.length === 0) {
    console.log("Aucun élève ne correspond à votre recherche.");
    return;
  }

  console.table(filterStudent);
}

module.exports = { list, find, more, commands };
