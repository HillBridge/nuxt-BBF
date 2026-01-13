// const mysql = require("mysql2");
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "bridge666",
  database: "coderHub",
  connectionLimit: 10,
});

const statement = `SELECT * FROM products WHERE price > ?;`;

// execute 先执行prepare语句，然后执行execute语句
// 可以有效防止SQL注入
// pool.execute(statement, [6000], (err, results) => {
//   if (err) {
//     console.log("error", err);
//   } else {
//     console.log("results", results.length);
//   }
// });

try {
  const [rows, fields] = await pool.execute(statement, [6000]);
  console.log("result", rows);
} catch (err) {
  console.log("--->>>>>error", err);
}
