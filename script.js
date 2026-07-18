"use strict";

/*
 * Ashok Choudhary Portfolio
 * Main JavaScript file
 */

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".navigation");
const navigationLinks = document.querySelectorAll(".navigation a");
const currentYear = document.querySelector("#current-year");


/*
 * Display the current year automatically.
 */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/*
 * Open or close the mobile navigation menu.
 */

function toggleNavigation() {
    const menuIsOpen = navigation.classList.toggle("active");

    menuButton.setAttribute(
        "aria-expanded",
        String(menuIsOpen)
    );

    menuButton.setAttribute(
        "aria-label",
        menuIsOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );

    document.body.classList.toggle(
        "menu-open",
        menuIsOpen
    );
}


/*
 * Close the mobile navigation menu.
 */

function closeNavigation() {
    navigation.classList.remove("active");

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    menuButton.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    document.body.classList.remove("menu-open");
}


if (menuButton && navigation) {
    menuButton.addEventListener(
        "click",
        toggleNavigation
    );

    navigationLinks.forEach(function (link) {
        link.addEventListener(
            "click",
            closeNavigation
        );
    });

    document.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Escape") {
                closeNavigation();
            }
        }
    );

    window.addEventListener(
        "resize",
        function () {
            if (window.innerWidth > 1050) {
                closeNavigation();
            }
        }
    );
}
