document.querySelectorAll(".meniu a").forEach(link => {
    link.addEventListener("click", function () {
        document.getElementById("ch-menu").checked = false; // Uncheck menu toggle
        document.querySelector(".meniu").style.transform = "translateX(-100%)"; // Hide menu
    });
});

// Make sure the menu opens when checked
document.getElementById("ch-menu").addEventListener("change", function () {
    if (this.checked) {
        document.querySelector(".meniu").style.transform = "translateX(0)";
    } else {
        document.querySelector(".meniu").style.transform = "translateX(-100%)";
    }
});