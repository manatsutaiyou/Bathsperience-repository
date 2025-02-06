document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const themeToggle = document.getElementById("switch-tema");
    const iconTema = document.getElementById("icon-tema");

    // Verifică tema salvată în localStorage
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-theme");
        iconTema.classList.remove("fa-sun");
        iconTema.classList.add("fa-moon");
    } else {
        iconTema.classList.remove("fa-moon");
        iconTema.classList.add("fa-sun");
    }

    // La schimbarea temei
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-theme");

        if (body.classList.contains("dark-theme")) {
            localStorage.setItem("theme", "dark");
            iconTema.classList.remove("fa-sun");
            iconTema.classList.add("fa-moon");
        } else {
            localStorage.setItem("theme", "light");
            iconTema.classList.remove("fa-moon");
            iconTema.classList.add("fa-sun");
        }
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const btnFiltreaza = document.getElementById("filtreaza-btn");

    btnFiltreaza.addEventListener("click", filtreaza); // Apelăm filtrarea doar când butonul este apăsat

    function filtreaza() {
        console.log("Filtrare aplicată!"); // Test: vezi în consolă dacă funcționează

        const nume = document.getElementById("nume").value.toLowerCase();
        const pretMaxim = parseFloat(document.getElementById("pret").value);
        const categorie = document.getElementById("categorie").value;
        const stil = document.getElementById("stil").value; // Select stil
        const rezistentLaApa = document.getElementById("rezistent").checked; // Checkbox rezistent la apă

        document.querySelectorAll("#lista-produse article").forEach(item => {
            const numeProdus = item.querySelector("h2").textContent.toLowerCase();
            const pretProdus = parseFloat(item.dataset.pret);
            const categorieProdus = item.dataset.categorie;
            const stilProdus = item.dataset.stil; // Citim stilul produsului
            const rezistentProdus = item.dataset.rezistentLaApa === "true"; // Verificăm dacă este rezistent la apă

            let vizibil = true;

            if (nume && !numeProdus.includes(nume)) {
                vizibil = false;
            }
            if (!isNaN(pretMaxim) && pretProdus > pretMaxim) {
                vizibil = false;
            }
            if (categorie && categorieProdus !== categorie) {
                vizibil = false;
            }
            if (stil && stilProdus !== stil) { // Filtrare după stil
                vizibil = false;
            }
            if (rezistentLaApa && !rezistentProdus) { // Filtrare după rezistență la apă
                vizibil = false;
            }

            item.style.display = vizibil ? "block" : "none";
        });
    }
});



function updatePret(valoare) {
    document.getElementById("pret-valoare").innerText = `$${valoare}`;
    filtreaza();
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("filtreaza-btn").addEventListener("click", filtreaza);
    document.getElementById("sort-asc").addEventListener("click", () => sorteaza(true));
    document.getElementById("sort-desc").addEventListener("click", () => sorteaza(false));
    document.getElementById("calculeaza").addEventListener("click", calculeaza);
    document.getElementById("reseteaza").addEventListener("click", reseteazaFiltre);
});

document.addEventListener("DOMContentLoaded", function() {
    const btnSorteazaAsc = document.getElementById("sorteaza-asc");
    const btnSorteazaDesc = document.getElementById("sorteaza-desc");
    const btnCalculeaza = document.getElementById("calculeaza");

    if (btnSorteazaAsc) btnSorteazaAsc.addEventListener("click", () => sorteaza(true));
    if (btnSorteazaDesc) btnSorteazaDesc.addEventListener("click", () => sorteaza(false));
    if (btnCalculeaza) btnCalculeaza.addEventListener("click", calculeaza);

    function sorteaza(asc) {
        let container = document.getElementById("lista-produse");
        let produse = Array.from(container.querySelectorAll("article"))
            .filter(prod => prod.style.display !== "none"); // Sortăm doar produsele vizibile

        if (produse.length === 0) {
            alert("Nu există produse de sortat!");
            return;
        }

        produse.sort((a, b) => {
            let catA = a.getAttribute("data-categorie")?.toLowerCase() || "";
            let catB = b.getAttribute("data-categorie")?.toLowerCase() || "";
            let pretA = parseFloat(a.getAttribute("data-pret")) || 0;
            let pretB = parseFloat(b.getAttribute("data-pret")) || 0;

            if (catA !== catB) return asc ? catA.localeCompare(catB) : catB.localeCompare(catA);
            return asc ? pretA - pretB : pretB - pretA;
        });

        produse.forEach(prod => container.appendChild(prod));
    }

    function calculeaza() {
        let produse = Array.from(document.querySelectorAll("#lista-produse article"))
            .filter(prod => prod.style.display !== "none");

        if (produse.length === 0) {
            alert("Nu există produse pentru calcul!");
            return;
        }

        let preturi = produse.map(prod => parseFloat(prod.getAttribute("data-pret")) || 0);
        let suma = preturi.reduce((acc, val) => acc + val, 0);
        let minim = Math.min(...preturi);
        let maxim = Math.max(...preturi);

        let div = document.getElementById("calcul-info");
        if (!div) {
            div = document.createElement("div");
            div.id = "calcul-info";
            document.body.appendChild(div);
        }

        div.innerText = `Total: ${suma.toFixed(2)} RON | Min: ${minim.toFixed(2)} RON | Max: ${maxim.toFixed(2)} RON`;
        div.style.position = "fixed";
        div.style.bottom = "20px";
        div.style.right = "20px";
        div.style.background = "black";
        div.style.color = "white";
        div.style.padding = "10px";
        div.style.borderRadius = "5px";
        div.style.fontSize = "16px";
        div.style.zIndex = "1000";

        setTimeout(() => div.remove(), 3000);
    }
});




document.getElementById("reseteaza").addEventListener("click", function () {
    document.getElementById("nume").value = "";
    document.getElementById("pret").value = 35; // Valoarea inițială
    document.getElementById("pret-valoare").textContent = 35;
    document.getElementById("categorie").value = "";
    document.getElementById("stil").value = "";
    document.getElementById("rezistent").checked = false;

    // Resetare produse ascunse
    document.querySelectorAll("#lista-produse article").forEach(item => {
        item.style.display = "block"; // 👈 Face toate produsele vizibile din nou
    });

    // Resetare ordine ID
    const listaProduse = document.getElementById("lista-produse");
    const produse = Array.from(listaProduse.children);
    produse.sort((a, b) => {
        let idA = parseInt(a.id.replace("ar_ent_", ""));
        let idB = parseInt(b.id.replace("ar_ent_", ""));
        return idA - idB;
    });

        // Sortează după ID
        
    

    listaProduse.innerHTML = "";
    produse.forEach(p => listaProduse.appendChild(p));
});







