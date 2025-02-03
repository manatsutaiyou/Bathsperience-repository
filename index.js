const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Servire fișiere statice
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Variabila globală pentru erori
global.obGlobal = { obErori: null };

// Inițializare erori din JSON
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

// Funcție pentru afișarea erorilor
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

// Ruta pentru pagina principală (Acasă)
app.get(["/", "/index", "/home"], (req, res) => {
    let ip_utilizator = req.ip;
    res.render("pagini/index", { ip_utilizator });
});

// Ruta pentru pagina "Despre"
app.get("/despre", (req, res) => {
    res.render("pagini/despre");
});

// Blocare acces la /resurse/ fără fișier specificat
app.use("/resurse", (req, res, next) => {
    if (req.path === "/") {
        afiseazaEroare(403, res);
    } else {
        next();
    }
});

// Ruta generală pentru pagini inexistent
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

// Pornirea serverului
app.listen(8080, () => {
    console.log("🚀 Server pornit pe http://localhost:8080");
});
