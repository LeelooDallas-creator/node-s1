// chifoumi.js
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const choices = ["pierre", "feuille", "ciseaux"];

// stats d'une partie
let stats = {
  parties: 0,
  joueur1: 0,
  joueur2: 0,
  egalites: 0,
};

let manchesJouees = 0;
const MAX_MANCHES = 3;

// fonction aléatoire
function getRandomChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

// jouer une manche
function playRound() {
  const player1 = getRandomChoice();
  const player2 = getRandomChoice();

  console.log(`\nManche ${manchesJouees + 1}`);
  console.log(`Joueur 1 : ${player1}`);
  console.log(`Joueur 2 : ${player2}`);

  if (player1 === player2) {
    console.log("→ Égalité !");
    stats.egalites++;
  } else if (
    (player1 === "pierre" && player2 === "ciseaux") ||
    (player1 === "feuille" && player2 === "pierre") ||
    (player1 === "ciseaux" && player2 === "feuille")
  ) {
    console.log("→ Joueur 1 gagne !");
    stats.joueur1++;
  } else {
    console.log("→ Joueur 2 gagne !");
    stats.joueur2++;
  }

  manchesJouees++;
  stats.parties++;

  console.log(
    `Score actuel -> J1: ${stats.joueur1}, J2: ${stats.joueur2}, Égalités: ${stats.egalites}`
  );

  if (manchesJouees >= MAX_MANCHES) {
    console.log("\n=== Partie terminée ===");
    afficherResultatFinal();
    menu(); // retour au menu mais sans possibilité de rejouer
  } else {
    menu();
  }
}

function afficherResultatFinal() {
  console.log("\nRésultat final :");
  console.log(`Victoires Joueur 1 : ${stats.joueur1}`);
  console.log(`Victoires Joueur 2 : ${stats.joueur2}`);
  console.log(`Égalités : ${stats.egalites}`);

  if (stats.joueur1 > stats.joueur2) {
    console.log("🏆 Joueur 1 remporte la partie !");
  } else if (stats.joueur2 > stats.joueur1) {
    console.log("🏆 Joueur 2 remporte la partie !");
  } else {
    console.log("Match nul !");
  }
}

function sauvegarderPartie() {
  const fichier = "resultats_chifoumi.json";
  fs.writeFileSync(fichier, JSON.stringify(stats, null, 2), "utf-8");
  console.log(`Résultats sauvegardés dans "${fichier}" ✅`);
}

// menu principal
function menu() {
  console.log("\n--- Menu ---");
  if (manchesJouees < MAX_MANCHES) {
    console.log("1. Jouer une manche");
  }
  console.log("2. Voir les statistiques");
  console.log("3. Quitter (sauvegarder et fermer)");

  rl.question("Votre choix : ", (answer) => {
    switch (answer.trim()) {
      case "1":
        if (manchesJouees < MAX_MANCHES) {
          playRound();
        } else {
          console.log("⚠ La partie est déjà terminée (3 manches jouées).");
          menu();
        }
        break;
      case "2":
        console.log("\n--- Statistiques ---");
        console.log(`Manches jouées : ${manchesJouees}/${MAX_MANCHES}`);
        console.log(`Victoires Joueur 1 : ${stats.joueur1}`);
        console.log(`Victoires Joueur 2 : ${stats.joueur2}`);
        console.log(`Égalités : ${stats.egalites}`);
        menu();
        break;
      case "3":
        console.log("\nFin du jeu.");
        sauvegarderPartie();
        rl.close();
        break;
      default:
        console.log("Choix invalide !");
        menu();
    }
  });
}

// démarrage
menu();
