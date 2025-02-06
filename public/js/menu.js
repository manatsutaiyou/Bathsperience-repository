document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("ch-menu");
    const menu = document.querySelector(".meniu");
    const themeToggle = document.getElementById("theme-toggle");

    // Close menu when clicking a menu link
    document.querySelectorAll(".meniu a").forEach(link => {
        link.addEventListener("click", function () {
            if (menuToggle) menuToggle.checked = false; // Uncheck the menu toggle
            if (menu) menu.style.transform = "translateX(-100%)"; // Hide menu
        });
    });

    // Close menu when clicking the theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            if (menuToggle) menuToggle.checked = false; // Uncheck menu toggle
            if (menu) menu.style.transform = "translateX(-100%)"; // Hide menu
        });
    }

    // Ensure menu opens when checked
    if (menuToggle) {
        menuToggle.addEventListener("change", function () {
            if (this.checked) {
                if (menu) menu.style.transform = "translateX(0)";
            } else {
                if (menu) menu.style.transform = "translateX(-100%)";
            }
        });
    }
});

