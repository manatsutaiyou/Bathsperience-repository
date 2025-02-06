const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",  // or use process.env.DB_HOST
  user: "root",       // or use process.env.DB_USER
  password: "",       // or use process.env.DB_PASSWORD
  database: "ratuste", // Ensure correct database name
  port: 3309          // Add this if MySQL runs on port 3309
});

connection.connect(err => {
  if (err) {
    console.error("❌ Database connection error:", err);
    return;
  }
  console.log("✅ Connected to MySQL database!");
});

module.exports = connection;
