const mariadb = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const connection = mariadb.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    dateStrings: true,
});

module.exports = connnection;
