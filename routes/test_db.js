const db = require("../database"); // ✅ Move up one level

db.query("SELECT * FROM ratuste", (err, results) => {
    if (err) {
        console.error("❌ Database error:", err);
    } else {
        console.log("✅ Database results:", results);
    }
    process.exit(); // Close database connection
});
