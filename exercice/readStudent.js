/*
* 02 Exercice read students
  
  1. Lisez le fichier à l'aide de la méthode asynchrone.
  1.(bis) Pour la suite, utilisez l'approche synchrone afin de récupérer les données que vous pourrez exploiter par la suite dans le script.
  
  2. Recherchez dans le tableau tous les étudiants qui ont eu plus de 17 de moyenne strictement.
  
  3. Recherchez dans le tableau l'étudiant qui a eu la meilleur node.
  
  4. Récupérez les données dans un objet student, puis ajoutez chaque étudiant dans un tableau students.
  
  5. Ordonnez maintenant l'ensemble des données dans le tableau.
 */

const fs = require("node:fs");

fs.readFile("./data/student.txt", "utf8", (err, data) => {
	if (err) {
		console.error(err)
		process.exit(0);
	}
	
	console.log("lecture reussi")
})

let students;

try {
	students = JSON.parse(fs.readFileSync("./data/student.txt", "utf8"));
} catch(e) {
	console.error(e)
	process.exit(0)
}

const studentWithAvg = students.map((s) => {
	const avg = parseFloat((s.notes.reduce((acc, curr) => curr + acc, 0) / s.notes.length).toFixed(2))
	return {
		...s,
		avg
	}
})

const bestStudent = studentWithAvg.filter((s) => s.avg > 17)

console.group("Moyenne supérieur à 17")
bestStudent.map((s) => {
	console.log(s.name)
})
console.groupEnd()

const firstStudent = bestStudent.reduce((acc, curr) => {
		return acc.avg > curr.avg ? acc : curr
})

console.group("Meilleur élève")
console.log(`${firstStudent.name}, avec une moyenne de ${firstStudent.avg}`)
console.groupEnd()

studentWithAvg.sort((a, b) => b.avg - a.avg)

console.group("Etudiant trié par moyenne")
console.table(studentWithAvg)
console.groupEnd()