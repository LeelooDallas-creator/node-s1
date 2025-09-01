//jeu.js
const readline = require("readline");

// Création de l'interface readline
const rl = readline.createInterface ({
    input : process.stdin,
    output : process.stdout,
});

const nombreSecret = Math.floor(Math.random()*100) + 1;
let tentatives = 0;
const maxTentatives = 10;

console.log("=== Jeu du nombre mystère ===");
console.log("Je pense à un nombre entre 1 et 100");
console.log(`tu as ${maxTentatives} tentatives pour trouver\n`);

function demanderNombre() {
    rl.question(`Tentative ${tentatives + 1}/${maxTentatives} : Entre un nombre → ` , (reponse) => {
        const guess = parseInt (reponse, 10);

        // Vérification si l'entrée est un nombre valide
        if (isNaN(guess) || guess < 1 || guess > 100) {
            console.log("⚠️ Entrée invalide. Merci de donner un nombre entre 1 et 100.\n");
            return demanderNombre(); // redemande sans consommer de tentative
        }

        tentatives++;

        if(guess === nombreSecret){
            console.log(`🎉 Bravo ! Tu as trouvé le nombre ${nombreSecret} en ${tentatives} tentative(s).`)
            return rl.close
        } else if (guess < nombreSecret){
            console.log("➡️ Le nombre est plus grand.\n");
        } else {
            console.log("⬅️ Le nombre est plus petit.\n");
        }

        if(tentatives >= maxTentatives){
            console.log(`❌ Game Over ! Le nombre mystère était ${nombreSecret}.`)
            return rl.close();
        }
        demanderNombre();
        });
}
demanderNombre();