const express = require("express");

const reader = require("xlsx");
const file = reader.readFile("SessionPFE2022.xlsx");

let data = [];
const sheets = file.SheetNames;
for (let i = 0; i < sheets.length; i++) {
	const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
	temp.forEach((res) => {
		data.push(res);
	});
}
console.log(data);
// Parcour data
for (let i = 0; i < data.length; i++) {
	nom = data[i].nom;
	prenom = data[i].prenom;
	adresse = data[i].adresse;
	tel = data[i].tel;
	profil = data[i].profil;
	cv = data[i].cv;
	email = data[i].email;
}
