const express = require("express");
const router = express.Router();
const connection = require("../database");

// 🛠 Funcție pentru a obține categoriile ENUM din baza de date
function getCategories(callback) {
    connection.query(
        `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'ratuste' AND COLUMN_NAME = 'categorie'`,
        (err, results) => {
            if (err) {
                console.error("Eroare la obținerea categoriilor:", err);
                return callback([]); // Returnează un array gol în caz de eroare
            }
            const match = results[0].COLUMN_TYPE.match(/enum\((.+?)\)/);
            if (match) {
                const categories = match[1].replace(/'/g, "").split(",");
                return callback(categories);
            }
            return callback([]);
        }
    );
}

// ✅ Ruta pentru afisarea tuturor produselor sau pe categorie
router.get("/categorie/:categorie?", (req, res) => {
    const categorie = req.params.categorie;

    getCategories((categories) => {
        let query = "SELECT * FROM ratuste";
        let params = [];

        if (categorie && categorie !== "toate") {
            query += " WHERE categorie = ?";
            params.push(categorie);
        }

        connection.query(query, params, (err, results) => {
            if (err) {
                console.error("Eroare la obținerea produselor:", err);
                return res.status(500).send("Eroare la obținerea produselor");
            }
            const stiluri = [...new Set(results.map(produs => produs.stil).filter(stil => stil))];


            res.render("pagini/produse", { produse: results, categories, stiluri });
            
        });
    });
});

// ✅ Ruta pentru un singur produs (acum este clar diferențiată)
router.get("/detalii/:id", (req, res) => {
    connection.query("SELECT * FROM ratuste WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).send("Eroare la obținerea produsului");
        if (results.length === 0) return res.status(404).send("Produsul nu există.");
        res.render("pagini/produs", { produs: results[0] });
    });
});

module.exports = router;
