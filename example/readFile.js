const fs = require("node:fs");

// fs.readFile("./data/titanic.txt", {encoding: "utf8"}, (err, data) => {
// 	if (err) {
// 		console.error(err)
// 		return
// 	}
// 	console.log(data)
// })

try {
	const data = fs.readFileSync("./data/titanic.txt", "utf8")
	console.log(data);
} catch(e) {
	console.error(e);
}

fs.writeFile("./data/test.txt", "Hello node", (err) => {
	if (err) {
		console.error(err)
		process.exit(0)
	}
	console.log("Success");
})

fs.appendFile("./data/test.txt", " Ajout de texte avec appendFile", (err) => {
	if (err) {
		console.error(err)
		process.exit(0)
	}
	
	console.log("Ajout effectué");
})