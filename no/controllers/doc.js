
// Fonction : Login Usser
//si  user exist ===> Token else  return not found /
/*
const Login = async (req, res) => {
	//	console.log(req.body);

	// body errors
	const { errors, isValid } = ValidateLogin(req.body);
	try {
		if (!isValid) {
			res.status(404).json(errors);
		} else {
			UserModel.findOne({ email: req.body.email }).then((user) => {
				if (!user) {
					errors.email = "not found user";
					res.status(404).json(errors);
				} else {
					//compare passwords (body/db)
					bcrypt.compare(req.body.password, user.password).then((isMatch) => {
						// incorrect psw
						if (isMatch) {
							errors.password = "incorrect password";
							res.status(404).json(errors);
						} else {
							//Login Collaborateur && Admin
							//correct psw :  authorization  JSON WEB Token
							var token = jwt.sign(
								{
									//_payload
									id: user._id,
									nom: user.nom,
									prenom: user.prenom,
									email: user.email,
									role: user.role,
								},
								process.env.PRIVATE_KEY,
								{ expiresIn: "8h" } //date d'expération de token
							);
							const userConnect = user.role;
							if (userConnect == "Collaborateur") {
								res.status(200).json({
									message: "Welcome" + user.nom + " " + user.prenom,
									token: "Bearer " + token,
								});
							} else if (userConnect == "Candidat") {
								res.status(200).json({
									message: "Welcome " + user.nom + " " + user.prenom,
									token: "Bearer " + token,
								});
							} else {
								res.status(200).json({
									message: "Welcome " + user.nom + " " + user.prenom,
									token: "Bearer " + token,
								});
							}
						}
					});
				}
			});
		}
	} catch (error) {
		res.status(404).json(error.message);
	}
};
*/

//Fonction : convert csv to json
const convertCsvToJson = async (req, res) => {};
//Function : Create New User
const AddCandidat = async (req, res) => {
	//console.log(req.body);
	/**Test
	var xlsx = require("xlsx");

	var wb = xlsx.readFile(dataPathExcel);
	var sheetName = wb.SheetNames[0];
	var sheetValue = wb.Sheets[sheetName];
	//console.log(sheetValue);
	var excelData = xlsx.utils.sheet_to_json(sheetValue);
	console.log(excelData); */
	/**Test 
	var dataPathExcel = "SessionPFE2022.xlsx";
	var workbook = XLSX.readFile(dataPathExcel);
	var sheet_namelist = workbook.SheetNames;
	var x = 0;
	await sheet_namelist.forEach((element) => {
		var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]]);
		excelData.insertMany(xlData, (err, data) => {
			if (err) {
				console.log(err);
			} else {
				console.log(data);
			}
		});
		x++;
	});*/
	/*
	const { errors, isValid } = ValidateRegister(req.body);
	try {
		if (!isValid) {
			res.status(404).json(errors);
		} else {
			// test  if existe  email
			UserModel.findOne({ email: req.body.email }).then(async (exist) => {
				if (exist) {
					errors.email = "user exist";
					res.status(404).json(errors);
				} else {
					//hashed password
					const hash = bcrypt.hashSync(req.body.password, 10);
					// send to object (database)
					req.body.password = hash;
					req.body.role = "Collaborateur ";
					await UserModel.create(req.body);
					res.status(200).json({ message: "success" });
				}
			});
		}
	} catch (error) {
		res.status(404).json(error.message);
	}
	*/
};
///*******JSON FILE  */

// Requiring the module
const reader = require('xlsx')
  
// Reading our test file
const file = reader.readFile('../fileTest/SessionPFE2022.xlsx')
  
let data = []
  
const sheets = file.SheetNames
  
for(let i = 0; i < sheets.length; i++)
{
   const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]])
   temp.forEach((res) => {
      data.push(res)
   })
}
  
// Printing data
console.log(data)