/* Développez un programme en JavaScript qui charge les informations des élèves à partir du fichier student.txt
Implémentez les fonctionnalités suivantes dans votre système de gestion des élèves :
Une fonctionnalité pour afficher la liste du nom de tous les élèves.
Une fonctionnalité pour rechercher et afficher les informations d'un élève spécifique en fonction de son nom.
Une fonctionnalité pour filtrer et afficher les élèves ayant obtenu une moyenne supérieure à une valeur spécifiée.
Assurez-vous que votre système traite correctement les cas limites, tels que la gestion des entrées utilisateur incorrectes ou 
la manipulation de données incorrectes.
Testez votre système en utilisant différentes commandes pour vous assurer qu'il fonctionne correctement et qu'il produit les résultats 
attendus. */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Chemin vers le fichier student.txt
const studentFilePath = path.join(__dirname, "../data/student.txt");

// Charger les élèves depuis le fichier
function loadStudents(filename) {
  try {
    const data = fs.readFileSync(filename, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(" Erreur lors du chargement du fichier :", error.message);
    return [];
  }
}

// 1. Calculer la moyenne des notes
function calculateAverage(notes) {
  if (!Array.isArray(notes) || notes.length === 0) return 0;
  return notes.reduce((a, b) => a + b, 0) / notes.length;
}

// 2. Afficher tous les noms
function listStudentNames(students) {
  console.log("\nListe des élèves :");
  students.forEach((s, i) => console.log(`${i + 1}. ${s.name}`));
}

// 3. Afficher noms + notes + moyenne
function listAllDetails(students) {
  console.log("\n Liste complète des élèves :");
  students.forEach((s, i) => {
    console.log(
      `${i + 1}. ${s.name} | Notes: ${s.notes.join(
        ", "
      )} | Moyenne: ${calculateAverage(s.notes).toFixed(2)}`
    );
  });
}

// 6. Rechercher un élève par nom
function findStudentByName(students, name) {
  const s = students.find(
    (stu) => stu.name.toLowerCase() === name.toLowerCase()
  );
  if (!s) return console.log(`⚠️ Élève "${name}" introuvable.`);
  console.log(
    `\nÉlève trouvé :\nNom: ${s.name}\nAdresse: ${
      s.address
    }\nNotes: ${s.notes.join(", ")}\nMoyenne: ${calculateAverage(
      s.notes
    ).toFixed(2)}`
  );
}

// 7. Filtrer par moyenne
function filterByAverage(students, minAverage) {
  const filtered = students.filter(
    (s) => calculateAverage(s.notes) > minAverage
  );
  if (filtered.length === 0)
    return console.log(`⚠️ Aucun élève avec une moyenne > ${minAverage}`);
  console.log(`\nÉlèves avec une moyenne > ${minAverage}:`);
  filtered.forEach((s) =>
    console.log(
      `${s.name} | Moyenne: ${calculateAverage(s.notes).toFixed(
        2
      )} | Notes: ${s.notes.join(", ")}`
    )
  );
}

// Programme principal
const students = loadStudents(studentFilePath);

// Lire les arguments du terminal
const args = process.argv.slice(2);
const command = args[0];

if (command) {
  // Commandes depuis le terminal
  switch (command) {
    case "list":
      listStudentNames(students);
      break;
    case "details":
      listAllDetails(students);
      break;
    case "search":
      if (!args[1]) return console.log("Veuillez indiquer le nom de l'élève.");
      findStudentByName(students, args[1]);
      break;
    case "filter":
      if (!args[1])
        return console.log("Veuillez indiquer la moyenne minimale.");
      const minAverage = parseFloat(args[1]);
      if (isNaN(minAverage))
        return console.log("Veuillez entrer un nombre valide.");
      filterByAverage(students, minAverage);
      break;
    default:
      console.log(
        "Commande inconnue. Utilisez : list | details | search [nom] | filter [moyenne]"
      );
  }
} else {
  // Menu interactif
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function showMenu() {
    console.log("\n===== MENU INTERACTIF =====");
    console.log("1. Afficher la liste des élèves");
    console.log("2. Afficher tous les détails");
    console.log("3. Rechercher un élève par nom");
    console.log("4. Filtrer les élèves par moyenne");
    console.log("5. Quitter");

    rl.question("Choisissez une option (1-5) : ", (input) => {
      switch (input.trim()) {
        case "1":
          listStudentNames(students);
          showMenu();
          break;
        case "2":
          listAllDetails(students);
          showMenu();
          break;
        case "3":
          rl.question("Entrez le nom de l'élève : ", (name) => {
            findStudentByName(students, name.trim());
            showMenu();
          });
          break;
        case "4":
          rl.question("Entrez la moyenne minimale : ", (avg) => {
            const minAverage = parseFloat(avg);
            if (isNaN(minAverage))
              console.log("⚠️ Veuillez entrer un nombre valide.");
            else filterByAverage(students, minAverage);
            showMenu();
          });
          break;
        case "5":
          console.log("👋 Au revoir !");
          rl.close();
          break;
        default:
          console.log("⚠️ Option invalide. Choisissez entre 1 et 5.");
          showMenu();
      }
    });
  }

  showMenu();
}
