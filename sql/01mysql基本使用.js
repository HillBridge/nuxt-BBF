const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "bridge666",
  database: "coderHub",
});

const statement = `SELECT * FROM products WHERE price > 6000;`;

connection.query(statement, (err, results) => {
  if (err) {
    console.log("error", err);
  } else {
    console.log("results", results);
  }
});
