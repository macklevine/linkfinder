var devconfig;

var production = {
	dbConfig : {
		user : process.env.DB_USER,
		password : process.env.DB_PASSWORD,
		server : process.env.DB_SERVER,
		database : process.env.DB_NAME
	},
	port : process.env.PORT,
	authConfig : {
		userNames : process.env.USERS ? process.env.USERS.split(",") : [],
		salt : process.env.SALT,
		password : process.env.PASSWORD,
		secret : process.env.SECRET
	}
};

if(process.env.NODE_ENV==="development"){
	devconfig = require("./devconfig");
	module.exports = devconfig;
} else {
	module.exports = production;
}