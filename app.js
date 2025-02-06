// const express = require("express");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// const produseRoutes = require("./routes/produseRoutes");

// dotenv.config();
// const app = express();

// // Configurare EJS și resurse statice
// app.set("view engine", "ejs");
// app.use(express.static("public"));
// app.use(bodyParser.urlencoded({ extended: true }));

// // Rute pentru produse
// app.use("/produse", produseRoutes);

// // Pagina principală
// app.get("/", (req, res) => {
//     res.render("index");
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server pornit pe portul ${PORT}`));
