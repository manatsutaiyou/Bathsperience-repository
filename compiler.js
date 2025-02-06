console.log("✅ Compiler.js a fost încărcat!");

const fs = require("fs");
const path = require("path");
const sass = require("sass");
const fse = require("fs-extra");

// Definirea căilor pentru fișiere SCSS și CSS
global.folderScss = path.join(__dirname, "public/scss");
global.folderCss = path.join(__dirname, "public/css");
global.folderBackup = path.join(__dirname, "backup");

// Crearea folderelor necesare dacă nu există
[folderCss, folderBackup].forEach((folder) => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

/**
 * Funcție care compilează un fișier SCSS într-un fișier CSS.
 * @param {string} caleScss - Calea către fișierul SCSS de intrare
 * @param {string} caleCss - Calea către fișierul CSS de ieșire
 */
function compileazaScss(caleScss, caleCss) {
  try {
    // Convertim căile relative la absolute
    if (!path.isAbsolute(caleScss)) {
      caleScss = path.join(global.folderScss, caleScss);
    }
    if (!caleCss) {
      const fileName = path.basename(caleScss, ".scss") + ".css";
      caleCss = path.join(global.folderCss, fileName);
    } else if (!path.isAbsolute(caleCss)) {
      caleCss = path.join(global.folderCss, caleCss);
    }

    // Salvare în backup a fișierului CSS vechi
    if (fs.existsSync(caleCss)) {
      const backupPath = path.join(
        global.folderBackup,
        "resurse/css",
        path.basename(caleCss)
      );
      fse.ensureDirSync(path.dirname(backupPath));
      fse.copySync(caleCss, backupPath);
      console.log(`[BACKUP] Fișier salvat: ${backupPath}`);
    }

    // Compilare SCSS -> CSS
    const result = sass.compile(caleScss, { 
        style: "expanded",
        loadPaths: [path.join(__dirname, "node_modules")]
      });
      
      
    // Scrierea fișierului CSS compilat
    fs.writeFileSync(caleCss, result.css);
    console.log(`[SCSS COMPILAT] ${caleScss} -> ${caleCss}`);
  } catch (err) {
    console.error(`[EROARE COMPILARE] ${err.message}`);
  }
}

/**
 * Funcție pentru compilarea inițială a tuturor fișierelor SCSS.
 */
function compilareInitiala() {
  fs.readdir(global.folderScss, (err, files) => {
    if (err) {
      console.error(`[EROARE] Nu s-a putut citi folderul SCSS: ${err.message}`);
      return;
    }
    files.forEach((file) => {
      if (file.endsWith(".scss")) {
        compileazaScss(file);
      }
    });
  });
}

/**
 * Funcție care monitorizează modificările din folderul SCSS și recompilare automată.
 */
function urmaresteModificari() {
  fs.watch(global.folderScss, (eventType, filename) => {
    if (filename && filename.endsWith(".scss")) {
      console.log(`[WATCH] Detectată modificare: ${filename}`);
      compileazaScss(filename);
    }
  });
}

// Executare compilare inițială și activare watch
compilareInitiala();
urmaresteModificari();