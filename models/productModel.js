const db = require("../database");

class Product {
    static getAll(callback) {
        db.query("SELECT * FROM ratuste", (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    }

    static getById(id, callback) {
        db.query("SELECT * FROM ratuste WHERE id = ?", [id], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    }
}

module.exports = Product;
