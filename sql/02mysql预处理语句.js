const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "bridge666",
  database: "coderHub",
});

const statement = `SELECT * FROM products WHERE price > ?;`;

// execute 先执行prepare语句，然后执行execute语句
// 可以有效防止SQL注入
connection.execute(statement, [6000], (err, results) => {
  if (err) {
    console.log("error", err);
  } else {
    console.log("results", results.length);
  }
});
