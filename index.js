const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express(); // Move this up before using routes
const produseRoutes = require("./routes/produseRoutes"); // ✅ Correct path


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));



// Global error object
global.obGlobal = { obErori: null };

// Initialize errors from JSON
function initErori() {
    const caleErori = path.join(__dirname, "public/json/erori.json");

    fs.readFile(caleErori, "utf8", (err, data) => {
        if (err) {
            console.error("Eroare la citirea fișierului erori.json:", err);
            return;
        }

        try {
            let erori = JSON.parse(data);
            erori.info_erori.forEach(eroare => {
                eroare.imagine = path.posix.join(erori.cale_baza, eroare.imagine);
            });
            obGlobal.obErori = erori;
        } catch (parseError) {
            console.error("Eroare la parsarea JSON-ului:", parseError);
        }
    });
}
initErori();

app.use((req, res, next) => {
    if (!obGlobal.obErori) {
        console.log("Eroare de inițializare: erori.json");
        return res.status(500).send("Eroare de inițializare.");
    }
    next();
});

// Function to display errors
function afiseazaEroare(identificator, res, titlu = null, text = null, imagine = null) {
    if (!obGlobal.obErori) {
        return res.status(500).send("Eroare de inițializare.");
    }

    let eroare = obGlobal.obErori.info_erori.find(err => err.identificator == identificator) || obGlobal.obErori.eroare_default;

    res.status(eroare.status || 500).render("eroare", {
        titlu: titlu || eroare.titlu,
        text: text || eroare.text,
        imagine: imagine || eroare.imagine
    });
}

// Route for the home page
app.get(["/", "/index", "/home"], (req, res) => {
    console.log("Home route hit");
    let ip_utilizator = req.ip;
    res.render("pagini/index", { ip_utilizator });
});

// Route for the "About" page
app.get("/despre", (req, res) => {
    res.render("pagini/despre");
});

// Use routes for products
app.use("/produse", produseRoutes); // Corrected
app.use("/:id", produseRoutes);
// Block access to /resurse/ without specific file
app.use("/resurse", (req, res, next) => {
    if (req.path === "/") {
        afiseazaEroare(403, res);
    } else {
        next();
    }
});

// General route for non-existent pages
app.get("/*", (req, res) => {
    if (!obGlobal.obErori) {
        console.error("Erorile nu sunt încărcate!");
        return res.status(500).send("Eroare de inițializare.");
    }

    res.render("pagini/" + req.params[0], (eroare, rezultatRandare) => {
        if (eroare) {
            console.log("Eroare la randare:", eroare.message);
            if (eroare.message.startsWith("Failed to lookup view")) {
                afiseazaEroare(404, res);
            } else {
                afiseazaEroare(500, res);
            }
        } else {
            res.send(rezultatRandare);
        }
    });
});

// Start server
app.listen(8080, () => {
    console.log("🚀 Server pornit pe http://localhost:8080");
});

// Initialize compiler
require("./compiler");
console.log("Serverul a pornit și monitorizează modificările SCSS...");
